<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="终结单号">{{ formData.giftScrapCode }}</el-form-item>
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
            <el-form-item label="终结日期">{{ formData.scrapDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量">{{ $vxe.commafy(formData.giftQuantity,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元）">{{ $vxe.commafy(formData.giftAmount,{digits:2}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结人 ">{{ formData.terminatorName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=" 终结部门">{{ formData.terminatorOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总回收残值金额（元）">{{ formData.cost }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回收供应商">{{ formData.schemeName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="终结原因" class="noProp-item-textarea">{{ formData.scrapReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftScrapDetail ref="giftScrapDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
  </PageCard>
</template>
<script>
import { getScrap } from '@/api/scrap.js'
import giftScrapDetail from './components/giftScrapDetail.vue'
export default {
  components: {
    giftScrapDetail
  },
  data() {
    return {
      returnUrl: '/gift/scrap',
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
      getScrap(this.editId)
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
