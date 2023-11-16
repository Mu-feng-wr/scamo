<template>
  <div>
    <div class="logo">
      <img :src="require('@/assets/images/logo.png')" alt />
    </div>
    <div class="memu">
      <SidebarItem />
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
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// import variables from '@/styles/variables.scss'
import avatarImg from '@/assets/images/Headimage.png'

export default {
  components: { SidebarItem },
  data() {
    return {
      avatarImg,
      avatar: this.$store.getters.userInfo.avatar
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    // routes() {
    //   console.log(this.$store.getters.menuList)
    //   return this.$store.getters.menuList
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // variables() {
    //   return variables
    // },
    isCollapse() {
      return true
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
</style>
