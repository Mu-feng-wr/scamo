<template>
  <el-form :model="formData" ref="form" size="small" :disabled="disabled">
    <SectionCard title="通知" :isHeaderSplit="true">
      <div slot="header-r">
        <el-form>
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="submitForm" :disabled="disabled">保存</el-button>
        </el-form>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label prop="notice">
            <el-input type="textarea" v-model="formData.notice" placeholder="请输入通知" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </SectionCard>
    <SectionCard title="公告" :isHeaderSplit="true">
      <el-row>
        <el-col :span="24">
          <el-form-item label prop="notice">
            <el-input type="textarea" v-model="formData.notice" placeholder="请输入公告" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </SectionCard>
    <SectionCard title="欢迎消息" :isHeaderSplit="true">
      <el-row>
        <el-col :span="24">
          <el-form-item label prop="content">
            <el-input type="textarea" v-model="formData.content" placeholder="请输入欢迎消息" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </SectionCard>
  </el-form>
</template>

<script>
import { addNotice, updateNotice } from '@/api/notice.js'
export default {
  name: 'Notice',
  data() {
    return {
      disabled: true,
      formData: {}
    }
  },
  methods: {
    /** 修改按钮操作 */
    handleUpdate() {
      this.disabled = false
    },
    /** 提交按钮 */
    submitForm() {
      this.disabled = false
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.noticeId != null) {
            updateNotice(this.formData).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.disabled = true
            })
          } else {
            addNotice(this.formData).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.disabled = true
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.textareaC >>> .el-textarea__inner {
  min-height: 200px !important;
  resize: none;
}
</style>