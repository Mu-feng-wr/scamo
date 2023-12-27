<template>
  <div class="card-container app-container">
    <el-container>
      <el-aside class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="categoryName" prefix-icon="el-icon-search" placeholder="请输入分类名称" size="small" clearable @change="changeInput" />
          </div>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="categoryTreeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <el-container class="pl-20">
          <el-header>
            <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
              <div class="flex">
                <div class="searchLeft">
                  <el-row :gutter="14">
                    <el-col :span="4">
                      <el-input v-model="queryParams.categoryCode" placeholder="请输入分类编号" size="small" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.categoryName" size="small" placeholder="请输入分类名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.parentCode" size="small" placeholder="请输入父分类编号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.status" size="small" placeholder="请输入父分类名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.centralizedBusinessId" size="small" base-code="System-status" placeholder="请选择状态" clearable @change="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-date-picker v-model="queryParams.updateDate" size="small" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择更新时间" @change="load" />
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
              >
                <template #seqHeader>序号</template>
                <template #categoryCode="{row}">
                  <el-link :underline="false" type="primary" @click="handleDetail(row.categoryId)">{{ row.categoryCode }}</el-link>
                </template>
                <template #status="{ row }">
                  <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                </template>
                <template #todo="{ row }">
                  <div class="todo">
                    <el-button v-hasPermi="['library:category:list']" size="small" type="text" @click="handleDetail(row.categoryId)">查看</el-button>
                    <el-button v-hasPermi="['library:category:edit']" size="mini" type="text" @click="handleUpdate(row.categoryId)">修改</el-button>
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
        </el-container>
      </el-main>
    </el-container>
    <edit v-if="editVisble" v-model="editVisble" :edit-id="editId" :dict-data-list="dictDataList" :category-list-options="categoryTreeList" @reload="reload" />
    <detail v-if="detailVisible" v-model="detailVisible" :edit-id="editId" :dict-data-list="dictDataList" />
  </div>
</template>
<script>
import { categoryTreeSelect, listCategory } from '@/api/category.js'
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
      treeLoading: false,
      categoryTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      categoryName: '',
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      filterOptions: [],
      tableColumn: [
        // { type: 'checkbox', width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'categoryCode', title: '分类编号', width: 200, fixed: 'left', visible: true, visibleDisabled: true, slots: { default: 'categoryCode' } },
        { field: 'categoryName', title: '分类名称', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'parentCode', title: '父分类编号', width: 120, visible: true },
        { field: 'parentName', title: '父分类名称', width: 120, visible: true },
        { field: 'parentCodes', title: '长分类编号', width: 200, visible: true },
        { field: 'sort', title: '排序', width: 80, visible: true },
        { field: 'remarks', title: '备注', width: 160, visible: true },
        { field: 'updateDate', title: '更新时间', width: 160, visible: true },
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
    this.init()
    this.getDictData()
    this.load()
  },
  methods: {
    init() {
      this.treeLoading = true
      categoryTreeSelect()
        .then((res) => {
          this.categoryTreeList = res.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
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
      listCategory(this.currentParams)
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
    handleNodeClick(data) {
      this.queryParams.parentIds = data.id
      this.load()
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    getDictData() {
      var dictCodes = 'System-status' // 状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 查看
    handleDetail(categoryId) {
      this.editId = categoryId
      this.detailVisible = true
    },
    // 新增  修改
    handleUpdate(categoryId) {
      this.editId = ''
      if (categoryId) {
        this.editId = categoryId
      }
      this.editVisble = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除物资分类信息编号为 "' + row.categoryCode + '"，名称为 "' + row.categoryName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delCategory(row.categoryId).then((res) => {
          this.$message.success('删除成功')
          this.reload()
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'library/category/export',
        {
          ...this.queryParams
        },
        `物资分类_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
<style lang="scss" scoped>
.aside {
  background: #fff;
  padding: 0;
}
.tree {
  height: calc(100% - 56px);
  overflow: auto;
}
</style>