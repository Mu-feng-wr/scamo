<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="160px" class="form-table">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌编号">{{ formData.brandCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">{{ formData.brandName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌简称">{{ formData.shortName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌公司">{{ formData.brandCompany }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>
<script>
import { getBrand } from '@/api/brand.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/library/brand',
      submitLoading: false,
      dictDataList: [],
      formData: {}
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    this.init()
  },
  methods: {
    init(d) {
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
    }
  }
}
</script>
