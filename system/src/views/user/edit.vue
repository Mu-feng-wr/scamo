<template>
  <PageCard v-loading="loading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <!-- 用户信息 -->
      <SectionCard title="基础信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户编号" prop="no">
              <el-input v-model="formData.no" placeholder="请输入用户编号" maxlength="30" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆账号" prop="userName">
              <el-input v-model="formData.userName" placeholder="请输入登录账号" maxlength="50" clearable show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="formData.password" type="password" placeholder="请输入登录密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="loginName">
              <el-input v-model="formData.loginName" placeholder="请输入姓名" maxlength="30" clearable show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="formData.phonenumber" placeholder="请输入手机号码" maxlength="11" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户性别" prop="sex">
              <base-input :value.sync="formData.sex" :options-list="dictDataList" base-code="SysUser-sex" placeholder="请选择性别" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上级姓名" prop="parentUserId">
              <base-input
                :value.sync="formData.parentUserId"
                label-name="userName"
                value-name="userId"
                result-label="data"
                base-code="userList"
                :return-obj="true"
                placeholder="请选择上级姓名"
                clearable
                @change="parentNameChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="companyId">
              <base-input
                :value.sync="formData.companyId"
                label-name="deptName"
                value-name="deptId"
                result-label="data"
                base-code="companyList"
                :return-obj="true"
                placeholder="请选择所属公司"
                clearable
                @change="changeCompany"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                ref="treeSelect"
                v-model="formData.deptId"
                check-strictly
                check-half
                :data="deptChildList"
                node-key="deptId"
                :props="{label:'deptName'}"
                default-expand-all
                filterable
                popper-append-to-body
                @node-click="selectDept"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="岗位" prop="postIds">
              <base-input :value.sync="formData.postIds" base-code="optionSelect" result-label="data" placeholder="请选择岗位" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" clearable placeholder="请输入邮箱" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入职日期" prop="workDate">
              <el-date-picker v-model="formData.workDate" type="date" clearable placeholder="选择入职日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="状态" prop="status">
              <base-input style="width:calc((100% - 100px) / 2 - 12px)" :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" class="noProp-item-textarea">
              <el-input v-model="formData.remark" rows="4" clearable type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <rolesList :user-id="userId" :roles="formData.roles" @reloadPermissions="reloadPermissions" />
    <dataPermissions ref="menuAndPermission" :role-ids="formData.roleIds" :dict-data-list="dictDataList" />
    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </PageCard>
</template>

<script>
import { listDictItems } from '@/api/base.js'
import { getDeptByCompanyId, getExtendsUser, updateUser, addUser } from '@/api/user.js'
import { handleTree } from '@/utils/index.js'
import rolesList from './components/rolesList.vue'
import dataPermissions from './components/dataPermissions.vue'
export default {
  components: {
    rolesList,
    dataPermissions
  },
  data() {
    return {
      returnUrl: '/system/user',
      loading: false,
      formData: {
        sort: 0,
        status: '1',
        roleIds: []
      },
      rules: {
        no: [{ required: true, message: '用户编号不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        password: [{ required: true, message: '登陆密码不能为空', trigger: 'change' }],
        loginName: [{ required: true, message: '用户名称不能为空', trigger: 'change' }],
        deptId: [{ required: true, message: '归属部门不能为空', trigger: 'change' }],
        companyId: [{ required: true, message: '所属公司不能为空', trigger: 'change' }],
        workDate: [{ required: true, message: '入职时间不能为空', trigger: 'change' }],
        userName: [{ required: true, message: '登录账号不能为空', trigger: 'change' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }],
        phonenumber: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'change' }]
      },
      dictDataList: [],
      deptChildList: [],
      userId: ''
    }
  },
  created() {
    this.getDictData()
    this.userId = this.$route.query.id
    if (this.userId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getExtendsUser(this.userId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统状态
      dictCodes += ',SysUser-sex' // 性别
      dictCodes += ',SysRole-dataScope' // 数据权限
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    parentNameChange(val) {
      this.formData.parentUserNo = val.no
      this.formData.parentLoginName = val.loginName
      this.formData.parentUserName = val.userName
    },
    changeCompany(val) {
      this.getChildDeptList(val.deptId)
    },
    getChildDeptList(companyId) {
      getDeptByCompanyId(companyId).then((res) => {
        this.deptChildList = handleTree(res.data, 'deptId')
      })
    },
    reloadPermissions(val) {
      this.formData.roleIds = val
    },
    selectDept(val) {
      this.formData.deptId = val.deptId
      this.formData.deptName = val.deptName
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.formData.roleIds || this.formData.roleIds.length == 0) {
            this.$message({
              message: '用户角色不能为空！',
              type: 'warning'
            })
            return
          }
          var { permissionList } = this.$refs.menuAndPermission.getSelectData()
          this.form.selectedList = permissionList
          if (this.userId) {
            updateUser(this.formData).then((response) => {
              this.$message.success('修改成功')
            })
          } else {
            addUser(this.form).then((response) => {
              this.$message.success('新增成功')
            })
          }
        }
      })
    }
  }
}
</script>
