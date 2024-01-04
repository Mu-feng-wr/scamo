<template>
  <div class="card-container app-container">
    <el-container>
      <el-aside class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="deptName" prefix-icon="el-icon-search" placeholder="请输入分类名称" size="small" clearable @change="changeInput" />
          </div>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="deptOption"
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
                      <el-input v-model="queryParams.code" placeholder="请输入组织编号" size="small" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.deptName" size="small" placeholder="请输入组织名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.parentCode" size="small" placeholder="请输入上级组织编号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.parentName" size="small" placeholder="请输入上级组织名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.orgType" size="small" base-code="SysDept-orgType" placeholder="请选择组织类型" clearable @change="load" />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.status" size="small" base-code="System-status" placeholder="请选择状态" clearable @change="load" />
                    </el-col>
                  </el-row>
                  <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                    <el-col :span="8">
                      <input-range
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :start-value.sync="queryParams.createDateStart"
                        :end-value.sync="queryParams.createDateEnd"
                        startPlaceholder="创建开始日期"
                        endPlaceholder="创建结束日期"
                        @change="load"
                      />
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
                    <el-button v-hasPermi="['system:dept:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="handleUpdate()">新建组织</el-button>
                    <el-button v-hasPermi="['system:dept:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
                  <template #orgType="{ row }">
                    <dictDateView :value="row.orgType" :dict-data-list="dictDataList" dict-code="SysDept-orgType" />
                  </template>
                  <template #status="{ row }">
                    <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                  </template>
                  <template #todo="{ row }">
                    <div class="todo">
                      <el-button v-hasPermi="['system:dept:query']" size="small" type="text" @click="handleDetail(row.deptId)">查看</el-button>
                      <el-button v-hasPermi="['system:dept:edit']" size="mini" type="text" @click="handleUpdate(row.deptId)">修改</el-button>
                      <el-button v-hasPermi="['system:dept:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
      </el-main>
    </el-container>
    <edit v-if="editVisble" v-model="editVisble" :edit-id="editId" :dict-data-list="dictDataList" @reload="reload" />
    <detail v-if="detailVisible" v-model="detailVisible" :edit-id="editId" :dict-data-list="dictDataList" />
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { listDept, delDept } from '@/api/dept.js'
import { deptTreeSelect, listDictItems } from '@/api/base.js'
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
      deptOption: [],
      deptName: '',
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      tableColumn: [
        // { type: "checkbox", width: 50, align: "center", fixed: "left" },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'code', title: '组织编号', width: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'deptName', title: '组织名称', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'parentCode', title: '上级组织编号', width: 120, visible: true },
        { field: 'parentName', title: '上级组织名称', width: 120, visible: true },
        { field: 'orgType', title: '组织类型', width: 200, visible: true, slots: { default: 'orgType' } },
        { field: 'orderNum', title: '排序', width: 80, visible: true },
        { field: 'remark', title: '备注', width: 180, visible: true },
        { field: 'status', title: '状态', width: 160, visible: true, slots: { default: 'status' } },
        { field: 'updateDate', title: '更新时间', width: 160, visible: true },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      dictDataList: [],
      editVisble: false,
      detailVisible: false,
      editId: ''
    }
  },
  created() {
    this.getDeptTree()
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
      listDept(this.currentParams)
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
    getDeptTree() {
      this.treeLoading = true
      deptTreeSelect()
        .then((response) => {
          this.deptOption = response.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',SysDept-orgType' // 组织类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.load()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    handleExport() {
      this.download(
        '/system/dept/export',
        {
          ...this.queryParams
        },
        `dept_${new Date().getTime()}.xlsx`
      )
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项？', '', { type: 'warning' }).then(() => {
        delDept(row.deptId).then(() => {
          this.$message.success('删除成功')
        })
      })
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