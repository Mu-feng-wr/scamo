<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.phoneNumber" size="small" placeholder="请输入手机号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.reqNo" size="small" placeholder="请输入请求流水号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.feedbackEncod" size="small" placeholder="请输入反馈编码" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.feedbackVercod" size="small" placeholder="请输入反馈验证码" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.senderId" size="small" placeholder="请输入发送人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.sendDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择发送时间" size="small" @change="load" />
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
                <el-button v-hasPermi="['datac:consume:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:consume:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
                  <el-button v-hasPermi="['datac:consume:list']" size="small" type="text" @click="handleDetail(row.id)">查看</el-button>
                  <el-button v-hasPermi="['datac:consume:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.id)">修改</el-button>
                  <el-button v-hasPermi="['datac:consume:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listConsume, delConsume } from '@/api/consume.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'phoneNumber', title: '手机号', width: 200, visible: true },
        { field: 'reqNo', title: '请求流水号', width: 180, visible: true },
        { field: 'verifyCode', title: '验证码', width: 120, visible: true },
        { field: 'feedbackEncod', title: '反馈编码', width: 120, visible: true },
        { field: 'feedbackMsg', title: '反馈信息', width: 200, visible: true },
        { field: 'feedbackVercod', title: '反馈验证码', width: 180, visible: true },
        { field: 'errorMsg', title: '错误描述', width: 120, visible: true },
        { field: 'isPushAgain', title: '是否可再推送', width: 160, visible: true },
        { field: 'failureDuration', title: '失效时常', width: 120, visible: true },
        { field: 'senderId', title: '发送人', width: 120, visible: true },
        { field: 'sendDate', title: '发送时间', width: 120, visible: true },
        { field: 'businessModule', title: '业务模块', width: 120, visible: true },
        { field: 'consumeDate', title: '消费登记时间', width: 120, visible: true },
        { field: 'unifiedSystemNumber', title: '客户统一系统编号', width: 180, visible: true },
        { field: 'remarks', title: '备注', width: 120, visible: true },
        { field: 'status', title: '状态', width: 120, visible: true },
        { field: 'todo', title: '操作', width: 230, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      editVisible: false,
      detailVisible: false,
      editId: ''
    }
  },
  created() {
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
      listConsume(this.currentParams)
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
      const ids = row.id || this.ids
      this.$confirm('是否确认删除短信消费信息编号为"' + row.id + '"的数据项？', '', { type: 'warning' }).then(() => {
        delConsume(row.id).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
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