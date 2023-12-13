<template>
  <vxe-modal :title="title" v-model="dialogVisible" width="400px" height="50%" esc-closable resize @hide="close" show-footer>
    <div v-loading="loading">
      <el-tree lazy check-strictly :load="loadNode" :props="props" node-key="id" ref="tree" show-checkbox></el-tree>
    </div>
    <template #footer>
      <div class="text-center">
        <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
        <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
      </div>
    </template>
  </vxe-modal>
</template>
<script>
import { findCompanyList, getDeptByCompanyId } from '@/api/system/user.js'
export default {
  props: {
    title: {
      type: String,
      default: '选择中心'
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      props: {
        label: 'deptName'
      }
    }
  },
  created() {
    this.dialogVisible = this.visible
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level == 0) {
        this.loading = true
        findCompanyList()
          .then((res) => {
            let data = res.data.map((item) => {
              return {
                ...item,
                ...{
                  disabled: this.level >= 1
                }
              }
            })
            resolve(data)
          })
          .finally(() => {
            this.loading = false
          })
      } else if (this.level >= 1 && node.level == 1) {
        getDeptByCompanyId(node.data.deptId).then((res) => {
          let data = res.data.map((item) => {
            return {
              ...item,
              ...{
                disabled: this.level >= 2
              }
            }
          })
          resolve(data)
        })
      } else if (this.level >= 2 && node.level == 2) {
        getDeptByCompanyId(node.data.deptId).then((res) => {
          resolve(res.data)
        })
      }
      resolve([])
    },
    confirm() {
      let data = this.$refs.tree.getCheckedNodes()
      if (!data || data.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择数据'
        })
        return
      }
      if (data && data.length > 1) {
        this.$message({
          type: 'warning',
          message: '只能选择一条数据'
        })
        return
      }
      this.$emit('update:visible', false)
      this.$emit('confirm', data[0])
    },
    close() {
      this.$emit('update:visible', false)
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