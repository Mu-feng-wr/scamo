<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="form-table form-table-edit">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌编号" prop="brandCode">
              <el-input v-model="formData.brandCode" :disabled="formData.beUsed" placeholder="请输入品牌编号" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="formData.brandName" :disabled="formData.beUsed" placeholder="请输入品牌名称" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌简称" prop="shortName">
              <el-input v-model="formData.shortName" placeholder="请输入品牌简称" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌公司" prop="brandCompany">
              <el-input v-model="formData.brandCompany" placeholder="请输入品牌公司" maxlength="250" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="状态" prop="status">
              <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" :disabled="submitButton" @click="submitForm">提 交</el-button>
    </div>
  </PageCard>
</template>
<script>
import { getBrand, addBrand, updateBrand } from '@/api/brand.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/library/brand',
      submitLoading: false,
      submitButton: false,
      // 表单参数
      editId: '',
      formData: {},
      dictDataList: [],
      rules: {
        brandCode: [{ required: true, message: '品牌编号不能为空', trigger: 'change' }],
        brandName: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getBrand(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },

    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton = true
          if (this.formData.brandId != null) {
            updateBrand(this.formData).then((response) => {
              this.$message.success('修改成功')
              this.submitButton = false
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 500)
            })
          } else {
            addBrand(this.formData).then((response) => {
              this.$message.success('修改成功')
              this.submitButton = false
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 500)
            })
          }
        }
      })
    }
  }
}
</script>
