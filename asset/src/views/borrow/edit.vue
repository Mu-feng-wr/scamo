<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" :disabled="!editForm" :model="form" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用单号" prop="assetBorrowCode">
              <el-input v-model="form.assetBorrowCode" disabled placeholder="自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="form.applicantDate" size="small" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="centralizedBusinessId">
              <base-input
                base-code="listType"
                :value.sync="form.centralizedBusinessId"
                :label.sync="form.centralizedBusinessName"
                label-name="businessName"
                value-name="businessId"
                :pre-store="[{businessId: form.centralizedBusinessId,businessName: form.centralizedBusinessName,}]"
                placeholder="请选择业务类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="form.applicantName" disabled placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="form.applicantOrgName" disabled placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input v-model="form.applicantCompanyName" disabled placeholder="请输入申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借用日期" prop="borrowDate">
              <el-date-picker v-model="form.borrowDate" value-format="yyyy-MM-dd Hh:mm:ss" type="date" placeholder="借用日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量">
              <el-input-number v-model="form.assetQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">
              <el-input-number v-model="form.assetAmount" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人" prop="userName">
              <el-input suffix-icon="el-icon-arrow-down" :value="form.userName" placeholder="请输入使用人" @focus="userDialogVisible = true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门" prop="userOrgName">
              <el-input v-model="form.userOrgName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用公司" prop="companyName">
              <el-input v-model="form.companyName" disabled placeholder="选择使用人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input v-model="form.projectName" suffix-icon="el-icon-arrow-down" placeholder="请输入项目名称" @focus="projectDialogVisible = true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">
              <base-input
                :value.sync="form.schemeId"
                :label.sync="form.schemeName"
                :code.sync="form.schemeCode"
                :options-list="schemeList"
                code-name="schemeCode"
                label-name="schemeName"
                value-name="schemeId"
                placeholder="方案名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域" prop="location">
              <el-cascader
                ref="categoryCascader"
                v-model="form.location"
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
              <base-input base-code="AlmAssetBorrow-ynExpectReturn" :value.sync="form.ynExpectReturn" :options-list="dictDataList" placeholder="是否需要归还" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="预计归还日期">
              <el-date-picker v-model="form.expectReturnDate" style="width: calc(50% - 100px)" type="date" placeholder="选择预计归还日期" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="借用原因" prop="borrowReason" class="noProp-item-textarea">
              <el-input v-model="form.borrowReason" type="textarea" placeholder="请输入领用原因" show-word-limit :maxlength="300" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="资产明细">
      <assetBorrowDetail ref="assetDetail" v-bind="{ useAreaTree, dictDataList, schemeList }" :form="form" :edit-form="editForm" @calculate="calculate" />
    </SectionCard>
    <SectionCard v-if="form.status && form.status!=0" title="处理记录">
      <handleRecords :table-data="form.assetReviewAuditList" />
    </SectionCard>
    <SectionCard title="处理意见">
      <el-input v-model="form.curProcessOptions" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button v-if="(!form.status||form.status==0||form.status==3)" type="primary" @click="submitForm(2,6)">提 交</el-button>
      <el-button v-if="(!form.status||form.status==0||form.status==3)" type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button v-if="todo=='audit_superior'" type="primary" @click="approve(2,1)">通 过</el-button>
      <el-button v-if="todo=='register_asset_admin'" type="primary" @click="approve(2,1)">登 记</el-button>
      <el-button v-if="todo=='user_confirm'" type="primary" @click="approve(2,1)">确 认</el-button>
      <el-button v-if="todo=='recall_add'" type="warning" @click="approve(0,4)">撤 回</el-button>
      <el-button v-if="todo=='recall_superior'" type="warning" @click="approve(2,4)">撤 回</el-button>
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
import { listDictItems, listAddressQueryUseAreaTree, listSchemeQuery } from '@/api/base.js'
import assetBorrowDetail from './components/assetBorrowDetail.vue'
export default {
  components: {
    assetBorrowDetail
  },
  data() {
    return {
      submitLoading: false,
      form: {},
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
      },
      editForm: true
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
      if (['audit_superior', 'register_asset_admin', 'recall_add', 'recall_superior', 'invalid_add', 'user_confirm'].includes(this.todo)) {
        this.editForm = false
      }
      if (this.editId) {
        this.submitLoading = true
        getBorrow(this.editId)
          .then((res) => {
            this.form = {
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
        this.form = {
          ...this.form,
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
        this.$set(this.form, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd'))
        this.$set(this.form, 'userId', this.user.userId)
        this.$set(this.form, 'userName', this.user.userName)
        this.$set(this.form, 'userOrgId', this.user.deptId)
        this.$set(this.form, 'userOrgName', this.user.deptName)
        this.$set(this.form, 'companyId', this.user.companyName)
        this.$set(this.form, 'companyName', this.user.companyName)
      }
    },
    // 草稿  提交
    submitForm(status, curProcessResult) {
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
          if (status != 0 && curProcessResult != 4 && !this.form.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
            return
          }
          var submitData = {
            ...this.form,
            ...{
              almAssetBorrowDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status
            }
          }
          this.submitLoading = true
          if (this.editId) {
            updateBorrow(submitData)
              .then((res) => {
                this.$modal.msgSuccess(status == 2 ? '提交成功' : '修改成功')
                this.init()
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            addBorrow(submitData)
              .then((res) => {
                this.$modal.msgSuccess(status == 2 ? '提交成功' : '新增成功')
                this.$router.push({
                  name: 'borrow-borrowUpdate',
                  query: {
                    id: res.msg
                  }
                })
                // Global.$emit('closeCurrentTag', this.$route)
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
          if (!this.form.curProcessOptions && curProcessResult != 4) {
            this.$message({
              type: 'warning',
              message: '处理意见不能为空'
            })
            return
          }
          this.submitLoading = true
          var submitData = {
            ...this.form,
            ...{
              almAssetBorrowDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveBorrow(submitData)
            .then((res) => {
              this.$message.success(`${obj[curProcessResult]}！`)
              this.submitLoading = false
              setTimeout(() => {
                this.$route.push({
                  name: 'asset-borrow'
                })
              }, 200)
              setTimeout(() => {
                // Global.$emit('closeCurrentTag', this.$route)
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
      this.form = {
        ...this.form,
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
      this.form = {
        ...this.form,
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
        this.form = {
          ...this.form,
          ...{
            useAreaId: val[0],
            useAreaName: leftData.label,
            specificLocationId: val[1],
            specificLocationName: rightData.label
          }
        }
      } else {
        this.form = {
          ...this.form,
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
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listSchemeQuery().then((res) => {
        // 方案信息
        this.schemeList = res.rows
      })
    },
    calculate(list) {
      var assetQuantity = 0
      var assetAmount = 0
      list.forEach((item) => {
        assetQuantity = this.$vxe.add(assetQuantity, item.borrowQuantity)
        assetAmount = this.$vxe.add(assetAmount, item.subtotal)
      })
      this.$set(this.form, 'assetQuantity', assetQuantity)
      this.$set(this.form, 'assetAmount', assetAmount)
    }
  }
}
</script>
