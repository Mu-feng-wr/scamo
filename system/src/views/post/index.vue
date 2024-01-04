<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.roleName" size="small" placeholder="请输入岗位编码" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.postName" size="small" placeholder="请输入岗位名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="small" :value.sync="queryParams.status" base-code="System-status" placeholder="岗位状态" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <input-range
                    type="daterange"
                    size="small"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :start-value.sync="queryParams.createDateStart"
                    :end-value.sync="queryParams.createDateEnd"
                    start-placeholder="创建开始日期"
                    end-placeholder="创建结束日期"
                  />
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main>
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['system:post:add']" type="primary" plain size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['system:post:export']" type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="load">刷新</el-button>
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
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['system:post:query']" size="mini" type="text" @click="detailHandle(row.postId)">查看</el-button>
                  <el-button v-hasPermi="['system:post:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.postId)">修改</el-button>
                  <el-button v-hasPermi="['system:post:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listPost, delPost } from '@/api/post.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'postCode', title: '岗位编码', fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'postName', title: '岗位名称', fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'postSort', title: '排序', visible: true },
        { field: 'remark', title: '备注', visible: true },
        { field: 'createTime', title: '创建时间', width: 160, visible: true },
        { field: 'status', title: '状态', width: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      dictDataList: []
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
    reload(loading = true) {
      this.tableLoading = loading
      listPost(this.currentParams)
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
    handleDelete(row) {
      this.$confirm('是否确认删除岗位编号为"' + row.postId + '"的数据项？').then(() => {
        delPost(row.postId).then(() => {
          this.getList()
          this.$message.success('删除成功')
        })
      })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleExport() {
      this.download(
        '/system/post/export',
        {
          ...this.queryParams
        },
        `post_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>