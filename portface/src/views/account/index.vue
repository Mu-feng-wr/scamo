<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.companyCode" size="small" placeholder="请输入公司编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.companyName" size="small" placeholder="请输入公司名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.accountName" size="small" placeholder="请输入户名" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.accountNumber" size="small" placeholder="请输入账号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.depositBank" size="small" placeholder="请输入开户行" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.accountType"
                    :options-list="dictDataList"
                    base-code="FmBankAccount-accountType"
                    placeholder="请选择账户类型"
                    clearable
                    @change="load"
                  />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input size="small" :value.sync="queryParams.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" clearable @change="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['datac:account:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:account:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              <template #accountType="{row}">
                <dictDateView :value="row.accountType" :dict-data-list="dictDataList" dict-code="FmBankAccount-accountType" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['datac:account:list']" size="small" type="text" @click="handleDetail(row.accountId)">查看</el-button>
                  <el-button v-hasPermi="['datac:account:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.accountId)">修改</el-button>
                  <el-button v-hasPermi="['datac:account:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
    <edit v-if="editVisible" v-model="editVisible" :edit-id="editId" :dict-data-list="dictDataList" @reload="reload" />
    <detail v-if="detailVisible" v-model="detailVisible" :edit-id="editId" :dict-data-list="dictDataList" />
  </div>
</template>

<script>
import { listAccount, delAccount } from '@/api/account.js'
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
import edit from './components/edit.vue'
import detail from './components/detail.vue'
export default {
  components: {
    edit,
    detail
  },
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'companyCode', title: '公司编号', minWidth: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'companyName', title: '公司名称', minWidth: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'accountType', title: '账户类型', minWidth: 120, visible: true, slots: { default: 'accountType' } },
        { field: 'accountName', title: '户名', minWidth: 120, visible: true },
        { field: 'accountNumber', title: '账号', minWidth: 200, visible: true },
        { field: 'depositBank', title: '开户行', minWidth: 180, visible: true },
        { field: 'updateDate', title: '更新时间', minWidth: 160, visible: true },
        { field: 'status', title: '状态', minWidth: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      dictDataList: [],
      editVisible: false,
      detailVisible: false,
      editId: ''
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
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listAccount(this.currentParams)
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
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除账号为 "' + row.accountNumber + '" 户名为 "' + row.accountName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delAccount(row.accountId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 获取字典表
    getDictData() {
      let dictCodes = 'System-status' // 系统状态
      dictCodes += ',FmBankAccount-accountType' // 账户类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'datac/account/export',
        {
          ...this.queryParams
        },
        `银行账户_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>