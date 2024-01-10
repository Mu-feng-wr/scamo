<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetBorrowCode" size="mini" placeholder="借用单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userName" size="mini" placeholder="使用人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userOrgName" size="mini" placeholder="使用部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.borrowReason" size="mini" placeholder="借用原因" clearable @keyup.enter.native="load" />
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
                <el-button v-hasPermi="['asset:borrow:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增应用</el-button>
                <!-- <el-button v-hasPermi="['asset:borrow:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button> -->
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

              <!-- <template #status="{row}">
                <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="handleStatusChange(row)"></el-switch>
              </template>-->
              <template v-slot:todo>
                <div class="todo">
                  <el-button size="mini" type="text">查看</el-button>
                  <el-button size="mini" type="text">修改</el-button>
                  <el-button size="mini" type="text">删除</el-button>
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
import { manageList } from '@/api/manage.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { showOverflow: true, visible: true, field: 'versionCode', title: '应用编码', width: 120, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'versionName', title: '应用名称', width: 240, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'versionTitle', title: '应用标题', width: 240, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'subTitle', title: '应用副标题', width: 240 },
        { showOverflow: true, visible: true, field: 'price', title: '应用价格', width: 120, formatter: 'formatMoney' },
        { showOverflow: true, visible: true, field: 'createBy', title: '创建人', width: 120 },
        { showOverflow: true, visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { showOverflow: true, visible: true, field: 'updateBy', title: '更新人', width: 120 },
        { showOverflow: true, visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 120, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', visibleDisabled: true }
      ]
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
    reload(loading = true) {
      this.tableLoading = loading
      manageList(this.currentParams)
        .then((res) => {
          this.tableData = res.data.list
          this.tablePage.total = res.data.currentPageTotalElements
        })
        .finally(() => {
          this.tableLoading = false
        })
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
    reset() {
      this.queryParams = {}
      this.load()
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>