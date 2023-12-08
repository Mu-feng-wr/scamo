<template>
  <div>
    <vxe-grid
      ref="xTable"
      v-loading="tableLoading"
      max-height="500px"
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
    </vxe-grid>
  </div>
</template>
<script >
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableLoading: false,
      tableColumn: [
        { type: 'seq', width: 60, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { showOverflow: true, field: '', title: '单据编号', minWidth: 160, fixed: 'left' },
        { showOverflow: true, field: '', title: '发起时间', minWidth: 160 },
        { showOverflow: true, field: '', title: '发起人', minWidth: 160 },
        { showOverflow: true, field: '', title: '发起人岗位', minWidth: 160 },
        { showOverflow: true, field: '', title: '发起部门', minWidth: 160 },
        { showOverflow: true, field: '', title: '发起原因', minWidth: 160 },
        { showOverflow: true, field: '', title: '资产数量', minWidth: 160 },
        { showOverflow: true, field: '', title: '数量单位', minWidth: 160 },
        { showOverflow: true, field: '', title: '流程通过日期', minWidth: 160 },
        { showOverflow: true, field: '', title: '审批人', minWidth: 160 },
        { showOverflow: true, field: '', title: '审批操作', minWidth: 160 },
        { showOverflow: true, field: '', title: '审批意见', minWidth: 160 }
      ]
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>