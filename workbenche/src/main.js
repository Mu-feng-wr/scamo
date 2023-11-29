import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import yueniucomponents from 'yueniucomponents'
import 'yueniucomponents/yueniucomponents.css'
Vue.use(yueniucomponents)
import '@/icons'
import '@/permission'
import '@/styles/global.scss'

import WujieVue from 'wujie-vue2'
import hostMap from '@/hostMap.js'
Vue.use(WujieVue)
const { setupApp } = WujieVue
setupApp({
  name: 'authorization',
  url: hostMap('https'),
  exec: true
})

import '@/components/VXETable.js'   //注册vxe组件及相关方法
import 'vxe-table/lib/style.css'


import directive from './directive' // directive
Vue.use(directive)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

if (window.__POWERED_BY_WUJIE__) {
  let instance
  window.__WUJIE_MOUNT = () => {
    instance = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
  window.__WUJIE_UNMOUNT = () => {
    instance.$destroy()
  }
} else {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
