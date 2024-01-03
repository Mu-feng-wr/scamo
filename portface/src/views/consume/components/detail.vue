<template>
  <el-dialog title="查看短信消费信息" :visible.sync="openDialog" width="1000px" append-to-body>
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="130px" @close="cancel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号">{{ formData.phoneNumber }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求流水号">{{ formData.reqNo }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="验证码">{{ formData.verifyCode }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="反馈编码">{{ formData.feedbackEncod }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="反馈验证码">{{ formData.feedbackVercod }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可再推送">{{ formData.isPushAgain }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效时常">{{ formData.failureDuration }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送人">{{ formData.senderId }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发送时间">{{ formData.sendDate }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务模块">{{ formData.businessModule }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消费登记时间">{{ formData.consumeDate }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户统一系统编号">{{ formData.unifiedSystemNumber }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="反馈信息">{{ formData.feedbackMsg }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="错误描述">{{ formData.errorMsg }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
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
import { getConsume } from '@/api/consume.js'
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
      formData: {},
      rules: {},
      loading: false
    }
  },
  computed: {
    title() {
      return this.editId ? '编辑短信消费信息' : '添加短信消费信息'
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
      getConsume(this.editId)
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