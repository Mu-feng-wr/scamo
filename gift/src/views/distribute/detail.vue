<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="派发单号">{{ formData.giftDistributeCode }}</el-form-item>
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
            <el-form-item label="派发日期">{{ formData.distributeDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ $vxe.commafy(formData.giftQuantity,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元） ">{{ $vxe.commafy(formData.giftAmount,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发人">{{ formData.istributerName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发部门">{{ formData.istributerOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发公司">{{ formData.istributerCompanyName }}</el-form-item>
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

          <el-col :span="8">
            <el-form-item label="接收人">{{ formData.recipientor }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收人手机号码">{{ formData.recipientorMobile }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发类型">{{ formData.istributeType }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发方式">{{ formData.istributeMethod }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递单号">{{ formData.courierNumber }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递公司">{{ formData.courierCompany }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="派发状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="派发原因" class="noProp-item-textarea">{{ formData.distributeReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftDistributeDetail ref="giftDistributeDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getDistribute } from '@/api/distribute.js'
import giftDistributeDetail from './components/giftDistributeDetail.vue'
export default {
  components: {
    giftDistributeDetail
  },
  data() {
    return {
      returnUrl: '/gift/distribute',
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
      getDistribute(this.editId)
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
