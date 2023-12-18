import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import dictDataView from './dictDataView/index.vue'
import MoreQuery from './MoreQuery/index.vue'
import InputRange from './InputRange/index.vue'

// 一些弹框组件
import selectUser from './selectDialog/user.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  dictDataView,
  MoreQuery,
  InputRange,
  selectUser
]
com.forEach(item => {
  Vue.component(item.name, item)
})