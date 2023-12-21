<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="150px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用单号">{{ formData.consumableCollectCode }}</el-form-item>
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
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用日期">{{ formData.collectDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量">{{ formData.consumableQuantity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材金额">{{ $vxe.commafy(formData.consumableAmount,{digits:2}) }}</el-form-item>
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
          <el-col :span="8">
            <el-form-item label="使用终端">
              <dictDateView :value="formData.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="领用原因">{{ formData.collectReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableCollectDetail ref="consumableCollectDetail" :show-btn="false" :form-data="formData" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :table-data="formData.poPurchaseApplicationAuditList" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" :print-visible.sync="printVisible" :print-data="form" />
  </PageCard>
</template>
<script>
import { getCollect } from '@/api/collect.js'
import consumableCollectDetail from './components/consumableCollectDetail.vue'
import { listDictItems } from '@/api/base.js'
import Print from './components/print.vue'
export default {
  components: {
    consumableCollectDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/consumable/collect',
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
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetCollect-status' // 领用状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
