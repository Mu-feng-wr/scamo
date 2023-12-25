<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动单号">{{ formData.giftReshuffleCode }}</el-form-item>
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
            <el-form-item label="异动日期">{{ formData.reshuffleDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ $vxe.commafy(formData.giftQuantity,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元） ">{{ $vxe.commafy(formData.giftAmount,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动人">{{ formData.reshuffleUserName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动部门">{{ formData.reshuffleOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动公司">{{ formData.reshuffleCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动类型">{{ formData.reshuffleType }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨部门名称">{{ formData.crossOrgNames }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨公司名称">{{ formData.crossCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动原因" class="noProp-item-textarea">{{ formData.reshuffleReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftReshuffleDetail ref="giftReshuffleDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getReshuffle } from '@/api/reshuffle.js'
import giftReshuffleDetail from './components/giftReshuffleDetail.vue'
export default {
  components: {
    giftReshuffleDetail
  },
  data() {
    return {
      returnUrl: '/gift/reshuffle',
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
      getReshuffle(this.editId)
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
