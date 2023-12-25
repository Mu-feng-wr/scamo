<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用单号">{{ formData.giftCollectCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{$vxe.toDateString(formData.applicantDate,'yyyy-MM-dd') }}</el-form-item>
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
            <el-form-item label="领用日期">{{ formData.collectDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ formData.giftQuantity }}</el-form-item>
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
            <el-form-item label="使用区域">{{ formData.useAreaName }}/{{ formData.specificLocationName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领用状态">{{formData.status}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领用原因">{{ formData.collectReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftCollectDetail ref="giftCollectDetail" :show-btn="false" :form-data="formData" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :tableData="formData.poPurchaseApplicationAuditList" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getCollect } from '@/api/collect.js'
import giftCollectDetail from './components/giftCollectDetail.vue'
export default {
  components: {
    giftCollectDetail
  },
  data() {
    return {
      returnUrl: '/gift/collect',
      submitLoading: false,
      formData: {}
    }
  },
  created() {
    this.editId = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      this.submitLoading = true
      getCollect(this.editId)
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
