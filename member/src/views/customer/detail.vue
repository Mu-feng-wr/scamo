<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="160px" class="form-table" style="margin-bottom: 8px">
      <!-- 基础信息 -->
      <SectionCard title="基础信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编号">{{ formData.customerCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户姓名">{{ formData.name }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户性别">
              <dictDateView :value="formData.sex" :dictDataList="dictDataList" dict-code="SysUser-sex" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码">{{ formData.phoneNumber }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">{{ formData.companyEmail }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信号">{{ formData.wxid }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职位">{{ formData.position }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市">{{ formData.registerCity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期">{{ formData.registrationDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="预算费用">{{ formData.budgetExpenses }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计最晚使用时间">{{ formData.estimatedLatestServiceTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品需求">{{ formData.productDemand }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 客户画像 -->
      <SectionCard title="客户画像" class="mt-8">
        <el-row>
          <el-col :span="7" style="text-align: center; padding-bottom: 2px; border-left: 1px solid #e9eaec; border-bottom: 1px solid #e9eaec">
            <div class="mt-10">
              <span>头像</span>
            </div>
            <customerAvatar :user="formData" />
          </el-col>
          <el-col :span="17">
            <el-row>
              <el-col :span="12">
                <el-form-item label="学历">{{ formData.education }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业大学">{{ formData.graduatedUniversity }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="籍贯">{{ formData.national }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生日">{{ formData.birthday }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码1">{{ formData.phoneNumber1 }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码2">{{ formData.phoneNumber2 }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="个人邮箱">{{ formData.personalEmail }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否已婚">
                  <dictDateView :value="formData.ynMarry" :dictDataList="dictDataList" dict-code="MmCustomer-ynMarry" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item
              label="居住地址"
              class="addressPCD-first"
            >{{ formData.residentialProvince }}{{ formData.residentialCity }}{{ formData.residentialDistrict }}{{ formData.residentialAddress }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="办公地址" class="addressPCD-first">{{ formData.officeProvince }}{{ formData.officeCity }}{{ formData.officeDistrict }}{{ formData.officeAddress }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="户籍地址" class="addressPCD-first">{{ formData.residenceProvince }}{{ formData.residenceCity }}{{ formData.residenceDistrict }}{{ formData.residenceAddress }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="addressPCD">
            <el-form-item label="邮寄地址" class="addressPCD-first">{{ formData.mailProvince }}{{ formData.mailCity }}{{ formData.mailDistrict }}{{ formData.mailAddress }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="配偶名称">{{ formData.spouseName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="1孩">{{ formData.childNameAge1 }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="2孩">{{ formData.childNameAge2 }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="3孩">{{ formData.childNameAge3 }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="4孩">{{ formData.childNameAge4 }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="兴趣爱好">{{ formData.hobby }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 销售回访记录 -->
      <SectionCard title="销售回访" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已电话回访">
              <dictDateView :value="formData.ynFollowUpCall" :dictDataList="dictDataList" dict-code="System-whether" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回访人">{{ formData.followUpUserId }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回访时间">{{ formData.followUpDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="回访内容">{{ formData.followUpContent }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 开通体验记录 -->
      <SectionCard title="开通体验" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已开通">
              <dictDateView :value="formData.yn7DayOnline" :dictDataList="dictDataList" dict-code="System-whether" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开通体验人">{{ formData.experienceUser }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开通时间">{{ formData.experienceDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="体验反馈">{{ formData.experienceFeedback }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 方案交流记录 -->
      <SectionCard title="方案交流" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已线下方案预约">
              <dictDateView :value="formData.ynOfflineScheme" :dictDataList="dictDataList" dict-code="System-whether" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解决方案人">{{ formData.schemeUser }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="线下方案时间">{{ formData.schemeDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="线下方案关注点">{{ formData.schemeConcern }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <!-- 成交记录 -->
      <SectionCard title="销售成交" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否已成交">
              <dictDateView :value="formData.ynTransaction" :dictDataList="dictDataList" dict-code="System-whether" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售员">{{ formData.transactionSales }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成交时间">{{ formData.transactionDate }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>

<script>
import { listDictItems } from '@/api/base.js'
import { findByCondition } from '@/api/customer.js'
import customerAvatar from './components/customer-avatar.vue'

export default {
  components: { customerAvatar },
  data() {
    return {
      returnUrl: '/member/customer',
      submitLoading: false,

      formData: {},
      dictDataList: []
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
