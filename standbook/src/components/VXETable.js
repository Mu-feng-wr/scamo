import Vue from 'vue'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.prototype.$vxe = XEUtils
Vue.prototype.$XModal = VXETable.modal

VXETable.formats.mixin({
  formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd')
  },
  formatDateTime({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
  },
  formatMoney({ cellValue }, digits) {
    return XEUtils.commafy(cellValue, { digits: digits || digits == 0 ? digits : 2 })
  },
  formatMeter({ cellValue }, digits) {
    return XEUtils.commafy(cellValue, { digits: digits || digits == 0 ? digits : 4 })
  }
})

Vue.use(VXETable)