import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'
import '@/styles/global.scss'
import { download } from '@/utils/request.js'
Vue.prototype.download = download

import WujieVue from 'wujie-vue2'
import hostMap from '@/hostMap.js'
Vue.use(WujieVue)
const { setupApp } = WujieVue
setupApp({
  name: 'workbenche',
  url: hostMap('//localhost:9001/'),
  exec: true,
  alive: true
})
setupApp({
  name: 'standbook',
  url: hostMap('//localhost:9002/'),
  exec: true,
  alive: true
})

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
