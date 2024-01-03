<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="150px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">{{ formData.contractCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">{{ formData.contractName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="typeName">{{ formData.typeName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="甲方" prop="purchaseUnitId">{{ formData.purchaseUnitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乙方" prop="saleUnitId">{{ formData.saleUnitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="丙方" prop="constructeCtlUnitId">{{ formData.constructeCtlUnitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="丁方" prop="tradeUnitId">{{ formData.tradeUnitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同造价(元)" prop="totalPrice">{{ $vxe.commafy(formData.totalPrice, { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率(%)" prop="taxRate">{{ formData.taxRate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签订日期" prop="signDate">{{ formData.signDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效时间">{{ formData.startDate }}~{{ formData.endDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数期(天)" prop="severalIssues">{{ formData.severalIssues }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算方式" prop="settingMethod">
              <dictDateView :value="formData.settingMethod" :dict-data-list="dictDataList" dict-code="CmContract-settingMethod" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方式" prop="procurementMethod">
              <dictDateView :value="formData.procurementMethod" :dict-data-list="dictDataList" dict-code="CmContract-procurementMethod" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="滞纳金计算方式" prop="overdueFeeMethod">
              <dictDateView :value="formData.overdueFeeMethod" :dict-data-list="dictDataList" dict-code="CmContract-overdueFeeMethod" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否为含税价" prop="isTaxPrice">
              <dictDateView :value="formData.isTaxPrice" :dict-data-list="dictDataList" dict-code="CmContract-isTaxPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票类型" prop="invoiceType">
              <dictDateView :value="formData.invoiceType" :dict-data-list="dictDataList" dict-code="CmContract-invoiceType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="CmContract-status" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同内容" class="noProp-item-textarea">{{ formData.content }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>
<script>
import { getContract } from '@/api/contract.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/portface/contract',
      submitLoading: false,
      editId: '',
      formData: {},
      dictDataList: []
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getContract(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'CmContract-status' // 状态
      dictCodes += ',CmContract-overdueFeeMethod' // 滞纳金计算方式
      dictCodes += ',CmContract-settingMethod' // 结算方式
      dictCodes += ',CmContract-procurementMethod' // 采购方式
      dictCodes += ',CmContract-invoiceType' // 发票类型
      dictCodes += ',CmContract-isTaxPrice' // 是否为含税价
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
