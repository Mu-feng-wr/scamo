<template>
  <el-dialog :title="title" :visible.sync="openView" width="600px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" :model="formData" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织编号" prop="code">
            <el-input v-model="formData.code" placeholder="请输入组织编号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织名称" prop="deptName">
            <el-input v-model="formData.deptName" placeholder="请输入部门名称" maxlength="250" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="formData.parentId != 0" label="上级部门" prop="parentId">
            <el-tree-select
              ref="treeSelect"
              v-model="formData.parentId"
              :props="{label:'deptName'}"
              node-key="deptId"
              check-strictly
              check-half
              :data="deptOptions"
              default-expand-all
              filterable
              popper-append-to-body
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织类型" prop="orgType">
            <base-input :value.sync="formData.orgType" :options-list="dictDataList" base-code="SysDept-orgType" placeholder="请选择组织类型" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="formData.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="formData.remark" type="textarea" rows="3" clearable placeholder="备注" maxlength="500" show-word-limit style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门状态">
            <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择部门状态" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listTree, getDept, addDept, updateDept, listDeptExcludeChild } from '@/api/dept.js'
import { handleTree } from '@/utils/index.js'
export default {
  model: {
    prop: 'openView',
    event: 'close'
  },
  props: {
    openView: {
      type: Boolean,
      default: false
    },
    categoryListOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    editId: {
      type: String,
      default: ''
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        status: 1,
        orderNum: 0
      },
      rules: {
        code: [{ required: true, message: '组织编号不能为空', trigger: 'change' }],
        parentId: [{ required: true, message: '上级部门不能为空', trigger: 'change' }],
        deptName: [{ required: true, message: '组织名称不能为空', trigger: 'change' }],
        orgType: [{ required: true, message: '组织类型不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        orderNum: [{ required: true, message: '排序不能为空', trigger: 'change' }]
      },
      deptOptions: []
    }
  },
  computed: {
    title() {
      return this.editId ? '编辑组织' : '添加组织'
    }
  },
  async created() {
    this.loading = true
    await this.getDictData()
    this.loading = false
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getDept(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.editId) {
            updateDept(this.formData).then(() => {
              this.$message.success('修改成功')
              this.$emit('reload')
              this.cancel()
            })
          } else {
            addDept(this.formData).then(() => {
              this.$message.success('新增成功')
              this.$emit('reload')
              this.cancel()
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('close', false)
    },
    async getDictData() {
      var deptData
      if (this.editId) {
        deptData = await listDeptExcludeChild(this.editId)
        this.deptOptions = handleTree(deptData.data, 'deptId')
      } else {
        deptData = await listTree()
        this.deptOptions = handleTree(deptData.data, 'deptId')
      }
    }
  }
}
</script>