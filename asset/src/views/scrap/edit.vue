<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :edit-form="!editForm" :model="formData" :rules="rules" label-width="180px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="处置单号">
              <el-input v-model="formData.assetScrapCode" disabled placeholder="自动生成终结单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" type="date" value-format="yyyy-MM-dd" placeholder="申请日期" />
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
            <el-form-item label="处置日期" prop="scrapDate">
              <el-date-picker v-model="formData.scrapDate" type="date" value-format="yyyy-MM-dd" placeholder="终结日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产数量" prop="assetQuantity">
              <el-input-number v-model="formData.assetQuantity" disabled :precision="0" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产含税金额（元）">
              <el-input-number v-model="formData.assetAmount" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终结人" prop="terminatorName">
              <el-input v-model="formData.terminatorName" suffix-icon="el-icon-arrow-down" placeholder="请选择终结人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处置部门">
              <el-input v-model="formData.terminatorOrgName" disabled placeholder="选择终结人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input suffix-icon="el-icon-arrow-down" :value="formData.projectName" placeholder="请选择项目" @focus="projectDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处置方式">
              <base-input :value.sync="formData.endSheetMethod" :dict-data-list="dictDataList" base-code="AamMaterialAccount-endSheetMethod" placeholder="请选择处置方式" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总回收残值金额（元）">
              <el-input-number v-model="formData.totalRecovereResidualValue" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回收供应商">
              <el-input suffix-icon="el-icon-arrow-down" :value="formData.maintainerCompanyName" placeholder="请选择供应商" @focus="supplierDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="终结原因" prop="scrapReason" class="noProp-item-textarea">
              <el-input v-model="formData.scrapReason" type="textarea" placeholder="终结原因" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard class="mt-8" title="资产明细">
      <assetScrapDetail ref="assetDetail" :edit-form="editForm" :form-data="formData" @calculate="calculate" />
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
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择中终结人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
    <supplier v-if="supplierDialogVisible" :visible.sync="supplierDialogVisible" title="选择供应商" @confirm="supplierSelect" />
  </PageCard>
</template>
<script>
import { getScrap, addScrap, updateScrap, approveScrap } from '@/api/scrap.js'
import assetScrapDetail from './components/assetScrapDetail.vue'
import { listDictItems } from '@/api/base.js'
export default {
  components: {
    assetScrapDetail
  },
  data() {
    return {
      returnUrl: '/asset/scrap',
      editId: '',
      user: this.$store.getters.userInfo,
      formData: {},
      userDialogVisible: false,
      projectDialogVisible: false,
      submitLoading: false,
      supplierDialogVisible: false,
      todo: '',
      dictDataList: [],
      todoObj: {
        audit_superior: { curProcessStepName: '直接上级审批', operationName: '审批' },
        register_asset_admin: { curProcessStepName: '资产管理员登记', operationName: '登记' },
        recall_add: { curProcessStepName: '发起申购', operationName: '撤回' },
        recall_superior: { curProcessStepName: '直接上级审批', operationName: '撤回' },
        invalid_add: { curProcessStepName: '发起申购', operationName: '作废' }
      },
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        scrapDate: { required: true, message: '终结日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        terminatorName: { required: true, message: '终结人不能为空', trigger: 'change' },
        projectName: { required: true, message: '项目名称不能为空', trigger: 'change' },
        maintainerCompanyName: { required: true, message: '供应商不能为空', trigger: 'change' },
        scrapReason: { required: true, message: '终结原因不能为空', trigger: 'change' }
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
        getScrap(this.editId)
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
    // 选择终结人
    userSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          terminatorId: val.userId,
          terminatorName: val.userName,
          terminatorOrgId: val.deptId,
          terminatorOrgName: val.deptName
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
    // 选择出账公司
    supplierSelect(val) {
      this.formData = {
        ...this.formData,
        ...{
          maintainerCompanyId: val.supplierId,
          maintainerCompanyCode: val.supplierCode,
          maintainerCompanyName: val.supplierName
        }
      }
    },
    // 保存
    submitForm(status, curProcessStepName) {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (await this.$refs.assetDetail.validTable()) {
            return
          }
          if (status != 0 && !this.formData.curProcessOptions) {
            this.$message({
              message: `处理意见不能为空！`,
              type: 'warning'
            })
          }

          var submitData = {
            ...this.formData,
            ...{
              status: status,
              almAssetScrapDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              })
            }
          }

          this.submitLoading = true
          if (this.editId) {
            updateScrap(submitData).then((res) => {
              this.$message.success(status == 2 ? '提交成功' : '修改成功')
              if (status == 2) {
                setTimeout(() => {
                  this.$router.push({
                    name: 'asset-scrap'
                  })
                }, 300)
                // Global.$emit('closeCurrentTag', this.$route)
                return
              }
              this.init()
            })
          } else {
            addScrap(submitData).then((res) => {
              this.$message.success('新增成功')
              setTimeout(() => {
                if (status == 2) {
                  this.$router.push({
                    name: 'asset-scrap'
                  })
                } else {
                  this.$router.push({
                    name: 'scrap-scrapUpdate',
                    query: {
                      id: res.msg
                    }
                  })
                }
              }, 300)

              // Global.$emit('closeCurrentTag', this.$route)
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
              almAssetScrapDetailList: this.$refs.assetDetail.tableData.map((item, i) => {
                item.sort = i + 1
                return item
              }),
              status: status,
              curProcessResult: curProcessResult
            }
          }
          approveScrap(submitData)
            .then((res) => {
              this.$modal.msgSuccess(`${obj[curProcessResult]}！`)
              this.submitLoading = false
              setTimeout(() => {
                // Global.$emit('closeCurrentTag', this.$route)
              }, 1000)
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
      var totalRecovereResidualValue = 0
      list.forEach((item) => {
        assetQuantity = this.$vxe.add(assetQuantity, item.scrapQuantity)
        assetAmount = this.$vxe.add(assetAmount, item.subtotal)
        totalRecovereResidualValue = this.$vxe.add(totalRecovereResidualValue, item.recovereResidualValue)
      })
      this.formData.assetQuantity = assetQuantity
      this.formData.assetAmount = assetAmount
      this.formData.totalRecovereResidualValue = totalRecovereResidualValue
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'AamMaterialAccount-endSheetMethod' // 处置方式
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
