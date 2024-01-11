<template>
  <el-form :model="formData" :rules="rules" ref="form" size="small" label-width="200px" class="form-table form-table-edit" :disabled="disabled" :loading="loading">
    <SectionCard title="开票信息" :isHeaderSplit="true">
      <div slot="header-r">
        <el-form>
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="submitForm" :disabled="disabled">保存</el-button>
        </el-form>
      </div>

      <el-row>
        <el-col :span="8">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-select v-model="formData.invoiceType" placeholder="请选择发票类型" clearable filterable>
              <el-option v-for="item in sysDictionaryList['MmInvoice-invoiceType']" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" placeholder="请输入公司名称" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纳税人识别号" prop="taxpayerIdNum">
            <el-input v-model="formData.taxpayerIdNum" placeholder="请输入纳税人识别号" clearable disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开户银行" prop="depositBank">
            <el-input v-model="formData.depositBank" placeholder="请输入开户银行" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input v-model="formData.bankAccount" placeholder="请输入银行账号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="营业执照登记的企业地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入营业执照登记的企业地址" clearable disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="公司电话" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请输入公司电话" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="营业执照扫描件" prop="licenseFront">
            <el-input v-model="formData.licenseFront" placeholder="请输入营业执照扫描件" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票备注要求" prop="requireDec">
            <el-input v-model="formData.requireDec" placeholder="请输入开票备注要求" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </SectionCard>
  </el-form>
</template>

<script>
import { addInvoice, updateInvoice, findInoviceByCondition } from '@/api/invoice.js'
import pattern from '@/utils/pattern'
export default {
  name: 'Invoice',
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
      // 表单参数
      formData: {}
    }
  },
  computed: {
    rules() {
      return {
        invoiceType: [{ required: true, message: '发票类型不能为空', trigger: 'change' }],
        companyName: [{ required: true, message: '公司名称不能为空', trigger: 'change' }],
        taxpayerIdNum: [{ required: true, message: '纳税人识别号不能为空', trigger: 'change' }],
        mobile: [{ required: false, message: '公司电话不能为空', validator: pattern.validateTelephone, trigger: 'change' }],
        depositBank: { required: this.formData.invoiceType === '01' ? true : false, message: '开户银行不能为空', trigger: 'change' },
        bankAccount: { required: this.formData.invoiceType === '01' ? true : false, message: '银行账号不能为空', trigger: 'change' },
        address: { required: this.formData.invoiceType === '01' ? true : false, message: '企业地址不能为空', trigger: 'change' },
        mobile: { required: this.formData.invoiceType === '01' ? true : false, message: '公司电话不能为空', trigger: 'change' },
        licenseFront: { required: this.formData.invoiceType === '01' ? true : false, message: '扫描件不能为空', trigger: 'change' }
      }
    }
  },
  mounted() {
    this.getInvoiceByCustomerId()
  },
  methods: {
    getInvoiceByCustomerId() {
      this.loading = true
      if (this.$store.getters.userInfo.customerId) {
        findInoviceByCondition({ customerId: this.$store.getters.userInfo.customerId }).then((response) => {
          this.formData = response.data
          this.loading = false
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate() {
      if (this.disabled) {
        this.disabled = !this.disabled
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.disabled = !this.disabled
          }
        })
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.invoiceId != null) {
            updateInvoice(this.formData.invoiceId, this.formData).then((response) => {
              this.$message.success('修改成功')
              this.disabled = true
            })
          } else {
            addInvoice(this.formData).then((response) => {
              this.$message.success('新增成功')
              this.disabled = true
            })
          }
        }
      })
    }
  }
}
</script>
