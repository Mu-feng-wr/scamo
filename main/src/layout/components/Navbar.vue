<template>
  <div class="navbar disp-flex justify-between align-center">
    <div class="pageTitle">{{ pageTitle }}</div>
    <div class="topMenu">菜单</div>
    <div class="disp-flex right_menu">
      <router-link to="/dashboard" class="right-menu-item hover-effect">
        <img class="mr-3" :src="require('@/assets/images/search.png')" />驾驶舱
      </router-link>

      <el-dropdown class="right-menu-item hover-effect" trigger="click">
        <div>
          <img class="mr-3" :src="require('@/assets/images/search.png')" />消息
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <i class="el-icon-message"></i>未读日报
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-collection-tag"></i>待办任务
            <el-badge :value="20" class="item" />
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-document"></i>待办工单
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-date"></i>今日日程
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-edit-outline"></i>待批申请
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-bell"></i>系统通知
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="right-menu-item" @click="openScreenfull">
        <svg-icon class="icon mr-3" :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" />全屏
      </div>
    </div>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
import screenfull from 'screenfull'
export default {
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    pageTitle() {
      return defaultSettings.pageTitle
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    openScreenfull() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 56px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .pageTitle {
    font-size: 18px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: #222943;
    padding: 0 15px;
  }
  .topMenu {
    height: 100%;
  }
  .right_menu {
    color: #222943;
    padding-right: 15px;
    .right-menu-item {
      padding: 0 12px;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      &::after {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        background: #e9eaec;
        content: '';
        height: 10px;
      }
      &:last-child::after {
        background: transparent;
      }
    }

    .icon {
      font-size: 13px;
      color: #222943;
    }
  }
}
</style>
