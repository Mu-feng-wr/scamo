<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属公司" prop="companyId">
              <base-input
                :value.sync="formData.companyId"
                base-code="companyList"
                value-name="deptId"
                label-name="deptName"
                placeholder="请选择公司"
                result-label="data"
                clearable
                :pre-store="[{deptName:formData.companyName, deptId:formData.companyId}]"
                @change="changeCompany"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门名称" prop="orgName">
              <el-tree-select
                ref="treeSelect"
                v-model="formData.orgId"
                :disabled="formData.companyId ? false : true"
                check-strictly
                check-half
                :data="deptChildList"
                :only-final="true"
                default-expand-all
                filterable
                popper-append-to-body
                @node-click="selectOrg"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId">
              <base-input
                :value.sync="formData.projectId"
                base-code="listProject"
                value-name="projectId"
                label-name="projectName"
                placeholder="请选择项目名称"
                clearable
                :pre-store="[{projectName:formData.projectName, projectId:formData.projectId}]"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="方案编号" prop="schemeCode">
              <el-input v-model="formData.schemeCode" placeholder="请输入方案编号" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称" prop="schemeName">
              <el-input v-model="formData.schemeName" placeholder="请输入方案名称" maxlength="250" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案方式" prop="approach">
              <el-input v-model="formData.approach" placeholder="请输入方案方式" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="方案主题" prop="theme">
              <el-input v-model="formData.theme" placeholder="请输入方案主题" maxlength="250" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案有效时间">
              <input-range type="daterange" :start-value.sync="formData.startDate" :end-value.sync="formData.endDate" size="medium" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算费用(元)" prop="fee">
              <el-input-number v-model.number="formData.fee" style="width: 100%" :precision="2" :step="1" placeholder="请输入预算费用(元)" :max="9999999999.99" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <base-input style="width:calc((100% - 320px) / 3 - 16px);" :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="方案目的" prop="purpose" class="noProp-item-textarea">
              <el-input v-model="formData.purpose" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案目标" prop="mark" class="noProp-item-textarea">
              <el-input v-model="formData.mark" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="方案内容" prop="content" class="noProp-item-textarea">
              <el-input v-model="formData.content" type="textarea" placeholder="请输入方案内容" maxlength="1000" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预计产出" prop="output" class="noProp-item-textarea">
              <el-input v-model="formData.output" type="textarea" placeholder="请输入内容" maxlength="1000" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit clearable />
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
import { getScheme, addScheme, updateScheme } from '@/api/scheme.js'
import { listDictItems, getDeptByCompanyId } from '@/api/base.js'
import { handleTree } from '@/utils/index.js'
export default {
  data() {
    return {
      returnUrl: '/portface/scheme',
      submitLoading: false,
      submitButton: false,

      formData: {},
      rules: {
        companyId: [{ required: true, message: '所属公司不能为空', trigger: 'change' }],
        companyName: [{ required: true, message: '所属公司不能为空', trigger: 'change' }],
        projectId: [{ required: true, message: '项目id不能为空', trigger: 'change' }],
        projectName: [{ required: true, message: '项目名称不能为空', trigger: 'change' }],
        schemeCode: [{ required: true, message: '方案编号不能为空', trigger: 'change' }],
        schemeName: [{ required: true, message: '方案名称不能为空', trigger: 'change' }],
        purpose: [{ required: true, message: '方案目的不能为空', trigger: 'change' }],
        approach: [{ required: true, message: '方案方式不能为空', trigger: 'change' }],
        content: [{ required: true, message: '方案内容不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getSysDictionaryList()
    this.init(this.$route.query.id)
  },
  methods: {
    init(id) {
      if (id) {
        this.submitLoading = true
        getScheme(id)
          .then((res) => {
            this.formData = res.data
            if (this.formData.companyId) {
              this.getChildDeptList(this.formData.companyId)
            }
          })
          .finally(() => {
            this.submitLoading = false
          })
      }
    },
    selectOrg() {},
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统-状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },

    /** 根据公司id获取部门细信息 */
    getChildDeptList(companyId) {
      getDeptByCompanyId(companyId).then((res) => {
        this.deptChildList = handleTree(res.data, 'deptId')
      })
    },

    /** 选择公司触发 */
    changeCompany(val) {
      this.getChildDeptList(this.formData.companyId)
    },

    /** 选择部门触发 */
    deptChange(row) {
      if (row) {
        this.formData.orgId = row.deptId
        this.formData.orgName = row.deptName
      } else {
        this.formData.orgId = null
        this.formData.orgName = null
      }
    },
    /** 清除部门触发 */
    cleanDept(val) {
      if (!val) {
        this.formData.orgId = null
        this.formData.orgName = null
      }
    },

    /** 选择项目触发 */
    projectChoose(val) {
      this.formData.projectCode = ''
      this.formData.projectName = ''
      this.projectList.forEach((item) => {
        if (item.projectId == val) {
          this.formData.projectId = item.projectId
          this.formData.projectCode = item.projectCode
          this.formData.projectName = item.projectName
        }
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton = true
          if (!this.editId) {
            updateScheme(this.formData)
              .then((res) => {
                this.$message.success('修改成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
              })
              .finally(() => {
                this.submitButton = false
              })
          } else {
            addScheme(this.formData)
              .then((res) => {
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
              })
              .finally(() => {
                this.submitButton = false
              })
          }
        }
      })
    }
  }
}
</script>
