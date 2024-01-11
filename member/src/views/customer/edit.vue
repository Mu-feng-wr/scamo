<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <!-- 基础信息 -->
      <SectionCard title="基础信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编号" prop="customerCode">
              <el-input v-model="formData.customerCode" placeholder="请输入客户编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户性别">
              <base-input :value.sync="formData.sex" :options-list="dictDataList" base-code="SysUser-sex" placeholder="请选择用户性别" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="formData.phoneNumber" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="companyEmail">
              <el-input v-model="formData.companyEmail" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信号">
              <el-input v-model="formData.wxid" placeholder="请输入微信号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位">
              <el-input v-model="formData.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市">
              <el-cascader v-model="formData.selectedOptions" style="width: 100%" :options="cityOptions" filterable size="large" placeholder="请选择城市" @change="handleChange" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期">
              <el-date-picker v-model="formData.registrationDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择注册日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算费用">
              <el-input v-model="formData.budgetExpenses" placeholder="请输入预算费用" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="预计最晚使用时间">
              <el-date-picker v-model="formData.estimatedLatestServiceTime" style="width: calc(50% - 100px)" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择预计最晚使用时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品需求" class="noProp-item-textarea">
              <el-input v-model="formData.productDemand" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="客户画像" class="mt-8">
        <!-- 客户画像 -->
        <el-row>
          <el-col :span="7" class="customerAvatar">
            <div class="pb-10">
              <span>头像</span>
            </div>
            <customerAvatar :user="formData" />
          </el-col>
          <el-col :span="17">
            <el-row>
              <el-col :span="12">
                <el-form-item label="学历">
                  <el-input v-model="formData.education" placeholder="请输入学历" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业大学">
                  <el-input v-model="formData.graduatedUniversity" placeholder="请输入毕业大学" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="籍贯">
                  <el-input v-model="formData.national" placeholder="请输入籍贯" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生日">
                  <el-date-picker v-model="formData.birthday" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择生日" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码1">
                  <el-input v-model="formData.phoneNumber1" placeholder="请输入手机号码1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码2">
                  <el-input v-model="formData.phoneNumber2" placeholder="请输入手机号码2" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="个人邮箱">
                  <el-input v-model="formData.personalEmail" placeholder="请输入个人邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否已婚">
                  <base-input :value.sync="formData.ynMarry" :options-list="dictDataList" base-code="MmCustomer-ynMarry" placeholder="请选择是否已婚" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="居住地址">
              <el-cascader
                v-model="formData.residential"
                style="width: 30%"
                :options="regionData"
                :props="{value:'label'}"
                filterable
                placeholder="请选择城市"
                @change="changeAddress($event,'residential')"
              />
              <el-input v-model="formData.residentialAddress" placeholder="详细地址" maxlength="150" show-word-limit class="pl-10" style="width: 50%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="办公地址">
              <el-cascader
                v-model="formData.office"
                style="width: 30%"
                :options="regionData"
                :props="{value:'label'}"
                filterable
                placeholder="请选择城市"
                @change="changeAddress($event,'office')"
              />
              <el-input v-model="formData.officeAddress" placeholder="详细地址" maxlength="150" class="pl-10" show-word-limit style="width: 50%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="户籍地址">
              <el-cascader
                v-model="formData.residence"
                style="width: 30%"
                :options="regionData"
                :props="{value:'label'}"
                filterable
                placeholder="请选择城市"
                @change="changeAddress($event,'residence')"
              />

              <el-input v-model="formData.residenceAddress" placeholder="详细地址" maxlength="150" class="pl-10" show-word-limit style="width: 50%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="邮寄地址">
              <el-cascader v-model="formData.mail" style="width: 30%" :options="regionData" :props="{value:'label'}" filterable placeholder="请选择城市" @change="changeAddress($event,'mail')" />
              <el-input v-model="formData.mailAddress" placeholder="详细地址" maxlength="150" class="pl-10" show-word-limit style="width: 50%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="配偶名称">
              <el-input v-model="formData.spouseName" placeholder="请输入配偶名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="1孩">
              <el-input v-model="formData.childNameAge1" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="2孩">
              <el-input v-model="formData.childNameAge2" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="3孩">
              <el-input v-model="formData.childNameAge3" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="4孩">
              <el-input v-model="formData.childNameAge4" style="width: calc((100% - 160px) / 2 - 13px)" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="兴趣爱好" class="noProp-item-textarea">
              <el-input v-model="formData.hobby" type="textarea" placeholder="请输入兴趣爱好" maxlength="260" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 销售回访记录 -->
      <SectionCard title="销售回访" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已电话回访">
              <base-input :value.sync="formData.ynFollowUpCall" :options-list="dictDataList" base-code="System-whether" placeholder="请选择是否已电话回访" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回访人">
              <el-input v-model="formData.followUpUserId" placeholder="请输入电话回访人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回访时间">
              <el-date-picker v-model="formData.followUpDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择电话回访时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="回访内容" class="noProp-item-textarea">
              <el-input v-model="formData.followUpContent" type="textarea" maxlength="250" show-word-limit placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 开通体验记录 -->
      <SectionCard title="开通体验" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已开通">
              <base-input :value.sync="formData.yn7DayOnline" :options-list="dictDataList" base-code="System-whether" placeholder="请选择是否已开通" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开通体验人">
              <el-input v-model="formData.experienceUser" placeholder="请输入开通体验人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开通时间">
              <el-date-picker v-model="formData.experienceDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择开通时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="体验反馈" class="noProp-item-textarea">
              <el-input v-model="formData.experienceFeedback" type="textarea" maxlength="250" show-word-limit placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 方案交流记录 -->

      <SectionCard title="方案交流" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已线下方案预约">
              <base-input :value.sync="formData.ynOfflineScheme" :options-list="dictDataList" base-code="System-whether" placeholder="请选择是否已线下方案预约" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解决方案人">
              <el-input v-model="formData.schemeUser" placeholder="请输入解决方案人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线下方案时间">
              <el-date-picker v-model="formData.schemeDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择线下方案时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="线下方案关注点" class="noProp-item-textarea">
              <el-input v-model="formData.schemeConcern" type="textarea" maxlength="250" show-word-limit placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 成交记录 -->

      <SectionCard title="销售成交" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已成交">
              <base-input :value.sync="formData.ynTransaction" :options-list="dictDataList" base-code="System-whether" placeholder="请选择是否已成交" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售员">
              <el-input v-model="formData.transactionSales" placeholder="请输入销售员" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交时间">
              <el-date-picker v-model="formData.transactionDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="  请选择成交时间" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" @click="dataFormSubmit">提 交</el-button>
    </div>
  </PageCard>
</template>

<script>
import { listDictItems } from '@/api/base.js'
import { findByCondition, addCustomer, updateCustomer } from '@/api/customer.js'
import customerAvatar from './components/customer-avatar.vue'

import { provinceAndCityData, CodeToText, regionData } from 'element-china-area-data'

export default {
  components: { customerAvatar },
  data() {
    return {
      returnUrl: '/member/customer',
      submitLoading: false,
      regionData,
      cityOptions: provinceAndCityData,
      selectedOptions: [],
      formData: {},
      editId: '',
      dictDataList: [],
      // 表单校验
      rules: {
        customerCode: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        companyEmail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        registerCity: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
        registrationDate: [{ required: true, message: '注册日期不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  mounted() {
    this.getSysDictionaryList()
  },
  methods: {
    init(id) {
      this.submitLoading = true
      findByCondition({ customerId: this.editId })
        .then((res) => {
          res.data.yn7DayOnline = res.data.yn7DayOnline ? '1' : '0'
          this.formData = res.data
          this.formData.residential = [res.data.residentialProvince, res.data.residentialCity, res.data.residentialDistrict]
          this.formData.office = [res.data.officeProvince, res.data.officeCity, res.data.mailDistrict]
          this.formData.mail = [res.data.mailProvince, res.data.officeCity, res.data.mailDistrict]
          this.formData.residence = [res.data.residenceProvince, res.data.residenceCity, res.data.residenceDistrict]
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 选择城市触发
    handleChange(value) {
      const city = CodeToText[value[0]] + '/' + CodeToText[value[1]]
      this.formData.registerCity = city
    },

    changeAddress(val, type) {
      if (type == 'residential') {
        this.formData.residentialProvince = val && val.length > 0 ? val[0] : ''
        this.formData.residentialCity = val && val.length > 0 ? val[1] : ''
        this.formData.residentialDistrict = val && val.length > 0 ? val[2] : ''
      }
      if (type == 'office') {
        this.formData.officeProvince = val && val.length > 0 ? val[0] : ''
        this.formData.officeCity = val && val.length > 0 ? val[1] : ''
        this.formData.officeDistrict = val && val.length > 0 ? val[2] : ''
      }
      if (type == 'mail') {
        this.formData.mailProvince = val && val.length > 0 ? val[0] : ''
        this.formData.mailCity = val && val.length > 0 ? val[1] : ''
        this.formData.mailDistrict = val && val.length > 0 ? val[2] : ''
      }
      if (type == 'residence') {
        this.formData.residenceProvince = val && val.length > 0 ? val[0] : ''
        this.formData.residenceCity = val && val.length > 0 ? val[1] : ''
        this.formData.residenceDistrict = val && val.length > 0 ? val[2] : ''
      }
    },
    /** 提交按钮 */
    dataFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.customerId != null) {
            updateCustomer(this.formData).then((response) => {
              this.$message.success('修改成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 1000)
            })
          } else {
            addCustomer(this.formData).then((response) => {
              this.$message.success('新增成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 1000)
            })
          }
        }
      })
    },
    // 获取字典数据
    getSysDictionaryList() {
      let dictCodes = 'MmCustomer-status' // 客户状态
      dictCodes += ',SysUser-sex' // 性别
      dictCodes += ',MmCustomer-acquisitionChannel' // 获客渠道
      dictCodes += ',System-whether' // 系统状态（是否）
      dictCodes += ',MmCustomer-ynMarry' // 是否已婚
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>

<style scoped lang="scss">
.customerAvatar {
  height: 245px;
  text-align: center;
  padding-bottom: 2px;
  border-left: 1px solid rgb(233, 234, 236);
  border-bottom: 1px solid rgb(233, 234, 236);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
