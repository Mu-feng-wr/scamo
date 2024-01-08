<template>
  <PageCard v-loading="loading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="角色信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formData.roleName" placeholder="请输入角色名称" maxlength="100" show-word-limit :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色标识" prop="roleKey">
              <el-input v-model="formData.roleKey" placeholder="请输入角色标识" maxlength="100" show-word-limit :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="roleSort">
              <el-input-number v-model="formData.roleSort" controls-position="right" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <base-input
                style="width: calc((100% - 200px) / 3 - 18px)"
                size="small"
                :value.sync="formData.status"
                :options-list="dictDataList"
                base-code="System-status"
                placeholder="状态"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="formData.remark" rows="3" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit :disabled="isDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <dataPermissions ref="dataPermissions" :dict-data-list="dictDataList" :edit-id="editId" />

    <div slot="footer" align="center">
      <el-button type="primary" @click="submit">提 交</el-button>
    </div>
  </PageCard>
</template>

<script>
import { addRole, updateRole, getSystemRole } from '@/api/role.js'
import { listDictItems } from '@/api/base.js'
import dataPermissions from '../components/dataPermissions.vue'
export default {
  components: {
    dataPermissions
  },
  data() {
    return {
      returnUrl: '/system/role',
      loading: false,
      formData: {
        roleSort: 0,
        status: '1'
      },
      isDisabled: false,
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'change' }],
        roleSort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        roleKey: [{ required: true, message: '角色标识不能为空', trigger: 'change' }]
      },
      editId: '',
      dictDataList: []
    }
  },
  created() {
    this.getDictData()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getSystemRole(this.editId)
        .then((res) => {
          this.formData = res.data
          if (this.formData.isAssociateUsers == '1') {
            this.isDisabled = true
          } else {
            this.isDisabled = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var { menuIdList, permissionList } = this.$refs.dataPermissions.getSelectData()

          if (menuIdList.length == 0) {
            this.$message({
              message: `角色权限不能为空，请填写完整信息！`,
              type: 'warning'
            })
            return false
          }
          var submitData = {
            ...this.formData,
            ...{
              menuIdList,
              permissionList
            }
          }
          this.loading = true
          if (submitData.roleId) {
            updateRole(submitData)
              .then((response) => {
                this.$message.success('修改成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 1000)
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            addRole(submitData)
              .then((response) => {
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 1000)
              })
              .finally(() => {
                this.loading = false
              })
          }
        }
      })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',SysRole-dataScope' // 角色信息-数据权限
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>