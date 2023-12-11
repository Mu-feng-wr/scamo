<template>
  <div>
    <vxe-grid
      height="100"
      max-height="500"
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
      <template v-slot:curProcessResult="{ row }">
        <span>{{ curProcessResultObj[row.curProcessResult] }}</span>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
export default {
  name: 'HandleRecords',
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
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', slots: { header: 'seqHeader' } },
        { showOverflow: true, field: 'curProcessStepName', title: '步骤名称', minWidth: 160 },
        { showOverflow: true, field: 'curProcessResult', title: '处理状态', minWidth: 160, slots: { default: 'curProcessResult' } },
        { showOverflow: true, field: 'curProcessOptions', title: '处理意见', minWidth: 160, headerAlign: 'center', align: 'left' },
        { showOverflow: true, field: 'curProcessorName', title: '处理人', minWidth: 160 },
        { showOverflow: true, field: 'curOrgName', title: '处理部门', minWidth: 160 },
        { showOverflow: true, field: 'curProcessDate', title: '处理时间', minWidth: 160 },
        { showOverflow: true, field: 'deliveryDate', title: '送到时间', minWidth: 160 }
      ],
      curProcessResultObj: {
        1: '通过',
        2: '退回',
        3: '转发',
        4: '撤回',
        5: '作废',
        6: '发起'
      }
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>