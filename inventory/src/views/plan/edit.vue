<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="盘点单号">
              <el-input v-model="form.planCode" disabled size="small" placeholder="自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="form.applicantDate" size="small" value-format="yyyy-MM-dd" placeholder="申请日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="centralizedBusinessId">
              <base-input
                size="small"
                :value.sync="form.centralizedBusinessId"
                :label.sync="form.centralizedBusinessName"
                base-code="listType"
                :pre-store="[{businessId:form.centralizedBusinessId,businessName:form.centralizedBusinessName}]"
                label-name="businessName"
                value-name="businessId"
                placeholder="请选择业务类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input v-model="form.applicantName" size="small" disabled placeholder="申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input v-model="form.applicantOrgName" size="small" disabled placeholder="申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input v-model="form.applicantCompanyName" size="small" disabled placeholder="申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="24">
            <el-form-item label="盘点标题" prop="planTitle">
              <el-input v-model="form.planTitle" size="small" placeholder="盘点标题" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="计划年月" prop="yearMonth">
              <el-date-picker v-model="form.yearMonth" size="small" type="month" value-format="yyyy-MM" placeholder="选择计划年月" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行时间" prop="startDate">
              <InputRange size="small" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :start-value.sync="form.startDate" :end-value.sync="form.endDate" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应盘资产数量" prop="offereQuantity">
              <el-input-number v-model="form.offereQuantity" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人" prop="responsiblerName">
              <el-input v-model="form.responsiblerName" size="small" suffix-icon="el-icon-arrow-down" placeholder="请选择责任人" @focus="openSelectUser('responsibler')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任部门" prop="responsiblerOrgName">
              <el-input v-model="form.responsiblerOrgName" disabled size="small" placeholder="选择责任人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应盘资产总金额（元）" prop="offereAssetTotalAmount">
              <el-input-number v-model="form.offereAssetTotalAmount" disabled :precision="3" controls-position="right" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点周期" prop="cycleInventory">
              <base-input size="small" :value.sync="form.cycleInventory" base-code="ImInventoryPlan-cycleInventory" :options-list="dictDataList" placeholder="盘点周期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="覆盖范围" prop="coverageRange">
              <base-input size="small" :value.sync="form.coverageRange" base-code="ImInventoryPlan-coverageRange" :options-list="dictDataList" placeholder="覆盖范围" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="覆盖数据" prop="coverageDate">
              <base-input size="small" :value.sync="form.coverageDate" :options-list="typeList" label-name="businessName" value-name="businessId" placeholder="请选择覆盖数据" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产状态" prop="assetStatus">
              <base-input size="small" :value.sync="form.assetStatus" base-code="ImInventoryPlan-assetStatus" :options-list="dictDataList" placeholder="请选择资产状态" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否自盘" prop="ynSelfInventory">
              <base-input :value.sync="form.ynSelfInventory" size="small" base-code="ImInventoryPlan-ynSelfInventory" :options-list="dictDataList" placeholder="是否自盘" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划状态" prop="planStatus">
              <base-input :value.sync="form.planStatus" size="small" base-code="ImInventoryPlan-assetStatus" :options-list="dictDataList" placeholder="请选择资产状态" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="盘点原因" class="noProp-item-textarea" prop="planReason">
              <el-input v-model="form.planReason" type="textarea" size="small" placeholder="盘点原因" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard v-if="form.releaserName" title="下达信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="下达人" prop="releaserName">
              <el-input v-model="form.releaserName" size="small" placeholder="下达人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下达部门" prop="releaserOrgName">
              <el-input v-model="form.releaserOrgName" size="small" placeholder="下达部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下达日期" prop="releaseDate">
              <el-date-picker v-model="form.releaseDate" type="date" placeholder="选择下达日期" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard v-if="form.completerName" title="任务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务完成人">
              <el-input v-model="form.completerName" size="small" placeholder="任务完成人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务完成部门">
              <el-input v-model="form.completerOrgName" size="small" placeholder="任务完成部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务完成日期">
              <el-date-picker v-model="form.completeDate" type="date" placeholder="选择任务完成日期" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard v-if="form.reporteName" title="报告信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报告人">
              <el-input v-model="form.reporteName" size="small" placeholder="报告人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报告部门">
              <el-input v-model="form.reporteOrgName" size="small" placeholder="报告部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完成报告时间">
              <el-date-picker v-model="form.reporteDate" disabled type="date" placeholder="完成报告时间" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="目标责任人">
      <!-- <targetResponsibler ref="targetResponsibler" :prop-dict-dataList="dictDataList" :type-list="typeList" :form="form" /> -->
    </SectionCard>
    <SectionCard title="资产明细">
      <!-- <inventoryLockDoc /> -->
    </SectionCard>

    <div slot="footer" align="center">
      <el-button type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button type="primary" @click="submitForm(1)">提 交</el-button>
    </div>

    <selectUser v-if="userDialog.userDialogVisible" :visible.sync="userDialog.userDialogVisible" :title="userDialog.title" @confirm="userSelect" />
  </PageCard>
</template>
<script>
import { getPlan, addPlan, updatePlan } from '@/api/plan.js'
import { listDictItems, listTypeQuery } from '@/api/base.js'
// import targetResponsibler from '@/views/inventory/plan/components/targetResponsibler.vue'
// import inventoryLockDoc from '@/views/inventory/plan/components/inventoryLockDoc.vue'
export default {
  components: {
    // targetResponsibler,
    // inventoryLockDoc
  },
  data() {
    return {
      submitLoading: false,
      typeList: [],
      rules: {
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        planTitle: { required: true, message: '盘点标题不能为空', trigger: 'change' },
        responsiblerName: { required: true, message: '责任人不能为空', trigger: 'change' },
        yearMonth: { required: true, message: '计划年月不能为空', trigger: 'change' },
        startDate: { required: true, message: '执行时间不能为空', trigger: 'change' },
        cycleInventory: { required: true, message: '盘点周期不能为空', trigger: 'change' },
        coverageRange: { required: true, message: '覆盖范围不能为空', trigger: 'change' },
        coverageDate: { required: true, message: '覆盖数据不能为空', trigger: 'change' },
        assetStatus: { required: true, message: '资产状态不能为空', trigger: 'change' },
        planStatus: { required: true, message: '计划状态不能为空', trigger: 'change' },
        ynSelfInventory: { required: true, message: '请选择是否自盘', trigger: 'change' },
        remarks: { required: true, message: '备注不能为空', trigger: 'change' },
        planReason: { required: true, message: '盘点原因不能为空', trigger: 'change' }
      },
      dictDataList: [],
      userDialog: {
        userDialogVisible: false,
        title: '',
        type: ''
      },
      form: {},
      editId: '',
      user: this.$store.getters.userInfo
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
        getPlan(this.editId)
          .then((res) => {
            this.form = res.data
            if (this.form.status == 0 && this.form.applicantId != this.user.userId) {
              this.form = {
                ...this.form,
                ...{
                  applicantId: this.user.userId,
                  applicantName: this.user.userName,
                  applicantOrgId: this.user.deptId,
                  applicantOrgName: this.user.deptName,
                  applicantCompanyId: this.user.companyId,
                  applicantCompanyName: this.user.companyName,
                  unifiedSystemNumber: this.user.unifiedSystemNumber
                }
              }

              this.$set(this.form, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
            }
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else {
        this.form = {
          ...this.form,
          ...{
            sourceTerminal: 1, // 终端来源    默认是   1 pc
            applicantId: this.user.userId,
            applicantName: this.user.userName,
            applicantOrgId: this.user.deptId,
            applicantOrgName: this.user.deptName,
            applicantCompanyId: this.user.companyId,
            applicantCompanyName: this.user.companyName,
            unifiedSystemNumber: this.user.unifiedSystemNumber
          }
        }
        this.$set(this.form, 'applicantDate', this.$vxe.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
      }
    },
    // 打开用户选择列表
    openSelectUser(type) {
      if (type == 'responsibler') {
        this.userDialog.title = '选择责任人'
      }
      this.userDialog.type = type
      this.userDialog.userDialogVisible = true
    },
    // 选择用户
    userSelect(val) {
      if (this.userDialog.type == 'responsibler') {
        this.$set(this.form, 'responsiblerId', val.userId)
        this.$set(this.form, 'responsiblerName', val.userName)
        this.$set(this.form, 'responsiblerOrgId', val.deptId)
        this.$set(this.form, 'responsiblerOrgName', val.deptName)
      }
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'ImInventoryPlan-cycleInventory' // 盘点周期
      dictCodes += ',ImInventoryPlan-ynSelfInventory' // 是否自盘
      dictCodes += ',ImInventoryPlan-coverageRange' // 覆盖范围
      dictCodes += ',ImInventoryPlan-assetStatus' // 资产状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listTypeQuery().then((res) => {
        this.typeList = res.rows
      })
    },

    submitForm(status) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$refs.targetResponsibler.validTable()) {
            return
          }
          this.form = { ...this.form, ...{ almAssetReturnDetailList: this.$refs.targetResponsibler.tableData, status } }
          if (this.editId != null) {
            updatePlan(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功')
                if (status == 1) {
                  setTimeout(() => {
                    this.$router.push({
                      name: 'inventory-plan'
                    })
                  }, 300)
                  // Global.$emit('closeCurrentTag', this.$route)
                }
                this.init()
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            addPlan(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功')
                if (status == 1) {
                  setTimeout(() => {
                    this.$router.push({
                      name: 'inventory-plan'
                    })
                  }, 300)
                  // Global.$emit('closeCurrentTag', this.$route)
                }
                setTimeout(() => {
                  this.$router.push({
                    name: 'plan-planUpdate'
                  })
                }, 300)
                // Global.$emit('closeCurrentTag', this.$route)
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
        }
      })
    }
  }
}
</script>
