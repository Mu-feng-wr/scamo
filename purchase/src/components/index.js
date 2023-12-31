import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'
import MoreQuery from '@/components/MoreQuery/index.vue'
import InputRange from '@/components/InputRange/index.vue'
import dictDataView from '@/components/dictDataView/index.vue'
import HandleRecords from '@/components/HandleRecords/index.vue'
import PageCard from '@/components/PageCard/index.vue'
import sectionCard from '@/components/sectionCard/index.vue'

// 一些按钮组件
import uploadFile from './btnHandler/uploadFile.vue'
import selectMaterial from './btnHandler/selectMaterial.vue'
import uploadImg from './btnHandler/uploadImg.vue'

// 一些弹框组件
import selectUser from './selectDialog/user.vue'
import supplier from './selectDialog/supplier.vue'
import chargeOff from './selectDialog/chargeOff.vue'
import contract from './selectDialog/contract.vue'
import project from './selectDialog/project.vue'
import purchaseApplication from './selectDialog/purchaseApplication.vue'

const com = [
  searchArea,
  baseInput,
  tableHeaderConfig,
  MoreQuery,
  InputRange,
  dictDataView,
  HandleRecords,
  uploadFile,
  selectMaterial,
  PageCard,
  sectionCard,
  selectUser,
  supplier,
  chargeOff,
  contract,
  project,
  purchaseApplication,
  uploadImg
]
com.forEach(item => {
  Vue.component(item.name, item)
})