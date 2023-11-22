<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div>
        <div v-if="$route.path=='/dashboard'">
          <dashboard />
        </div>
        <WujieVue v-for="(item, i) in cachedViews" v-show="$route.path==item.name&&$route.path!='/dashboard'" :key="i" width="100%" height="100%" class="wujie" :url="item.url" :name="item.name" :props="props" />
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  components: {
    dashboard: () => import('@/views/dashboard/index')
  },
  data() {
    return {
      url: '',
      props: {
        userInfo: this.$store.getters.userInfo
      }
    }
  },
  computed: {
    cachedViews() {
      return this.$store.getters.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 56px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
