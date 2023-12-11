<template>
  <div style="display:inline-block">
    <el-button type="primary" :disabled="disabled" plain icon="el-icon-upload2" size="mini" @click="handleImport">{{ name }}</el-button>
    <el-dialog :title="upload.title" :visible.sync="open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="disabled||isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx格式文件。</span>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'UploadFile',
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '批量导入'
    }
  },
  data() {
    return {
      open: false,
      isUploading: false
    }
  },
  computed: {
    upload() {
      return {
        title: this.title,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + this.url
      }
    }
  },
  methods: {
    handleImport() {
      this.open = true
    },
    handleFileUploadProgress() {
      this.isUploading = true
    },
    handleFileSuccess(response, file, fileList) {
      var msg = '' // 导入提示信息；
      if (!response.data || response.data.length == 0) {
        msg = '请不要导入空文件！'
      }

      this.open = false
      this.isUploading = false
      this.$refs.upload.clearFiles()
      if (msg) {
        this.$message({
          type: 'warning',
          message: msg
        })
      } else {
        this.$message({
          type: 'success',
          message: '导入成功！'
        })
      }
      this.$emit('uploadSuccess', response)
    },
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>