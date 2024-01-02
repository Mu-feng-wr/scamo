<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.contractCode" size="small" placeholder="请输入合同编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.reqNo" size="small" placeholder="请输入合同名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.feedbackEncod" size="small" placeholder="请输入甲方名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.feedbackVercod" size="small" placeholder="请输入合同类型" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.senderId" size="small" placeholder="请输入丙方名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.tradeUnitName" size="small" placeholder="请输入丁方名称" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.content" size="small" placeholder="请输入合同内容" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.signDate" size="small" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择签订日期" @change="load" />
                </el-col>
                <el-col :span="4">
                  <InputRange
                    type="daterange"
                    size="small"
                    :start-value="queryParams.dateRangeQueryStart"
                    :end-alue="queryParams.dateRangeQueryEnd"
                    valueFormat="yyyy-Mm-dd"
                    start-placeholder="请选择有效开始时间"
                    end-placeholder="请选择有效结束时间"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input size="small" :value.sync="queryParams.settingMethod" base-code="CmContract-settingMethod" placeholder="请选择结算方式" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="small" :value.sync="queryParams.procurementMethod" base-code="CmContract-procurementMethod" placeholder="请选择采购方式" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="small" :value.sync="queryParams.invoiceType" base-code="CmContract-invoiceType" placeholder="请选择发票类型" clearable @change="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filter-options="filterOptions" :form-data.sync="queryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['datac:contract:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:contract:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              v-loading="tableLoading"
              height="auto"
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
            >
              <template #seqHeader>序号</template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="CmContract-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['datac:contract:list']" size="small" type="text" @click="handleDetail(row.id)">查看</el-button>
                  <el-button v-hasPermi="['datac:contract:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.id)">修改</el-button>
                  <el-button v-hasPermi="['datac:contract:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
                </div>
              </template>
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
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { listContract, delContract } from '@/api/contract.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'contractCode', title: '合同编号', minWidth: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'contractName', title: '合同名称', minWidth: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'typeName', title: '合同类型', minWidth: 120, visible: true },
        { field: 'purchaseUnitName', title: '采购单位名称', minWidth: 120, visible: true },
        { field: 'saleUnitName', title: '供应商单位名称', minWidth: 200, visible: true },
        { field: 'totalPrice', title: '合同造价(元)', minWidth: 180, visible: true, formatter: 'formatMoney' },
        { field: 'signDate', title: '签订日期', minWidth: 120, visible: true },
        { field: 'updateDate', title: '更新时间', minWidth: 160, visible: true },
        { field: 'status', title: '状态', minWidth: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 230, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [{ label: '状态：', type: 'baseInput', baseCode: 'CmContract-status', options: this.dictDataList, placeholder: '请输入状态', value: 'status' }]
    }
  },
  created() {
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
        ...{ pageNum: this.tablePage.currentPage, pageSize: this.tablePage.pageSize }
      }
    },
    reload() {
      this.tableLoading = true
      listContract(this.currentParams)
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
    // 新增||编辑
    addOrUpdateHandle(id) {
      this.editId = id
      this.editVisible = true
    },
    // 查看
    handleDetail(id) {
      this.editId = id
      this.detailVisible = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除合同编号为 "' + row.contractCode + '"，合同名称为 "' + row.contractName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delContract(row.contractId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 获取字典表
    getDictData() {
      var dictCodes = 'CmContract-status' // 状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'datac/consume/export',
        {
          ...this.queryParams
        },
        `consume_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>