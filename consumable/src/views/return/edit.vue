<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :disabled="!editForm" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="归还单号" prop="consumableReturnCode">
              <el-input v-model="formData.consumableReturnCode" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" value-format="yyyy-MM-dd" type="date" placeholder="选择申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="centralizedBusinessId">
              <base-input
                base-code="listType"
                :value.sync="formData.centralizedBusinessId"
                :label.sync="formData.centralizedBusinessName"
                label-name="businessName"
                value-name="businessId"
                :pre-store="[{businessId: formData.centralizedBusinessId,businessName: formData.centralizedBusinessName,}]"
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
            <el-form-item label="申请部门">
              <el-input v-model="formData.applicantOrgName" disabled placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司">
              <el-input v-model="formData.applicantCompanyName" disabled placeholder="请输入申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="归还日期" prop="returnDate">
              <el-date-picker v-model="formData.returnDate" type="date" placeholder="选择归还日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量">
              <el-input-number v-model="formData.consumableQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材含税金额（元）">
              <el-input-number v-model="formData.consumableAmount" controls-position="right" disabled :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人" prop="userName">
              <el-input v-model="formData.userName" suffix-icon="el-icon-arrow-down" placeholder="请选择使用人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门">
              <el-input v-model="formData.userOrgName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用公司">
              <el-input v-model="formData.companyName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="formData.projectName" suffix-icon="el-icon-arrow-down" placeholder="请选择项目名称" @focus="projectDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">
              <base-input
                base-code="listScheme"
                :value.sync="formData.schemeId"
                :label.sync="formData.schemeName"
                :code.sync="formData.schemeCode"
                label-name="schemeName"
                value-name="schemeId"
                code-name="schemeCode"
                placeholder="方案名称"
                :pre-store="[{schemeId:formData.schemeId,schemeName:formData.schemeName}]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用终端" prop="sourceTerminal">
              <base-input
                size="small"
                :disabled="formData.ynGenLine==1"
                :value.sync="formData.sourceTerminal"
                :options-list="dictDataList"
                base-code="System-sourceTerminal"
                placeholder="请选择使用终端"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据来源" prop="billSource">
              <base-input
                size="small"
                :disabled="formData.ynGenLine==1"
                :value.sync="formData.billSource"
                :options-list="dictDataList"
                base-code="ClmConsumableReturn-billSource"
                placeholder="请选择单据来源"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="归还原因" prop="returnReason" class="noProp-item-textarea">
              <el-input v-model="formData.returnReason" type="textarea" placeholder="请输入归还原因" show-word-limit :maxlength="300" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableReturnDetail ref="consumableReturn" :edit-form="editForm" :form-data="formData" v-bind="{schemeList}" @calculate="calculate" />
    </SectionCard>
    <SectionCard v-if="formData.status && formData.status!=0" title="处理记录">
      <handleRecords :table-data="formData.assetReviewAuditList" />
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
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getReturn, addReturn, updateReturn, approveReturn } from '@/api/return.js'
import consumableReturnDetail from './components/consumableReturnDetail.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    consumableReturnDetail
  },
  data() {
    return {
      returnUrl: '/consumable/return',
      submitLoading: false,
      formData: {},
      dictDataList: [],
      rules: {
        returnDate: { required: true, message: '归还日期不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        userOrgName: { required: true, message: '使用部门不能为空', trigger: 'change' },
        companyName: { required: true, message: '使用公司不能为空', trigger: 'change' },
        billSource: { required: true, message: '单据来源不能为空', trigger: 'change' },
        returnReason: { required: true, message: '归还原因不能为空', trigger: 'change' }
      },
      editId: '',
      userDialogVisible: false,
      projectDialogVisible: false,
      user: this.$store.getters.userInfo,
      schemeList: [],
      todo: '',
      todoObj: {
        audit_superior: { curProcessStepName: '直接上级审批', operationName: '审批' },
        register_asset_admin: { curProcessStepName: '资产管理员登记', operationName: '登记' },
        recall_add: { curProcessStepName: '发起申购', operationName: '撤回' },
        recall_superior: { curProcessStepName: '直接上级审批', operationName: '撤回' },
        invalid_add: { curProcessStepName: '发起申购', operationName: '作废' }
      },
      editForm: true
    }
  },
  created() {
    this.todo = this.$route.query.todo
    this.editId = this.$route.query.id
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
        getReturn(this.editId)
          .then((res) => {
            this.formData = res.data
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else {
        this.formData = {
          ...this.formData,
          ...{
            applicantDate: this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'),
            returnDate: this.$vxe.toDateString(new Date()),
            sourceTerminal: 1, // 来源终端  默认 1 pc
            billSource: 2, // 单据来源  默认 2借用单
            applicantId: this.user.userId,
            applicantName: this.user.userName,
            applicantOrgId: this.user.deptId,
            applicantOrgName: this.user.deptName,
            applicantCompanyId: this.user.companyId,
            applicantCompanyName: this.user.companyName
          }
        }
        this.$set(this.formData, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'))
        this.$set(this.formData, 'returnDate', this.$vxe.toDateString(new Date()))
        this.$set(this.formData, 'userId', this.user.userId)
        this.$set(this.formData, 'userName', this.user.userName)
        this.$set(this.formData, 'userOrgId', this.user.deptId)
        this.$set(this.formData, 'userOrgName', this.user.deptName)
        this.$set(this.formData, 'companyId', this.user.companyId)
        this.$set(this.formData, 'companyName', this.user.companyName)
      }
    },
    submitForm(status) {
      this.$refs['form'].validate(async (valid) => {
        if (valid && this.$refs.consumableReturn) {
          if (this.$refs.consumableReturn.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.consumableReturn.validTable()) {
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
              clmConsumableReturnDetailList: this.$refs.consumableReturn.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status
            }
          }
          this.submitLoading = true
          if (this.editId != null) {
            updateReturn(submitData)
              .then((res) => {
                this.$message.succcess(status == 2 ? '提交成功' : '修改成功')
                if (status == 2) {
                  setTimeout(() => {
                    window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  }, 500)
                  return
                }
                this.init()
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            addReturn(submitData)
              .then((res) => {
                this.message.succcess(status == 2 ? '提交成功' : '新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  if (status == 2) {
                    window.$wujie.props.route({
                      path: '/consumable/return',
                      module: 'Consumable',
                      fullPath: '/consumable/return/edit',
                      title: '编辑归还入库',
                      condition: { id: res.msg }
                    })
                  }
                }, 500)
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
          if (this.$refs.consumableReturn.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.consumableReturn.validTable()) {
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
              clmConsumableReturnDetailList: this.$refs.consumableReturn.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveReturn(submitData)
            .then((res) => {
              this.$message.success(`${obj[curProcessResult]}！`)
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
    // 选择使用人
    userSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          userId: val.userId,
          userName: val.userName,
          userOrgId: val.deptId,
          userOrgName: val.deptName,
          companyId: val.companyId,
          companyName: val.companyName
        }
      }
    },
    // 选择项目
    projectSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          projectId: val.projectId,
          projectName: val.projectName,
          projectCode: val.projectCode
        }
      }
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'System-sourceTerminal' // 入库方式
      dictCodes += ',ClmConsumableReturn-billSource' // 单据来源
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    calculate(list) {
      var consumableQuantity = 0
      var consumableAmount = 0
      list.forEach((item) => {
        consumableQuantity = this.$vxe.add(consumableQuantity, item.returnQuantity)
        consumableAmount = this.$vxe.add(consumableAmount, item.subtotal)
      })
      this.$set(this.formData, 'consumableQuantity', consumableQuantity)
      this.$set(this.formData, 'consumableAmount', consumableAmount)
    }
  }
}
</script>
