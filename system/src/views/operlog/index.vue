<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.operName" size="small" placeholder="请输入用户姓名" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.title" size="small" placeholder="请输入模块名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.businessTypes"
                    :options-list="dictDataList"
                    base-code="SysOperLog-businessType"
                    placeholder="请选择操作类型"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.method" size="small" placeholder="请输入请求方法" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.operParam" size="small" placeholder="请输入请求参数" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.operIp" size="small" placeholder="请输入IP地址" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.macAddress" size="small" placeholder="请输入MAC地址" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.deviceType" size="small" placeholder="请输入终端类型" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.deviceVersion" size="small" placeholder="浏览器/终端版本" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.systemOperational" size="small" placeholder="请输入操作系统" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.provinceName" size="small" placeholder="请输入所属身份" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.cityName" size="small" placeholder="请输入所属城市" clearable @keyup.enter.native="load" />
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
      <el-main>
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['system:operlog:remove']" type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean">清空</el-button>
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
              <template #businessType="{row}">
                <dictDateView :value="row.businessType" :dict-data-list="dictDataList" dict-code="SysOperLog-businessType" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['system:operlog:query']" size="mini" type="text" @click="detailHandle(row.roleId)">查看</el-button>
                  <el-button v-hasPermi="['system:operlog:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listOperlog, delOperlog, cleanOperlog } from '@/api/operlog.js'
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
        { field: 'operName', title: '用户姓名', fixed: 'left', minWidth: 150, visible: true, visibleDisabled: true },
        { field: 'title', title: '模块名称', fixed: 'left', minWidth: 150, visible: true, visibleDisabled: true },
        { field: 'businessType', title: '操作', minWidth: 120, visible: true, slots: { default: 'businessType' } },
        { field: 'method', title: '请求方法', visible: true, minWidth: 120 },
        { field: 'operParam', title: '请求参数', visible: true, minWidth: 120 },
        { field: 'operIp', title: '主机', visible: true, minWidth: 120 },
        { field: 'macAddress', title: 'MAC地址', visible: true, minWidth: 120 },
        { field: 'deviceType', title: '终端类型', visible: true, minWidth: 120 },
        { field: 'deviceVersion', title: '浏览器/终端版本', visible: true, minWidth: 150 },
        { field: 'provinceName', title: '所属省份', visible: true, minWidth: 120 },
        { field: 'cityName', title: '所属城市', visible: true, minWidth: 120 },
        { field: 'operTime', title: '操作日期', visible: true, minWidth: 200 },
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
      listOperlog(this.currentParams)
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
      this.$confirm('是否确认删除日志编号为"' + row.operId + '"的数据项？').then(() => {
        delOperlog(row.operId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    getDictData() {
      var dictCodes = 'SysOperLog-businessType' // 操作日志业务类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项？').then(() => {
        cleanOperlog().then(() => {
          this.reload()
          this.$message.success('清空成功')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>