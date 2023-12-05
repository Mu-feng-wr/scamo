<template>
  <section class="app-main" :style="{'height':minHeight}">
    <div class="w-100 content" :style="{'height':minHeight}">
      <div v-if="currentPath=='/dashboard'">
        <dashboard />
      </div>
      <WujieVue
        v-for="(item, i) in wujieCacheView"
        v-show="currentPath==item.fullPath"
        :key="i"
        width="100%"
        height="100%"
        class="wujie"
        :url="getUrl(item)"
        :name="item.name"
        :props="getProps(item)"
      />
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
        },
        route: this.addWujiePage
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
      return this.$route.fullPath
    },
    currentPath() {
      return this.$store.getters.currentPath
    }
  },
  methods: {
    getUrl(item) {
      const wujieHost = {
        Workbenche: 'http://localhost:9001/#',
        Standbook: 'http://localhost:9002/#',
        Asset: 'http://localhost:9003/#',
        Consumable: 'http://localhost:9003/#',
        Gift: 'http://localhost:9004/#',
        Purchase: 'http://localhost:9005/#',
        Inventory: 'http://localhost:9006/#',
        Library: 'http://localhost:9007/#',
        Portface: 'http://localhost:9008/#',
        System: 'http://localhost:9009/#',
        Monitor: 'http://localhost:9010/#',
        Tool: 'http://localhost:9011/#',
        Member: 'http://localhost:9012/#'
      }
      return wujieHost[item.module] + item.fullPath
    },
    addWujiePage(route) {
      var urlList = this.$store.getters.cachedViews
      var index = this.cachedViews.findIndex((item) => item.fullPath == route.fullPath)
      if (index < 0) {
        urlList.push(route)
        this.$store.commit('system/SET_CACHEVIEWS', urlList)
        this.$router.push({
          path: route.path
        })
      } else {
        urlList.splice(index, 1)
        this.$nextTick(() => {
          urlList.splice(index, 0, route)
          this.$store.commit('system/SET_CACHEVIEWS', urlList)
        })
      }
      this.$store.commit('system/SET_CURRENTPATH', route.fullPath)
      this.$router.push({
        path: route.path
      })
    },
    getProps(item) {
      return {
        query: item.query,
        ...this.props
      }
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
