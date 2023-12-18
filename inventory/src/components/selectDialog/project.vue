<template>
  <vxe-modal v-model="dialogVisible" title="选择项目" width="70%" height="90%" esc-closable resize @hide="close">
    <el-container>
      <el-header style="overflow: hidden;">
        <el-row :gutter="14" class="mb-10">
          <el-col :span="4">
            <el-input v-model="queryParams.projectCode" size="mini" placeholder="请输入项目编号" clearable />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.projectName" size="mini" placeholder="请输入项目名称" clearable />
          </el-col>
          <el-col :span="4">
            <el-input v-model="queryParams.abbreviation" size="mini" placeholder="请输入建设单位" clearable />
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
          @cell-click="cellClick"
        >
          <template #seqHeader>序号</template>
          <template v-slot:focusType="{row}">
            <dictDateView :value="row.focusType" :dict-data-list="dictDataList" dict-code="PmProject-focusType" />
          </template>
        </vxe-grid>
      </el-main>
      <el-footer style="height:50px;">
        <div class="text-right pt-10">
          <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
          <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
        </div>
      </el-footer>
    </el-container>
  </vxe-modal>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listDictItems, listProjectQuery } from '@/api/base.js'
export default {
  name: 'Project',
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
      currentParams: {},
      dictDataList: []
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: this.selectType, width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 50, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'projectCode', title: '项目编号', width: 140 },
        { field: 'projectName', title: '项目名称', minWidth: 180 },
        { field: 'abbreviation', title: '项目简称', width: 120 },
        { field: 'address', title: '项目地址', width: 120 },
        { field: 'focusType', title: '项目类型', width: 180, slots: { default: 'focusType' } },
        { field: 'abbreviation', title: '建设单位', width: 180 },
        { field: 'resumpteTime', title: '开工报告批准时间', width: 180 }
      ]
    }
  },
  created() {
    this.dialogVisible = this.visible
    this.load()
    this.getDictData()
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
      listProjectQuery(this.currentParams)
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
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    confirm() {
      var data = ''
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
    getDictData() {
      var dictCodes = 'PmProject-focusType' // 项目类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
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