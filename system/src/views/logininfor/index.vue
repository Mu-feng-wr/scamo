<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <el-row :gutter="14">
            <el-col :span="4">
              <el-input v-model="queryParams.ipaddr" size="small" placeholder="请输入登录地址" clearable @keyup.enter.native="load" />
            </el-col>
            <el-col :span="4">
              <el-input v-model="queryParams.userName" size="small" placeholder="请输入用户名称" clearable @keyup.enter.native="load" />
            </el-col>
            <el-col :span="4">
              <base-input size="small" :value.sync="queryParams.logStatusList" :options-list="dictDataList" base-code="SysLogininfor-status" placeholder="登录状态" clearable @change="load" />
            </el-col>
            <el-col :span="8">
              <input-range
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :start-value.sync="queryParams.accessTimeStart"
                :end-value.sync="queryParams.accessTimeEnd"
                start-placeholder="访问开始日期"
                end-placeholder="访问结束日期"
                @change="load"
              />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </SearchArea>
      </el-header>
      <el-main>
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['system:logininfor:remove']" type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean">清空</el-button>
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
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="SysLogininfor-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['system:logininfor:query']" size="mini" type="text" @click="handleUnlock(row)">解锁</el-button>
                  <el-button v-hasPermi="['system:logininfor:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listLogininfor, delLogininfor, cleanLogininfor, unlockLogininfor } from '@/api/logininfor.js'
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
        { field: 'infoId', title: '访问编号', fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'userName', title: '用户名称', fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'ipaddr', title: '地址', visible: true },
        { field: 'status', title: '登录状态', width: 120, visible: true, slots: { default: 'status' } },
        { field: 'msg', title: '描述', visible: true },
        { field: 'accessTime', title: '访问时间', width: 160, visible: true },
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
      listLogininfor(this.currentParams)
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
      this.$confirm('是否确认删除访问编号为"' + row.infoId + '"的数据项？').then(function () {
        delLogininfor(row.infoId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    getDictData() {
      var dictCodes = 'SysLogininfor-status' // 日志信息-登录状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleClean() {
      this.$confirm('是否确认清空所有登录日志数据项？').then(() => {
        cleanLogininfor().then(() => {
          this.reload()
          this.$message.success('清空成功')
        })
      })
    },
    /** 解锁按钮操作 */
    handleUnlock(row) {
      this.$confirm('是否确认解锁用户"' + row.username + '"数据项?').then(() => {
        unlockLogininfor(row.username).then(() => {
          this.$message.success('用户' + row.username + '解锁成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/system/logininfor/export',
        {
          ...this.queryParams
        },
        `logininfor_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>