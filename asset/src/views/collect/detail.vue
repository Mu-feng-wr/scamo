<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用单号">{{ formData.assetCollectCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ $vxe.toDateString(formData.applicantDate,'yyyy-MM-dd') }}</el-form-item>
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
            <el-form-item label="领用日期">{{ formData.collectDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">{{ formData.assetQuantity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{digits:2}) }}</el-form-item>
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
            <el-form-item label="领用原因">
              <span>{{ formData.collectReason }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetCollectDetail ref="assetDetail" :show-btn="false" :form-data="formData" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :table-data="formData.assetReviewAuditList" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" :print-visible.sync="printVisible" :print-data="formData" />
  </PageCard>
</template>
<script>
import { getCollect } from '@/api/collect.js'
import assetCollectDetail from './components/assetCollectDetail.vue'
import { listDictItems } from '@/api/base.js'
import Print from './components/print.vue'
export default {
  components: {
    assetCollectDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/asset/collect',
      submitLoading: false,
      formData: {},
      dictDataList: [],
      printVisible: false
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
      getCollect(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetCollect-status' // 领用状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
