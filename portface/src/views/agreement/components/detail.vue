<template>
  <el-dialog title="查看招标协议信息" :visible.sync="openDialog" width="500px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="140px">
      <el-form-item label="招标协议编号">{{ formData.tenderAgreementCode }}</el-form-item>
      <el-form-item label="招标协议名称">{{ formData.tenderAgreementName }}</el-form-item>
      <el-form-item label="客户统一系统编号">{{ formData.unifiedSystemNumber }}</el-form-item>
    </el-form>
    <div slot="footer" align="center" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAgreement } from '@/api/agreement.js'
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

    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>