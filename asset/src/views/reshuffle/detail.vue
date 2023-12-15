<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动单号">{{ formData.assetReshuffleCode }}</el-form-item>
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
              <dictDateView :value="formData.sourceTerminal" :dict-datalist="dictDataList" dict-code="System-sourceTerminal" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dictdata-list="dictDataList" dict-code="AlmAssetReshuffle-reshuffleStatus" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动日期">{{ formData.reshuffleDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">{{ $vxe.commafy(formData.assetQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{digits:3}) }}</el-form-item>
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
            <el-form-item label="跨部门名称">{{ formData.crossOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨公司名称">{{ formData.crossCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动原因" class="noProp-item-textarea">
              <span>{{ formData.reshuffleReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetReshuffleDetail ref="assetReshuffleDetail" :form-data="formData" :show-btn="false" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" :print-visible.sync="printVisible" :print-data="formData" />
  </PageCard>
</template>
<script>
import assetReshuffleDetail from './components/assetReshuffleDetail.vue'
import { getReshuffle } from '@/api/reshuffle.js'
import { listDictItems } from '@/api/base.js'
import Print from './components/print.vue'
export default {
  components: {
    assetReshuffleDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/asset/reshuffle',
      submitLoading: false,
      formData: {},
      editId: '',
      printVisible: false,
      dictDataList: []
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
      dictCodes += ',AlmAssetReshuffle-reshuffleStatus' // 异动状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
