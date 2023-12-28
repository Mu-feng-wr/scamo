import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import dictDataView from '@/components/dictDataView/index.vue'
import ElTreeSelect from './ElTreeSelect/index.vue'
import MoreQuery from './MoreQuery/index.vue'
import PageCard from './PageCard/index.vue'
import sectionCard from './sectionCard/index.vue'

// 一些弹框组件
import project from './selectDialog/project.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  dictDataView,
  ElTreeSelect,
  MoreQuery,
  PageCard,
  sectionCard,
  project
]
com.forEach(item => {
  Vue.component(item.name, item)
})