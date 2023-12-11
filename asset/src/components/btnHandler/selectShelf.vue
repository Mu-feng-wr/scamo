<template>
  <div style="display:inline-block">
    <el-button :disabled="disabled" type="primary" :size="size" icon="el-icon-position" plain @click="openDialog">{{ title }}</el-button>
    <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" width="400px" @close="close">
      <div v-loading="loading" :style="{height:height+' !important'}">
        <el-tree lazy check-strictly :load="loadNode" :props="props" node-key="id" ref="tree" show-checkbox></el-tree>
      </div>
      <div class="text-center">
        <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
        <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listAddressQuery } from '@/api/library/address'
export default {
  props: {
    title: {
      type: String,
      default: '设置货架'
    },
    height: {
      type: String,
      default: '500px'
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
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
      props: {
        label: 'locationName'
      },
      loading: false
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    loadNode(node, resolve) {
      if (node.level == 0) {
        this.loading = true
        listAddressQuery(this.query)
          .then((res) => {
            let data = res.rows.map((item) => {
              item.disabled = true
              return item
            })
            resolve(data)
          })
          .finally(() => {
            this.loading = false
          })
      } else if (node.level == 1) {
        console.log(node)
        listAddressQuery({ parentId: node.data.locationAddressId }).then((res) => {
          resolve(res.rows)
        })
      }
      resolve([])
    },
    load() {
      listAddressQuery(this.query).then((res) => {
        this.treeList = res.rows
      })
    },

    confirm() {
      let data = this.$refs.tree.getCheckedNodes()
      console.log(data)
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