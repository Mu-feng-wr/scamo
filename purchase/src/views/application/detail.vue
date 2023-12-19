<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" disabled label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号">{{ formData.purchaseApplicationCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ formData.applicantDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人">{{ formData.applicantName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门">{{ formData.applicantOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司">{{ formData.applicantCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">{{ formData.createDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源终端">
              <dictDateView :value="formData.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="PoPurchaseApplication-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称">{{ formData.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司">{{ formData.accountName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称">{{ formData.contractName }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标协议">{{ formData.tenderAgreementName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次申购总金额（元）">{{ $vxe.commafy(formData.subscriptionTaxAmount, { digits: 2 }) }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购日期">{{ formData.subscriptionDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系人">{{ formData.arrivalContact }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系电话">{{ formData.arrivalMobile }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">{{ formData.arrivalDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求" prop="arrivalRequirement">{{ formData.arrivalRequirement }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域">{{ formData.ereaName }}{{ formData.locationName ? "/" + formData.locationName : "" }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量">{{ $vxe.commafy(formData.subscriptionQuantity, { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购不含税金额（元）">{{ $vxe.commafy(formData.subscriptionExcTaxAmount, { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额（元）">{{ $vxe.commafy(formData.purchaseTaxAmount, { digits: 2 }) }}</el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">{{ formData.remarks }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申购原因" class="noProp-item-textarea">{{ formData.subscriptionReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetApplicationDetail ref="assetApplicationDetail" :disabled="true" :form-data="formData" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :table-data="formData.assetReviewAuditList" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printDialog=true">打印</el-button>
    </div>
    <Print v-if="printDialog" :print-data="formData" :print-visible.sync="printDialog" />
  </PageCard>
</template>
<script>
import { getApplication } from '@/api/application.js'
import assetApplicationDetail from './components/assetApplicationDetail.vue'
import { listDictItems } from '@/api/base.js'
import Print from './components/print.vue'
export default {
  components: {
    assetApplicationDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/purchase/application',
      submitLoading: false,
      formData: {},
      printDialog: false,
      dictDataList: []
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
      getApplication(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',PoPurchaseApplication-status' // 申购状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
