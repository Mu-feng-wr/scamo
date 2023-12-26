<template>
  <el-dialog :title="title" :visible.sync="openView" width="500px" append-to-body>
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="80px" @close="cancel">
      <el-form-item label="分类编号">
        <el-input v-model="formData.categoryCode" placeholder="自动生成编号" :disabled="true" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="请输入分类名称" :disabled="formData.beUsed" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="父级分类" prop="parentId">
        <el-tree-select
          ref="treeSelect"
          v-model="formData.parentId"
          node-key="id"
          check-strictly
          check-half
          :data="categoryListOptions"
          filterable
          popper-append-to-body
          @node-click="selectCategory"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button :loading="submitLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCategory, updateCategory, addCategory } from '@/api/category.js'
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
    categoryListOptions: {
      type: Array,
      default: () => {
        return []
      }
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
      formData: {
        status: '1'
      },
      loading: false,
      submitLoading: false,
      rules: {
        categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.editId ? '修改物资分类信息' : '新增物资分类信息'
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
      getCategory(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          var submitFunc = addCategory
          if (this.editId) {
            submitFunc = updateCategory
          }
          submitFunc(this.formData)
            .then((res) => {
              this.$message.success(this.editId ? '修改成功' : '新增成功')
              this.$emit('reload')
              this.cancel()
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    cancel() {
      this.$emit('close', false)
    },
    selectCategory(value) {
      this.formData.parentCode = value.categoryCode
      this.formData.parentIds = value.parentIds
    }
  }
}
</script>

<style lang="scss" scoped>
</style>