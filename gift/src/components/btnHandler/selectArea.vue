<template>
  <div style="display:inline-block">
    <el-button :disabled="disabled" type="primary" :size="size" icon="el-icon-position" plain resize @click="openDialog">{{ title }}</el-button>
    <vxe-modal v-model="dialogVisible" :title="title" width="400px" height="90%" esc-closable @hide="close">
      <div v-loading="loading" :style="{height:height+' !important'}">
        <el-tree ref="tree" node-key="id" check-strictly :data="treeList" show-checkbox />
      </div>
      <div class="text-center">
        <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
        <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
      </div>
    </vxe-modal>
  </div>
</template>
<script>
import { listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  name: 'SelectArea',
  props: {
    title: {
      type: String,
      default: '设置具体位置'
    },
    height: {
      type: String,
      default: '500px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      dialogVisible: false,
      treeList: [],
      loading: false
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
      this.load()
    },
    load() {
      this.loading = true
      listAddressQueryUseAreaTree()
        .then((res) => {
          this.treeList = res.data.map((item) => {
            item.disabled = true
            return item
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    confirm() {
      var data = this.$refs.tree.getCheckedNodes()
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
      this.dialogVisible = false
      this.$emit('confirm', data[0])
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>