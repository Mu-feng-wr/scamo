<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="160px" class="form-table">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="地址编码">{{ formData.locationCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址名称">{{ formData.locationName }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="父级地址">{{ formData.companyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址类型">
              <dictDateView :value="formData.locationType" :dict-data-list="dictDataList" dict-code="StlLocationAddress-locationType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经度">{{ formData.longitude }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度">{{ formData.latitude }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="库位地址">{{ formData.provinceName }}{{ formData.cityName }}{{ formData.districtCountyName }}{{ formData.address }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否公开">
              <dictDateView :value="formData.ynPublic" :dict-data-list="dictDataList" dict-code="StlLocationAddress-ynPublic" />
            </el-form-item>
            <el-form-item label="所属公司">{{ formData.companyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="排序">{{ formData.sort }}</el-form-item>
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
import { getAddress } from '@/api/address.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/library/address',
      // 提交加载
      submitLoading: false,
      dictDataList: [],

      // 表单参数
      formData: {}
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      this.submitLoading = true
      getAddress(this.editId)
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
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',StlLocationAddress-locationType' // 地址类型
      dictCodes += ',StlLocationAddress-ynPublic' // 是否公开
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
