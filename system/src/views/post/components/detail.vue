<template>
  <vxe-modal v-model="openView" :title="title" width="600px" height="70%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form v-loading="loading" ref="form" label-width="80px">
      <el-form-item label="岗位名称">{{ form.postName }}</el-form-item>
      <el-form-item label="岗位编码">{{ form.postCode }}</el-form-item>
      <el-form-item label="排序">{{ form.postSort }}</el-form-item>
      <el-form-item label="状态">
        <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
      </el-form-item>
      <el-form-item label="备注">{{ form.remark }}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getPos } from '@/api/post.js'
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
      getPos(this.editId)
        .then((res) => [(this.formData = res.data)])
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