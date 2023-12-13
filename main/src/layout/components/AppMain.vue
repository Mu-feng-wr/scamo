<template>
  <section class="app-main" :style="{'height':minHeight}">
    <div class="w-100 content" :style="{'height':minHeight}">
      <div v-if="currentPath=='/dashboard'">
        <dashboard />
      </div>
      <WujieVue
        v-for="(item) in wujieCacheView"
        v-show="currentPath==item.fullPath"
        :key="getUrl(item)"
        width="100%"
        height="100%"
        class="wujie"
        :url="getUrl(item)"
        :name="item.fullPath"
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
        route: this.addWujiePage,
        setFunc: this.setFunc,
        closeCurrentPage: this.closeCurrentPage,
        origin: window.location.origin
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
      console.log(this.$store.getters.cachedViews)
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
      console.log(window.location, '========')
      const wujieHost = {
        Workbenche: `http://${window.location.hostname}:9001/#`,
        Standbook: `http://${window.location.hostname}:9002/#`,
        Asset: `http://${window.location.hostname}:9003/#`,
        Consumable: `http://${window.location.hostname}:9003/#`,
        Gift: `http://${window.location.hostname}:9004/#`,
        Purchase: `http://${window.location.hostname}:9005/#`,
        Inventory: `http://${window.location.hostname}:9006/#`,
        Library: `http://${window.location.hostname}:9007/#`,
        Portface: `http://${window.location.hostname}:9008/#`,
        System: `http://${window.location.hostname}:9009/#`,
        Monitor: `http://${window.location.hostname}:9010/#`,
        Tool: `http://${window.location.hostname}:9011/#`,
        Member: `http://${window.location.hostname}:9012/#`
      }
      var query = []
      if (item.condition) {
        for (var i in item.condition) {
          query.push(`${i}=${item.condition[i]}`)
        }
      }
      return wujieHost[item.module] + item.fullPath + '?' + query.join('&')
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
        if (route.condition && route.condition != this.cachedViews[index].condition) {
          urlList.splice(index, 1)
          this.$nextTick(() => {
            urlList.splice(index, 0, route)
            this.$store.commit('system/SET_CACHEVIEWS', urlList)
          })
        }
      }
      this.$store.commit('system/SET_CURRENTPATH', route.fullPath)
      this.$router.push({
        path: route.path
      })
    },
    closeCurrentPage({ path }) {
      debugger
      var urlList = JSON.parse(JSON.stringify(this.$store.getters.cachedViews))
      var index = urlList.findIndex((item) => item.fullPath == this.$store.getters.currentPath)
      urlList.splice(index, 1)
      this.$store.commit('system/SET_CURRENTPATH', path)
      this.$store.commit('system/SET_CACHEVIEWS', urlList)
      this.$router.push({
        path: path
      })
    },
    setFunc(func) {
      for (var i in func) {
        this.props[i] = func[i]
      }
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
  border-radius: 4 px 4px 0 0;
  position: relative;
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
