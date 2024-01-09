<template>
  <vxe-modal v-model="openView" title="查看日志" width="700px" height="70%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" :model="formData" label-width="100px" class="p-20">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块：">
            {{ formData.title }} /
            <dictDateView :value="formData.businessType" :dict-data-list="dictDataList" dict-code="SysOperLog-businessType" />
          </el-form-item>
          <el-form-item label="登录信息：">{{ formData.operName }} / {{ formData.operIp }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">{{ formData.operUrl }}</el-form-item>
          <el-form-item label="请求方式：">{{ formData.requestMethod}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作方法：">{{ formData.method }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：">
            <div style="width:100%">{{ formData.operParam }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="返回参数：">{{ formData.jsonResult }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作状态：">
            <div v-if="formData.status === 0">正常</div>
            <div v-else-if="formData.status === 1">失败</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间：">{{ formData.operTime }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="异常信息：" v-if="formData.status === 1">{{ formData.errorMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </vxe-modal>
</template>

<script>
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
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
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