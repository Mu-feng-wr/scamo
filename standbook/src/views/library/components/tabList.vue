<template>
  <div class="mt-20">
    <el-tabs v-model="activeName">
      <template v-for="(item,i) in tabList">
        <el-tab-pane v-if="item.visible" :key="i" :label="item.label" :name="item.name" />
      </template>
    </el-tabs>
    <vxe-grid
      ref="xTable"
      v-loading="tableLoading"
      min-height="300px"
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
<script>
import vxeTable from '@/mixins/vxeTable'
export default {
  mixins: [vxeTable],
  props: {
    registerList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      activeName: 'application',
      currentParams: {}
    }
  },
  computed: {
    tabList() {
      return [
        { label: '申购', name: 'application', visible: true },
        { label: '采购', name: 'shipment', visible: true },
        { label: '入库', name: 'receipt', visible: true },
        { label: '领用', name: 'collect', visible: true },
        { label: '借用', name: 'borrow', visible: true },
        { label: '归还', name: 'return', visible: true },
        { label: '异动', name: 'reshuffle', visible: true },
        { label: '调拨', name: 'allocation', visible: true },
        { label: '维修', name: 'repair', visible: true },
        { label: '终结', name: 'scrap', visible: true },
        { label: '盘点', name: 'inventory', visible: true },
        { label: '变更', name: 'change', visible: true },
        { label: '折旧', name: 'depreciation', visible: true }
      ]
    },
    tableColumn() {
      return [
        { type: 'seq', width: 60, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { showOverflow: true, field: '', title: '申购单号', minWidth: 160 },
        { showOverflow: true, field: '', title: '申购日期', minWidth: 160 },
        { showOverflow: true, field: '', title: '业务类型', minWidth: 160 },
        { showOverflow: true, field: '', title: '申购原因', minWidth: 160 },
        { showOverflow: true, field: '', title: '申购原因', minWidth: 160 },
        { showOverflow: true, field: '', title: '申购金额', minWidth: 160 },
        { showOverflow: true, field: '', title: '申请人', minWidth: 160 },
        { showOverflow: true, field: '', title: '申请日期', minWidth: 160 },
        { showOverflow: true, field: '', title: '操作', minWidth: 160 }
      ]
    }
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.currentParams = {
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize
      }
    },
    reload() {}
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>