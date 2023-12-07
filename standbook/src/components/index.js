import Vue from 'vue'
import searchArea from './searchArea/index.vue'
import baseInput from './baseInput/index.vue'
import tableHeaderConfig from './tableHeaderConfig/index.vue'
import MoreQuery from './MoreQuery/index.vue'
import InputRange from './InputRange/index.vue'
import dictDataView from './dictDataView/index.vue'
import PageCard from './PageCard/index.vue'
import sectionCard from './sectionCard/index.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  MoreQuery,
  InputRange,
  dictDataView,
  PageCard,
  sectionCard
]
com.forEach(item => {
  Vue.component(item.name, item)
})