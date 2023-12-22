<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="异动单号">
              <el-input v-model="formData.consumableReshuffleCode" disabled placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker v-model="formData.applicantDate" clearable type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请日期" />
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
            <el-form-item label="异动日期" prop="reshuffleDate">
              <el-date-picker v-model="formData.reshuffleDate" type="date" placeholder="选择异动日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量" prop="consumableQuantity">
              <el-input-number v-model="formData.consumableQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材金额 " prop="consumableAmount">
              <el-input-number v-model="formData.consumableAmount" controls-position="right" disabled :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动人" prop="reshuffleUserName">
              <el-input v-model="formData.reshuffleUserName" disabled placeholder="请输入异动人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动部门" prop="reshuffleOrgName">
              <el-input v-model="formData.reshuffleOrgName" disabled placeholder="请输入异动部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动公司" prop="reshuffleCompanyName">
              <el-input v-model="formData.reshuffleCompanyName" disabled placeholder="请输入异动部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="异动类型" prop="reshuffleType">
              <el-select v-model="formData.reshuffleType">
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

          <el-col :span="8">
            <el-form-item label="跨部门名称" prop="crossOrgName">
              <el-input v-model="formData.crossOrgName" placeholder="请选择跨部门名称" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="跨公司名称" prop="crossCompanyName">
              <el-input v-model="formData.crossCompanyName" disabled placeholder="选择跨公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动状态" prop="status">
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
            <el-form-item label="异动原因" prop="reshuffleReason" class="noProp-item-textarea">
              <el-input v-model="formData.reshuffleReason" type="textarea" placeholder="请输入异动原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableReshuffleDetail ref="consumableReshuffle" :form-data="formData" v-bind="{schemeList}" @calculate="calculate" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" @click="submitForm(0)">草 稿</el-button>
      <el-button type="primary" @click="submitForm(1)">提 交</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getReshuffle, addReshuffle, updateReshuffle } from '@/api/reshuffle.js'
import consumableReshuffleDetail from './components/consumableReshuffleDetail.vue'
import { listSchemeQuery, listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  components: {
    consumableReshuffleDetail
  },
  data() {
    return {
      returnUrl: '/consumable/reshuffle',
      submitLoading: false,
      formData: {},
      rules: {
        returnDate: { required: true, message: '异动日期不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        projectName: { required: true, message: '项目名称不能为空', trigger: 'change' },
        schemeId: { required: true, message: '方案名称不能为空', trigger: 'change' },
        reshuffleReason: { required: true, message: '异动原因不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        userOrgName: { required: true, message: '使用部门不能为空', trigger: 'change' },
        companyName: { required: true, message: '使用公司不能为空', trigger: 'change' },
        consumableQuantity: { required: true, message: '耗材数量不能为空', trigger: 'change' },
        consumableAmount: { required: true, message: '耗材金额不能为空', trigger: 'change' },
        status: { required: true, message: '借用状态不能为空', trigger: 'change' },
        reshuffleUserName: { required: true, message: '异动人不能为空', trigger: 'change' },
        reshuffleOrgName: { required: true, message: '异动部门不能为空', trigger: 'change' },
        reshuffleCompanyName: { required: true, message: '异动公司不能为空', trigger: 'change' },
        reshuffleType: { required: true, message: '异动类型不能为空', trigger: 'change' },
        crossCompanyName: { required: true, message: '跨部门名称不能为空', trigger: 'change' },
        crossOrgName: { required: true, message: '跨公司名称不能为空', trigger: 'change' },
        reshuffleDate: { required: true, message: '异动日期不能为空', trigger: 'change' }
      },
      editId: '',
      userDialogVisible: false,
      projectDialogVisible: false,
      user: this.$store.state.user.info,
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
        getReshuffle(this.editId)
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
            returnDate: this.$vxe.toDateString(new Date()),
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
        if (valid && this.$refs.consumableReshuffle) {
          if (this.$refs.consumableReshuffle.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          this.formData = { ...this.formData, ...{ almAssetReturnDetailList: this.$refs.consumableReshuffle.tableData, status } }
          if (this.editId != null) {
            updateReshuffle(this.formData)
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
            addReshuffle(this.formData)
              .then((res) => {
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                  window.$wujie.props.route({
                    path: '/consumable/reshuffle',
                    module: 'Consumable',
                    fullPath: '/consumable/reshuffle/edit',
                    title: '编辑耗材异动',
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
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
    },
    calculate(list) {
      let consumableQuantity = 0
      let consumableAmount = 0
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
