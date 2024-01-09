<template>
  <vxe-modal v-model="openView" :title="title" width="600px" height="75%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="120px" class="p-20">
      <el-form-item label="字典唯一标识" prop="code">
        <el-input v-model="formData.code" placeholder="请输入字典编号" />
      </el-form-item>
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="formData.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" controls-position="right" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" rows="4" clearable placeholder="备注" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="状态">
        <base-input size="small" :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getDictionaries, addDictionaries, updateDictionaries } from '@/api/dictionaries.js'
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
      formData: {
        sort: 0,
        status: '0'
      },
      rules: {
        code: [{ required: true, message: '字典编号不能为空', trigger: 'change' }],
        name: [{ required: true, message: '字典名称不能为空', trigger: 'change' }],
        value: [{ required: true, message: '字典值不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.editId ? '修改字典' : '添加字典'
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
      getDictionaries(this.editId)
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
          this.loading = true
          if (this.editId) {
            updateDictionaries(this.formData)
              .then((response) => {
                this.$message.success('修改成功')
                this.$emit('reload')
                this.cancel()
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            addDictionaries(this.formData)
              .then((response) => {
                this.$message.success('新增成功')
                this.$emit('reload')
                this.cancel()
              })
              .finally(() => {
                this.loading = false
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
<style lang="scss" scoped>
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>