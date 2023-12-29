<template>
  <el-dialog :title="title" :visible.sync="openView" width="500px" append-to-body>
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px" v-loading="loading">
      <el-form-item label="业务类型编号" prop="businessCode">
        <el-input v-model="formData.businessCode" placeholder="请输入业务类型编号" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="业务类型名称" prop="businessName">
        <el-input v-model="formData.businessName" placeholder="请输入业务类型名称" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <base-input :value.sync="formData.status" :options-list="dictDataList" size="small" base-code="System-status" placeholder="请选择状态" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
      </el-form-item>
    </el-form>
    <div align="center" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="submitButton">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getType, addType, updateType } from '@/api/type.js'
export default {
  model: {
    prop: 'openView',
    event: 'close'
  },
  props: {
    openView: {
      type: Boolean,
      default: false
    },
    editId: {
      type: String,
      default: ''
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      formData: {},
      rules: {
        businessCode: [{ required: true, message: '品牌编号不能为空', trigger: 'change' }],
        businessName: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      },
      submitButton: false
    }
  },
  computed: {
    title() {
      return this.editId ? '修改业务类型信息' : '添加业务类型信息'
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
      getType(this.editId)
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
            updateType(this.formData)
              .then((response) => {
                this.$message.success('修改成功')
                this.$emit('reload')
                this.cancel()
              })
              .finally(() => {
                this.submitButton = false
              })
          } else {
            addType(this.formData)
              .then((response) => {
                this.$message.success('新增成功')
                this.$emit('reload')
                this.cancel()
              })
              .finally(() => {
                this.submitButton = false
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