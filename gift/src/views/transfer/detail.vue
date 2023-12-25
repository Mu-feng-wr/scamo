<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单号">{{ formData.giftTransferCode }}</el-form-item>
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
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期">{{ formData.transferDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ $vxe.commafy(formData.giftQuantity,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元） ">{{ $vxe.commafy(formData.giftAmount,{digits:2}) }}</el-form-item>
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
            <el-form-item label="调拨状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调拨原因" class="noProp-item-textarea">{{ formData.transferReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftTransferDetail ref="giftTransferDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getTransfer } from '@/api/transfer.js'
import giftTransferDetail from './components/giftTransferDetail.vue'
export default {
  components: {
    giftTransferDetail
  },
  data() {
    return {
      returnUrl: '/gift/transfer',
      formData: {},
      editId: '',
      submitLoading: false
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
          this.form = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
