import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import dictDataView from '@/components/dictDataView/index.vue'
import InputRange from '@/components/InputRange/index.vue'
import MoreQuery from '@/components/MoreQuery/index.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  dictDataView,
  InputRange,
  MoreQuery
]
com.forEach(item => {
  Vue.component(item.name, item)
})