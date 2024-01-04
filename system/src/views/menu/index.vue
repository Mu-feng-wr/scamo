<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.menuName" size="small" placeholder="请输入菜单名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.parentName" size="small" placeholder="请输入上级菜单名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.perms" size="small" placeholder="请输入授权标识" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.menuTypes" :options-list="dictDataList" size="small" base-code="SysMenu-menuType" placeholder="请选择菜单类型" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.ynHome" :options-list="dictDataList" size="small" base-code="SysMenu-ynHome" placeholder="是否显示首页" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.status" :options-list="dictDataList" size="small" base-code="System-status" placeholder="请选择状态" clearable @change="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" class="mt-10">
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
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['system:menu:add']">新增</el-button>
                <el-button plain icon="el-icon-upload2" size="mini" @click="handleExport" v-hasPermi="['system:menu:export']">导出</el-button>
                <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="load">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              ref="vxeTable"
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
              :tree-config="{}"
            >
              <template #menuName="{row}">
                <span>
                  <svg-icon :icon-class="row.icon" />
                  {{ row.menuName }}
                </span>
              </template>
              <template #ynHome="{row}">
                <dictDateView :value="row.ynHome" :dict-data-list="dictDataList" dict-code="SysMenu-ynHome" />
              </template>
              <template #menuType="{row}">
                <dictDateView :value="row.menuType" :dict-data-list="dictDataList" dict-code="SysMenu-menuType" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.roleId)" v-hasPermi="['system:role:query']">查看</el-button>
                  <el-button size="mini" type="text" @click="addOrUpdateHandle(row.roleId)" v-hasPermi="['system:role:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['system:role:remove']">删除</el-button>
                </div>
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
import { listMenu, delMenu } from '@/api/menu.js'
import { listDictItems } from '@/api/base.js'
import { handleTree } from '@/utils/index.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      tableColumn: [
        {
          field: 'menuName',
          title: '菜单名称',
          minWidth: 250,
          fixed: 'left',
          headerAlign: 'center',
          align: 'left',
          treeNode: true,
          visible: true,
          visibleDisabled: true,
          slots: { default: 'menuName' }
        },
        { field: 'parentName', title: '上级菜单', minWidth: 160, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'menuType', title: '菜单类型', minWidth: 160, visible: true, slots: { default: 'menuType' } },
        { field: 'enName', title: '英文名称', minWidth: 160, visible: true },
        { field: 'component', title: '菜单URL', minWidth: 160, visible: true },
        { field: 'perms', title: '授权标识', minWidth: 160, visible: true },
        { field: 'ynHome', title: '是否显示首页', minWidth: 160, visible: true, slots: { default: 'ynHome' } },
        { field: 'orderNum', title: '排序', minWidth: 160, visible: true },
        { field: 'remark', title: '备注', headerAlign: 'center', align: 'left', minWidth: 220, visible: true },
        { field: 'updateTime', title: '最后更新时间', minWidth: 160, visible: true },
        { field: 'status', title: '状态', minWidth: 120, visible: true, slots: { default: 'status' } },
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
      listMenu(this.currentParams)
        .then((res) => {
          this.tableData = handleTree(res.data, 'menuId')
          console.log(this.tableData)
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
    toggleExpandAll() {
      this.$refs.vxeTable.setAllTreeExpand(false)
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项？', '', { type: 'warning' }).then(() => {
        delMenu(row.menuId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',SysMenu-menuType' // 菜单类型
      dictCodes += ',SysMenu-ynHome' // 是否显示首页
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleExport() {
      this.download(
        '/system/menu/export',
        {
          ...this.queryParams
        },
        `menu_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>