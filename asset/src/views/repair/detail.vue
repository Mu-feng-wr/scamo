<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="维修单号">{{ formData.assetRepairCode }}</el-form-item>
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
            <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="AlmAssetRepair-status" />
          </el-form-item>
        </el-col>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="维修日期">{{ formData.repairDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">{{ $vxe.commafy(formData.assetQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维修人">{{ formData.maintainerName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维修部门">{{ formData.maintainerOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维修总金额（元）">{{ $vxe.commafy(formData.maintenanceTotalCost,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="维修供应商">{{ formData.maintenanceSupplierName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维修原因" class="noProp-item-textarea">
              <span>{{ formData.repairReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetRepairDetail ref="assetDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" :print-visible.sync="printVisible" :print-data="formData" />
  </PageCard>
</template>
<script>
import { getRepair } from '@/api/repair.js'
import assetRepairDetail from './components/assetRepairDetail.vue'
import Print from './components/print.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    assetRepairDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/asset/repair',
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
      getRepair(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data,
            ...{
              location: [res.data.currentEreaId, res.data.currentLocationId]
            }
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'AlmAssetRepair-status' // 维修状态
      dictCodes += ',System-sourceTerminal' // 来源终端
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
