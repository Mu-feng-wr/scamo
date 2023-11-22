<template>
  <div ref="sidebar" class="sidebar">
    <el-menu :default-active="activeMenu" mode="horizontal" :collapse="false">
      <template v-for="(item, index) in menuList">
        <el-submenu v-if="index < visibleMenuNumber" :key="index" popper-class="submenu" :index="item.path">
          <div slot="title" class="title">
            <svg-icon class="icon" :icon-class="item.meta.icon" />
            <span class="name">{{ item.meta.title }}</span>
          </div>
          <el-menu-item v-for="(temp, i) in item.children" :key="i" :index="item.path+'/'+temp.path" @click.native="handleSelect(item,temp)">{{ temp.meta.title }}</el-menu-item>
        </el-submenu>
      </template>
      <el-submenu v-if="menuList.length>visibleMenuNumber" index="more" popper-class="submenu" class="moreMenu">
        <div slot="title" class="title">
          <img width="30px" :src="require('@/assets/images/More.png')" />
        </div>
        <template v-for="(item, index) in menuList">
          <el-submenu v-if="index >= visibleMenuNumber" :key="index" class="submenu" :index="item.path">
            <template slot="title">{{ item.meta.title }}</template>
            <el-menu-item v-for="(temp, n) in item.children" :key="n" class="moreMenuItem" :index="temp.path" @click.native="handleSelect(item,temp)">{{ temp.meta.title }}</el-menu-item>
          </el-submenu>
          <el-menu-item v-else-if="index > visibleMenuNumber" :key="index" :index="item.path+'/'+temp.path" class="moreMenuItem" @click.native="handleSelect(item)">{{ item.meta.title }}</el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  data() {
    return {
      visibleMenuNumber: 5
    }
  },
  computed: {
    menuList() {
      return this.$store.getters.menuList
    },
    activeMenu() {
      const route = this.$route
      const { meta, path, matched } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      if (matched && matched.length == 3) {
        return matched[1].path
      }
      return path
    }
  },
  mounted() {
    window.onresize = () => {
      this.calculateNumber()
    }
    this.calculateNumber()
  },
  methods: {
    calculateNumber() {
      const height = this.$refs.sidebar.offsetHeight
      this.visibleMenuNumber = Math.floor(height / 60)
    },
    handleSelect(item, temp) {
      this.$router.push({
        path: item.path + '/' + temp.path
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar {
  width: 100%;
  height: 100%;
  padding: 0 6px;
  box-sizing: border-box;
  margin-bottom: 61px;
  .el-menu {
    background: transparent !important;
    border: none !important;
    ::v-deep .el-submenu__icon-arrow {
      display: none !important;
    }
    ::v-deep .el-submenu {
      width: 100%;
      .el-submenu__title:hover {
        background-color: rgba(34, 41, 67, 0.2) !important;
        color: rgb(35, 109, 255) !important;
      }
      .el-submenu__title {
        padding: 4px 0 6px !important;
        box-sizing: border-box;
        border-radius: 6px;
        height: 50px;
        margin: 5px 0;
        border: none;
        .title {
          line-height: normal !important;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          padding-top: 5px;
          .icon {
            font-size: 17px;
            color: #e9f0ff;
            margin-bottom: 4px;
          }
          .name {
            text-align: center;
            width: 100%;
            display: inline-block;
            font-size: 12px;
            color: #e9f0ff;
          }
        }
      }
    }
  }
  .el-menu.is-active {
    color: red !important;
  }
}
</style>
<style lang="scss">
.el-menu--horizontal {
  &.submenu {
    left: 68px !important;
    margin-top: -50px;
  }
}
.el-submenu.is-active {
  .el-submenu__title,
  .el-menu-item:focus {
    background-color: rgba(34, 41, 67, 0.2) !important;
    color: rgb(35, 109, 255) !important;
  }
}
.el-menu--popup {
  .el-menu-item.is-active {
    background: #236dff;
    border-radius: 4px 4px 4px 4px;
    color: #fff !important;
  }
}
</style>