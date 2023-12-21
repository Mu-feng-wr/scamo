<template>
  <div style="display:inline-block">
    <el-upload
      ref="upload"
      :show-file-list="false"
      :accept="accept"
      :action="uploadUrl"
      :headers="headers"
      :limit="limit"
      :on-success="onUploadSuccess"
      :before-upload="beforeUpload"
      :on-error="onError"
      :disabled="disabled"
    >
      <el-link v-if="type=='icon'" type="primary" :underline="false">
        <i class="el-icon-upload" style="font-size:24px;"></i>
      </el-link>

      <el-button v-else slot="trigger" :loading="btnLoading" type="primary" plain icon="el-icon-upload" :size="size" :disabled="disabled">{{ title }}</el-button>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
var url = process.env.VUE_APP_BASE_API
if (process.env.NODE_ENV == 'development' && window.$wujie) {
  url = window.$wujie.props.origin
}
export default {
  name: 'UploadImg',
  props: {
    title: {
      type: String,
      default: '上传图片'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.jpg, .jpeg, .png'
    },
    uploadUrl: {
      type: String,
      default: url + '/file/upload'
    },
    limit: {
      type: Number,
      default: undefined
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      headers: {
        Authorization: getToken()
      },
      btnLoading: false
    }
  },
  methods: {
    onUploadSuccess(file) {
      this.btnLoading = false
      this.$emit('success', file.data)
    },
    beforeUpload() {
      this.btnLoading = true
    },
    onError() {
      this.btnLoading = false
    }
  }
}
</script>