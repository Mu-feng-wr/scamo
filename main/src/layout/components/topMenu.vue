<template>
  <div ref="top_menu" class="top_menu">
    <el-menu :default-active="activeMenu" :unique-opened="true" menu-trigger="hover" :collapse-transition="false" mode="horizontal">
      <template v-for="(item,i) in menuList">
        <el-menu-item v-if="i<visibleMenuNumber" :key="item.path+i" :index="item.path" @click="toLink(item)">{{ item.meta.title }}</el-menu-item>
      </template>

      <el-submenu v-if="menuList.length > visibleMenuNumber" index="more" title="更多">
        <template slot="title">更多</template>
        <template v-for="(item, i) in menuList">
          <el-menu-item v-if="i>=visibleMenuNumber" :key="item.path+i" :index="item.path" @click="toLink(item)">{{ item.meta.title }}</el-menu-item>
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
    window.onresize = () => {
      this.calculateNumber()
    }
    this.calculateNumber()
  },

  methods: {
    getMenu() {
      var currentPath = this.$route.path
      var currentPathArr = currentPath.split('/').filter((item) => item != '')
      var data = this.sidebarRouters.find((item) => item.path == currentPathArr[0] || item.path == '/' + currentPathArr[0])
      if (data) {
        this.moduleData = data
        this.menuList = data.children
      } else {
        this.moduleData = {}
        this.menuList = []
      }
      this.$forceUpdate()
      console.log(this.menuList, this.moduleData, this.activeMenu)
    },
    calculateNumber() {
      var width = this.$refs.top_menu.offsetWidth
      this.visibleMenuNumber = Math.floor(width / 120)
    },
    toLink(item) {
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