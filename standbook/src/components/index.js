import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig
]
com.forEach(item => {
  Vue.component(item.name, item)
})