<template>
  <el-dialog title="查看组织" :visible.sync="openView" width="600px" append-to-body @close="cancel">
    <el-form ref="form" v-loading="loading" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织编号">{{ formData.code }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织名称">{{ formData.deptName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="formData.parentId != 0" :span="24">
          <el-form-item label="上级部门">{{ '[' + formData.parentCode + ']' + formData.parentName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" prop="orgType">
          <el-form-item label="组织类型">
            <dictDateView :value="formData.orgType" :dict-data-list="dictDataList" dict-code="SysDept-orgType" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序">{{ formData.orderNum }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">{{ formData.remark }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门状态">
            <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDept } from '@/api/dept.js'
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
      formData: {}
    }
  },
  created() {
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
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>