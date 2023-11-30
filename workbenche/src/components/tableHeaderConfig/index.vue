<template>
  <div class="table_header_config">
    <el-button size="mini" icon="el-icon-setting" @click="openDialog">表头配置</el-button>
    <el-dialog :visible.sync="open" append-to-body width="800px" title="表头配置">
      <vxe-grid
        max-height="600"
        header-align="center"
        align="center"
        :data="tableData"
        border
        :resizable="true"
        :columns="tableColumn"
        :row-config="{isHover:true,isCurrent:true}"
        class="vxeTable"
      >
        <template #seqHeader>序号</template>
        <template #visible_header="{column}">
          <div>
            {{ column.title }}
            <el-checkbox v-model="visible" :indeterminate="indeterminate" @change="change" />
          </div>
        </template>
        <template #visible="{row}">
          <el-checkbox v-model="row.visible" :disabled="row.visibleDisabled" @change="changeCheckBox" />
        </template>
        <template #fixed="{row}">
          <el-checkbox v-model="row.fixed" :disabled="row.visibleDisabled" true-label="left" false-label>左</el-checkbox>
          <el-checkbox v-model="row.fixed" :disabled="row.visibleDisabled" true-label="right" false-label>右</el-checkbox>
        </template>
      </vxe-grid>
      <div class="text-center mt-15">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'TableHeaderConfig',
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      open: false,
      tableData: [],
      visible: false,
      tableColumn: [
        { type: 'seq', width: 50, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'title', title: '列名', minWidth: 160, headerAlign: 'center', align: 'left' },
        { field: 'visible', title: '显示', width: 140, slots: { default: 'visible', header: 'visible_header' } },
        { field: 'fixed', title: '固定方式', width: 140, slots: { default: 'fixed' } }
      ]
    }
  },
  computed: {
    indeterminate() {
      return !this.visible
    }
  },
  created() {},
  methods: {
    getVisible() {
      var arr = this.tableData.filter((item) => {
        return item.visible != true
      })
      if (arr.length > 0) {
        this.visible = false
      } else {
        this.visible = true
      }
    },
    openDialog() {
      this.tableData = JSON.parse(
        JSON.stringify(
          this.columns.filter((item) => {
            return item.field && item.field != 'todo'
          })
        )
      )
      this.getVisible()
      this.open = true
    },
    cancel() {
      this.tableData = JSON.parse(
        JSON.stringify(
          this.columns.filter((item) => {
            return item.field && item.field != 'todo'
          })
        )
      )
      this.open = false
    },
    confirm() {
      var data = [...this.columns]
      this.tableData.forEach((item) => {
        var index = data.findIndex((temp) => {
          return temp.field == item.field
        })
        this.$set(data[index], 'visible', item.visible)
        this.$set(data[index], 'fixed', item.fixed)
      })
      this.$emit('update:columns', data)
      this.open = false
    },
    change(val) {
      this.tableData = this.tableData.map((item) => {
        if (!item.visibleDisabled) {
          item.visible = val
        }
        return item
      })
    },
    changeCheckBox() {
      this.getVisible()
    },
    reset() {
      var data = [...this.columns]
      data.forEach((item) => {
        if (!item.visibleDisabled && item.field != 'todo' && item.field) {
          item.visible = true
          item.fixed = ''
        }
        return item
      })
      this.$emit('update:columns', data)
      this.open = false
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
<style lang="scss" scoped>
.table_header_config {
  display: inline-block;
}
</style>
