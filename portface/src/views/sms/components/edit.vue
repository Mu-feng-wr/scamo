<template>
  <el-dialog :title="title" :visible.sync="openDialog" width="1000px" append-to-body @close="cancel">
    <el-form ref="form" :model="formData" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求流水号" prop="reqNo">
            <el-input v-model="formData.reqNo" placeholder="请输入请求流水号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model="formData.verifyCode" placeholder="请输入验证码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="反馈编码" prop="feedbackEncod">
            <el-input v-model="formData.feedbackEncod" placeholder="请输入反馈编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="反馈验证码" prop="feedbackVercod">
            <el-input v-model="formData.feedbackVercod" placeholder="请输入反馈验证码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可再推送" prop="isPushAgain">
            <el-input v-model="formData.isPushAgain" placeholder="请输入是否可再推送" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效时常" prop="failureDuration">
            <el-input v-model="formData.failureDuration" placeholder="请输入失效时常" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送人" prop="senderId">
            <el-input v-model="formData.senderId" placeholder="请输入发送人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送时间" prop="sendDate">
            <el-date-picker v-model="formData.sendDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择发送时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务模块" prop="businessModule">
            <el-input v-model="formData.businessModule" placeholder="请输入业务模块" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户统一系统编号" prop="unifiedSystemNumber">
            <el-input v-model="formData.unifiedSystemNumber" placeholder="请输入客户统一系统编号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="错误描述" prop="errorMsg">
            <el-input v-model="formData.errorMsg" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="反馈信息" prop="feedbackMsg">
            <el-input v-model="formData.feedbackMsg" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSms, addSms, updateSms } from '@/api/sms.js'
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
  computed: {
    title() {
      return this.editId ? '编辑短信信息' : '添加短信信息'
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
      getSms(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.editId) {
            updateSms(this.form).then((response) => {
              this.$message.success('修改成功')
              this.$emit('reload')
              this.cancel()
            })
          } else {
            addSms(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.$emit('reload')
              this.cancel()
            })
          }
        }
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