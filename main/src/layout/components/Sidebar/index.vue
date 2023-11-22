<template>
  <div>
    <div class="logo" @click="toHome">
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
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
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
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse() {
      return true
    }
  },
  methods: {
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
</style>
