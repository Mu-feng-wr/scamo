<template>
  <div>
    <div class="logo" @click="toHome">
      <img :src="require('@/assets/images/logo.png')" alt />
    </div>
    <div class="memu">
      <div ref="sidebar" class="sidebar">
        <el-menu :default-active="activeMenu" mode="horizontal" :collapse="false">
          <template v-for="(item, i) in menuList">
            <el-submenu :key="item.name+i" popper-class="submenu" :index="item.name">
              <div slot="title" class="title">
                <svg-icon class="icon" :icon-class="item.meta.icon" />
                <span class="name">{{ item.meta.title }}</span>
              </div>
              <el-menu-item v-for="(temp, index) in item.children" :key="temp.name+index" :index="temp.name" @click.native="handleSelect(item, temp)">{{ temp.meta.title }}</el-menu-item>
            </el-submenu>
          </template>
          <el-submenu v-if="moreMenuList.length > 0" index="more_menu" popper-class="submenu" class="moreMenu">
            <div slot="title" class="title">
              <img width="30px" :src="require('@/assets/images/More.png')" />
            </div>
            <template v-for="(item, i) in moreMenuList">
              <el-submenu v-if="item.children&&item.children.length>0" :key="item.name+i" class="submenu" :index="item.name">
                <template slot="title">{{ item.meta.title }}</template>
                <el-menu-item v-for="(temp, n) in item.children" :key="temp.name+n" class="moreMenuItem" :index="temp.name" @click.native="handleSelect(item, temp)">{{ temp.meta.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="item.name+i" :index="item.name" class="moreMenuItem" @click.native="handleSelect(item)">{{ item.meta.title }}</el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="avatar-container text-center">
      <el-tag type="success" size="mini" style="margin-bottom: 5px">试用版</el-tag>
      <el-dropdown class="hover-effect" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar || avatarImg" class="user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown" class="sidebar-dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import avatarImg from '@/assets/images/Headimage.png'

export default {
  data() {
    return {
      avatarImg,
      avatar: this.$store.getters.userInfo.avatar,
      visibleMenuNumber: 5,
      menuList: [],
      moreMenuList: []
    }
  },
  computed: {
    activeMenu() {
      return this.$route.name
    }
  },
  mounted() {
    this.calculateNumber()
  },
  methods: {
    calculateNumber() {
      const height = this.$refs.sidebar.offsetHeight
      this.visibleMenuNumber = Math.floor(height / 60) - 1
      var routerList = this.$store.getters.menuList
      if (routerList.length <= this.visibleMenuNumber || routerList.length == this.visibleMenuNumber + 1) {
        this.menuList = routerList
        this.moreMenuList = []
      } else {
        this.menuList = routerList.slice(0, this.visibleMenuNumber)
        this.moreMenuList = routerList.slice(this.visibleMenuNumber)
      }
    },
    handleSelect(item, temp) {
      this.$store.commit('system/SET_CURRENTPATH', temp.path)
      this.$router.push({
        path: temp.path
      })
    },
    toHome() {
      this.$router.push('/dashboard')
    },
    logout() {
      this.$confirm('确定注销并退出系统吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('system/logout')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.memu {
  height: calc(100% - 190px);
  margin-bottom: 50px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

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
.el-menu-item {
  color: #222943 !important;
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
.el-menu--popup {
  min-width: 100px;
}
</style>
