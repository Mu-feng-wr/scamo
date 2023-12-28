<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.brandCode" size="small" placeholder="请输入品牌编号" clearable @keyup.enter.native="handleQuery" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.brandName" size="small" placeholder="请输入品牌名称" clearable @keyup.enter.native="handleQuery" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.shortName" size="small" placeholder="请输入品牌简称" clearable @keyup.enter.native="handleQuery" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.brandCompany" size="small" placeholder="请输入品牌公司" clearable @keyup.enter.native="handleQuery" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.status" size="small" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable @change="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <!-- <MoreQuery :filter-options="filterOptions" :form-data.sync="queryParams" @reload="load" /> -->
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding: 0">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['library:brand:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['library:brand:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              :row-config="{ isHover: true, isCurrent: true }"
              class="vxeTable"
            >
              <template #seqHeader>序号</template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['library:brand:list']" size="mini" type="text" @click="detailHandle(row.brandId)">查看</el-button>
                  <el-button v-hasPermi="['library:brand:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.brandId)">修改</el-button>
                  <el-button v-hasPermi="['library:brand:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listBrand, delBrand } from '@/api/brand.js'
import { listDictItems } from '@/api/base.js'
import vxeTable from '@/mixins/vxeTable'

export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      moreQueryParams: {},
      currentParams: {},
      tableColumn: [
        // { type: 'checkbox', width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'brandCode', title: '品牌编号', minWidth: 200, fixed: 'left', visible: true, visibleDisabled: true, showOverflow: true },
        { field: 'brandName', title: '品牌名称', minWidth: 180, fixed: 'left', visible: true, visibleDisabled: true, showOverflow: true },
        { field: 'shortName', title: '品牌简称', minWidth: 120, visible: true, showOverflow: true },
        { field: 'brandCompany', title: '品牌公司', minWidth: 120, visible: true, showOverflow: true },
        { field: 'remarks', title: '备注', minWidth: 200, visible: true, showOverflow: true },
        { field: 'updateDate', title: '更新时间', minWidth: 160, visible: true },
        { field: 'status', title: '状态', minWidth: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      queryParams: {},
      dictDataList: []
    }
  },
  created() {
    this.load()
    this.getSysDictionaryList()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.currentParams = {
        ...this.queryParams,
        ...this.moreQueryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    } /** 查询品牌信息列表 */,
    reload() {
      this.tableLoading = true
      listBrand(this.currentParams)
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
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status'
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/library/brand',
          module: 'Library',
          fullPath: '/library/brand/edit',
          title: '修改品牌',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/library/brand',
          module: 'Library',
          fullPath: '/library/brand/add',
          title: '新增品牌'
        })
      }
    },
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/library/brand',
        module: 'Library',
        fullPath: '/library/brand/detail',
        title: '品牌详情',
        condition: { id }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除品牌名称为"' + row.brandName + '"的数据项？', '', { type: 'warning' }).then(() => {
        delBrand(row.brandId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/library/brand/export',
        {
          ...this.queryParams
        },
        `品牌信息_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>