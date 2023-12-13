<template>
  <vxe-modal v-model="dialogVisible" type="modal" title="选择申购单" width="70%" height="90%" esc-closable resize @hide="close">
    <el-container>
      <el-header style="overflow:hidden;">
        <el-row :gutter="14" class="mb-10">
          <el-col :span="4">
            <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="请输入申购单号" clearable @keyup.enter.native="load" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.subscriptionReason" size="mini" placeholder="请输入申购原因" clearable @keyup.enter.native="load" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.applicantName" size="mini" placeholder="请输入申请人" clearable @keyup.enter.native="load" />
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
          border
          :resizable="true"
          :columns="tableColumn"
          :row-config="{isHover:true,isCurrent:true}"
          class="vxeTable"
          auto-resize
          show-overflow="tooltip"
          @checkbox-change="checkboxChange"
          @cell-click="cellClick"
        >
          <template #seqHeader>序号</template>
          <template #pager>
            <el-pagination
              background
              :current-page="tablePage.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="tablePage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tablePage.total"
              @size-change="handlePageChange($event,'pageSize')"
              @current-change="handlePageChange($event,'currentPage')"
            />
          </template>
        </vxe-grid>
      </el-main>
      <el-footer style="height:32px;">
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
import { listApplicationQuery } from '@/api/base'
export default {
  name: 'PurchaseApplication',
  mixins: [vxeTable],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'radio'
    },
    query: {
      type: Array,
      default: () => {
        return []
      }
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
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'purchaseApplicationCode', title: '申购编号', minWidth: 140 },
        { field: 'subscriptionDate', title: '申购日期', minWidth: 180 },
        { field: 'centralizedBusinessName', title: '业务类型', minWidth: 120 },
        { field: 'subscriptionReason', title: '申购原因', minWidth: 220, headerAlign: 'center', align: 'left' },
        { field: 'subscriptionTaxAmount', title: '申购金额', minWidth: 120 },
        { field: 'applicantName', title: '申请人', minWidth: 180 },
        { field: 'createDate', title: '创建日期', minWidth: 180 }
      ]
    }
  },
  created() {
    this.dialogVisible = this.visible
    this.load()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      var query = {}
      this.query.forEach((item) => {
        query[item.label] = item.value
      })
      this.currentParams = {
        ...query,
        ...this.queryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listApplicationQuery(this.currentParams)
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
    handlePageChange(value, type) {
      if (type == 'currentPage') {
        this.tablePage.currentPage = value
      }
      if (type == 'pageSize') {
        this.tablePage.pageSize = value
      }
      // 触发列表请求
      this.load()
    },
    checkboxChange(val) {},
    confirm() {
      var rowData = this.$refs.xTable.getRadioRecord()
      if (rowData.length <= 0) {
        this.$modal.msgWarning('请选择数据')
        return
      }
      this.$emit('confirm', rowData)
      this.close()
    },
    cellClick({ row }) {
      if (this.selectType == 'radio') {
        this.$refs.xTable.setRadioRow(row, true)
      } else if (this.selectType == 'checkbox ') {
        this.$refs.xTable.setCheckboxRow(row, true)
      }
    },
    close() {
      this.$emit('update:visible', false)
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