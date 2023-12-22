<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="调拨单号">
              <el-input v-model="formData.consumableTransferCode" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" type="date" placeholder="选择申请日期" />
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
                :pre-store="[{businessId:formData.centralizedBusinessId,businessName:formData.centralizedBusinessName}]"
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
            <el-form-item label="调拨日期" prop="transferDate">
              <el-date-picker v-model="formData.transferDate" type="date" placeholder="选择调拨日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量" prop="transferQuantity">
              <el-input-number v-model="formData.transferQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材金额 " prop="transferAmount">
              <el-input-number v-model="formData.transferAmount" controls-position="right" disabled :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出公司" prop="outCompanyName">
              <el-input v-model="formData.outCompanyName" placeholder="请选择" @focus="supplierDialogVisible=true,companyType =1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入公司" prop="inCompanyName">
              <el-input v-model="formData.inCompanyName" placeholder="请选择" @focus="supplierDialogVisible=true,companyType =2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收人" prop="receiverName">
              <el-input v-model="formData.receiverName" placeholder="请选择接收人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调出项目" prop="outProjectName">
              <el-input v-model="formData.outProjectName" placeholder="请选择项目名称" @focus="projectDialogVisible=true,projectType=1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调入项目" prop="inProjectName">
              <el-input v-model="formData.inProjectName" placeholder="请选择项目名称" @focus="projectDialogVisible=true,projectType=2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收部门" prop="receiverOrgName">
              <el-input v-model="formData.receiverOrgName" placeholder="请输入接收部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调拨状态" prop="status">
              <el-select v-model="formData.status" style="width:calc(25% - 30px)">
                <!-- <el-option
                  v-for="item in statusList"
                  :key="item.itemsValue"
                  :label="item.itemsName"
                  :value="item.itemsValue"
                >
                </el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调拨原因" prop="transferReason" class="noProp-item-textarea">
              <el-input v-model="formData.transferReason" type="textarea" placeholder="请输入调拨原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableTransferDetail ref="assetReceipt" :form-data="formData" v-bind="{schemeList}" @calculate="calculate" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button type="primary" @click="submitForm(1)">提 交</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择接收人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
    <supplier v-if="supplierDialogVisible" :visible.sync="supplierDialogVisible" title="选择公司" @confirm="supplierSelect" />
  </PageCard>
</template>
<script>
import { getTransfer, addTransfer, updateTransfer } from '@/api/transfer.js'
import consumableTransferDetail from './components/consumableTransferDetail.vue'
import { listSchemeQuery, listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  components: {
    consumableTransferDetail
  },
  data() {
    return {
      returnUrl: '/consumable/transfer',
      submitLoading: false,
      formData: {},
      rules: {
        transferDate: { required: true, message: '调拨日期不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        projectName: { required: true, message: '项目名称不能为空', trigger: 'change' },
        schemeId: { required: true, message: '方案名称不能为空', trigger: 'change' },
        transferReason: { required: true, message: '调拨原因不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        transferQuantity: { required: true, message: '耗材数量不能为空', trigger: 'change' },
        transferAmount: { required: true, message: '耗材金额不能为空', trigger: 'change' },
        outCompanyName: { required: true, message: '调出公司不能为空', trigger: 'change' },
        inCompanyName: { required: true, message: '调入公司不能为空', trigger: 'change' },
        outProjectName: { required: true, message: '调出项目不能为空', trigger: 'change' },
        inProjectName: { required: true, message: '调入项目不能为空', trigger: 'change' },
        receiverName: { required: true, message: '接收人不能为空', trigger: 'change' },
        receiverOrgName: { required: true, message: '接收项目不能为空', trigger: 'change' },
        status: { required: true, message: '借用状态不能为空', trigger: 'change' }
      },
      editId: '',
      userDialogVisible: false,
      projectDialogVisible: false,
      projectType: null,
      supplierDialogVisible: false,
      companyType: null,
      user: this.$store.getters.userInfo,
      schemeList: [],
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
    this.getDictData()
    this.getUserArea()
    this.init()
  },
  methods: {
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
    init() {
      if (this.editId) {
        this.submitLoading = true
        getTransfer(this.editId)
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
            applicantDate: this.$vxe.toDateString(new Date()),
            transferDate: this.$vxe.toDateString(new Date()),
            sourceTerminal: 1, // 来源终端  默认 1 pc
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
    submitForm(status) {
      this.$refs['form'].validate((valid) => {
        if (valid && this.$refs.assetReceipt) {
          if (this.$refs.assetReceipt.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          this.formData = { ...this.formData, ...{ almAssetReturnDetailList: this.$refs.assetReceipt.tableData, status } }
          if (this.editId != null) {
            updateTransfer(this.formData)
              .then((response) => {
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
            addTransfer(this.formData)
              .then((res) => {
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  window.$wujie.props.route({
                    path: '/consumable/transfer',
                    module: 'Consumable',
                    fullPath: '/consumable/transfer/edit',
                    title: '编辑耗材调拨',
                    condition: { id: res.msg }
                  })
                }, 500)
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
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
          companyName: val.companyName,
          receiverName: val.userName,
          receiverId: val.userId
        }
      }
    },
    // 选择项目
    projectSelect(val) {
      if (this.projectType == 2) {
        this.formData.inProjectId = val.projectId
        this.formData.inProjectName = val.projectName
      } else {
        this.formData.outProjectId = val.projectId
        this.formData.outProjectName = val.projectName
      }
    },
    // 选择出账公司
    supplierSelect(val) {
      if (this.companyType == 2) {
        this.formData.inCompanyId = val.supplierId
        this.formData.inCompanyName = val.supplierName
      } else {
        this.formData.outCompanyId = val.supplierId
        this.formData.outCompanyName = val.supplierName
      }
    },
    // 获取字典数据
    getDictData() {
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
    },
    calculate(list) {
      var transferQuantity = 0
      var transferAmount = 0
      list.forEach((item) => {
        transferQuantity = this.$vxe.add(transferQuantity, item.returnQuantity)
        transferAmount = this.$vxe.add(transferAmount, item.subtotal)
      })
      this.$set(this.formData, 'transferQuantity', transferQuantity)
      this.$set(this.formData, 'transferAmount', transferAmount)
    }
  }
}
</script>
