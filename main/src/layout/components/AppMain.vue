<template>
  <section class="app-main" :style="{'min-height':minHeight}">
    <transition name="fade-transform" mode="out-in">
      <div>
        <div v-if="$route.path=='/dashboard'">
          <dashboard />
        </div>
        <WujieVue v-for="(item, i) in wujieCacheView" v-show="$route.path==item.path" :key="i" width="100%" height="100%" class="wujie" :url="getUrl(item)" :name="item.name" :props="props" />
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
    minHeight() {
      if (this.$route.path == '/dashboard') {
        return 'calc(100vh - 90px)'
      } else {
        return 'calc(100vh - 121px)'
      }
    },
    cachedViews() {
      return this.$store.getters.cachedViews
    },
    wujieCacheView() {
      const mainRoute = ['/dashboard']
      return this.cachedViews.filter((item) => !mainRoute.includes(item.path))
    },
    key() {
      return this.$route.path
    }
  },
  methods: {
    getUrl(item) {
      const wujieHost = {
        Workbenche: 'http://192.168.10.10:9001/#'
      }
      // console.log(wujieHost[item.module] + item.path)
      return wujieHost[item.module] + item.path
    }
  }
}
</script>

<style scoped>
.app-main {
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
