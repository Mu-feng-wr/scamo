import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import MoreQuery from '@/components/MoreQuery/index.vue'
import InputRange from '@/components/InputRange/index.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  MoreQuery,
  InputRange
]
com.forEach(item => {
  Vue.component(item.name, item)
})