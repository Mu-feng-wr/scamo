import Vue from 'vue'
import searchArea from './searchArea/index.vue'
import baseInput from './baseInput/index.vue'
import tableHeaderConfig from './tableHeaderConfig/index.vue'
import MoreQuery from './MoreQuery/index.vue'
import InputRange from './InputRange/index.vue'
import dictDataView from './dictDataView/index.vue'
import PageCard from './PageCard/index.vue'
import sectionCard from './sectionCard/index.vue'
import HandleRecords from './HandleRecords/index.vue'
import uploadImg from './btnHandler/uploadImg.vue'
import uploadFile from './btnHandler/uploadFile.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  MoreQuery,
  InputRange,
  dictDataView,
  PageCard,
  sectionCard,
  HandleRecords,
  uploadImg,
  uploadFile
]
com.forEach(item => {
  Vue.component(item.name, item)
})