<template>
  <div>
    <div class="logo" @click="toHome">
      <img :src="require('@/assets/images/logo.png')" alt />
    </div>
    <div class="memu">
      <div ref="sidebar" class="sidebar">
        <el-menu :default-active="activeMenu" mode="horizontal" :collapse="false">
          <template v-for="(item, index) in menuList">
            <el-submenu v-if="index < visibleMenuNumber" :key="item.path + index" popper-class="submenu" :index="item.path">
              <div slot="title" class="title">
                <svg-icon class="icon" :icon-class="item.meta.icon" />
                <span class="name">{{ item.meta.title }}</span>
              </div>
              <el-menu-item v-for="(temp, i) in item.children" :key="item.path + i" :index="temp.path" @click.native="handleSelect(item, temp)">{{ temp.meta.title }}</el-menu-item>
            </el-submenu>
          </template>
          <el-submenu v-if="menuList.length > visibleMenuNumber" index="more_menu" popper-class="submenu" class="moreMenu">
            <div slot="title" class="title">
              <img width="30px" :src="require('@/assets/images/More.png')" />
            </div>
            <template v-for="(item, index) in menuList">
              <el-submenu v-if="index >= visibleMenuNumber" :key="item.path + index" class="submenu" :index="item.path">
                <template slot="title">{{ item.meta.title }}</template>
                <el-menu-item v-for="(temp, n) in item.children" :key="temp.path + n" class="moreMenuItem" :index="temp.path" @click.native="handleSelect(item, temp)">{{ temp.meta.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="index > visibleMenuNumber" :key="temp.path + index" :index="temp.path" class="moreMenuItem" @click.native="handleSelect(item)">{{ item.meta.title }}</el-menu-item>
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
      // activeMenu: ''
    }
  },
  computed: {
    activeMenu () {
      return this.$route.path
    },
    menuList() {
      return this.$store.getters.menuList
    }
  },
  created() {
    // this.activeMenu = this.$route.path
  },
  mounted() {
    this.calculateNumber()
  },
  methods: {
    calculateNumber() {
      const height = this.$refs.sidebar.offsetHeight
      this.visibleMenuNumber = Math.floor(height / 60)
    },
    handleSelect(item, temp) {
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
