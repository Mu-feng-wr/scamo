<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.configName" size="small" placeholder="请输入参数名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.configKey" size="small" placeholder="请输入参数键名" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.configType" size="small" placeholder="系统内置" clearable>
                    <el-option label="是" value="Y" />
                    <el-option label="否" value="N" />
                  </el-select>
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
                    @change="load"
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
                <el-button v-hasPermi="['system:config:add']" type="primary" plain size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['system:config:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
                <el-button v-hasPermi="['system:config:remove']" type="danger" plain icon="el-icon-refresh" size="mini" @click="handleRefreshCache">刷新缓存</el-button>
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
              <template #configType="{row}">
                <span v-if="row.configType=='Y'">是</span>
                <span v-if="row.configType=='N'">否</span>
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['system:config:query']" size="mini" type="text" @click="detailHandle(row.configId)">查看</el-button>
                  <el-button v-hasPermi="['system:config:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.configId)">修改</el-button>
                  <el-button v-hasPermi="['system:config:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listConfig, delConfig, refreshCache } from '@/api/config.js'
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
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'configId', title: '参数主键', minWidth: 120, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'configName', title: '参数名称', minWidth: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'configKey', title: '参数键名', minWidth: 200, visible: true },
        { field: 'configValue', title: '参数键值', minWidth: 200, visible: true },
        { field: 'configType', title: '系统内置', minWidth: 120, visible: true, slots: { default: 'configType' } },
        { field: 'remark', title: '备注', minWidth: 250, visible: true },
        { field: 'createTime', title: '创建时间', minWidth: 160, visible: true },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
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
    reload(loading = true) {
      this.tableLoading = loading
      listConfig(this.currentParams)
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
    addOrUpdateHandle(id) {
      this.editId = id
      this.editVisble = true
    },
    detailHandle(id) {
      this.editId = id
      this.detailVisible = true
    },
    handleDelete(row) {
      this.$confirm('是否确认删除参数编号为"' + row.configId + '"的数据项？').then(() => {
        delConfig(row.configId).then(() => {
          this.reload()
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
        'system/role/export',
        {
          ...this.queryParams
        },
        `role_${new Date().getTime()}.xlsx`
      )
    },
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$message.success('刷新成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>