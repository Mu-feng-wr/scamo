<template>
  <section class="app-main" :style="{'height':minHeight}">
    <div class="w-100 content" :style="{'height':minHeight}">
      <div v-if="$route.path=='/dashboard'">
        <dashboard />
      </div>
      <WujieVue v-for="(item, i) in wujieCacheView" v-show="$route.path==item.path" :key="i" width="100%" height="100%" class="wujie" :url="getUrl(item)" :name="item.name" :props="props" />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/request'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
Vue.prototype.$vxe = XEUtils

export default {
  name: 'AppMain',
  components: {
    dashboard: () => import('@/views/dashboard/index')
  },
  data() {
    return {
      url: '',
      props: {
        userInfo: this.$store.getters.userInfo,
        request: request,
        permissions: this.$store.getters.permissions,
        roles: this.$store.getters.roles,
        download: this.download,
        VXETable: VXETable,
        logout: () => {
          this.$store.dispatch('system/logout')
        }
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
        Workbenche: 'http://localhost:9001/#',
        Standbook: 'http://localhost:9002/#'
      }
      return wujieHost[item.module] + item.path
    }
  }
}
</script>

<style scoped>
.app-main {
  width: calc(100% - 40px);
  margin: 0 auto;
  overflow: hidden;
}
.content {
  background: white;
  border-radius: 4 px 4px 0 0;
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
