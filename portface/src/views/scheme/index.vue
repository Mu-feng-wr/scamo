<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.schemeCode" size="small" placeholder="请输入方案编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.schemeName" size="small" placeholder="请输入方案名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.approach" size="small" placeholder="请输入方案方式" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <InputRange
                    type="daterange"
                    size="small"
                    :start-value="queryParams.dateRangeQueryStart"
                    :end-value="queryParams.dateRangeQueryEnd"
                    value-format="yyyy-MM-dd"
                    start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.theme" size="small" placeholder="请输入方案主题" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.mark" size="small" placeholder="请输入方案目标" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.purpose" size="small" placeholder="请输入方案目的" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.output" size="small" placeholder="请输入预计产出" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.content" size="small" placeholder="请输入方案内容" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.companyName" size="small" placeholder="请输入公司名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.orgName" size="small" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.projectName" size="small" placeholder="请输入项目名称" clearable @keyup.enter.native="handleQuery" />
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
                <el-button v-hasPermi="['datac:project:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:project:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['datac:project:list']" size="small" type="text" @click="handleDetail(row.schemeId)">查看</el-button>
                  <el-button v-hasPermi="['datac:project:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.schemeId)">修改</el-button>
                  <el-button v-hasPermi="['datac:project:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listScheme, delScheme } from '@/api/scheme.js'
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
        { field: 'schemeCode', title: '方案编号', width: 150, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'schemeName', title: '方案名称', width: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'theme', title: '方案主题', width: 180, visible: true, visibleDisabled: true },
        { field: 'companyName', title: '公司名称', width: 250, visible: true },
        { field: 'orgName', title: '部门名称', width: 130, visible: true },
        { field: 'projectName', title: '项目名称', width: 180, visible: true },
        { field: 'purpose', title: '方案目的', width: 180, visible: true },
        { field: 'approach', title: '方案方式', width: 180, visible: true },
        { field: 'content', title: '方案内容', width: 180, visible: true },
        { field: 'startDate', title: '方案开始时间', width: 180, visible: true },
        { field: 'endDate', title: '方案结束时间', width: 180, visible: true },
        { field: 'mark', title: '方案目标', width: 180, visible: true },
        { field: 'fee', title: '预算费用(元)', width: 150, formatter: 'formatMoney', visible: true },
        { field: 'output', title: '预计产出', width: 150, formatter: 'formatMoney', visible: true },
        { field: 'remarks', title: '备注', width: 180, visible: true },
        { field: 'updateDate', title: '更新时间', width: 120, visible: true },
        { field: 'status', title: '状态', width: 120, slots: { default: 'status' }, visible: true },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '预计费用：', type: 'numberRange', placeholder: '请选择状态', value: 'status', valueStart: 'feeStart', valueEnd: 'feeEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'System-status', option: this.dictDataList, placeholder: '请选择状态', value: 'status' }
      ]
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
      listScheme(this.currentParams)
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
      if (id) {
        window.$wujie.props.route({
          path: '/portface/scheme',
          module: 'Portface',
          fullPath: '/portface/scheme/edit',
          title: '编辑方案',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/portface/scheme',
          module: 'Portface',
          fullPath: '/portface/scheme/add',
          title: '新增方案'
        })
      }
    },
    // 查看
    handleDetail(id) {
      window.$wujie.props.route({
        path: '/portface/scheme',
        module: 'Portface',
        fullPath: '/portface/scheme/detail',
        title: '方案详情',
        condition: { id }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除方案编号为 "' + row.schemeCode + '"，方案名称为"' + row.schemeName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delScheme(row.schemeId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 获取字典表
    getDictData() {
      var dictCodes = 'System-status' // 系统状态
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