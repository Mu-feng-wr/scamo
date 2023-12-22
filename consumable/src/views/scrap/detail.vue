<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="终结单号">{{ formData.assetScrapCode }}</el-form-item>
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
            <el-form-item label="终结日期">{{ formData.scrapDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量">{{ $vxe.commafy(formData.assetQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结人">{{ formData.terminatorName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结部门">{{ formData.terminatorOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结方式">{{ }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总回收残值金额（元）">{{ $vxe.commafy(formData.totalRecovereResidualValue,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回收供应商">{{ formData.maintainerCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="终结原因" class="noProp-item-textarea">
              <span>{{ formData.scrapReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableScrapDetail ref="assetDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" :print-visible.sync="printVisible" :print-data="formData" />
  </PageCard>
</template>
<script>
import { getScrap } from '@/api/scrap.js'
import consumableScrapDetail from './components/consumableScrapDetail.vue'
import Print from './components/print.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    consumableScrapDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/consumable/scrap',
      submitLoading: false,
      formData: {},
      editId: '',
      printVisible: false,
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
      getScrap(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetScrap-status' // 终结状态
      listDictItems(dictCodes).then((res) => {})
    }
  }
}
</script>
