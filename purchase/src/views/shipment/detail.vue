<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" v-loading="submitLoading" label-width="170px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货单号">{{ formData.shipmentCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ formData.applicantDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人">{{ formData.applicantName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门">{{formData.applicantOrgName}}</el-form-item>
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
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="PoPurchaseShipment-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商编号">{{ formData.supplierCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">{{ formData.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司编号">{{ formData.accountNumber }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司名称">{{ formData.accountName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号">{{ formData.contractCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称">{{ formData.contractName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编号">{{ formData.projectCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标协议编号">{{ formData.tenderAgreementCode }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="招标协议标题">{{ formData.tenderAgreementName }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号">{{ formData.purchaseApplicationCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期">{{ formData.subscriptionDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系人">{{ formData.arrivalContact }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系电话">{{ formData.arrivalMobile }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期">{{ formData.arrivalDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求">{{ formData.arrivalRequirement }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域">{{ formData.ereaName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="具体位置">{{ formData.locationName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量">{{ $vxe.commafy(formData.subscriptionQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额（元）">{{ $vxe.commafy(formData.subscriptionTaxAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="来源终端">
              <dictDateView :value="formData.sourceTerminal" :dictDataList="dictDataList" dictCode="System-sourceTerminal" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="采购信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购单号">{{ formData.purchaseCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购人">{{ formData.purchaserName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购部门">{{ formData.purchaserOrgName }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="发货信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货日期">{{ formData.shipmentDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货人">{{ formData.shipperName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次发货数量">{{ $vxe.commafy(formData.shipmentQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次发货金额（元）">{{ $vxe.commafy(formData.shipmentAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余未发货数量">{{ $vxe.commafy(formData.unShipmentQuantity,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余未发货金额（元）">{{ $vxe.commafy(formData.unShipmentAmount,{digits:3}) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货状态">
              <dictDateView :value="formData.status" :dictDataList="dictDataList" dictCode="PoPurchaseShipment-status" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" v-if="formData.shipmentId ? true : false">{{ formData.createDate }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="更新时间" v-if="formData.shipmentId ? true : false">{{ formData.updateDate }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发货原因" class="noProp-item-textarea">{{ formData.shipmentReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="资产明细">
        <shipmentAssetDetail ref="assetShipmentDetail" :showBtn="false" :editId="editId" :form="form" />
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="success" @click="printDialog=true">打印</el-button>
    </div>
    <Print v-if="printDialog" :print-data="formData" :printVisible.sync="printDialog" />
  </PageCard>
</template>
<script>
import { getShipment } from '@/api/shipment.js'
import assetShipmentDetail from './components/assetShipmentDetail.vue'
import Print from './components/print.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    assetShipmentDetail,
    Print
  },
  data() {
    return {
      returnUrl: '/purchase/shipment',
      editId: '',
      formData: {},
      submitLoading: false,
      dictDataList: [],
      printDialog: false
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
      getShipment(this.editId)
        .then((res) => {
          let poPurchaseApplication = res.data.poPurchaseApplication || {}
          this.formData = {
            ...res.data,
            ...{
              accountNumber: poPurchaseApplication.accountNumber,
              centralizedBusinessName: poPurchaseApplication.centralizedBusinessName,
              purchaseApplicationCode: poPurchaseApplication.purchaseApplicationCode,
              subscriptionDate: poPurchaseApplication.subscriptionDate,
              subscriptionReason: poPurchaseApplication.subscriptionReason,
              subscriptionQuantity: poPurchaseApplication.subscriptionQuantity,
              subscriptionTaxAmount: poPurchaseApplication.subscriptionTaxAmount,
              supplierCode: poPurchaseApplication.supplierCode,
              supplierName: poPurchaseApplication.supplierName,
              accountId: poPurchaseApplication.accountId,
              accountName: poPurchaseApplication.accountName,
              contractCode: poPurchaseApplication.contractCode,
              contractName: poPurchaseApplication.contractName,
              projectCode: poPurchaseApplication.projectCode,
              projectName: poPurchaseApplication.projectName,
              ereaName: poPurchaseApplication.ereaName,
              locationName: poPurchaseApplication.locationName,
              arrivalContact: poPurchaseApplication.arrivalContact,
              arrivalMobile: poPurchaseApplication.arrivalMobile,
              arrivalDate: poPurchaseApplication.arrivalDate,
              arrivalRequirement: poPurchaseApplication.arrivalRequirement,
              tenderAgreementCode: poPurchaseApplication.tenderAgreementCode,
              tenderAgreementTitle: poPurchaseApplication.tenderAgreementTitle,
              purchaseCode: poPurchaseApplication.purchaseCode,
              purchaserName: poPurchaseApplication.purchaserName,
              purchaserOrgName: poPurchaseApplication.purchaserOrgName,
              unShipmentQuantity: this.$vxe.subtract(poPurchaseApplication.subscriptionQuantity, res.data.shipmentQuantity),
              unShipmentAmount: this.$vxe.subtract(poPurchaseApplication.subscriptionTaxAmount, res.data.shipmentAmount)
            }
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'System-sourceTerminal' //来源终端
      dictCodes += ',PoPurchaseShipment-status' //发货状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
