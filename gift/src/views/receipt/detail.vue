<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="礼品入库单号">{{formData.giftReceiptCode}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{$vxe.toDateString(formData.applicantDate,'yyyy-MM-dd') }}</el-form-item>
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
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="申请信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收单号">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收日期">{{$vxe.toDateString(formData.registeDate,'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收方式">
              <dictDateView :value="formData.accepterMethod" :dictDataList="dictDataList" dictCode="AlmAssetReceipt-accepterMethod" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品来源">
              <dictDateView :value="formData.giftSource" :dictDataList="dictDataList" dictCode="AlmAssetReceipt-giftSource" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产来源">
              <dictDateView :value="formData.giftSource" :dictDataList="dictDataList" dictCode="AlmAssetReceipt-giftSource" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收人姓名">{{ formData.accepterName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收部门名称">{{ formData.accepterOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品所属仓库名称">{{ formData.warehouseName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品所属公司名称">{{ formData.assetCompanyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收数量">{{ $vxe.commafy(formData.receiptQuantity , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收不含税金额">{{ $vxe.commafy(formData.receiptExcTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收税额">{{ $vxe.commafy(formData.receiptTax , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收总金额 ">{{ $vxe.commafy(formData.receiptTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="验收状态 ">{{ formData.status}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">{{ formData.remarks }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="验收原因" prop="receiptReason" class="noProp-item-textarea">{{ formData.receiptReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="申购信息" v-if="formData.accepterMethod==1">
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
            <el-form-item label="申购人">
              <el-input disabled v-model="formData.applicantName" placeholder="选择申购单自动带出" />
            </el-form-item>
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
            <el-form-item label="申购不含税金额">{{ $vxe.commafy(formData.subscriptionExcTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额">{{ $vxe.commafy(formData.purchaseTaxAmount , { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额">{{ $vxe.commafy(formData.subscriptionTaxAmount , { digits: 2 }) }}</el-form-item>
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
            <el-form-item label="使用区域">{{ formData.currentEreaName }}/{{ formData.currentLocationName}}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息">
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
      <SectionCard class="mt-8" title="礼品明细">
        <giftReceiptDetail ref="giftReceiptDetail" :form-data="formData" :showBtn="false" />
      </SectionCard>
    </el-form>
  </PageCard>
</template>
<script>
import { getReceipt } from '@/api/receipt'
import giftReceiptDetail from './components/giftReceiptDetail.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    giftReceiptDetail
  },
  data() {
    return {
      returnUrl: '/gift/receipt',
      editId: '',
      formData: {},
      submitLoading: false,
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
      getReceipt(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data,
            ...{
              location: [res.data.currentEreaId, res.data.currentLocationId]
              // almAssetReceiptDetailList: res.data.almAssetReceiptDetailList.map((row) => {
              //   return {
              //     ...row,
              //     ...{
              //       subtotal: this.$vxe.multiply(row.buyQuantity, row.priceIncludTax)
              //     }
              //   }
              // })
            }
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'AlmAssetReceipt-accepterMethod' // 入库方式
      dictCodes += ',AlmAssetReceipt-giftSource' // 礼品来源
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
