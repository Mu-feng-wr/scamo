<template>
  <el-dialog title="查看业务类型信息" :visible.sync="openView" width="500px" append-to-body>
    <el-form ref="form" label-width="120px" v-loading="loading">
      <el-form-item label="业务类型编号">{{ formData.businessCode }}</el-form-item>
      <el-form-item label="业务类型名称">{{ formData.businessName }}</el-form-item>
      <el-form-item label="状态">
        <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
      </el-form-item>
      <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
    </el-form>
    <div align="center" slot="footer" class="dialog-footer">
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
      submitButton: false
    }
  },
  computed: {},
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
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>

<style>
</style>