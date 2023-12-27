<template>
  <el-dialog title="查看物资分类信息" :visible.sync="openView" width="500px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" label-width="80px">
      <el-form-item label="分类编号">{{ formData.categoryCode }}</el-form-item>
      <el-form-item label="分类名称">{{ formData.categoryName }}</el-form-item>
      <el-form-item label="父级分类">{{ formData.parentName }}</el-form-item>
      <el-form-item label="排序">{{ formData.sort }}</el-form-item>
      <el-form-item label="状态">
        <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
      </el-form-item>
      <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCategory } from '@/api/category.js'
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
      formData: {},
      loading: false
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
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>

<style>
</style>