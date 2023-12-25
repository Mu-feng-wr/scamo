<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="领用单号">
              <el-input v-model="formData.giftCollectCode" disabled placeholder="系统自动生成" />
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
            <el-form-item label="领用日期" prop="collectDate">
              <el-date-picker v-model="formData.collectDate" value-format="yyyy-MM-dd Hh:mm:ss" type="date" placeholder="领用日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品数量" prop="giftQuantity">
              <el-input-number v-model="formData.giftQuantity" disabled :precision="2" controls-position="right" :min="0" :step="1" placeholder="请输入礼品数量" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="礼品含税金额（元）" prop="giftAmount">
              <el-input-number v-model="formData.giftAmount" disabled :precision="2" controls-position="right" :min="0" :step="1" placeholder="请输入礼品含税金额（元）" />
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
            <el-form-item label="方案名称">
              <base-input :value.sync="formData.schemeId" base-code="listScheme" label-name="schemeName" value-name="schemeId" placeholder="方案名称" />
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
          <el-col :span="24">
            <el-form-item label="领用状态">
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
            <el-form-item label="领用原因" prop="collectReason" class="noProp-item-textarea">
              <el-input v-model="formData.collectReason" type="textarea" placeholder="请输入领用原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="礼品明细">
      <giftCollectDetail ref="giftCollectDetail" :form-data="formData" v-bind="{useAreaTree}" @calculate="calculate" />
    </SectionCard>
    <SectionCard title="处理记录">
      <handleRecords :table-data="formData.poPurchaseApplicationAuditList" />
    </SectionCard>
    <div slot="footer" align="center">
      <el-button type="success" :disabled="btnDisabled" @click="submitForm(0)">草 稿</el-button>
      <el-button type="primary" :disabled="btnDisabled" @click="submitForm(6)">提 交</el-button>
    </div>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
  </PageCard>
</template>
<script>
import { getCollect, addCollect, updateCollect } from '@/api/collect.js'
import { listAddressQueryUseAreaTree } from '@/api/base.js'
import giftCollectDetail from './components/giftCollectDetail.vue'
export default {
  components: {
    giftCollectDetail
  },
  data() {
    return {
      returnUrl: '/gift/collect',
      submitLoading: false,
      formData: {},
      rules: {
        collectDate: { required: true, message: '领用日期不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        location: { required: true, message: '使用区域不能为空', trigger: 'change' },
        collectReason: { required: true, message: '领用原因不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
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
      user: this.$store.getters.userInfo,
      userDialogVisible: false,
      projectDialogVisible: false,
      propsUseAreaTree: {
        label: 'label',
        value: 'id',
        children: 'children'
      },
      useAreaTree: [],
      btnDisabled: false,
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
    this.getUserArea()
    this.init()
  },
  methods: {
    init() {
      if (this.editId) {
        this.submitLoading = true
        getCollect(this.editId)
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
            collectDate: this.$vxe.toDateString(new Date()),
            sourceTerminal: 1, // 来源终端  默认1  pc
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
        if (valid) {
          if (this.$refs.giftCollectDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          this.formData = { ...this.formData, ...{ almAssetCollectDetailList: this.$refs.giftCollectDetail.tableData, status } }
          this.btnDisabled = true
          if (this.editId) {
            updateCollect(this.formData)
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
                this.btnDisabled = false
              })
          } else {
            addCollect(this.formData)
              .then((res) => {
                this.$message.success(status == 2 ? '提交成功' : '新增成功')
                if (status == 2) {
                  setTimeout(() => {
                    window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                    window.$wujie.props.route({
                      path: '/gift/collect',
                      module: 'Gift',
                      fullPath: '/gift/collect/edit',
                      title: '编辑礼品领用',
                      condition: { id: res.msg }
                    })
                  }, 500)
                }
              })
              .finally(() => {
                this.btnDisabled = false
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
          projectName: val.projectName
        }
      }
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
    calculate(list) {
      var giftQuantity = 0
      var assetAmount = 0
      list.forEach((item) => {
        giftQuantity = this.$vxe.add(giftQuantity, item.collectQuantity)
        assetAmount = this.$vxe.add(assetAmount, item.subtotal)
      })
      this.$set(this.formData, 'giftQuantity', giftQuantity)
      this.$set(this.formData, 'assetAmount', assetAmount)
    }
  }
}
</script>
