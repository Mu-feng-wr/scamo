<template>
  <vxe-modal v-model="openView" title="菜单详情" width="680px" height="90%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" v-loading="loading" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单名称">{{ formData.menuName }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="英文名称">{{ formData.enName }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单">{{ formData.parentName }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型">
            <dictDateView :value="formData.menuType" :dict-data-list="dictDataList" dict-code="SysMenu-menuType" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType == 'C'" :span="24">
          <el-form-item label="菜单URL">{{ formData.component }}</el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'M'" :span="24">
          <el-form-item label="授权标识">{{ formData.perms }}</el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'F'" :span="24">
          <el-form-item label="菜单图标">{{ formData.icon }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序">{{ formData.orderNum }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">{{ formData.remark }}</el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'F'" :span="24">
          <el-form-item prop="status">
            <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType == 'C'" :span="12">
          <el-form-item label="是否显示首页">
            <dictDateView :value="row.ynHome" :dict-data-list="dictDataList" dict-code="SysMenu-ynHome" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getMenu } from '@/api/menu.js'
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
      getMenu(this.editId)
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
<style lang="scss" scoped>
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>