<template>
  <div ref="top_menu" class="top_menu">
    <el-menu :default-active="activeMenu" :unique-opened="true" menu-trigger="hover" :collapse-transition="false" mode="horizontal">
      <template v-for="(item) in menuList">
        <el-menu-item v-if="!item.children||item.children.length==0" :key="item.path" :index="item.path" @click="toLink(item)">{{ item.meta.title }}</el-menu-item>
        <el-submenu v-else :key="item.path">
          <template slot="title">{{ item.meta.title }}</template>
          <template v-for="(temp) in item.children">
            <el-menu-item :key="temp.path" :index="temp.path" @click="toLink(temp)">{{ temp.meta.title }}</el-menu-item>
          </template>
        </el-submenu>
      </template>

      <el-submenu v-if="moreMenuList.length>0" index="more" title="更多">
        <template slot="title">更多</template>
        <template v-for="(item) in moreMenuList">
          <el-menu-item :key="item.path" :index="item.path" @click="toLink(item)">{{ item.meta.title }}</el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      moreMenuList: [],
      visibleMenuNumber: 3,
      moduleData: {}
    }
  },
  computed: {
    sidebarRouters() {
      return this.$store.getters.sidebarRouters
    },
    activeMenu() {
      return this.$route.path
    }
  },
  watch: {
    '$route.path': {
      handler() {
        this.getMenu()
      },
      immediate: true
    }
  },
  mounted() {
    this.calculateNumber()
  },

  methods: {
    getMenu() {
      var currentPath = this.$route.path
      var currentPathArr = currentPath.split('/').filter((item) => item != '')
      var data = this.sidebarRouters.find((item) => item.path == currentPathArr[0] || item.path == '/' + currentPathArr[0])
      if (data) {
        this.moduleData = data
        this.menuList = data.children.slice(0, this.visibleMenuNumber)
        this.moreMenuList = data.children.slice(this.visibleMenuNumber)
      } else {
        this.moduleData = {}
        this.menuList = []
        this.moreMenuList = []
      }
      this.$forceUpdate()
    },
    calculateNumber() {
      var width = this.$refs.top_menu.offsetWidth
      this.visibleMenuNumber = Math.floor(width / 120)
      this.getMenu()
    },
    toLink(item) {
      var routerList = this.$store.getters.cachedViews
      var index = routerList.findIndex((temp) => item.path == temp.fullPath)
      if (index < 0) {
        routerList.push({
          path: item.path,
          name: item.name,
          title: item.meta.fullTitle,
          fullPath: item.path,
          module: item.meta.module
        })
      }
      this.$store.commit('system/SET_CACHEVIEWS', routerList)
      this.$store.commit('system/SET_CURRENTPATH', item.path)
      this.$router.push({
        path: item.path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top_menu {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .el-menu-item {
    padding: 0 8px;
    margin: 0 16px;
    height: 100%;
    color: #303133;
  }
  .is-active {
    border-bottom-color: #236dff !important;
    color: #236dff !important;
    ::v-deep .el-submenu__icon-arrow {
      color: #236dff !important;
    }
  }
  ::v-deep .el-submenu {
    height: 100%;
    .el-submenu__title {
      padding: 0 8px;
      margin: 0 16px;
      height: 100%;
      background-color: transparent !important;
    }
  }
}
</style>