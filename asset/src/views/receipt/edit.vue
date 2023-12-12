<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :disabled="!editForm" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收单号" prop="assetReceiptCode">
              <el-input v-model="formData.assetReceiptCode" size="small" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker
                v-model="formData.applicantDate"
                :disabled="!!formData.assetReceiptId"
                size="small"
                clearable
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择申请日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别" prop="centralizedBusinessId">
              <base-input
                size="small"
                :disabled="formData.ynGenLine==1||!!formData.assetReceiptId"
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
              <el-input v-model="formData.applicantName" size="small" disabled placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" size="small" disabled placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司名称" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" size="small" disabled placeholder="请输入申请公司名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard class="mt-8" title="申请信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收日期" prop="acceptedDate">
              <el-date-picker v-model="formData.acceptedDate" size="small" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择验收日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收方式" prop="accepterMethod">
              <base-input
                size="small"
                :disabled="formData.ynGenLine==1"
                :value.sync="formData.accepterMethod"
                :options-list="dictDataList"
                base-code="AlmAssetReceipt-accepterMethod"
                placeholder="请选择验收方式"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产来源" prop="assetSource">
              <base-input
                size="small"
                :disabled="formData.ynGenLine==1"
                :value.sync="formData.assetSource"
                :options-list="dictDataList"
                base-code="AlmAssetReceipt-assetSource"
                placeholder="请选择资产来源"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收人姓名" prop="accepterName">
              <el-input size="small" suffix-icon="el-icon-arrow-down" :value="formData.accepterName" placeholder="请选择验收人姓名" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收部门名称" prop="accepterOrgName">
              <el-input v-model="formData.accepterOrgName" size="small" disabled placeholder="选择验收人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产所属仓库名称" prop="warehouseName">
              <base-input
                size="small"
                base-code="listAddressWarehouse"
                label-name="locationName"
                value-name="locationAddressId"
                :return-obj="true"
                :value.sync="formData.warehouseId"
                placeholder="请输入资产所属仓库名称"
                :pre-store="[{locationAddressId:formData.warehouseId,locationName:formData.warehouseName}]"
                @change="changeWarehouseName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产所属公司名称" prop="assetCompanyName">
              <el-input v-model="formData.assetCompanyName" size="small" disabled placeholder="选择仓库自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收数量">
              <el-input-number v-model="formData.receiptQuantity" size="small" :precision="formData.materialType==1?0:3" disabled :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收不含税金额（元）">
              <el-input-number v-model="formData.receiptExcTaxAmount" size="small" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收税额（元）">
              <el-input-number v-model="formData.receiptTax" size="small" disabled :precision="3" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="formData.status!=0?8:16">
            <el-form-item label="验收总金额（元）">
              <el-input-number
                v-model="formData.receiptTaxAmount"
                size="small"
                :style="formData.status!=0?'':'width:calc(50% - 85px - 12px );'"
                disabled
                :precision="2"
                :step="1"
                controls-position="right"
                placeholder="自动计算 "
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.status!=0" :span="8">
            <el-form-item label="状态">
              <base-input size="small" base-code="AlmAssetReceipt-status" :disabled="true" :value.sync="formData.status" :options-list="dictDataList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" size="small" type="textarea" placeholder="请输入内容" :maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="验收原因" prop="receiptReason" class="noProp-item-textarea">
              <el-input v-model="formData.receiptReason" size="small" type="textarea" placeholder="请选择验收原因" :maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard v-if="formData.accepterMethod==1" class="mt-8" title="申购信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号" prop="purchaseApplicationId">
              <el-input suffix-icon="el-icon-arrow-down" :disabled="!!editId" :value="formData.purchaseApplicationCode" placeholder="请选择申购单" @focus="focusApplication" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期" prop="subscriptionDate">
              <el-date-picker v-model="formData.subscriptionDate" size="small" disabled clearable type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="formData.phone" size="small" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购人">
              <el-input v-model="formData.poApplicantName" size="small" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购部门">
              <el-input v-model="formData.purchaseApplicantOrgName" size="small" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购公司">
              <el-input v-model="formData.purchaseApplicantCompanyName" size="small" disabled placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购数量">
              <el-input-number
                v-model="formData.subscriptionQuantity"
                size="small"
                disabled
                :precision="formData.materialType==1?0:3"
                :step="1"
                controls-position="right"
                placeholder="选择申购单自动带出"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购不含税金额（元）">
              <el-input-number v-model="formData.subscriptionExcTaxAmount" size="small" disabled :precision="8" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额（元）">
              <el-input-number v-model="formData.purchaseTaxAmount" size="small" disabled :precision="8" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购总金额（元）">
              <el-input-number v-model="formData.subscriptionTaxAmount" size="small" disabled :precision="2" :step="1" controls-position="right" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">
              <el-date-picker v-model="formData.arrivalDate" size="small" disabled clearable type="date" value-format="yyyy-MM-dd" placeholder="选择申购单自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求">
              <el-input v-model="formData.arrivalRequirement" size="small" disabled placeholder="选择申购单自动带出" />
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
                size="small"
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
                size="small"
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
                size="small"
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod==1"
                :value="`${formData.accountCode?'['+formData.accountCode+']':''}${formData.accountName||''}`"
                :placeholder="formData.accepterMethod==1?'自动带出':'请选择出账公司'"
                @focus="chargeOffDialogVisible=true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractCode">
              <el-input
                size="small"
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
                size="small"
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
                style="width:calc(50% - 85px - 12px );"
                size="small"
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
    </el-form>
    <SectionCard class="mt-8" title="资产明细">
      <assetReceiptDetail ref="assetDetail" :edit-form="editForm" v-bind="{useAreaTree}" :form-data="formData" @calculate="calculate" />
    </SectionCard>
    <SectionCard v-if="formData.status" title="处理记录" class="mt-8">
      <handleRecords :table-data="formData.assetReviewAuditList" />
    </SectionCard>

    <el-row>
      <el-col :span="12" class="pr-10">
        <SectionCard title="处理意见">
          <el-input v-model="formData.curProcessOptions" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
        </SectionCard>
      </el-col>
      <el-col :span="12" class="pl-10">
        <!-- <enclosure></enclosure> -->
      </el-col>
    </el-row>

    <div slot="footer" align="center">
      <el-button v-if="formData.ynGenLine==0||!formData.ynGenLine" type="primary" @click="submitForm(0,1)">保存生成单个资产</el-button>
      <el-button v-if="(!formData.status||formData.status==0)&&formData.ynGenLine!=1" type="primary" @click="submitForm(0)">保存继续录入资产明细</el-button>
      <el-button v-if="(!formData.status||formData.status==0||formData.status==3)&&formData.ynGenLine!=1" type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button v-if="formData.ynGenLine==1&&formData.status==0||formData.status==3" type="primary" @click="submitForm(2,6)">提 交</el-button>
      <el-button v-if="todo=='audit_superior'" type="primary" @click="approve(2,1)">通 过</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="primary" @click="approve(2,1)">登 记</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="approve(0,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="approve(2,4)">撤 回</el-button>
      <el-button v-if="todo=='audit_superior'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='invalid_add'" type="danger" @click="approve(4,5)">作 废</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择验收人" @confirm="userSelect" />
    <supplier v-if="supplierDialogVisible" :visible.sync="supplierDialogVisible" title="选择供应商" @confirm="supplierSelect" />
    <chargeOff v-if="chargeOffDialogVisible" :visible.sync="chargeOffDialogVisible" title="出账公司名称" @confirm="chargeOffSelect" />
    <contract v-if="contractDialogVisible" :visible.sync="contractDialogVisible" @confirm="contractSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
    <purchaseApplication
      v-if="purchaseDialog"
      :visible.sync="purchaseDialog"
      :query="[{label:'centralizedBusinessId',value:formData.centralizedBusinessId},{label:'materialType',value:'1'}]"
      @confirm="purchaseHandler"
    />
  </PageCard>
</template>
<script>
import { getReceipt, addReceipt, updateReceipt, approveReceipt } from '@/api/receipt.js'
import assetReceiptDetail from './components/assetReceiptDetail.vue'
import { listDictItems, listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  components: {
    assetReceiptDetail
  },
  data() {
    return {
      returnUrl: '/asset/receipt',
      submitLoading: false,
      formData: {},
      userDialogVisible: false,
      supplierDialogVisible: false,
      chargeOffDialogVisible: false,
      contractDialogVisible: false,
      projectDialogVisible: false,
      purchaseDialog: false,
      editForm: true,
      dictDataList: [],
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        acceptedDate: { required: true, message: '验收日期不能为空', trigger: 'change' },
        accepterMethod: { required: true, message: '验收方式不能为空', trigger: 'change' },
        assetSource: { required: true, message: '资产来源不能为空', trigger: 'change' },
        sourceTerminal: { required: true, message: '来源终端不能为空', trigger: 'change' },
        accepterName: { required: true, message: '验收人不能为空', trigger: 'change' },
        warehouseName: { required: true, message: '资产仓库不能为空', trigger: 'change' },
        purchaseApplicationId: { required: true, message: '申购单号不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类别不能为空', trigger: 'change' },
        location: { required: true, message: '使用区域不能为空', trigger: 'change' },
        receiptReason: { required: true, message: '验收原因不能为空', trigger: 'change' },
        supplierCode: { required: true, message: '供应商不能为空', trigger: 'change' },
        accountId: { required: true, message: '出账公司不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        contractCode: { required: true, message: '合同编号不能为空', trigger: 'change' }
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
  watch: {
    'formData.accepterMethod': {
      handler(newVal, oldVal) {
        if (newVal && oldVal && (newVal == 1 || oldVal == 1)) {
          this.clearPurchaseApplication()
        }
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
      if (['audit_superior', 'register_asset_admin', 'recall_add', 'recall_superior', 'invalid_add'].includes(this.todo)) {
        this.editForm = false
      }
      if (this.editId) {
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
                almAssetReceiptDetailList: res.data.almAssetReceiptDetailList.map((row) => {
                  return {
                    ...row,
                    ...{
                      subtotal: this.$vxe.multiply(row.receiptQuantity, row.priceIncludTax)
                    }
                  }
                })
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
        this.$set(this.formData, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      }
    },
    // 保存草稿 生成单个资产
    submitForm(status, ynGenLine) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.$refs.assetDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.assetDetail.validTable()) {
            return
          }
          if (this.editId && status == 2 && !this.formData.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
            return
          }

          var submitData = {
            ...this.formData,
            ...{
              almAssetReceiptDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              ynGenLine: ynGenLine ? 1 : 0,
              curProcessStepName: this.todo ? this.todoObj[this.todo] : '发起申购'
            }
          }
          this.submitLoading = true
          if (this.editId != null) {
            updateReceipt(submitData)
              .then((res) => {
                if (this.editId && status == 2) {
                  // 编辑情况   提交先调更新，再调提交审批
                  this.approve(2, 6)
                  return
                }
                this.submitLoading = false
                this.$message.success('修改成功')
                if (status == 0) {
                  this.init()
                  return
                }
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            addReceipt(submitData)
              .then((res) => {
                this.submitLoading = false
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  window.$wujie.props.route({
                    path: '/asset/receipt',
                    module: 'Asset',
                    fullPath: '/asset/receipt/edit',
                    title: '编辑资产入库',
                    condition: { id: res.msg }
                  })
                }, 300)
              })
              .finally(() => {
                this.submitLoading = false
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
    // 审核
    approve(status, curProcessResult) {
      var obj = {
        6: '发起成功',
        1: this.todo == 'audit_superior' ? '审核成功' : '登记成功',
        2: '退回成功',
        4: '撤回成功',
        5: '作废成功'
      }
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.$refs.assetDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.assetDetail.validTable()) {
            return
          }
          if (!this.formData.curProcessOptions && curProcessResult != 4) {
            this.$message({
              type: 'warning',
              message: '处理意见不能为空'
            })
            return
          }
          this.submitLoading = true
          var submitData = {
            ...this.formData,
            ...{
              almAssetReceiptDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveReceipt(submitData)
            .then((response) => {
              this.$message.success(`${obj[curProcessResult]}！`)
              this.submitLoading = false
              setTimeout(() => {
                this.$router.push({
                  name: 'asset-receipt'
                })
              }, 300)
            })
            .catch(() => {
              this.submitLoading = false
            })
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
      dictCodes += ',AlmAssetReceipt-assetSource' // 资产来源
      dictCodes += ',AlmAssetReceipt-status' // 入库状态
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
        receiptTaxAmount = this.$vxe.add(receiptTaxAmount, this.$vxe.add(item.receiptQuantity, item.subtotal))
        receiptTax = this.$vxe.add(receiptTax, item.taxAmount)
        receiptExcTaxAmount = this.$vxe.add(receiptExcTaxAmount, this.$vxe.multiply(item.receiptQuantity, item.priceExcludTax))
        receiptQuantity = this.$vxe.add(receiptQuantity, item.receiptQuantity)
      })
      this.$set(this.formData, 'receiptTaxAmount', receiptTaxAmount)
      this.$set(this.formData, 'receiptTax', receiptTax)
      this.$set(this.formData, 'receiptExcTaxAmount', receiptExcTaxAmount)
      this.$set(this.formData, 'receiptQuantity', receiptQuantity)
    },
    // 选择申购单
    purchaseHandler(data) {
      this.formData = {
        ...this.formData,
        ...{
          purchaseApplicationId: data.purchaseApplicationId,
          purchaseApplicationCode: data.purchaseApplicationCode,
          phone: data.phone,
          purchaseApplicantOrgId: data.applicantOrgId,
          purchaseApplicantOrgName: data.applicantOrgName,
          applicantCompanyId: data.applicantCompanyId,
          applicantCompanyName: data.applicantCompanyName,
          subscriptionQuantity: data.subscriptionQuantity,
          subscriptionExcTaxAmount: data.subscriptionExcTaxAmount,
          purchaseTaxAmount: data.purchaseTaxAmount,
          subscriptionTaxAmount: data.subscriptionTaxAmount,
          arrivalRequirement: data.arrivalRequirement,
          poApplicantName: data.applicantName,
          accountNumber: data.accountNumber
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
          purchaseApplicationId: '',
          purchaseApplicationName: '',
          purchaseApplicationCode: '',
          phone: '',
          purchaseApplicantOrgId: '',
          purchaseApplicantOrgName: '',
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
    // 选择供应商
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
        ...{ accountId: val.accountId, accountCode: val.accountCode, accountName: val.companyName, accountNumber: val.accountNumber }
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
    },
    // 打开申购选择
    focusApplication() {
      if (!this.formData.centralizedBusinessId) {
        this.$message({
          type: 'warning',
          message: '请选择业务类型'
        })
        return
      }
      this.purchaseDialog = true
    }
  }
}
</script>
