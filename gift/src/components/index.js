import Vue from 'vue'
import searchArea from '@/components/searchArea/index.vue'
import baseInput from '@/components/baseInput/index.vue'
import tableHeaderConfig from '@/components/tableHeaderConfig/index.vue'

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
  selectArea,
  selectMaterial,
  setUser,
  uploadImg,
  uploadFile,
  selectShelf,
  selectStandbook,
  selectUser,
  supplier,
  chargeOff,
  contract,
  project,
  purchaseApplication
]
com.forEach(item => {
  Vue.component(item.name, item)
})