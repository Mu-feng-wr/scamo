<template>
  <el-dialog title="查看银行账户信息" :visible.sync="openDialog" width="800px" append-to-body @close="cancel">
    <el-form v-loading="loading" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司编号">{{ formData.companyCode }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司名称">{{ formData.companyName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户类型">
            <dictDateView :value="formData.accountType" :dict-data-list="dictDataList" dict-code="FmBankAccount-accountType" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户名">{{ formData.accountName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号">{{ formData.accountNumber }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行">{{ formData.depositBank }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态">
            <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAccount } from '@/api/account.js'
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
      formData: {}
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
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>