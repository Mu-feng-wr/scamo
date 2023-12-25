<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="归还单号">{{ formData.giftReturnCode }}</el-form-item>
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
            <el-form-item label="归还日期">{{ formData.returnDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ $vxe.commafy(formData.giftQuantity,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元）">{{ $vxe.commafy(formData.giftAmount,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人">{{ formData.userName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门">{{ formData.userOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用公司">{{ formData.companyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">{{ formData.schemeName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归还状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域">{{ formData.useAreaName }}/{{ formData.specificLocationName }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="数据来源">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="归还原因" class="noProp-item-textarea">{{ formData.returnReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftReturnDetail ref="giftReturnDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getReturn } from '@/api/return.js'
import giftReturnDetail from './components/giftReturnDetail.vue'
export default {
  components: {
    giftReturnDetail
  },
  data() {
    return {
      returnUrl: '/gift/return',
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
      getReturn(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
