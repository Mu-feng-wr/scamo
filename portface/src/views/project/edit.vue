<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="formData.projectCode" placeholder="请输入项目编号" :disabled="formData.beUsed" clearable maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="请输入项目名称" :disabled="formData.beUsed" clearable maxlength="220" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称" prop="abbreviation">
              <el-input v-model="formData.abbreviation" placeholder="请输入供应商简称" clearable maxlength="220" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目地址" prop="districtName">
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
          <el-col :span="8">
            <el-form-item label="经度" prop="longitude">
              <el-input-number v-model.number="formData.longitude" style="width: 100%" :precision="2" :step="1" placeholder="请输入经度" :max="9999999999.99" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number v-model.number="formData.latitude" style="width: 100%" :precision="2" :step="1" placeholder="请输入纬度" :max="9999999999.99" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计税方法" prop="taxCalculation">
              <base-input :value.sync="formData.taxCalculation" :options-list="dictDataList" base-code="PmProject-taxCalculation" placeholder="请选择计税方法" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完工时间" prop="completionTime">
              <el-date-picker v-model="formData.completionTime" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择完工时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停工时间" prop="downTime">
              <el-date-picker v-model="formData.downTime" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择停工时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="复工时间" prop="resumpteTime">
              <el-date-picker v-model="formData.resumpteTime" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择复工时间" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重点类型" prop="focusType">
              <base-input :value.sync="formData.focusType" :options-list="dictDataList" base-code="PmProject-focusType" placeholder="请选择重点类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否重点项目" prop="isFocusProject">
              <base-input :value.sync="formData.isFocusProject" :options-list="dictDataList" base-code="PmProject-isFocusProject" placeholder="请选择是否重点项目" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="约定完工时间" prop="agreedCompleteTime">
              <el-date-picker v-model="formData.agreedCompleteTime" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择约定完工时间" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <base-input style="width:calc((100% - 300px) / 3 - 16px)" :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作内容" prop="projectScale" class="noProp-item-textarea">
              <el-input v-model="formData.constructeContent" type="textarea" placeholder="请输入内容" maxlength="1000" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目规模" prop="projectScale" class="noProp-item-textarea">
              <el-input v-model="formData.projectScale" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创优目标" prop="innovateGoal" class="noProp-item-textarea">
              <el-input v-model="formData.innovateGoal" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" class="noProp-item-textarea">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
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
import { getProject, addProject, updateProject } from '@/api/project.js'
import { listDictItems } from '@/api/base.js'
import { regionData } from 'element-china-area-data'

export default {
  data() {
    return {
      cityOptions: regionData,
      returnUrl: '/portface/project',
      submitLoading: false,
      submitButton: false,
      editId: '',
      formData: {},
      // 表单校验
      rules: {
        projectCode: [{ required: true, message: '项目编号不能为空', trigger: 'blur' }],
        projectName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        districtName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('区/县名称不能为空'))
              } else if (!this.formData.address) {
                callback(new Error('详细地址不能为空'))
              }
            },
            trigger: 'change'
          }
        ],
        delFlag: [{ required: true, message: '删除标记不能为空', trigger: 'blur' }],
        createDate: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
        createBy: [{ required: true, message: '创建人ID不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        focusType: [{ required: true, message: '重点类型不能为空', trigger: 'change' }]
      },
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
        .then((response) => {
          this.formData = response.data
          this.submitLoading = false
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
    },
    changeArea() {
      const value = this.$refs.addressChoose.getCheckedNodes()[0]
      if (value) {
        this.formData.provinceId = value.value
        this.formData.provinceName = value.label
        this.formData.cityId = value.parent.value
        this.formData.cityName = value.parent.label
        this.formData.districtCountyId = value.parent.parent.value
        this.formData.districtCountyName = value.parent.parent.label
      } else {
        this.formData.provinceId = ''
        this.formData.provinceName = ''
        this.formData.cityId = ''
        this.formData.cityName = ''
        this.formData.districtCountyId = ''
        this.formData.districtCountyName = ''
      }
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.submitButton = true
          if (this.formData.projectId != null) {
            updateProject(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              setTimeout(() => {
                window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
              }, 500)
            })
          } else {
            addProject(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
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