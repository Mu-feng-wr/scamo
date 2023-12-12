<template>
  <vxe-modal v-model="dialogVisible" title="选择合同" width="70%" height="90%" esc-closable resize @hide="close">
    <el-container>
      <el-header style="overflow:hidden;">
        <el-row :gutter="14" class="mb-10">
          <el-col :span="4">
            <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="请输入合同编号" clearable />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.subscriptionReason" size="mini" placeholder="请输入合同名称" clearable />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.applicantName" size="mini" placeholder="请输入甲方" clearable />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="load">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <vxe-grid
          ref="xTable"
          height="auto"
          :loading="tableLoading"
          header-align="center"
          align="center"
          :data="tableData"
          :pager-config="tablePage"
          border
          :resizable="true"
          :columns="tableColumn"
          :row-config="{isHover:true,isCurrent:true}"
          class="vxeTable"
          @page-change="handlePageChange"
          @cell-click="cellClick"
        >
          <template #seqHeader>序号</template>
        </vxe-grid>
      </el-main>
      <el-footer style="height:35px;">
        <div class="text-right">
          <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
          <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
        </div>
      </el-footer>
    </el-container>
  </vxe-modal>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listContractQuery } from '@/api/base.js'
export default {
  name: 'Contract',
  mixins: [vxeTable],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'radio'
    }
  },
  data() {
    return {
      queryParams: {},
      dialogVisible: false,
      currentParams: {}
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: this.selectType, width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 50, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'contractCode', title: '合同编号', width: 140 },
        { field: 'contractName', title: '合同名称', width: 180, showOverflow: true },
        { field: 'typeName', title: '合同类型', width: 120 },
        { field: 'saleUnitName', title: '甲方', minWidth: 180, showOverflow: true },
        { field: 'tradeUnitName', title: '乙方', minWidth: 180, showOverflow: true },
        { field: 'totalAmount', title: '签订金额', width: 180 },
        { field: 'signDate', title: '签订日期', width: 180 }
      ]
    }
  },
  mounted() {
    this.dialogVisible = this.visible
    this.tableLoading = true
    this.load()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.currentParams = {
        ...this.queryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listContractQuery(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    reset() {
      this.queryParams = {}
      this.load()
    },
    handlePageChange({ currentPage, pageSize }) {
      debugger
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    confirm() {
      let data = ''
      if (this.selectType == 'radio') {
        data = this.$refs.xTable.getRadioRecord()
        if (!data) {
          this.$modal.msgWarning('请选择数据')
          return
        }
      } else if (this.selectType == 'checkbox') {
        data = this.$refs.xTable.getCheckboxRecords()
        if (!data) {
          this.$modal.msgWarning('至少选择一条数据')
          return
        }
      }
      this.$emit('confirm', data)
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    },
    cellClick({ row }) {
      if (this.selectType == 'radio') {
        this.$refs.xTable.setRadioRow(row, true)
      } else if (this.selectType == 'checkbox ') {
        this.$refs.xTable.setCheckboxRow(row, true)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
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