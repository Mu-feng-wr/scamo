<template>
  <el-dialog :title="title" :visible.sync="openDialog" width="500px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="140px">
      <el-form-item label="招标协议编号" prop="tenderAgreementCode">
        <el-input v-model="formData.tenderAgreementCode" placeholder="请输入招标协议编号" />
      </el-form-item>
      <el-form-item label="招标协议名称" prop="tenderAgreementName">
        <el-input v-model="formData.tenderAgreementName" placeholder="请输入招标协议名称" />
      </el-form-item>
      <el-form-item label="客户统一系统编号" prop="unifiedSystemNumber">
        <el-input v-model="formData.unifiedSystemNumber" placeholder="请输入客户统一系统编号" />
      </el-form-item>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAgreement, addAgreement, updateAgreement } from '@/api/agreement.js'
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
      formData: {},
      rules: {}
    }
  },
  computed: {
    title() {
      return this.editId ? '修改招标协议信息' : '新增招标协议信息'
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
      getAgreement(this.editId)
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
          if (!this.editId) {
            updateAgreement(this.formData).then((res) => {
              this.$message.success('修改成功')
              this.$emit('reload')
              this.cancel()
            })
          } else {
            addAgreement(this.formData).then((res) => {
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