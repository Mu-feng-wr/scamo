<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="礼品入库单号" prop="giftReceiptCode">
              <el-input v-model="formData.giftReceiptCode" placeholder="请输入礼品入库单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别" prop="centralizedBusinessId">
              <base-input
                :value.sync="formData.centralizedBusinessId"
                :label.sync="formData.centralizedBusinessName"
                base-code="listType"
                :pre-store="[{businessId:formData.centralizedBusinessId,businessName:formData.centralizedBusinessName}]"
                label-name="businessName"
                value-name="businessId"
                placeholder="请选择业务类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="formData.applicantName" disabled placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" disabled placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司名称" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" disabled placeholder="请输入申请公司名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="申请信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收单号" prop="assetReceiptCode">
              <el-input v-model="formData.assetReceiptCode" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收日期" prop="registeDate">
              <el-date-picker v-model="formData.registeDate" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择验收日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收方式" prop="accepterMethod">
              <base-input :value.sync="formData.accepterMethod" :options-list="dictDataList" base-code="AlmAssetReceipt-accepterMethod" placeholder="请选择验收方式" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品来源" prop="giftSource">
              <base-input :value.sync="formData.giftSource" :options-list="dictDataList" base-code="AlmAssetReceipt-giftSource" placeholder="请选择礼品来源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产来源" prop="giftSource">
              <base-input :value.sync="formData.giftSource" :options-list="dictDataList" base-code="AlmAssetReceipt-giftSource" placeholder="请选择资产来源" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收人姓名" prop="accepterName">
              <el-input v-model="formData.accepterName" suffix-icon="el-icon-arrow-down" placeholder="请选择验收人姓名" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收部门名称" prop="accepterOrgName">
              <el-input v-model="formData.accepterOrgName" disabled placeholder="选择验收人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品所属仓库名称" prop="warehouseName">
              <base-input
                base-code="listAddressWarehouse"
                label-name="locationName"
                value-name="locationAddressId"
                :return-obj="true"
                :value.sync="formData.warehouseId"
                placeholder="请输入礼品所属仓库名称"
                :pre-store="[{locationAddressId:formData.warehouseId,locationName:formData.warehouseName}]"
                @change="changeWarehouseName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品所属公司名称" prop="assetCompanyName">
              <el-input v-model="formData.assetCompanyName" disabled placeholder="选择仓库自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收数量" prop="receiptQuantity">
              <el-input-number v-model="formData.receiptQuantity" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收不含税金额" prop="receiptExcTaxAmount">
              <el-input-number v-model="formData.receiptExcTaxAmount" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收税额" prop="receiptTax">
              <el-input-number v-model="formData.receiptTax" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收总金额 " prop="receiptTaxAmount">
              <el-input-number v-model="formData.receiptTaxAmount" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算 " />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="验收状态 " prop="status">
              <el-select v-model="formData.status" placeholder="请选择验收状态" style="width:calc(50% - 85px - 12px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="验收原因" prop="receiptReason" class="noProp-item-textarea">
              <el-input v-model="formData.receiptReason" type="textarea" placeholder="请选择验收原因" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard v-if="formData.accepterMethod==1" class="mt-8" title="申购信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号" prop="purchaseApplicationId">
              <base-input
                :value.sync="formData.purchaseApplicationId"
                base-code="listApplication"
                label-name="purchaseApplicationCode"
                value-name="purchaseApplicationId"
                :pre-store="[{purchaseApplicationId:formData.purchaseApplicationId,purchaseApplicationCode:formData.purchaseApplicationCode}]"
                :return-obj="true"
                clearable
                @change="changePurchaseApplicationId"
                @clear="clearPurchaseApplication"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期" prop="subscriptionDate">
              <el-date-picker v-model="formData.subscriptionDate" disabled clearable type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="formData.phone" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购人">
              <el-input v-model="formData.applicantName" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购部门">
              <el-input v-model="formData.purchaseApplicantOrgName" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购公司">
              <el-input v-model="formData.purchaseApplicantCompanyName" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量">
              <el-input-number v-model="formData.subscriptionQuantity" disabled :precision="2" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购不含税金额">
              <el-input-number v-model="formData.subscriptionExcTaxAmount" disabled :precision="2" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额">
              <el-input-number v-model="formData.purchaseTaxAmount" disabled :precision="2" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额">
              <el-input-number v-model="formData.subscriptionTaxAmount" disabled :precision="2" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">
              <el-date-picker v-model="formData.arrivalDate" disabled clearable type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求">
              <el-input v-model="formData.arrivalRequirement" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="使用信息">
        <el-row>
          <el-col :span="24">
            <el-form-item label="使用区域" prop="location">
              <el-cascader
                ref="categoryCascader"
                v-model="formData.location"
                :props="propsUseAreaTree"
                :options="useAreaTree"
                placeholder="请选择使用区域"
                :filterable="true"
                clearable
                style="width: 100%"
                @change="useAreaChange"
              >
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf">({{ data.children.length }})</span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard class="mt-8" title="财务信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierCode">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod==1"
                :value="`${formData.supplierCode?'['+formData.supplierCode+']':''}${formData.supplierName||''}`"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择供应商'"
                @focus="supplierDialogVisible=true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司名称" prop="accountId">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod==1"
                :value="`${formData.accountCode?'['+formData.accountCode+']':''}${formData.accountName||''}`"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择出账公司'"
                @focus="chargeOffDialogVisible=true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod==1"
                :value="`${formData.contractCode?'['+formData.contractCode+']':''}${formData.contractName||''}`"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择合同'"
                @focus="contractDialogVisible=true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectCode">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod==1"
                :value="`${formData.projectCode?'['+formData.projectCode+']':''}${formData.projectName||''}`"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择项目'"
                @focus="projectDialogVisible=true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="招标协议" prop="tenderAgreementId">
              <base-input
                style="width:calc(50% - 85px - 12px)"
                base-code="listAgreement"
                label-name="tenderAgreementName"
                value-name="tenderAgreementId"
                :disabled="formData.accepterMethod==1"
                :value.sync="formData.tenderAgreementId"
                :pre-store="[{tenderAgreementId:formData.tenderAgreementId,tenderAgreementName:formData.tenderAgreementName}]"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择招标协议'"
                :return-obj="true"
                @change="changeTenderAgreement"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard class="mt-8" title="礼品明细">
        <giftReceiptDetail ref="giftReceiptDetail" v-bind="{useAreaTree}" :form-date="formData" @calculate="calculate" />
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button v-if="formData.status<=0" type="primary" @click="submitForm(6)">保存生成单个资产</el-button>
      <el-button v-if="formData.status==0" type="primary" @click="submitForm(0)">保存继续录入资产明细</el-button>
      <el-button v-if="!todo" type="primary" @click="submitForm(6)">提 交</el-button>
      <el-button v-if="!todo" type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button v-if="todo=='audit_superior'" type="primary" @click="submitForm(1)">通 过</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="primary" @click="submitForm(1)">登 记</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="submitForm(4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="submitForm(4)">撤 回</el-button>
      <el-button v-if="todo=='audit_superior'" type="warning" @click="submitForm(2)">退 回</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="warning" @click="submitForm(2)">退 回</el-button>
      <el-button v-if="todo=='invalid_add'" type="danger" @click="submitForm(5)">作 废</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择验收人" @confirm="userSelect" />
    <supplier v-if="supplierDialogVisible" :visible.sync="supplierDialogVisible" title="选择供应商" @confirm="supplierSelect" />
    <chargeOff v-if="chargeOffDialogVisible" :visible.sync="chargeOffDialogVisible" title="出账公司名称" @confirm="chargeOffSelect" />
    <contract v-if="contractDialogVisible" :visible.sync="contractDialogVisible" @confirm="contractSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getReceipt, addReceipt, updateReceipt } from '@/api/receipt.js'
import giftReceiptDetail from './components/giftReceiptDetail.vue'
import { listAddressQueryUseAreaTree, listDictItems } from '@/api/base.js'
export default {
  components: {
    giftReceiptDetail
  },
  data() {
    return {
      returnUrl: '/gift/receipt',
      submitLoading: false,
      formData: {},
      userDialogVisible: false,
      supplierDialogVisible: false,
      chargeOffDialogVisible: false,
      contractDialogVisible: false,
      projectDialogVisible: false,
      dictDataList: [],
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        registeDate: { required: true, message: '验收日期不能为空', trigger: 'change' },
        accepterMethod: { required: true, message: '验收方式不能为空', trigger: 'change' },
        giftSource: { required: true, message: '礼品来源不能为空', trigger: 'change' },
        sourceTerminal: { required: true, message: '来源终端不能为空', trigger: 'change' },
        accepterName: { required: true, message: '验收人不能为空', trigger: 'change' },
        warehouseName: { required: true, message: '资产仓库不能为空', trigger: 'change' },
        purchaseApplicationId: { required: true, message: '申购单号不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类别不能为空', trigger: 'change' },
        location: { required: true, message: '使用区域不能为空', trigger: 'change' },
        remarks: { required: true, message: '备注不能为空', trigger: 'change' },
        receiptReason: { required: true, message: '验收原因不能为空', trigger: 'change' },
        supplierCode: { required: true, message: '供应商不能为空', trigger: 'change' },
        accountId: { required: true, message: '出账公司不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        accepterOrgName: { required: true, message: '验收部门名称不能为空', trigger: 'change' },
        assetCompanyName: { required: true, message: '礼品所属公司名称不能为空', trigger: 'change' },
        receiptQuantity: { required: true, message: '验收数量不能为空', trigger: 'change' },
        receiptExcTaxAmount: { required: true, message: '验收不含税金额不能为空', trigger: 'change' },
        receiptTax: { required: true, message: '验收税额不能为空', trigger: 'change' },
        receiptTaxAmount: { required: true, message: '验收总金额不能为空', trigger: 'change' },
        status: { required: true, message: '验收状态不能为空', trigger: 'change' }
      },
      editId: '',
      user: this.$store.getters.userInfo,
      propsUseAreaTree: {
        label: 'label',
        value: 'id',
        children: 'children'
      },
      useAreaTree: [],
      todo: '',
      todoObj: {
        audit_superior: { curProcessStepName: '直接上级审批', operationName: '审批' },
        register_asset_admin: { curProcessStepName: '资产管理员登记', operationName: '登记' },
        recall_add: { curProcessStepName: '发起申购', operationName: '撤回' },
        recall_superior: { curProcessStepName: '直接上级审批', operationName: '撤回' },
        invalid_add: { curProcessStepName: '发起申购', operationName: '作废' }
      }
    }
  },
  created() {
    this.todo = this.$route.query.todo
    this.editId = this.$route.query.id
    this.getUserArea()
    this.getDictData()
    this.init()
  },
  methods: {
    init() {
      if (this.editId) {
        this.submitLoading = true
        getReceipt(this.editId)
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
      } else {
        this.formData = {
          ...this.formData,
          ...{
            sourceTerminal: 1, // 终端来源    默认是   1 pc
            applicantId: this.user.userId,
            applicantName: this.user.userName,
            applicantOrgId: this.user.deptId,
            applicantOrgName: this.user.deptName,
            applicantCompanyId: this.user.companyId,
            applicantCompanyName: this.user.companyName
          }
        }
      }
    },
    // 提交 审批 作废  登记  撤回操作
    submitForm(status) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.$refs.giftReceiptDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.giftReceiptDetail.validTable()) {
            return
          }
          this.formData = {
            ...this.formData,
            ...{
              almAssetReceiptDetailList: this.$refs.giftReceiptDetail.tableData,
              status: status,
              ynGenLine: status == 0 ? 0 : 1,
              curProcessStepName: this.todo ? this.todoObj[this.todo] : '发起申购'
            }
          }
          if (this.editId != null) {
            updateReceipt(this.formData).then((res) => {
              this.$message.success(statu == 2 ? '提交成功' : '修改成功')
              if (status == 2) {
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
                return
              }
              this.init()
            })
          } else {
            addReceipt(this.formData).then((res) => {
              this.$message.success(statu == 2 ? '提交成功' : '新增成功')
              if (status == 2) {
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  window.$wujie.props.route({
                    path: '/gift/receipt',
                    module: 'Gift',
                    fullPath: '/gift/receipt/edit',
                    title: '编辑礼品入库',
                    condition: { id: res.msg }
                  })
                }, 500)
                return
              }
              this.init()
            })
          }
        }
      })
    },
    userSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          accepterId: val.userId,
          accepterName: val.userName,
          accepterOrgId: val.deptId,
          accepterOrgName: val.deptName
        }
      }
    },
    getDictData() {
      var dictCodes = 'AlmAssetReceipt-accepterMethod' // 入库方式
      dictCodes += ',AlmAssetReceipt-giftSource' // 礼品来源
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 计算资产数量 税额等
    calculate(arr) {
      var receiptTaxAmount = 0 // 验收总金额
      var receiptTax = 0 // 验收税额
      var receiptExcTaxAmount = 0 // 验收不含税金额
      var receiptQuantity = 0 // 验收数量
      arr.forEach((item) => {
        receiptTaxAmount = this.$vxe.add(receiptTaxAmount, this.$vxe.add(item.buyQuantity, item.priceIncludTax))
        receiptTax = this.$vxe.add(receiptTax, item.taxAmount)
        receiptExcTaxAmount = this.$vxe.add(receiptExcTaxAmount, item.subtotal)
        receiptQuantity = this.$vxe.add(receiptQuantity, item.buyQuantity)
      })
      this.$set(this.formData, 'receiptTaxAmount', receiptTaxAmount)
      this.$set(this.formData, 'receiptTax', receiptTax)
      this.$set(this.formData, 'receiptExcTaxAmount', receiptExcTaxAmount)
      this.$set(this.formData, 'receiptQuantity', receiptQuantity)
    },
    changePurchaseApplicationId(data) {
      this.formData = {
        ...this.formData,
        ...{
          phone: data.phone,
          applicantId: data.applicantId,
          applicantName: data.applicantName,
          purchaseApplicantOrgId: data.applicantOrgId,
          purchaseApplicantOrgName: data.applicantOrgName,
          applicantCompanyId: data.applicantCompanyId,
          applicantCompanyName: data.applicantCompanyName,
          subscriptionQuantity: data.subscriptionQuantity,
          subscriptionExcTaxAmount: data.subscriptionExcTaxAmount,
          purchaseTaxAmount: data.purchaseTaxAmount,
          subscriptionTaxAmount: data.subscriptionTaxAmount,
          arrivalRequirement: data.arrivalRequirement
        }
      }
      // 入库方式为申购入库 需要将财务信息带出
      if (this.formData.accepterMethod == 1) {
        this.formData = {
          ...this.formData,
          ...{
            supplierId: data.supplierId,
            supplierCode: data.supplierCode,
            supplierName: data.supplierName,
            accountId: data.accountId,
            accountCode: data.accountCode,
            accountName: data.accountName,
            contractId: data.contractId,
            contractCode: data.contractCode,
            contractName: data.contractName,
            projectId: data.projectId,
            projectCode: data.projectCode,
            projectName: data.projectName,
            tenderAgreementId: data.tenderAgreementId,
            tenderAgreementName: data.tenderAgreementName,
            tenderAgreementTitle: data.tenderAgreementTitle
          }
        }
      }
    },
    clearPurchaseApplication() {
      // 清除申购单信息
      this.formData = {
        ...this.formData,
        ...{
          phone: '',
          applicantId: '',
          applicantName: '',
          purchaseApplicantOrgId: '',
          purchaseApplicantOrgName: '',
          applicantCompanyId: '',
          applicantCompanyName: '',
          subscriptionQuantity: '',
          subscriptionExcTaxAmount: '',
          purchaseTaxAmount: '',
          subscriptionTaxAmount: '',
          arrivalRequirement: '',
          supplierId: '',
          supplierCode: '',
          supplierName: '',
          accountId: '',
          accountCode: '',
          accountName: '',
          contractId: '',
          contractCode: '',
          contractName: '',
          projectId: '',
          projectCode: '',
          projectName: '',
          tenderAgreementId: '',
          tenderAgreementName: '',
          tenderAgreementTitle: ''
        }
      }
    },
    changeWarehouseName(val) {
      this.formData = {
        ...this.formData,
        ...{
          warehouseId: val.locationAddressId,
          warehouseName: val.locationName,
          assetCompanyId: val.companyId,
          assetCompanyName: val.companyName
        }
      }
    },
    getUserArea() {
      listAddressQueryUseAreaTree().then((res) => {
        this.useAreaTree = res.data
        this.useAreaTree.forEach((item) => {
          if (!item.children) {
            item['disabled'] = true
          }
        })
      })
    },
    useAreaChange(val) {
      if (val.length == 2) {
        var leftData = this.useAreaTree.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])
        this.formData = {
          ...this.formData,
          ...{
            currentEreaId: val[0],
            currentEreaName: leftData.label,
            currentLocationId: val[1],
            currentLocationName: rightData.label
          }
        }
      } else {
        this.formData = {
          ...this.formData,
          ...{
            currentEreaId: '',
            currentEreaName: '',
            currentLocationId: '',
            currentLocationName: ''
          }
        }
      }
    },
    // 选择出账公司
    supplierSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          supplierId: val.supplierId,
          supplierCode: val.supplierCode,
          supplierName: val.supplierName
        }
      }
    },
    // 选择出账公司
    chargeOffSelect(val) {
      this.formData = {
        ...this.formData,
        ...{ accountId: val.accountId, accountCode: val.accountCode, accountName: val.accountName, accountNumber: val.accountNumber }
      }
    },
    // 选择合同
    contractSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          contractId: val.contractId,
          contractCode: val.contractCode,
          contractName: val.contractName
        }
      }
    },
    // 选择项目
    projectSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          projectId: val.projectId,
          projectCode: val.projectCode,
          projectName: val.projectName
        }
      }
    },
    changeTenderAgreement(val) {
      this.formData = {
        ...this.formData,
        ...{
          tenderAgreementId: val.tenderAgreementId,
          tenderAgreementCode: val.tenderAgreementCode,
          tenderAgreementName: val.tenderAgreementName
        }
      }
    }
  }
}
</script>
