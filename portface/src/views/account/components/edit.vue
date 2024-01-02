<template>
  <el-dialog :title="title" :visible.sync="openDialog" width="800px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司编号" prop="companyCode">
            <el-input v-model="formData.companyCode" placeholder="请输入公司编号" maxlength="50" clearable show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" placeholder="请输入公司名称" maxlength="250" clearable show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户类型" prop="accountType">
            <base-input :value.sync="formData.accountType" :options-list="dictDataList" base-code="FmBankAccount-accountType" placeholder="请选择账户类型" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户名" prop="accountName">
            <el-input v-model="formData.accountName" placeholder="请输入户名" maxlength="50" clearable show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号" prop="accountNumber">
            <el-input v-model="formData.accountNumber" :disabled="formData.accountId ? true : false" placeholder="请输入账号" maxlength="30" clearable show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行" prop="depositBank">
            <el-input v-model="formData.depositBank" placeholder="请输入开户行" maxlength="250" clearable show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button :loading="submitButton" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAccount, addAccount, updateAccount } from '@/api/account.js'
export default {
  model: {
    prop: 'openDialog',
    event: 'close'
  },
  props: {
    openDialog: {
      type: Boolean,
      default: false
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    editId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      submitButton: false,
      formData: {},
      rules: {
        companyCode: [{ required: true, message: '公司编号不能为空', trigger: 'change' }],
        companyName: [{ required: true, message: '公司名称不能为空', trigger: 'change' }],
        accountNumber: [{ required: true, message: '账号不能为空', trigger: 'change' }],
        depositBank: [{ required: true, message: '开户行不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.editId ? '编辑银行账户信息' : '添加银行账户信息'
    }
  },
  created() {
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getAccount(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton = true
          if (this.editId != null) {
            updateAccount(this.formData).then((res) => {
              this.$message.success('修改成功')
              this.$emit('reload')
              this.cancel()
            })
          } else {
            addAccount(this.formData).then((res) => {
              this.$message.success('新增成功')
              this.$emit('reload')
              this.cancel()
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>

<style>
</style>