<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="160px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="companyName">{{ formData.companyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门名称">{{ formData.orgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId">{{ formData.projectName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="方案编号" prop="schemeCode">{{ formData.schemeCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称" prop="schemeName">{{ formData.schemeName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案方式" prop="approach">{{ formData.approach }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="方案主题" prop="theme">{{ formData.theme }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案有效时间">{{ formData.startDate }}~ {{ formData.endDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算费用(元)" prop="fee">{{ $vxe.commafy(formData.fee, { digits: 2 }) }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="方案目的">{{ formData.purpose }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案目标">{{ formData.mark }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案内容">{{ formData.content }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预计产出">{{ formData.output }}</el-form-item>
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
import { getScheme } from '@/api/scheme.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/portface/scheme',
      // 提交加载
      submitLoading: false,
      editId: '',
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
    init() {
      this.submitLoading = true
      getScheme(this.editId)
        .then((response) => {
          this.formData = response.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },

    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统-状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
