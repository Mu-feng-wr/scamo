<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单号">{{ formData.assetTransferCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ formData.applicantDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型">{{ formData.centralizedBusinessName }}</el-form-item>
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
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="AlmAssetCollect-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期">{{ formData.transferDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">{{ $vxe.commafy(formData.assetQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出公司">{{ formData.outCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入公司">{{ formData.inCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收人">{{ formData.receiverName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出项目">{{ formData.outProjectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入项目">{{ formData.inProjectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收部门">{{ formData.receiverOrgName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调拨原因" class="noProp-item-textarea">
              <span>{{ formData.transferReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetTransferDetail ref="assetDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <!-- <Print ref="printRef" v-if="printVisible" :printVisible.sync="printVisible" :printData="form"></Print> -->
  </PageCard>
</template>
<script>
import assetTransferDetail from './components/assetTransferDetail.vue'
import { getTransfer } from '@/api/transfer.js'
// import Print from './components/print.vue'
export default {
  components: {
    assetTransferDetail
    // Print
  },
  data() {
    return {
      returnUrl: '/asset/transfer',
      submitLoading: false,
      formData: {},
      editId: '',
      printVisible: false
    }
  },
  created() {
    this.editId = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      this.submitLoading = true
      getTransfer(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
