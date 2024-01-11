<template>
  <el-form :model="formData" :rules="rules" ref="form" size="small" label-width="120px" class="form-table form-table-edit" :disabled="disabled" v-loading="loading">
    <SectionCard title="企业信息" :isHeaderSplit="true">
      <div slot="header-r">
        <el-form>
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="submitForm" :disabled="disabled">保存</el-button>
        </el-form>
      </div>

      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="formData.enterpriseName" placeholder="请输入企业名称" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业性质" prop="enterpriseNature">
            <el-select v-model="formData.enterpriseNature" placeholder="请选择企业性质" clearable filterable>
              <el-option v-for="item in sysDictionaryList['MmEnterprise-enterpriseNature']" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮件地址" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮件地址" clearable disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="formData.contact" placeholder="请输入联系人" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="formData.telephone" placeholder="请输入联系电话" clearable disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </SectionCard>
  </el-form>
</template>

<script>
import { addEnterprise, updateEnterprise, findByUnifiedSystemNumber } from '@/api/enterprise.js'
import pattern from '@/utils/pattern'
export default {
  name: 'Enterprise',
  props: {
    sysDictionaryList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      disabled: true,
      formData: {},
      rules: {
        enterpriseName: [{ required: true, message: '企业名称不能为空', trigger: 'change' }],
        contact: [{ required: true, message: '联系人不能为空', trigger: 'change' }],
        telephone: [{ required: false, validator: pattern.validateTelephone, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getEnterpriseInfo()
  },
  methods: {
    getEnterpriseInfo() {
      this.loading = true
      findByUnifiedSystemNumber()
        .then((response) => {
          this.formData = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.disabled = !this.disabled
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.enterpriseId) {
            updateEnterprise(this.formData).then((res) => {
              this.$message.success('修改成功')
              this.disabled = true
            })
          } else {
            addEnterprise(this.formData).then((res) => {
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
