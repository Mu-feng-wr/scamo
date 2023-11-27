<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar ref="sidebar" class="sidebar-container" />
    <div class="main-container">
      <div>
        <navbar ref="navbar" />
      </div>
      <tabMenu />
      <Breadcrumb v-if="showBreadcrumb" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import tabMenu from './components/tabMenu.vue'
import Breadcrumb from './components/Breadcrumb.vue'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    tabMenu,
    Breadcrumb
  },
  computed: {
    sidebar() {
      return {
        opened: true,
        withoutAnimation: false
      }
    },
    device() {
      return 'desktop'
    },
    fixedHeader() {
      return false
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    showBreadcrumb() {
      if (this.$route.path == '/dashboard') {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.$refs.sidebar.calculateNumber()
      this.$refs.navbar.calculateNumber()
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
</style>
