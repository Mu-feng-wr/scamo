<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动单号">
              <el-input v-model="formData.assetReshuffleCode" disabled placeholder="自动生成" />
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
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="formData.applicantName" disabled placeholder="申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="formData.applicantOrgName" disabled placeholder="申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input v-model="formData.applicantCompanyName" disabled placeholder="申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动日期" prop="reshuffleDate">
              <el-date-picker v-model="formData.reshuffleDate" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择异动日期" />
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
            <el-form-item label="异动人" prop="reshuffleUserName">
              <el-input v-model="formData.reshuffleUserName" suffix-icon="el-icon-arrow-down" placeholder="请选择变更人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动部门" prop="reshuffleOrgName">
              <el-input v-model="formData.reshuffleOrgName" disabled placeholder="选择异动人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动公司" prop="reshuffleCompanyName">
              <el-input v-model="formData.reshuffleCompanyName" disabled placeholder="选择异动人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动类型" prop="reshuffleType">
              <base-input :options-list="dictDataList" :value.sync="formData.reshuffleType" base-code="AlmAssetReshuffle-reshuffleType" placeholder="异动类型" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨部门名称" prop="crossOrgId">
              <el-tree-select
                ref="treeSelect"
                v-model="formData.crossOrgId"
                check-strictly
                check-half
                :data="deptTree"
                :only-final="true"
                default-expand-all
                filterable
                popper-append-to-body
                @node-click="selectDept"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨公司名称" prop="crossCompanyName">
              <el-input v-model="formData.crossCompanyName" disabled placeholder="选择跨部门名称自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动原因" class="noProp-item-textarea" prop="reshuffleReason">
              <el-input v-model="formData.reshuffleReason" type="textarea" placeholder="异动原因" show-word-limit :maxlength="300" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard class="mt-8" title="资产明细">
      <assetReshuffleDetail ref="assetReshuffleDetail" :form-data="formData" @calculate="calculate" />
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
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择变更人" @confirm="userSelect" />
  </PageCard>
</template>
<script>
import { getReshuffle, addReshuffle, updateReshuffle, approveReshuffle } from '@/api/reshuffle.js'
import { listDictItems, deptTreeFilter } from '@/api/base.js'
import assetReshuffleDetail from './components/assetReshuffleDetail.vue'
export default {
  components: {
    assetReshuffleDetail
  },
  data() {
    return {
      returnUrl: '/asset/reshuffle',
      editId: '',
      user: this.$store.getters.userInfo,
      formData: {},
      userDialogVisible: false,
      projectDialogVisible: false,
      submitLoading: false,
      supplierDialogVisible: false,
      dictDataList: [],
      deptTree: [],
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        reshuffleDate: { required: true, message: '变更日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        reshuffleUserName: { required: true, message: '异动人不能为空', trigger: 'change' },
        reshuffleType: { required: true, message: '异动类型不能为空', trigger: 'change' },
        reshuffleReason: { required: true, message: '变更原因不能为空', trigger: 'change' },
        crossOrgId: { required: true, message: '跨部门不能为空', trigger: 'change' },
        crossCompanyName: { required: true, message: '跨公司名称不能为空', trigger: 'change' }
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
    this.todo = this.$route.query.todo
    this.editId = this.$route.query.id
    this.getDictData()
    this.getDeptTree()
    this.init()
  },
  methods: {
    init() {
      if (this.editId) {
        this.submitLoading = true
        getReshuffle(this.editId)
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
          reshuffleUserId: val.userId,
          reshuffleUserName: val.userName,
          reshuffleOrgId: val.deptId,
          reshuffleOrgName: val.deptName,
          reshuffleCompanyId: val.companyId,
          reshuffleCompanyName: val.companyName
        }
      }
    },

    // 保存
    submitForm(status, curProcessStepName) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.$refs.assetReshuffleDetail.tableData.length == 0) {
            this.$message({
              message: `请填写资产明细`,
              type: 'warning'
            })
            return
          }
          if (status != 0 && !this.formData.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
            return
          }
          if (await this.$refs.assetReshuffleDetail.validTable()) {
            return
          }
          var submitData = {
            ...this.formData,
            ...{
              assetReshuffleDetail: this.$refs.assetReshuffleDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status
            }
          }
          if (this.editId) {
            updateReshuffle(submitData)
              .then((res) => {
                this.$message.success(status == 2 ? '提交成功' : '修改成功')
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
            addReshuffle(submitData)
              .then((res) => {
                this.$message.success(status == 2 ? '提交成功' : '新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  if (status != 2) {
                    window.$wujie.props.route({
                      path: '/asset/reshuffle',
                      module: 'Asset',
                      fullPath: '/asset/reshuffle/edit',
                      title: '编辑资产异动',
                      condition: { id: res.msg }
                    })
                  }
                }, 500)
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
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
          if (this.$refs.assetReshuffleDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          if (await this.$refs.assetReshuffleDetail.validTable()) {
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
              assetReshuffleDetail: this.$refs.assetReshuffleDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveReshuffle(submitData)
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
    // 统计数量  金额
    calculate(list) {
      var assetQuantity = 0
      var assetAmount = 0
      list.forEach((item) => {
        assetQuantity = this.$vxe.add(assetQuantity, item.reshuffleQuantity)
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
    // 获取部门下拉树
    getDeptTree() {
      deptTreeFilter().then((res) => {
        this.deptTree = res.data
      })
    },
    // 选择跨部门
    selectDept(val) {
      this.$set(this.formData, 'crossOrgId', val.data.deptId)
      this.$set(this.formData, 'crossOrgName', val.data.deptName)
      this.$set(this.formData, 'crossCompanyId', val.data.parentId)
      this.$set(this.formData, 'crossCompanyName', val.data.parentName)
    }
  }
}
</script>
