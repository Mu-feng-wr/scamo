<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" :show-toggle-btn="false" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.companyName" size="small" placeholder="请输入业务类型编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markLogo" size="small" placeholder="请输入业务类型名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.status" :options-list="dictDataList" size="small" base-code="System-status" placeholder="请选择状态" clearable @change="load" />
                </el-col>
                <el-col :span="12">
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
                <el-button v-hasPermi="['asset:borrow:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="handleUpdate()">新增</el-button>
                <el-button v-hasPermi="['asset:borrow:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              ref="multipleTable"
              v-loading="tableLoading"
              highlight-current-row
              height="auto"
              style="min-height: 500px"
              header-align="center"
              align="center"
              :data="tableData"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{ isHover: true, isCurrent: true }"
              class="vxeTable"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #businessCode="{row}">
                <el-link :underline="false" type="primary" @click="handleDetail(row.businessId)">{{ row.businessCode }}</el-link>
              </template>
              <template #status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template #todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['library:category:list']" size="small" type="text" @click="handleDetail(row.businessId)">查看</el-button>
                  <el-button v-hasPermi="['library:category:edit']" size="mini" type="text" @click="handleUpdate(row.businessId)">修改</el-button>
                  <el-button v-hasPermi="['library:category:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
    <edit v-if="editVisble" v-model="editVisble" :edit-id="editId" :dict-data-list="dictDataList" @reload="reload" />
    <detail v-if="detailVisible" v-model="detailVisible" :edit-id="editId" :dict-data-list="dictDataList" />
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
import { listType, delType } from '@/api/type.js'
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
      currentParams: {},
      queryParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'businessCode', title: '业务类型编号', visible: true, visibleDisabled: true, slots: { default: 'businessCode' } },
        { field: 'businessName', title: '业务类型名称', visible: true, visibleDisabled: true },
        { field: 'updateDate', title: '更新时间', visible: true },
        { field: 'status', title: '状态', width: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      dictDataList: [],
      editVisble: false,
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
      listType(this.currentParams)
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
    handleUpdate(id) {
      this.editId = id
      this.editVisble = true
    },
    handleDelete(row) {
      this.$confirm('是否确认删除业务名称为 "' + row.businessName + '" 的数据项？').then(function () {
        delType(row.businessId).then(() => {
          this.$message.success('删除成功')
          this.reload()
        })
      })
    },
    handleDetail(id) {
      this.editId = id
      this.detailVisible = true
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
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'library/type/export',
        {
          ...this.queryParams
        },
        `业务_${new Date().getTime()}.xlsx`
      )
    },
    getDictData() {
      var dictCodes = 'System-status' // 状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>

<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>