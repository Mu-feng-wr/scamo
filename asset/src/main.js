import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small' })

import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import '@/components/index.js'
import '@/icons'
import '@/permission'
import '@/styles/global.scss'

import '@/components/VXETable.js'

import directive from './directive' // directive
Vue.use(directive)

import elImageViewer from 'element-ui/packages/image/src/image-viewer'
Vue.component('elImageViewer', elImageViewer)

import { download } from '@/utils/request.js'
if (window.$wujie) {
  Vue.prototype.download = window.$wujie.props.download
} else {
  Vue.prototype.download = download
}

import Print from 'vue-print-nb'
Vue.use(Print) // 注册

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
