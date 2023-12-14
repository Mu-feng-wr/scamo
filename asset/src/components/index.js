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
import ElTreeSelect from './ElTreeSelect/index.vue'

// 一些按钮组件
import selectArea from './btnHandler/selectArea.vue'
import selectMaterial from './btnHandler/selectMaterial.vue'
import setUser from './btnHandler/setUser.vue'
import uploadImg from './btnHandler/uploadImg.vue'
import uploadFile from './btnHandler/uploadFile.vue'
import selectShelf from './btnHandler/selectShelf.vue'
import selectStandbook from './btnHandler/selectStandbook.vue'

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
  PageCard,
  sectionCard,
  HandleRecords,
  selectArea,
  selectMaterial,
  uploadImg,
  uploadFile,
  selectUser,
  supplier,
  chargeOff,
  contract,
  project,
  purchaseApplication,
  setUser,
  selectShelf,
  selectStandbook,
  ElTreeSelect
]
com.forEach(item => {
  Vue.component(item.name, item)
})