<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="归还单号">
              <el-input v-model="formData.giftReturnCode" disabled placeholder="系统自动生成" />
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
            <el-form-item label="归还日期" prop="returnDate">
              <el-date-picker v-model="formData.returnDate" type="date" placeholder="选择归还日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量" prop="giftQuantity">
              <el-input-number v-model="formData.giftQuantity" disabled controls-position="right" :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元）" prop="giftAmount">
              <el-input-number v-model="formData.giftAmount" controls-position="right" disabled :precision="3" placeholder="自动计算" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用人" prop="userName">
              <el-input v-model="formData.userName" suffix-icon="el-icon-arrow-down" placeholder="请选择使用人" @focus="userDialogVisible=true" />
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
              <el-input v-model="formData.projectName" suffix-icon="el-icon-arrow-down" placeholder="请选择项目名称" @focus="projectDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称" prop="schemeId">
              <base-input
                :value.sync="formData.schemeId"
                :label.sync="formData.schemeName"
                :code.sync="formData.schemeCode"
                :options-list="schemeList"
                code-name="schemeCode"
                label-name="schemeName"
                value-name="schemeId"
                placeholder="方案名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归还状态" prop="status">
              <el-select v-model="formData.status">
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
          <el-col :span="16">
            <el-form-item label="数据来源">
              <el-select v-model="formData.status" style="width:calc(50% - 100px)">
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
            <el-form-item label="归还原因" prop="returnReason" class="noProp-item-textarea">
              <el-input v-model="formData.returnReason" type="textarea" placeholder="请输入归还原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftReturnDetail ref="assetReceipt" :form-data="formData" v-bind="{schemeList}" @calculate="calculate" />
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
import { getReturn, addReturn, updateReturn } from '@/api/return.js'
import giftReturnDetail from './components/giftReturnDetail.vue'
import { listAddressQueryUseAreaTree, listSchemeQuery } from '@/api/base.js'
export default {
  components: {
    giftReturnDetail
  },
  data() {
    return {
      returnUrl: '/gift/return',
      submitLoading: false,
      formData: {},
      rules: {
        returnDate: { required: true, message: '归还日期不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        projectName: { required: true, message: '项目名称不能为空', trigger: 'change' },
        schemeId: { required: true, message: '方案名称不能为空', trigger: 'change' },
        returnReason: { required: true, message: '归还原因不能为空', trigger: 'change' },
        applicantName: { required: true, message: '申请人不能为空', trigger: 'change' },
        applicantOrgName: { required: true, message: '申请部门不能为空', trigger: 'change' },
        applicantCompanyName: { required: true, message: '申请公司不能为空', trigger: 'change' },
        giftQuantity: { required: true, message: '礼品数量不能为空', trigger: 'change' },
        giftAmount: { required: true, message: '礼品含税金额（元）不能为空', trigger: 'change' },
        userOrgName: { required: true, message: '使用部门不能为空', trigger: 'change' },
        companyName: { required: true, message: '使用公司不能为空', trigger: 'change' },
        status: { required: true, message: '领用状态不能为空', trigger: 'change' }
      },
      editId: '',
      userDialogVisible: false,
      projectDialogVisible: false,
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
            updateReturn(this.formData)
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
            addReturn(this.formData)
              .then((res) => {
                this.$message.success(status == 2 ? '提交成功' : '新增成功')
                if (status == 2) {
                  setTimeout(() => {
                    window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                    window.$wujie.props.route({
                      path: '/gift/return',
                      module: 'Gift',
                      fullPath: '/gift/return/edit',
                      title: '编辑礼品归还',
                      condition: { id: res.msg }
                    })
                  }, 500)
                }
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
      let giftQuantity = 0
      let giftAmount = 0
      list.forEach((item) => {
        giftQuantity = this.$vxe.add(giftQuantity, item.returnQuantity)
        giftAmount = this.$vxe.add(giftAmount, item.subtotal)
      })
      this.$set(this.formData, 'giftQuantity', giftQuantity)
      this.$set(this.formData, 'giftAmount', giftAmount)
    }
  }
}
</script>
