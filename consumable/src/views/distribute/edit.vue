<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" :model="form" :rules="rules" label-width="170px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="派发单号">
              <el-input disabled v-model="form.consumableDistributeCode" placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applicantDate">
              <el-date-picker clearable v-model="form.applicantDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="centralizedBusinessId">
              <base-input
                baseCode="listType"
                :value.sync="form.centralizedBusinessId"
                :label.sync="form.centralizedBusinessName"
                labelName="businessName"
                valueName="businessId"
                :preStore="[{businessId:form.centralizedBusinessId,businessName:form.centralizedBusinessName}]"
                placeholder="请选择业务类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <el-input disabled v-model="form.applicantName" placeholder="请输入申请人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门" prop="applicantOrgName">
              <el-input disabled v-model="form.applicantOrgName" placeholder="请输入申请部门" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司" prop="applicantCompanyName">
              <el-input disabled v-model="form.applicantCompanyName" placeholder="请输入申请公司" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="派发日期" prop="distributeDate">
              <el-date-picker v-model="form.distributeDate" type="date" placeholder="选择派发日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材数量 " prop="distributeQuantity">
              <el-input-number disabled v-model="form.distributeQuantity" controls-position="right" :precision="3" placeholder="自动计算"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材含税金额（元） " prop="distributeAmount">
              <el-input-number controls-position="right" disabled v-model="form.distributeAmount" :precision="3" placeholder="自动计算"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发人" prop="istributerName">
              <el-input suffix-icon="el-icon-arrow-down" v-model="form.istributerName" placeholder="请选择派发人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发部门" prop="istributerOrgName">
              <el-input disabled v-model="form.istributerOrgName" placeholder="选择派发人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发公司" prop="istributerCompayName">
              <el-input disabled v-model="form.istributerCompayName" placeholder="选择派发人自动带出" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-input suffix-icon="el-icon-arrow-down" v-model="form.projectName" placeholder="请选择项目名称" @focus="projectDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">
              <base-input
                :value.sync="form.schemeId"
                :label.sync="form.schemeName"
                :code.sync="form.schemeCode"
                :optionsList="schemeList"
                codeName="schemeCode"
                labelName="schemeName"
                valueName="schemeId"
                placeholder="方案名称"
              ></base-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用区域">
              <el-cascader
                :props="propsUseAreaTree"
                :options="useAreaTree"
                placeholder="请选择使用区域"
                :filterable="true"
                clearable
                ref="categoryCascader"
                v-model="form.location"
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
            <el-form-item label="接收人" prop="recipientor">
              <el-input suffix-icon="el-icon-arrow-down" v-model="form.userName" placeholder="请选择接收人" @focus="userDialogVisible=true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收人手机号码" prop="recipientorMobile">
              <el-input v-model="form.recipientorMobile" placeholder="接收人手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="派发类型" prop="istributeType">
              <el-select v-model="form.istributeType">
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
            <el-form-item label="派发方式" prop="istributeMethod">
              <el-select v-model="form.istributeMethod">
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
            <el-form-item label="快递单号">
              <el-input v-model="form.courierNumber" placeholder=" 快递单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=" 快递公司">
              <el-input v-model="form.courierCompany" placeholder=" 快递公司" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="派发状态" prop="status">
              <el-select v-model="form.status" style="width:calc(25% - 30px)">
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
            <el-form-item label="派发原因" prop="distributeReason" class="noProp-item-textarea">
              <el-input type="textarea" v-model="form.distributeReason" placeholder="请输入派发原因" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <SectionCard title="耗材明细">
      <consumableDistributeDetail ref="consumableDistributeDetail" :form="form" v-bind="{schemeList}" @calculate="calculate" />
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
import { getDistribute, addDistribute, updateDistribute } from '@/api/consume/distribute'
import selectUser from '@/views/components/selectDialog/user.vue'
import project from '@/views/components/selectDialog/project.vue'
import consumableDistributeDetail from './components/consumableDistributeDetail.vue'
import { listSchemeQuery } from '@/api/datac/scheme'
import { listAddressQueryUseAreaTree } from '@/api/library/address'
export default {
  components: {
    consumableDistributeDetail
  },
  data() {
    return {
      submitLoading: false,
      form: {},
      rules: {
        distributeDate: { required: true, message: '派发日期不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        centralizedBusinessId: { required: true, message: '业务类型不能为空', trigger: 'change' },
        userName: { required: true, message: '使用人不能为空', trigger: 'change' },
        projectName: { required: true, message: '项目名称不能为空', trigger: 'change' },
        schemeId: { required: true, message: '方案名称不能为空', trigger: 'change' },
        distributeReason: { required: true, message: '派发原因不能为空', trigger: 'change' },
        applicantDate: { required: true, message: '申请日期不能为空', trigger: 'change' },
        applicantName: {
          required: true,
          message: '申请人不能为空',
          trigger: 'blur'
        },
        applicantOrgName: {
          required: true,
          message: '申请部门不能为空',
          trigger: 'blur'
        },
        applicantCompanyName: {
          required: true,
          message: '申请公司不能为空',
          trigger: 'blur'
        },
        userOrgName: { required: true, message: '使用部门不能为空', trigger: 'blur' },
        companyName: { required: true, message: '使用公司不能为空', trigger: 'blur' },
        distributeQuantity: { required: true, message: '耗材数量不能为空', trigger: 'blur' },
        distributeAmount: { required: true, message: '耗材含税金额（元）不能为空', trigger: 'blur' },
        istributerName: { required: true, message: '派发人不能为空', trigger: 'blur' },
        istributerOrgName: { required: true, message: '派发部门不能为空', trigger: 'blur' },
        istributerCompayName: { required: true, message: '派发公司不能为空', trigger: 'blur' },
        status: { required: true, message: '借用状态不能为空', trigger: 'change' },
        recipientor: { required: true, message: '接收人不能为空', trigger: 'blur' },
        recipientorMobile: { required: true, message: '接收人手机号码不能为空', trigger: 'blur' },
        istributeType: { required: true, message: '派发类型不能为空', trigger: 'blur' },
        istributeMethod: { required: true, message: '派发方式不能为空', trigger: 'blur' }
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
        getDistribute(this.editId)
          .then((res) => {
            this.form = res.data
          })
          .finally(() => {
            this.submitLoading = false
          })
      } else {
        this.form = {
          ...this.form,
          ...{
            applicantDate: this.$vxe.toDateString(new Date()),
            distributeDate: this.$vxe.toDateString(new Date()),
            sourceTerminal: 1, //来源终端  默认 1 pc
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
        if (valid && this.$refs.consumableDistributeDetail) {
          if (this.$refs.consumableDistributeDetail.tableData.length == 0) {
            this.$message({
              type: 'warning',
              message: '请添加明细表数据'
            })
            return
          }
          this.form = { ...this.form, ...{ almAssetReturnDetailList: this.$refs.consumableDistributeDetail.tableData, status } }
          if (this.editId != null) {
            updateDistribute(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功')
                this.$router.back()
              })
              .finally(() => {
                this.submitLoading = false
              })
          } else {
            addDistribute(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功')
                this.$router.back()
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
    // 获取字典数据
    getDictData() {
      listSchemeQuery().then((response) => {
        //方案信息
        this.schemeList = response.rows
      })
    },
    calculate(list) {
      let distributeQuantity = 0
      let distributeAmount = 0
      list.forEach((item) => {
        distributeQuantity = this.$vxe.add(distributeQuantity, item.returnQuantity)
        distributeAmount = this.$vxe.add(distributeAmount, item.subtotal)
      })
      this.$set(this.form, 'distributeQuantity', distributeQuantity)
      this.$set(this.form, 'distributeAmount', distributeAmount)
    }
  }
}
</script>
