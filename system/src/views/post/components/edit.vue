<template>
  <vxe-modal v-model="openView" :title="title" width="600px" height="70%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="formData.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="formData.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="排序" prop="postSort">
        <el-input-number v-model="formData.postSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" rows="4" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getPost, addPost, updatePost } from '@/api/post.js'
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
        status: '1',
        postSort: 0
      },
      rules: {
        postName: [{ required: true, message: '岗位名称不能为空', trigger: 'change' }],
        postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'change' }],
        postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.editId ? '修改岗位' : '添加岗位'
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
      getPost(this.editId)
        .then((res) => [(this.formData = res.data)])
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.editId) {
            updatePost(this.formData)
              .then((response) => {
                this.$message.success('修改成功')
                this.$emit('reload')
                this.cancel()
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            addPost(this.formData)
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