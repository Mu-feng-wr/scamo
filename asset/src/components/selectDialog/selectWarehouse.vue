<template>
  <vxe-modal :title="title" v-model="dialogVisible" width="400px" height="50%" esc-closable @hide="close" resize show-footer>
    <div v-loading="loading">
      <el-tree check-strictly :data="treeList" :props="props" node-key="id" ref="tree" show-checkbox></el-tree>
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
import { queryAddressTreeSelect } from '@/api/base.js'
export default {
  props: {
    title: {
      type: String,
      default: '选择仓库'
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
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      props: {
        label: 'label'
      },
      treeList: []
    }
  },
  created() {
    this.dialogVisible = this.visible
    this.load()
  },
  methods: {
    load() {
      queryAddressTreeSelect({ locationTypeList: '1,2' }).then((res) => {
        this.treeList = res.data.map((item) => {
          item.disabled = true
          return item
        })
      })
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