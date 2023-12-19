<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :disabled="formDisabled" :model="formData" :rules="rules" label-width="180px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购单号">
              <el-input v-model="formData.purchaseApplicationCode" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别" prop="centralizedBusinessId">
              <base-input
                :value.sync="formData.centralizedBusinessId"
                :label.sync="formData.centralizedBusinessName"
                :disabled="$refs.assetApplicationDetail?$refs.assetApplicationDetail.tableData.length>0:false"
                base-code="listType"
                label-name="businessName"
                value-name="businessId"
                :pre-store="[{ businessId: formData.centralizedBusinessId,businessName: formData.centralizedBusinessName}]"
                placeholder="请选择业务类别"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="formData.applicantName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="财务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :value="`${
                  formData.supplierCode ? '[' + formData.supplierCode + ']' : ''
                }${formData.supplierName || ''}`"
                placeholder="请选择供应商"
                @focus="supplierDialogVisible = true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出账公司" prop="accountName">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :value="`${formData.accountCode ? '[' + formData.accountCode + ']' : ''}${formData.accountName || ''}`"
                placeholder="请选择出账公司"
                @focus="chargeOffDialogVisible = true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :value="`${formData.contractCode ? '[' + formData.contractCode + ']' : ''}${formData.contractName || ''}`"
                placeholder="请选择合同"
                @focus="contractDialogVisible = true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input
                suffix-icon="el-icon-arrow-down"
                :disabled="formData.accepterMethod == 1"
                :value="`${formData.projectCode ? '[' + formData.projectCode + ']' : ''}${formData.projectName || ''}`"
                placeholder="请选择项目"
                @focus="projectDialogVisible = true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标协议">
              <base-input
                base-code="listAgreement"
                label-name="tenderAgreementName"
                value-name="tenderAgreementId"
                code-name="tenderAgreementCode"
                :value.sync="formData.tenderAgreementId"
                :label.sync="formData.tenderAgreementName"
                :code.sync="formData.tenderAgreementCode"
                placeholder="请选择招标协议"
                :return-obj="true"
                :pre-store="[{ tenderAgreementId: formData.tenderAgreementId,tenderAgreementName: formData.tenderAgreementName}]"
                @change="changeTenderAgreement"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本次申购总金额（元）">
              <el-input-number v-model.number="formData.subscriptionTaxAmount" :disabled="true" :precision="2" :step="1" controls-position="right" placeholder="请输入本次申购总金额（元）" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="申购日期" prop="subscriptionDate">
              <el-date-picker v-model="formData.subscriptionDate" type="date" placeholder="请选择申购日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系人" prop="arrivalContact">
              <el-input v-model="formData.arrivalContact" placeholder="请选择到货联系人" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货联系电话" prop="arrivalMobile">
              <el-input v-model="formData.arrivalMobile" placeholder="请输入到货联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货日期" prop="arrivalDate">
              <el-date-picker v-model="formData.arrivalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货要求" prop="arrivalRequirement">
              <el-input v-model="formData.arrivalRequirement" placeholder="请输入到货要求" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="申购数量">
              <el-input-number
                v-model.number="formData.subscriptionQuantity"
                :disabled="true"
                :precision="formData.materialType==1?0:3"
                :step="1"
                controls-position="right"
                placeholder="自动计算"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购不含税金额（元）">
              <el-input-number v-model.number="formData.subscriptionExcTaxAmount" :disabled="true" :precision="8" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购税额（元）">
              <el-input-number v-model.number="formData.purchaseTaxAmount" :disabled="true" :precision="8" :step="1" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入备注" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申购原因" class="noProp-item-textarea" prop="subscriptionReason">
              <el-input v-model="formData.subscriptionReason" type="textarea" placeholder="请输入申购原因" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>

    <SectionCard title="资产明细">
      <assetApplicationDetail ref="assetApplicationDetail" :disabled="detailDisibled" :form-data.sync="formData" @calculate="calculate" />
    </SectionCard>
    <SectionCard v-if="formData.status && formData.status!=0" title="处理记录">
      <handleRecords :table-data="formData.assetReviewAuditList" />
    </SectionCard>
    <SectionCard title="处理意见">
      <el-input v-model="formData.curProcessOptions" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button v-if="(!formData.status||formData.status==0||formData.status==3)" type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button v-if="(!formData.status||formData.status==0||formData.status==3)" type="primary" @click="submitForm(2,6)">提 交</el-button>
      <el-button v-if="todo=='audit_superior'" type="primary" @click="approve(2,1)">通 过</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="primary" @click="approve(2,1)">登 记</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="approve(0,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="approve(2,4)">撤 回</el-button>
      <el-button v-if="todo=='audit_superior'||todo=='register_asset_admin'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='invalid_add'" type="danger" @click="approve(4,5)">作 废</el-button>
    </div>
    <contract v-if="contractDialogVisible" :visible.sync="contractDialogVisible" @confirm="contractSelect" />
    <supplier v-if="supplierDialogVisible" :visible.sync="supplierDialogVisible" title="选择供应商" @confirm="supplierSelect" />
    <chargeOff v-if="chargeOffDialogVisible" :visible.sync="chargeOffDialogVisible" title="出账公司" @confirm="chargeOffSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { listAddressQueryUseAreaTree } from '@/api/base.js'
import { getApplication, addApplication, updateApplication, approveApplication } from '@/api/application.js'
import assetApplicationDetail from './components/assetApplicationDetail.vue'
// import Global from '@/layout/components/global.js'
export default {
  components: {
    assetApplicationDetail
  },
  data() {
    return {
      returnUrl: '/purchase/application',
      submitLoading: false,
      contractDialogVisible: false,
      supplierDialogVisible: false,
      chargeOffDialogVisible: false,
      projectDialogVisible: false,
      formDisabled: false,
      detailDisibled: false,
      formData: {},
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类别不能为空', trigger: 'change' },
        supplierName: { required: true, message: '供应商不能为空', trigger: 'change' },
        accountName: { required: true, message: '出账公司不能为空', trigger: 'change' },
        contractName: { required: true, message: '合同名称不能为空', trigger: 'change' },
        subscriptionDate: { required: true, message: '申购日期不能为空', trigger: 'change' },
        arrivalContact: { required: true, message: '到货联系人不能为空', trigger: 'change' },
        arrivalMobile: { required: true, message: '到货联系电话不能为空', trigger: 'change' },
        arrivalDate: { required: true, message: '到货日期不能为空', trigger: 'change' },
        arrivalRequirement: { required: true, message: '到货要求不能为空', trigger: 'change' },
        location: { required: true, message: '使用区域不能为空', trigger: 'change' },
        subscriptionQuantity: { required: true, message: '申购数量不能为空', trigger: 'change' },
        subscriptionExcTaxAmount: { required: true, message: '申购不含税金额（元）不能为空', trigger: 'change' },
        purchaseTaxAmount: { required: true, message: '申购税额（元）不能为空', trigger: 'change' },
        subscriptionReason: { required: true, message: '申购原因不能为空', trigger: 'change' }
      },
      user: this.$store.getters.userInfo,
      todo: '',
      todoObj: {
        audit_superior: { curProcessStepName: '直接上级审批', operationName: '审批' },
        register_asset_admin: { curProcessStepName: '资产管理员登记', operationName: '登记' },
        recall_add: { curProcessStepName: '发起申购', operationName: '撤回' },
        recall_superior: { curProcessStepName: '直接上级审批', operationName: '撤回' },
        invalid_add: { curProcessStepName: '发起申购', operationName: '作废' }
      },
      editId: '',
      propsUseAreaTree: {
        label: 'label',
        value: 'id',
        children: 'children'
      },
      useAreaTree: []
    }
  },
  created() {
    this.editId = this.$route.query.id
    this.todo = this.$route.query.todo || ''
    this.getAddress()
    this.init()
  },
  methods: {
    init() {
      if (this.editId) {
        this.submitLoading = true
        getApplication(this.editId)
          .then((res) => {
            this.formData = {
              ...res.data,
              ...{
                location: res.data.ereaId ? [res.data.ereaId, res.data.locationId] : []
              }
            }

            // 审批中需要把表单禁止修改
            if (this.formData.status != '0' && this.formData.status != '3') {
              this.formDisabled = true
            }
            // 草稿、退回、登记时才可以修改明细表
            if (!this.formData.status || this.formData.status == 0 || this.formData.status == 3 || this.operationName == '登记') {
              this.detailDisibled = false
            } else {
              this.detailDisibled = true
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
        this.$set(this.formData, 'subscriptionDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      }
    },
    // 合同选择
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
    // 供应商选择
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
        ...{
          accountId: val.accountId,
          accountNumber: val.accountNumber,
          accountName: val.companyName
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
    // 选择招标协议
    changeTenderAgreement(val) {
      this.formData = {
        ...this.formData,
        ...{
          tenderAgreementTitle: val.tenderAgreementName
        }
      }
    },
    // 使用区域选择
    useAreaChange(val) {
      if (val.length == 2) {
        var leftData = this.useAreaTree.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])
        this.formData = {
          ...this.formData,
          ...{
            ereaId: val[0],
            ereaName: leftData.label,
            locationId: val[1],
            locationName: rightData.label
          }
        }
      } else {
        this.formData = {
          ...this.formData,
          ...{
            ereaId: '',
            ereaName: '',
            locationId: '',
            locationName: ''
          }
        }
      }
    },
    getAddress() {
      listAddressQueryUseAreaTree().then((res) => {
        this.useAreaTree = res.data
        this.useAreaTree.forEach((item) => {
          if (!item.children) {
            item['disabled'] = true
          }
        })
      })
    },
    calculate(list) {
      var subscriptionQuantity = 0
      var subscriptionExcTaxAmount = 0
      var purchaseTaxAmount = 0
      var subscriptionTaxAmount = 0
      list.forEach((item) => {
        subscriptionQuantity = this.$vxe.add(subscriptionQuantity, item.buyQuantity)
        subscriptionExcTaxAmount = this.$vxe.add(subscriptionExcTaxAmount, this.$vxe.multiply(item.buyQuantity, item.priceExcludTax))
        purchaseTaxAmount = this.$vxe.add(purchaseTaxAmount, item.taxAmount)
        subscriptionTaxAmount = this.$vxe.add(subscriptionTaxAmount, item.subtotal)
      })
      this.formData = {
        ...this.formData,
        ...{
          subscriptionQuantity,
          subscriptionExcTaxAmount,
          purchaseTaxAmount,
          subscriptionTaxAmount
        }
      }
    },
    // 新增或者修改
    submitForm(status, curProcessResult) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (status != 0 && curProcessResult != 4 && !this.formData.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
            return
          }
          if (this.$refs.assetApplicationDetail.tableData.length == 0) {
            this.$message({
              message: `资产明细数据不能为空！`,
              type: 'warning'
            })
            return
          }

          if (await this.$refs.assetApplicationDetail.validTable()) {
            return
          }
          var submitData = {
            ...this.formData,
            ...{
              status: status,
              assetApplicationDetail: this.$refs.assetApplicationDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              curProcessResult: curProcessResult || ''
            }
          }
          if (this.editId) {
            this.submitLoading = true
            updateApplication(submitData).then((response) => {
              this.submitLoading = false
              this.$message.success(status == 2 ? '提交成功' : '修改成功')
              if (status == 2) {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
                return
              }
              this.init()
            })
          } else {
            this.submitLoading = true
            addApplication(submitData).then((res) => {
              this.submitLoading = false
              this.$message.success(status == 2 ? '提交成功' : '新增成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                window.$wujie.props.route({
                  path: '/purchase/application',
                  module: 'Purchase',
                  fullPath: '/purchase/application/edit',
                  title: '编辑申购',
                  condition: { id: res.msg }
                })
              }, 500)
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
    // 流程操作
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
          if (this.$refs.assetApplicationDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.assetApplicationDetail.validTable()) {
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
              assetApplicationDetail: this.$refs.assetApplicationDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveApplication(submitData)
            .then((res) => {
              this.$modal.msgSuccess(`${obj[curProcessResult]}！`)
              this.submitLoading = false
              setTimeout(() => {
                this.$router.push({
                  name: 'purchase/application'
                })
              }, 300)
              // Global.$emit('closeCurrentTag', this.$route)
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
    }
  }
}
</script>
