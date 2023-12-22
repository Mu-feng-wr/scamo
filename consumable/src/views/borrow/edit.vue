<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用单号" prop="assetBorrowCode">
              <el-input v-model="formData.consumableBorrowCode" disabled placeholder="自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" size="small" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择申请日期" />
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
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" disabled placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" disabled placeholder="请输入申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用日期" prop="borrowDate">
              <el-date-picker v-model="formData.borrowDate" value-format="yyyy-MM-dd Hh:mm:ss" type="date" placeholder="借用日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量">
              <el-input-number v-model="formData.consumableQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材含税金额（元）">
              <el-input-number v-model="formData.consumableAmount" disabled controls-position="right" :precision="2" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人" prop="userName">
              <el-input suffix-icon="el-icon-arrow-down" :value="formData.userName" placeholder="请输入使用人" @focus="userDialogVisible = true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门" prop="userOrgName">
              <el-input v-model="formData.userOrgName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用公司" prop="companyName">
              <el-input v-model="formData.companyName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="formData.projectName" suffix-icon="el-icon-arrow-down" placeholder="请输入项目名称" @focus="projectDialogVisible = true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">
              <base-input
                :value.sync="formData.schemeId"
                :label.sync="formData.schemeName"
                :code.sync="formData.schemeCode"
                :options-list="schemeList"
                code-name="schemeCode"
                label-name="schemeName"
                value-name="schemeId"
                placeholder="方案名称"
                :pre-store="[{schemeId:formData.schemeId,schemeName:formData.schemeName}]"
              />
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
            <el-form-item label="是否需要归还" prop="ynExpectReturn">
              <base-input base-code="AlmAssetBorrow-ynExpectReturn" :value.sync="formData.ynExpectReturn" :options-list="dictDataList" placeholder="是否需要归还" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="formData.ynExpectReturn==1" label="预计归还日期" prop="expectReturnDate">
              <el-date-picker v-model="formData.expectReturnDate" value-format="yyyy-MM-dd" type="date" placeholder="选择预计归还日期" />
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
          <el-col :span="24">
            <el-form-item label="借用原因" prop="borrowReason" class="noProp-item-textarea">
              <el-input v-model="formData.borrowReason" type="textarea" placeholder="请输入借用原因" show-word-limit :maxlength="300" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <consumableBorrowDetail ref="consumableBorrowDetail" v-bind="{ useAreaTree, dictDataList, schemeList }" :form-data="formData" @calculate="calculate" />
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
      <el-button v-if="todo=='user_confirm'" type="primary" @click="approve(2,1)">确 认</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="approve(0,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="approve(2,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior_asset_admin'" type="warning" @click="approve(2,4)">撤 回</el-button>
      <el-button v-if="todo=='audit_superior'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='register_asset_admin'||todo=='user_confirm'" type="warning" @click="approve(3,2)">退 回</el-button>
      <el-button v-if="todo=='invalid_add'" type="danger" @click="approve(4,5)">作 废</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getBorrow, addBorrow, updateBorrow, approveBorrow } from '@/api/borrow.js'
import consumableBorrowDetail from './components/consumableBorrowDetail.vue'
import { listDictItems, listSchemeQuery, listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  components: {
    consumableBorrowDetail
  },
  data() {
    return {
      returnUrl: '/consumable/borrow',
      submitLoading: false,
      formData: {},
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        borrowDate: { required: true, message: '借用日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        userOrgName: { required: true, message: '使用部门不能为空', trigger: 'change' },
        companyName: { required: true, message: '使用公司不能为空', trigger: 'change' },
        location: { required: true, message: '使用区域不能为空', trigger: 'change' },
        ynExpectReturn: { required: true, message: '请选择归还状态', trigger: 'change' },
        expectReturnDate: { required: true, message: '请选择预计归还日期', trigger: 'change' },
        borrowReason: { required: true, message: '请输入借用原因', trigger: 'change' }
      },
      editId: '',
      userDialogVisible: false,
      projectDialogVisible: false,
      user: this.$store.getters.userInfo,
      propsUseAreaTree: {
        label: 'label',
        value: 'id',
        children: 'children'
      },
      useAreaTree: [],
      dictDataList: [],
      schemeList: [],
      todo: '',
      todoObj: {
        audit_superior: { curProcessStepName: '直接上级审批', operationName: '审批' },
        register_asset_admin: { curProcessStepName: '资产管理员登记', operationName: '登记' },
        recall_add: { curProcessStepName: '发起申购', operationName: '撤回' },
        recall_superior: { curProcessStepName: '直接上级审批', operationName: '撤回' },
        invalid_add: { curProcessStepName: '发起申购', operationName: '作废' },
        user_confirm: { curProcessStepName: '借用人确认', operationName: '确认' },
        recall_superior_asset_admin: { curProcessStepName: '资产管理员撤回', operationName: '撤回' }
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
        getBorrow(this.editId)
          .then((res) => {
            this.formData = {
              ...res.data,
              ...{
                location: [res.data.useAreaId, res.data.specificLocationId]
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
            borrowDate: this.$vxe.toDateString(new Date()),
            sourceTerminal: 1, // 来源终端  默认1  pc
            applicantId: this.user.userId,
            applicantName: this.user.userName,
            applicantOrgId: this.user.deptId,
            applicantOrgName: this.user.deptName,
            applicantCompanyId: this.user.companyId,
            applicantCompanyName: this.user.companyName,
            collectDate: this.parseTime(new Date()) // 领用日期
          }
        }
        this.$set(this.formData, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'))
        this.$set(this.formData, 'userId', this.user.userId)
        this.$set(this.formData, 'userName', this.user.userName)
        this.$set(this.formData, 'userOrgId', this.user.deptId)
        this.$set(this.formData, 'userOrgName', this.user.deptName)
        this.$set(this.formData, 'companyId', this.user.companyId)
        this.$set(this.formData, 'companyName', this.user.companyName)
      }
    },
    // 草稿  提交
    submitForm(status) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$refs.consumableBorrowDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          this.formData = {
            ...this.formData,
            ...{
              clmConsumableBorrowDetailList: this.$refs.consumableBorrowDetail.tableData,
              status
            }
          }
          this.submitLoading = true
          if (this.editId) {
            updateBorrow(this.formData)
              .then((res) => {
                this.$message.success(status == 2 ? '新增成功！' : '修改成功！')
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
            addBorrow(this.formData)
              .then((res) => {
                this.$modal.msgSuccess('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  window.$wujie.props.route({
                    path: '/consumable/borrow',
                    module: 'Consumable',
                    fullPath: '/consumable/borrow/edit',
                    title: '编辑耗材借用',
                    condition: { id: res.msg }
                  })
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
          if (this.$refs.consumableBorrowDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.consumableBorrowDetail.validTable()) {
            return
          }
          if (!this.formData.curProcessOptions) {
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
              clmConsumableBorrowDetailList: this.$refs.consumableBorrowDetail.tableData,
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveBorrow(submitData)
            .then((response) => {
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
    // 获取使用区域树
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
    // 选择使用区域
    useAreaChange(val) {
      if (val.length == 2) {
        var leftData = this.useAreaTree.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])
        this.formData = {
          ...this.formData,
          ...{
            useAreaId: val[0],
            useAreaName: leftData.label,
            specificLocationId: val[1],
            specificLocationName: rightData.label
          }
        }
      } else {
        this.formData = {
          ...this.formData,
          ...{
            useAreaId: '',
            useAreaName: '',
            specificLocationId: '',
            specificLocationName: ''
          }
        }
      }
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      dictCodes += ',AlmAssetBorrow-ynExpectReturn' // 借用是否需要归还
      dictCodes += ',AlmAssetCollect-usePurpose' // 使用目的
      dictCodes += ',System-sourceTerminal' // 来源终端
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
    },
    calculate(list) {
      var consumableQuantity = 0
      var consumableAmount = 0
      list.forEach((item) => {
        consumableQuantity = this.$vxe.add(consumableQuantity, item.borrowQuantity)
        consumableAmount = this.$vxe.add(consumableAmount, item.subtotal)
      })
      this.$set(this.formData, 'consumableQuantity', consumableQuantity)
      this.$set(this.formData, 'consumableAmount', consumableAmount)
    }
  }
}
</script>
