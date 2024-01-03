<template>
  <PageCard v-loading="loading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基础信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商编号" prop="supplierCode">
              <el-input v-model="formData.supplierCode" placeholder="请输入供应商编号" clearable maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" clearable maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商简称" prop="abbreviation">
              <el-input v-model="formData.abbreviation" placeholder="请输入供应商简称" clearable maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="曾用名" prop="nameUsedBefore">
              <el-input v-model="formData.nameUsedBefore" placeholder="请输入曾用名" clearable maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="历史曾用名" prop="hisNameUsedBefore">
              <el-input v-model="formData.hisNameUsedBefore" style="width: calc(50% - 85px)" :disabled="true" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司地址" prop="districtName">
              <el-cascader
                ref="addressChoose"
                v-model="formData.districtName"
                style="width:27%;padding-right:10px;"
                :options="cityOptions"
                filterable
                placeholder="请选择"
                clearable
                @change="changeArea"
              />
              <el-input v-model="formData.address" placeholder="详细地址" maxlength="150" show-word-limit clearable style="width: 50%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="营业执照号" prop="dutyCode">
              <el-input v-model="formData.dutyCode" placeholder="请输入营业执照号" clearable maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纳税人类型" prop="taxpayerType">
              <base-input :value.sync="formData.taxpayerType" :options-list="dictDataList" base-code="MsSupplier-taxpayerType" placeholder="请选择纳税人类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期" prop="incorporationDate">
              <el-date-picker v-model="formData.incorporationDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择成立日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营类型" prop="businessType">
              <base-input :value.sync="formData.businessType" :options-list="dictDataList" base-code="MsSupplier-businessType" placeholder="请选择经营类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业法人" prop="enterpriseLegal">
              <el-input v-model="formData.enterpriseLegal" placeholder="请输入企业法人" clearable maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactUser">
              <el-input v-model="formData.contactUser" placeholder="请输入联系人" clearable maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="formData.telephone" placeholder="请输入联系电话" clearable maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="状态" prop="status">
              <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择纳税人类型" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="扩展信息" class="mt-8">
        <el-row>
          <el-col :span="24">
            <el-form-item label="供应商介绍" prop="companyIntroduction" class="noProp-item-textarea">
              <el-input v-model="formData.companyIntroduction" type="textarea" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发展历程" prop="developeCourse" class="noProp-item-textarea">
              <el-input v-model="formData.developeCourse" type="textarea" placeholder="请输入内容" clearable maxlength="1000" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="业绩情况" prop="performance" class="noProp-item-textarea">
              <el-input v-model="formData.performance" type="textarea" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司概况" prop="companyProfile" class="noProp-item-textarea">
              <el-input v-model="formData.companyProfile" type="textarea" placeholder="请输入内容" clearable maxlength="1000" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="品牌优势" prop="brandAdvantage" class="noProp-item-textarea">
              <el-input v-model="formData.brandAdvantage" type="textarea" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业变更栏" prop="enterpriseChangeColumn" class="noProp-item-textarea">
              <el-input v-model="formData.enterpriseChangeColumn" type="textarea" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业信息栏" prop="enterprisesInformationColumn" class="noProp-item-textarea">
              <el-input v-model="formData.enterprisesInformationColumn" type="textarea" placeholder="请输入内容" clearable maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否推荐" prop="ynRecommend">
              <base-input :value.sync="formData.ynRecommend" :options-list="dictDataList" base-code="MsSupplier-ynRecommend" placeholder="请选择是否推荐" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐入库单位名称" prop="recommendeUnitName">
              <el-input v-model="formData.recommendeUnitName" placeholder="请输入推荐入库单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库日期" prop="storageDate">
              <el-date-picker v-model="formData.storageDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择入库日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" clearable maxlength="250" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>

    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </PageCard>
</template>

<script>
import { getSupplier, updateSupplier } from '@/api/supplier.js'
import { listDictItems } from '@/api/base.js'
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      returnUrl: '/portface/supplier',
      cityOptions: regionData,
      loading: false,
      editId: '',
      formData: {},
      // 表单校验
      rules: {
        supplierCode: [{ required: true, message: '供应商编号不能为空', trigger: 'change' }],
        supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        dutyCode: [{ required: true, message: '营业执照号不能为空', trigger: 'change' }],
        provinceName: [{ required: true, message: '省份名称不能为空', trigger: 'change' }],
        provinceId: [{ required: true, message: '省份id不能为空', trigger: 'change' }],
        cityName: [{ required: true, message: '城市名称不能为空', trigger: 'change' }],
        districtId: [{ required: true, message: '区/县id不能为空', trigger: 'change' }],
        districtName: [{ required: true, message: '区/县名称不能为空', trigger: 'change' }],
        address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        taxpayerType: [{ required: true, message: '纳税人类型不能为空', trigger: 'change' }],
        incorporationDate: [{ required: true, message: '成立日期不能为空', trigger: 'change' }],
        businessType: [{ required: true, message: '经营类型不能为空', trigger: 'change' }],
        storageDate: [{ required: true, message: '入库日期不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        delFlag: [{ required: true, message: '删除标记不能为空', trigger: 'change' }],
        createDate: [{ required: true, message: '创建时间不能为空', trigger: 'change' }],
        createBy: [{ required: true, message: '创建人ID不能为空', trigger: 'change' }]
      },
      dictDataList: []
    }
  },
  created() {},
  mounted() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      getSupplier(this.editId).then((res) => {
        this.formData = res.data
        this.formData.districtName = [this.formData.provinceId, this.formData.cityId, this.formData.districtId]
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
    },
    changeArea(val) {
      const value = this.$refs.addressChoose.getCheckedNodes()[0]
      if (value) {
        this.formData.provinceId = value.value
        this.formData.provinceName = value.label
        this.formData.cityId = value.parent.value
        this.formData.cityName = value.parent.label
        this.formData.districtId = value.parent.parent.value
        this.formData.districtName = value.parent.parent.label
      } else {
        this.formData.provinceId = ''
        this.formData.provinceName = ''
        this.formData.cityId = ''
        this.formData.cityName = ''
        this.formData.districtId = ''
        this.formData.districtName = ''
      }
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.editId) {
            updateSupplier(this.formData).then((res) => {
              this.$message.success('修改成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 500)
            })
          } else {
            updateSupplier(this.formData).then((res) => {
              this.$message.success('新增成功')
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
