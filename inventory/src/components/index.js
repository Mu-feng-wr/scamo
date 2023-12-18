import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import dictDataView from './dictDataView/index.vue'
import MoreQuery from './MoreQuery/index.vue'
import InputRange from './InputRange/index.vue'
import PageCard from './PageCard/index.vue'
import sectionCard from './sectionCard/index.vue'

// 一些弹框组件
import selectUser from './selectDialog/user.vue'
import project from './selectDialog/project.vue'
import selectWarehouse from './selectDialog/selectWarehouse.vue'
import componyDept from './selectDialog/componyDept.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  dictDataView,
  MoreQuery,
  InputRange,
  selectUser,
  project,
  selectWarehouse,
  componyDept,
  PageCard,
  sectionCard
]
com.forEach(item => {
  Vue.component(item.name, item)
})