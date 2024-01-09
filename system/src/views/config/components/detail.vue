<template>
  <vxe-modal v-model="openView" :title="title" width="500px" height="70%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" label-width="80px">
      <el-form-item label="参数名称">{{ formData.configName }}</el-form-item>
      <el-form-item label="参数键名">{{ formData.configKey }}</el-form-item>
      <el-form-item label="参数键值">{{ formData.configValue }}</el-form-item>
      <el-form-item label="系统内置">
        <span v-if="formData.configType=='Y'">是</span>
        <span v-if="formData.configType=='N'">否</span>
      </el-form-item>
      <el-form-item label="备注">{{ formData.remark }}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer align-center">
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getConfig } from '@/api/config.js'
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
  computed: {
    title() {
      return '查看参数'
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
      getConfig(this.editId)
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