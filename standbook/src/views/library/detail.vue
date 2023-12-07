<template>
  <PageCard>
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="资产编号">{{ formData.assetCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产名称">{{ formData.assetName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产分类">{{ formData.categoryName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序列号">{{ formData.serialNum }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号">{{ formData.specificationModel }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务归口">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产所属公司">{{ formData.assetCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属仓库">{{ formData.warehouseName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属货架">{{ formData.firstShelfName }}{{ formData.sconedShelfName?'/'+formData.sconedShelfName:'' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价（元）">{{ $vxe.commafy(formData.priceIncludTax,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率（%）">{{ formData.taxRate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税额（元）">{{ $vxe.commafy(formData.taxAmount,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量单位">{{ formData.quantityUnit }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商">{{ formData.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司">{{ formData.accountName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称">{{ formData.contractName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">{{ formData.schemeName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用日期">{{ formData.enableDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结日期">{{ formData.endData }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-status" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-10" title="使用信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="使用人">{{ formData.currentUserName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门">{{ formData.currentOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用公司">{{ formData.currentCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域">{{ formData.currentEreaName }}{{ formData.currentLocationName?'/'+formData.currentLocationName:'' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始使用日期">{{ formData.firstCountDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后盘点日期">{{ formData.lastCountDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点人">{{ formData.lastCountUserName }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="盘点部门">{{ formData.lastCountOrgName }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-10" title="财务信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="卡片编号">{{ formData.assetCardNo }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="净残值（元）">{{ $vxe.commafy(formData.netSalvageValue,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="残值（元）">
              <!-- {{ $vxe.commafy(formData.netSalvageValue,{digits:2}) }} -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回收残值（元）">{{ $vxe.commafy(formData.recycleResidualValue,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期">{{ formData.termValidity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="质保期">{{ formData.qualityGuaranteePeriod }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产原图片">
              <el-link type="primary" :underline="false" @click="openImg(formData.pictureRui)">{{ formData.pictureName }}</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后盘点图片">
              <!-- {{ formData.pictureName }} -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结图片">
              <el-link type="primary" :underline="false" @click="openImg(formData.endAssetPictureRui)">{{ formData.endAssetPictureName }}</el-link>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-10" title="扩展信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="扩展字段1">{{ formData.extendedField1 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段2">{{ formData.extendedField2 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段3">{{ formData.extendedField3 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段4">{{ formData.extendedField4 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段5">{{ formData.extendedField5 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段6">{{ formData.extendedField6 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段7">{{ formData.extendedField7 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段8">{{ formData.extendedField8 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段9">{{ formData.extendedField9 }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="扩展字段10">{{ formData.extendedField10 }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="登记信息">
      <completePeriodRegister :table-data="formData.dataList||[]" />
      <tabList :register-list="formData.dataList" />
    </SectionCard>
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </PageCard>
</template>

<script>
import completePeriodRegister from './components/completePeriodRegister.vue'
import tabList from './components/tabList.vue'
import { getAccount } from '@/api/materialAccount.js'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    completePeriodRegister,
    tabList
  },
  data() {
    return {
      editId: '',
      formData: {},
      dictDataList: [],
      imgList: [],
      elImageViewer: false
    }
  },
  created() {
    this.editId = this.$route.query.id
    this.getDictData()
    this.init()
  },
  methods: {
    init() {
      this.submitLoading = true
      getAccount(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'AamMaterialAccount-status' // 台账状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 图片查看大图
    openImg(url) {
      this.imgList = [url]
      this.elImageViewer = true
    },
    // 关闭大图查看
    imgViewerClose() {
      this.elImageViewer = false
    }
  }
}
</script>