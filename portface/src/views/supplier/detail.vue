<template>
  <PageCard v-loading="loading" :return-url="returnUrl">
    <el-form ref="form" label-width="150px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基础信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商编号">{{ formData.supplierCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">{{ formData.supplierName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商简称">{{ formData.abbreviation }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="曾用名">{{ formData.nameUsedBefore }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="历史曾用名">{{ formData.hisNameUsedBefore }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司地址" class="addressPCD-first">{{ formData.provinceName }}{{ formData.cityName }}{{ formData.districtName }}{{ formData.address }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="营业执照号">{{ formData.dutyCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纳税人类型">
              <dictDateView :value="formData.taxpayerType" :dict-data-list="dictDataList" dict-code="MsSupplier-taxpayerType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期">{{ formData.incorporationDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营类型">
              <dictDateView :value="formData.businessType" :dict-data-list="dictDataList" dict-code="MsSupplier-businessType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人">{{ formData.enterpriseLegal }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人">{{ formData.contactUser }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话">{{ formData.telephone }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="状态">
              <dictDateView :value="formData.businessType" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="扩展信息" class="mt-8">
        <el-row>
          <el-col :span="24">
            <el-form-item label="供应商介绍">{{ formData.companyIntroduction }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发展历程">{{ formData.developeCourse }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="业绩情况">{{ formData.performance }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司概况">{{ formData.companyProfile }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="品牌优势">{{ formData.brandAdvantage }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业变更栏">{{ formData.enterpriseChangeColumn }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业信息栏">{{ formData.enterprisesInformationColumn }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否推荐">
              <dictDateView :value="formData.ynRecommend" :dict-data-list="dictDataList" dict-code="MsSupplier-ynRecommend" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐入库单位名称">{{ formData.recommendeUnitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库日期">{{ formData.storageDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>

<script>
import { getSupplier } from '@/api/supplier.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/portface/supplier',
      formData: {},
      loading: false,
      editId: ''
    }
  },
  mounted() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getSupplier(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统状态
      dictCodes += ',MsSupplier-taxpayerType' // 纳税人类型
      dictCodes += ',MsSupplier-ynRecommend' // 是否推荐
      dictCodes += ',MsSupplier-businessType' // 经营类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
