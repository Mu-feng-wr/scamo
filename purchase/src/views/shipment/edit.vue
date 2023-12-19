<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" :model="formData" :rules="rules" label-width="180px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货单号">
              <el-input disabled v-model="formData.shipmentCode" placeholder="自动生成发货单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别" prop="centralizedBusinessName">
              <el-input v-model="formData.centralizedBusinessName" placeholder="选择申购单自动带出" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="formData.applicantName" placeholder="请输入申请人" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" placeholder="请输入申请部门" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司名称" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" placeholder="请输入申请公司名称" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申购信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号" prop="purchaseApplicationCode">
              <el-input suffix-icon="el-icon-arrow-down" :disabled="!!editId" v-model="formData.purchaseApplicationCode" @focus="purchaseDialog = true" placeholder="请选择申购单"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期" prop="subscriptionDate">
              <el-date-picker clearable v-model="formData.subscriptionDate" type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系人" prop="arrivalContact">
              <el-input v-model="formData.arrivalContact" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系电话" prop="arrivalMobile">
              <el-input v-model="formData.arrivalMobile" placeholder="选择申购单自动带出" maxlength="11" show-word-limit :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">
              <el-date-picker clearable v-model="formData.arrivalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求" prop="arrivalRequirement">
              <el-input v-model="formData.arrivalRequirement" placeholder="选择申购单自动带出" maxlength="300" show-word-limit :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域" prop="ereaName">
              <el-input v-model="formData.ereaName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量" prop="subscriptionQuantity">
              <el-input-number
                :disabled="true"
                :precision="formData.materialType==1?0:3"
                :step="1"
                :max="999999.99"
                v-model.number="formData.subscriptionQuantity"
                controls-position="right"
                placeholder="选择申购单自动带出"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额（元）" prop="subscriptionTaxAmount">
              <el-input-number :disabled="true" :precision="2" :step="1" :max="999999.99" v-model.number="formData.subscriptionTaxAmount" controls-position="right" placeholder="选择申购单自动带出"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体位置" prop="locationName">
              <el-input style="width: calc((100% - 340px)/3 - 24px)" :value="(formData.ereaName||'')+(formData.locationName?'/'+formData.locationName:'')" placeholder="选择申购单自动带出" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商编号" prop="supplierCode">
              <el-input v-model="formData.supplierCode" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="formData.supplierName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司编号" prop="accountNumber">
              <el-input v-model="formData.accountNumber" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司名称" prop="accountName">
              <el-input v-model="formData.accountName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="formData.contractCode" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="formData.contractName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编号">
              <el-input v-model="formData.projectCode" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="formData.projectName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标协议编号">
              <el-input v-model="formData.tenderAgreementCode" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="招标协议标题">
              <el-input style="width: calc((100% - 340px)/3 - 24px)" v-model="formData.tenderAgreementName" placeholder="选择申购单自动带出" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard v-if="formData.purchaseId" title="采购信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购单号">
              <el-input v-model="formData.purchaseCode" placeholder="选择申购单自动带出" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购人">
              <el-input v-model="formData.purchaserName" placeholder="选择申购单自动带出" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购部门">
              <el-input v-model="formData.purchaserOrgName" placeholder="选择申购单自动带出" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="发货信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发货日期" prop="shipmentDate">
              <el-date-picker clearable v-model="formData.shipmentDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择申请日期" :disabled="formIsDisabled"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发货人" prop="shipperName">
              <el-input v-model="formData.shipperName" placeholder="请选择申购人" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次发货数量" prop="shipmentQuantity">
              <el-input-number
                disabled
                :precision="formData.materialType==1?0:3"
                :step="1"
                :max="999999.99"
                v-model.number="formData.shipmentQuantity"
                controls-position="right"
                placeholder="请输入本次发货数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次发货金额（元）" prop="shipmentAmount">
              <el-input-number disabled :precision="2" :step="1" v-model.number="formData.shipmentAmount" controls-position="right" placeholder="请输入本次发货金额（元）"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余未发货数量" prop="unShipmentQuantity">
              <el-input-number
                :disabled="true"
                :precision="formData.materialType==1?0:3"
                :step="1"
                :max="999999.99"
                v-model.number="formData.unShipmentQuantity"
                controls-position="right"
                placeholder="请输入剩余未发货数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余未发货金额（元）" prop="unShipmentAmount">
              <el-input-number :disabled="true" :precision="2" :step="1" :max="999999.99" v-model.number="formData.unShipmentAmount" controls-position="right" placeholder="请输入剩余未发货金额（元）"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发货原因" prop="shipmentReason" class="noProp-item-textarea">
              <el-input type="textarea" v-model="formData.shipmentReason" placeholder="请输入发货原因" maxlength="300" show-word-limit :disabled="formIsDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard class="mt-8" title="资产明细">
      <assetShipmentDetail ref="assetShipmentDetail" :editId="editId" :form-data="formData" @calculate="uploadTotal" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm(0,1)" v-if="(formData.ynGenLine==0||!formData.ynGenLine)&&formData.materialType==1">保存生成单个资产</el-button>
      <el-button :disabled="submitButton" type="success" v-if="(!formData.status||formData.status==0)" @click="submitForm(0,formData.ynGenLine||0)">草 稿</el-button>
      <el-button
        :disabled="submitButton"
        type="primary"
        v-if="(!formData.status||formData.status==0)&&(formData.ynGenLine==1||formData.materialType!=1)"
        @click="submitForm(1,formData.materialType==1?1:0,'提交成功')"
      >提 交</el-button>
    </div>
    <purchaseApplication v-if="purchaseDialog" :visible.sync="purchaseDialog" @confirm="purchaseHandler" :query="[{label:'businessKey',value:'PO_SHIPMENT'}]" />
  </PageCard>
</template>
<script>
import { getShipment, addShipment, updateShipment } from '@/api/shipment.js'
import assetShipmentDetail from './components/assetShipmentDetail.vue'
export default {
  components: {
    assetShipmentDetail
  },
  data() {
    return {
      submitLoading: false,
      isDetail: false,
      purchaseDialog: false,
      formData: {},
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessName: { required: true, message: '业务类别不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        purchaseApplicationId: { required: true, message: '请选择申购单号', trigger: 'change' },
        supplierCode: { required: true, message: '供应商编号不能为空', trigger: 'change' },
        supplierName: { required: true, message: '供应商名称不能为空', trigger: 'change' },
        accountNumber: { required: true, message: '出账公司编号不能为空', trigger: 'change' },
        accountName: { required: true, message: '出账公司名称不能为空', trigger: 'change' },
        contractCode: { required: true, message: '合同编号不能为空', trigger: 'change' },
        contractName: { required: true, message: '合同名称不能为空', trigger: 'change' },
        purchaseApplicationCode: { required: true, message: '申购单号不能为空', trigger: 'change' },
        subscriptionDate: { required: true, message: '申购日期不能为空', trigger: 'change' },
        arrivalContact: { required: true, message: '到货联系人不能为空', trigger: 'change' },
        arrivalMobile: { required: true, message: '到货联系电话不能为空', trigger: 'change' },
        arrivalDate: { required: true, message: '到货日期不能为空', trigger: 'change' },
        arrivalRequirement: { required: true, message: '到货要求不能为空', trigger: 'change' },
        ereaName: { required: true, message: '使用区域不能为空', trigger: 'change' },
        locationName: { required: true, message: '具体位置不能为空', trigger: 'change' },
        subscriptionQuantity: { required: true, message: '申购数量不能为空', trigger: 'change' },
        subscriptionExcTaxAmount: { required: true, message: '申购不含税金额（元）不能为空', trigger: 'change' },
        purchaseTaxAmount: { required: true, message: '申购税额（元）不能为空', trigger: 'change' },
        shipmentAmount: { required: true, message: '请填写本次发货金额', trigger: 'change' },
        shipmentQuantity: { required: true, message: '请填写本次发货数量', trigger: 'change' },
        shipperName: { required: true, message: '请填写发货人', trigger: 'change' },
        shipmentDate: { required: true, message: '请选择发货日期', trigger: 'change' },
        unShipmentQuantity: { required: true, message: '剩余未发货数量不能为空', trigger: 'change' },
        unShipmentAmount: { required: true, message: '剩余未发货金额（元）不能为空', trigger: 'change' },
        shipmentReason: { required: true, message: '发货原因不能为空', trigger: 'change' }
      },
      curProcessStepName: null,
      formIsDisabled: false,
      user: this.$store.getters.userInfo,
      editId: '',
      submitButton: false
    }
  },
  created() {
    this.editId = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      if (!this.editId) {
        this.formData = {
          ...this.formData,
          ...{
            sourceTerminal: 1, //来源终端  默认1:pc
            applicantId: this.user.userId,
            applicantName: this.user.userName,
            applicantOrgId: this.user.deptId,
            applicantOrgName: this.user.deptName,
            applicantCompanyId: this.user.companyId,
            applicantCompanyName: this.user.companyName
          }
        }
        this.$set(this.formData, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
        this.$set(this.formData, 'shipmentDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'))
        this.$set(this.formData, 'shipperName', this.user.userName)
      } else {
        this.submitLoading = true
        getShipment(this.editId)
          .then((res) => {
            var poPurchaseApplication = res.data.poPurchaseApplication || {}
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
                materialType: poPurchaseApplication.materialType,
                unShipmentQuantity: this.$vxe.subtract(poPurchaseApplication.subscriptionQuantity, res.data.shipmentQuantity),
                unShipmentAmount: this.$vxe.subtract(poPurchaseApplication.subscriptionTaxAmount, res.data.shipmentAmount)
              }
            }
            // 草稿状态重置申请人
            if (this.formData.status == 0 && this.formData.applicantId != this.user.userId) {
              this.formData = {
                ...this.formData,
                ...{
                  applicantId: this.user.userId,
                  applicantName: this.user.userName,
                  applicantOrgId: this.user.deptId,
                  applicantOrgName: this.user.deptName,
                  applicantCompanyId: this.user.companyId,
                  applicantCompanyName: this.user.companyName
                }
              }
            }
          })
          .finally(() => {
            this.submitLoading = false
          })
      }
    },
    // 改变申购单号
    purchaseHandler(value) {
      this.formData = {
        ...this.formData,
        ...{
          purchaseApplicationId: value.purchaseApplicationId,
          purchaseApplicationCode: value.purchaseApplicationCode,
          subscriptionDate: value.subscriptionDate || '',
          centralizedBusinessId: value.centralizedBusinessId || '',
          centralizedBusinessName: value.centralizedBusinessName || '' || '',
          subscriptionQuantity: value.subscriptionQuantity || '',
          subscriptionTaxAmount: value.subscriptionTaxAmount || '',
          supplierCode: value.supplierCode || '',
          supplierName: value.supplierName || '',
          accountNumber: value.accountNumber || '',
          accountName: value.accountName || '',
          contractCode: value.contractCode || '',
          contractName: value.contractName || '',
          projectCode: value.projectCode || '',
          projectName: value.projectName || '',
          locationName: value.locationName || '',
          arrivalMobile: value.arrivalMobile || '',
          arrivalDate: value.arrivalDate || '',
          arrivalRequirement: value.arrivalRequirement || '',
          tenderAgreementCode: value.tenderAgreementCode || '',
          tenderAgreementName: value.tenderAgreementName || '',
          purchaseCode: value.purchaseCode,
          purchaserName: value.purchaserName,
          purchaserOrgName: value.purchaserOrgName,
          ereaName: value.ereaName,
          arrivalContact: value.arrivalContact,
          subscriber: value.applicantName,
          subscriberOrgName: value.applicantOrgName,
          subscriberCompanyName: value.applicantCompanyName,
          subscriptionExcTaxAmount: value.subscriptionExcTaxAmount,
          purchaseTaxAmount: value.purchaseTaxAmount,
          purchaseId: value.purchaseId,
          purchaseCode: value.purchaseCode,
          purchaserName: value.purchaserName,
          purchaserOrId: value.purchaserOrId,
          purchaserOrgName: value.purchaserOrgName,
          remarks: value.remarks,
          materialType: value.materialType,
          shipmentReason: value.subscriptionReason
        }
      }
    },
    submitForm(status, ynGenLine, message) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          var assetShipmentDetail = this.$refs.assetShipmentDetail.tableData
          if (assetShipmentDetail.length == 0) {
            // 明细表为空
            this.$message({
              message: `资产明细数据不能为空！`,
              type: 'warning'
            })
            return
          }
          if (await this.$refs.assetShipmentDetail.validTable()) {
            return
          }
          var submitData = {
            ...this.formData,
            ...{
              status: status,
              assetDetail: this.$refs.assetShipmentDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              ynGenLine: ynGenLine == null || ynGenLine == undefined ? 0 : ynGenLine
            }
          }
          this.submitLoading = true
          if (this.formData.shipmentId != null) {
            updateShipment(submitData).then((response) => {
              this.$message.success(message || '修改成功')
              this.submitLoading = false
              if (status == 1) {
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
                return
              }
              this.init()
            })
          } else {
            addShipment(submitData).then((res) => {
              this.$message.success('新增成功')
              this.submitLoading = false
              window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              if (status == 0) {
                window.$wujie.props.route({
                  path: '/purchase/shipment',
                  module: 'Purchase',
                  fullPath: '/purchase/shipment/edit',
                  title: '编辑发货',
                  condition: { id: res.msg }
                })
                return
              }
            })
          }
        } else {
          this.$nextTick(() => {
            var isError = this.$refs['form'].$el.getElementsByClassName('is-error')
            if (isError[0].querySelector('input')) {
              isError[0].querySelector('input').focus()
            } else if (isError[0].querySelector('textarea')) {
              isError[0].querySelector('textarea').focus()
            }
          })
        }
      })
    },
    uploadTotal(list) {
      var shipmentQuantity = 0
      var shipmentAmount = 0
      var unShipmentQuantity = 0
      var unShipmentAmount = 0
      list.forEach((item) => {
        shipmentQuantity = this.$vxe.add(shipmentQuantity, item.shipmentQuantity)
        shipmentAmount = this.$vxe.add(shipmentAmount, this.$vxe.multiply(item.shipmentQuantity, item.priceIncludTax))
        unShipmentQuantity = this.$vxe.add(unShipmentQuantity, item.unShipmentQuantity)
        unShipmentAmount = this.$vxe.add(unShipmentAmount, this.$vxe.multiply(item.unShipmentQuantity, item.priceIncludTax))
      })
      if (this.formData.ynGenLine == 1) {
        return
      }
      this.$set(this.formData, 'shipmentQuantity', shipmentQuantity)
      this.$set(this.formData, 'shipmentAmount', shipmentAmount)
      this.$set(this.formData, 'unShipmentQuantity', unShipmentQuantity)
      this.$set(this.formData, 'unShipmentAmount', unShipmentAmount)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
