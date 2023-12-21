<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收单号">{{ formData.consumableReceiptCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ $vxe.toDateString(formData.applicantDate,'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人">{{ formData.applicantName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门">{{ formData.applicantOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司名称">{{ formData.applicantCompanyName }}</el-form-item>
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
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="申请信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收日期">{{ $vxe.toDateString(formData.registeDate,'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收方式">
              <dictDateView :value="formData.accepterMethod" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-accepterMethod" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产来源">
              <dictDateView :value="formData.assetSource" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-assetSource" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收人姓名">{{ formData.accepterName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收部门名称">{{ formData.accepterOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材所属仓库名称">{{ formData.warehouseName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材所属公司名称">{{ formData.assetCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收数量">{{ $vxe.commafy(formData.receiptQuantity , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收不含税金额（元）">{{ $vxe.commafy(formData.receiptExcTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收税额（元）">{{ $vxe.commafy(formData.receiptTax , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="验收总金额（元）">{{ $vxe.commafy(formData.receiptTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">
              <span>{{ formData.remarks }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="验收原因" prop="receiptReason" class="noProp-item-textarea">
              <span>{{ formData.receiptReason }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard v-if="formData.accepterMethod==1" class="mt-8" title="申购信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号">{{ formData.purchaseApplicationCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期">{{ formData.subscriptionDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">{{ formData.phone }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购人">{{ formData.applicantName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购部门">{{ formData.purchaseApplicantOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购公司">{{ formData.purchaseApplicantCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量">{{ formData.subscriptionQuantity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购不含税金额（元）">{{ $vxe.commafy(formData.subscriptionExcTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额（元）">{{ $vxe.commafy(formData.purchaseTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额（元）">{{ $vxe.commafy(formData.subscriptionTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">{{ $vxe.toDateString(formData.arrivalDate,'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求">{{ formData.arrivalRequirement }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="使用信息">
        <el-row>
          <el-col :span="24">
            <el-form-item label="使用区域">{{ formData.currentEreaName }}{{ formData.currentLocationName ? '/' + formData.currentLocationName:'' }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称">{{ `${formData.supplierCode?'['+formData.supplierCode+']':''}${formData.supplierName||''}` }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司名称">{{ `${formData.accountCode?'['+formData.accountCode+']':''}${formData.accountName||''}` }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">{{ `${formData.contractCode?'['+formData.contractCode+']':''}${formData.contractName||''}` }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectCode">{{ `${formData.projectCode?'['+formData.projectCode+']':''}${formData.projectName||''}` }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="招标协议" prop="tenderAgreementId">{{ formData.tenderAgreementName }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard class="mt-8" title="耗材明细">
        <consumableReceiptDetail ref="consumableReceiptDetail" :form-data="formData" :show-btn="false" />
      </SectionCard>
      <SectionCard title="处理记录" class="mt-8">
        <handleRecords :table-data="formData.assetReviewAuditList" />
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="success" @click="printVisible=true">打印</el-button>
    </div>
    <Print v-if="printVisible" ref="printRef" :print-visible.sync="printVisible" :print-data="formData" :dict-data-list="dictDataList" />
  </PageCard>
</template>
<script>
import { getReceipt } from '@/api/receipt.js'
import consumableReceiptDetail from './components/consumableReceiptDetail.vue'
import { listDictItems } from '@/api/base.js'
import Print from './components/print.vue'
export default {
  components: {
    consumableReceiptDetail,
    Print
  },
  data() {
    return {
      editId: '',
      formData: {},
      submitLoading: false,
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
      getReceipt(this.editId)
        .then((res) => {
          // 入库方式为  有申购单入库的时候，将申购单数据带出
          if (res.data.accepterMethod == 1) {
            res.data = {
              ...res.data,
              ...{
                phone: res.data.poPurchaseApplication.arrivalMobile,
                poApplicantName: res.data.poPurchaseApplication.applicantName,
                purchaseApplicantOrgName: res.data.poPurchaseApplication.applicantOrgName,
                purchaseApplicantCompanyName: res.data.poPurchaseApplication.applicantCompanyName,
                subscriptionQuantity: res.data.poPurchaseApplication.subscriptionQuantity,
                subscriptionExcTaxAmount: res.data.poPurchaseApplication.subscriptionExcTaxAmount,
                purchaseTaxAmount: res.data.poPurchaseApplication.purchaseTaxAmount,
                subscriptionTaxAmount: res.data.poPurchaseApplication.subscriptionTaxAmount
              }
            }
          }
          this.formData = {
            ...res.data,
            ...{
              location: [res.data.currentEreaId, res.data.currentLocationId],
              clmConsumableReceiptDetailList: res.data.clmConsumableReceiptDetailList.map((row) => {
                return {
                  ...row,
                  ...{
                    subtotal: this.$vxe.multiply(row.buyQuantity, row.priceIncludTax)
                  }
                }
              })
            }
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      let dictCodes = 'AlmAssetReceipt-accepterMethod' // 入库方式
      dictCodes += ',AlmAssetReceipt-assetSource' // 资产来源
      dictCodes += ',AlmAssetReceipt-status' // 入库状态
      dictCodes += ',System-sourceTerminal' // 来源终端
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
