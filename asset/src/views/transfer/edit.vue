<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单号">
              <el-input v-model="formData.assetTransferCode" disabled placeholder="自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="centralizedBusinessId">
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
            <el-form-item label="申请人">
              <el-input v-model="formData.applicantName" disabled placeholder="申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门">
              <el-input v-model="formData.applicantOrgName" disabled placeholder="申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司">
              <el-input v-model="formData.applicantCompanyName" disabled placeholder="申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨日期" prop="transferDate">
              <el-date-picker v-model="formData.transferDate" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择异动日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量" prop="assetQuantity">
              <el-input-number v-model="formData.assetQuantity" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）" prop="assetAmount">
              <el-input-number v-model="formData.assetAmount" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出公司" prop="outCompanyName">
              <base-input
                base-code="companyList"
                :value.sync="formData.outCompanyId"
                :label.sync="formData.outCompanyName"
                placeholder="调出公司"
                result-label="data"
                label-name="deptName"
                value-name="deptId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入公司" prop="inCompanyName">
              <base-input
                base-code="companyList"
                :value.sync="formData.inCompanyId"
                :label.sync="formData.inCompanyName"
                placeholder="调入公司"
                result-label="data"
                label-name="deptName"
                value-name="deptId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收人" prop="receiverName">
              <el-input v-model="formData.receiverName" suffix-icon="el-icon-arrow-down" placeholder="请选择变更人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出项目" prop="outProjectName">
              <el-input :value="formData.outProjectName" suffix-icon="el-icon-arrow-down" placeholder="调出项目" @focus="openProjectSelect('out')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入项目" prop="inProjectName">
              <el-input :value="formData.inProjectName" suffix-icon="el-icon-arrow-down" placeholder="调入项目" @focus="openProjectSelect('in')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收部门">
              <el-input v-model="formData.receiverOrgName" disabled placeholder="自动带出接收部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调拨原因" class="noProp-item-textarea" prop="transferReason">
              <el-input v-model="formData.transferReason" type="textarea" placeholder="调拨原因" :maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard class="mt-8" title="资产明细">
      <assetTransferDetail ref="assetDetail" :form-data="formData" :dict-data-list="dictDataList" @calculate="calculate" />
    </SectionCard>
    <SectionCard v-if="formData.status && formData.status!=0" title="处理记录">
      <handleRecords :table-data="formData.poPurchaseApplicationAuditList" />
    </SectionCard>
    <SectionCard title="处理意见">
      <el-input v-model="formData.curProcessOptions" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button v-if="(!formData.status||formData.status==0||formData.status==3)" type="primary" @click="submitForm(2,6)">提 交</el-button>
      <el-button v-if="(!formData.status||formData.status==0||formData.status==3)" type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button v-if="todo=='audit_superior'" type="primary" @click="approve(2,1)">通 过</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="primary" @click="approve(2,1)">登 记</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="approve(0,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="approve(2,4)">撤 回</el-button>
      <el-button v-if="todo=='audit_superior'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='invalid_add'" type="danger" @click="approve(4,5)">作 废</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择接收人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getTransfer, approveTransfer, addTransfer, updateTransfer } from '@/api/transfer.js'
import { listDictItems } from '@/api/base.js'
import assetTransferDetail from './components/assetTransferDetail.vue'
export default {
  components: {
    assetTransferDetail
  },
  data() {
    return {
      returnUrl: '/asset/transfer',
      editId: '',
      user: this.$store.getters.userInfo,
      formData: {},
      userDialogVisible: false,
      projectDialogVisible: false,
      submitLoading: false,
      supplierDialogVisible: false,
      dictDataList: [],
      projectType: '',
      transferDate: { required: true, message: '调拨日期不能为空', trigger: 'change' },
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        inProjectName: { required: true, message: '调入项目不能为空', trigger: 'change' },
        outProjectName: { required: true, message: '调出项目不能为空', trigger: 'change' },
        receiverName: { required: true, message: '接收人不能为空', trigger: 'change' },
        transferReason: { required: true, message: '调拨原因不能为空', trigger: 'change' },
        outCompanyName: { required: true, message: '调出公司不能为空', trigger: 'change' },
        inCompanyName: { required: true, message: '调入公司不能为空', trigger: 'change' }
      },
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
    this.editId = this.$route.query.id
    this.getDictData()
    this.init()
  },
  methods: {
    init() {
      if (this.editId) {
        this.submitLoading = true
        getTransfer(this.editId)
          .then((res) => {
            this.formData = {
              ...res.data
            }
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else {
        this.formData = {
          ...this.formData,
          ...{
            applicantDate: this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'),
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
    normalizerDept(node) {
      return {
        isDisabled: node.children && node.children.length <= 0
      }
    },
    // 选择终结人
    userSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          receiverId: val.userId,
          receiverName: val.userName,
          receiverOrgId: val.deptId,
          receiverOrgName: val.deptName
        }
      }
    },

    // 保存
    submitForm(status, curProcessStepName) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (status != 0 && !this.formData.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
          }
          if (await this.$refs.assetDetail.validTable()) {
            return
          }
          var submitData = {
            ...this.formData,
            ...{
              almAssetTransferAuditList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status
            }
          }
          if (this.editId) {
            updateTransfer(submitData).then((res) => {
              this.$message.success(status == 2 ? '提交成功！' : '修改成功')
              if (status == 2) {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                return
              }
              this.init()
            })
          } else {
            addTransfer(submitData).then((res) => {
              this.$message.success('新增成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                window.$wujie.props.route({
                  path: '/asset/transfer',
                  module: 'Asset',
                  fullPath: '/asset/transfer/edit',
                  title: '编辑资产调拨',
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
              almAssetTransferAuditList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveTransfer(submitData)
            .then((res) => {
              this.$modal.msgSuccess(`${obj[curProcessResult]}！`)
              this.submitLoading = false
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 500)
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
    // 统计数量  金额
    calculate(list) {
      var assetQuantity = 0
      var assetAmount = 0
      list.forEach((item) => {
        assetQuantity = this.$vxe.add(assetQuantity, item.transferQuantity)
        assetAmount = this.$vxe.add(assetAmount, item.subtotal)
      })
      this.formData.assetQuantity = assetQuantity
      this.formData.assetAmount = assetAmount
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'AlmAssetReshuffle-reshuffleType' // 资产特性
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 打开项目选择
    openProjectSelect(type) {
      this.projectType = type
      this.projectDialogVisible = true
    },
    // 选择项目
    projectSelect(val) {
      if (this.projectType == 'out') {
        this.$set(this.formData, 'outProjectId', val.projectId)
        this.$set(this.formData, 'outProjectName', val.projectName)
        this.$set(this.formData, 'outProjectCode', val.projectCode)
      } else if (this.projectType == 'in') {
        this.$set(this.formData, 'inProjectId', val.projectId)
        this.$set(this.formData, 'inProjectName', val.projectName)
        this.$set(this.formData, 'inProjectCode', val.projectCode)
      }
    }
  }
}
</script>
