<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用单号">{{ formData.assetBorrowCode }}</el-form-item>
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
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="AlmAssetBorrow-borrowStatus" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用日期">{{ formData.borrowDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">{{ $vxe.commafy(formData.assetQuantity,{ digits: 3 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">{{ $vxe.commafy(formData.assetAmount,{ digits: 3 }) }}</el-form-item>
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
            <el-form-item label="是否需要归还">
              <dictDateView :value="formData.ynExpectReturn" :dict-data-list="dictDataList" dict-code="AlmAssetBorrow-ynExpectReturn" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="预计归还日期">{{ formData.expectReturnDate }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="借用原因" class="noProp-item-textarea">
              <span>{{ formData.borrowReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetBorrowDetail ref="assetReceipt" :show-btn="false" :form-data="formData" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :table-data="formData.assetReviewAuditList" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <!-- <Print v-if="printVisible" :printVisible.sync="printVisible" :printData="form" /> -->
  </PageCard>
</template>
<script>
import { getBorrow } from '@/api/borrow.js'
import assetBorrowDetail from './components/assetBorrowDetail.vue'
// import Print from './components/print.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    assetBorrowDetail
    // Print
  },
  data() {
    return {
      formData: {},
      submitLoading: false,
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
      getBorrow(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data,
            ...{
              location: [res.data.useAreaId, res.data.specificLocationId]
            }
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'AlmAssetBorrow-ynExpectReturn' // 借用是否需要归还
      dictCodes += ',System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetBorrow-borrowStatus' // 借用状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
