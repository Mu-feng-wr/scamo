<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" label-width="150px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目编号">{{ formData.projectCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">{{ formData.projectName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称">{{ formData.abbreviation }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目地址">
              {{ formData.provinceName }}
              {{ formData.cityName }}
              {{ formData.districtName }}
              {{ formData.address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经度">{{ formData.longitude }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度">{{ formData.latitude }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计税方法">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="PmProject-taxCalculation" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完工时间">{{ formData.completionTime }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停工时间">{{ formData.downTime }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="复工时间">{{ formData.resumpteTime }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点类型">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="PmProject-focusType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否重点项目">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="PmProject-focusType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="约定完工时间">{{ formData.agreedCompleteTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作内容" class="noProp-item-textarea">{{ formData.projectScale }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目规模" class="noProp-item-textarea">{{ formData.projectScale }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创优目标" class="noProp-item-textarea">{{ formData.innovateGoal }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">{{ formData.remark }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>
<script>
import { getProject } from '@/api/project.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
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
      getProject(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },

    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',PmProject-taxCalculation' // 计税方法
      dictCodes += ',PmProject-isFocusProject' // 是否重点项目
      dictCodes += ',PmProject-focusType' // 重点类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
