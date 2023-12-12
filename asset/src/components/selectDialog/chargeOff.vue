<template>
  <vxe-modal :title="title" v-model="dialogVisible" width="70%" height="90%" esc-closable resize @hide="close">
    <el-container>
      <el-header style="overflow:hidden;">
        <el-row :gutter="14" class="pb-10">
          <el-col :span="4">
            <el-input size="mini" v-model="queryParams.accountNumber" placeholder="请输入账号" clearable @keydown.enter="load" />
          </el-col>
          <el-col :span="4">
            <el-input size="mini" v-model="queryParams.accountName" placeholder="请输入户名" clearable @keydown.enter="load" />
          </el-col>
          <el-col :span="4">
            <el-input size="mini" v-model="queryParams.depositBank" placeholder="请输入开户行" clearable @keydown.enter="load" />
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
          <template v-slot:status="{ row }">
            <dictDateView :value="row.status" :dictDataList="dictDataList" dictCode="System-status" />
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
import { listDictItems, listAccountQuery } from '@/api/base.js'
export default {
  name: 'ChargeOff',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'radio' //radio单选   checkbox多选
    },
    title: {
      type: String,
      default: '选择出账公司'
    }
  },
  mixins: [vxeTable],
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
        { field: 'accountNumber', title: '账号', width: 140 },
        { field: 'accountName', title: '户名', minWidth: 180, headerAlign: 'center', align: 'center' },
        { field: 'depositBank', title: '开户行', width: 120 },
        { field: 'companyName', title: '公司名称', width: 200 },
        { field: '', title: '关联项目', width: 180, showOverflow: true },
        { field: 'status', title: '状态', minWidth: 180, headerAlign: 'center', align: 'center', showOverflow: true, slots: { default: 'status' } },
        { field: 'createBy', title: '创建人', width: 180 },
        { field: 'createDate', title: '创建日期', width: 180 }
      ]
    }
  },
  created() {
    this.dialogVisible = this.visible
    this.getDictData()
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
      listAccountQuery(this.currentParams)
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
    getDictData() {
      let dictCodes = 'System-status' //账号状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    cellClick({ row }) {
      if (this.selectType == 'radio') {
        this.$refs.xTable.setRadioRow(row, true)
      } else if (this.selectType == 'checkbox') {
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