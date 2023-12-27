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
                      <el-input v-model="queryParams.materialCode" size="small" placeholder="请输入物资编号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.materialName" size="small" placeholder="请输入物资名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-tree-select
                        ref="treeSelect"
                        v-model="queryParams.categoryId"
                        :props="{label:'categoryName'}"
                        size="small"
                        node-key="id"
                        :data="categoryOptions"
                        filterable
                        @node-click="load"
                      />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.sn" size="small" placeholder="请输入序列号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.unitName" placeholder="请输入计量单位" clearable @keyup.enter.native="handleQuery" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.modelType" size="small" placeholder="请输入规格型号" clearable @keyup.enter.native="load" />
                    </el-col>
                  </el-row>
                  <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                    <el-col :span="4">
                      <base-input base-code="StlMaterial-ynPublic" :options-list="dictDataList" size="small" :value.sync="queryParams.ynPublic" placeholder="是否公开" />
                    </el-col>
                    <el-col :span="4">
                      <base-input base-code="StlMaterial-ynInviteTender" :options-list="dictDataList" size="small" :value.sync="queryParams.ynPublic" placeholder="是否招标" />
                    </el-col>
                    <el-col :span="4">
                      <base-input base-code="StlMaterial-materialType" :options-list="dictDataList" size="small" :value.sync="queryParams.materialType" placeholder="物资类型" />
                    </el-col>
                    <el-col :span="4">
                      <base-input
                        base-code="listType"
                        size="small"
                        :value.sync="queryParams.centralizedBusinessId"
                        label-name="businessName"
                        value-name="businessId"
                        placeholder="请选择业务归口"
                      />
                    </el-col>
                    <el-col :span="4">
                      <base-input base-code="listBrand" size="small" :value.sync="queryParams.brandId" label-name="brandName" value-name="brandId" placeholder="请选择品牌" />
                    </el-col>
                    <el-col :span="4">
                      <base-input base-code="StlMaterial-shelfStatus" :options-list="dictDataList" size="small" :value.sync="queryParams.shelfStatus" placeholder="请选择上架状态" />
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
                  <template #materialCode="{row}">
                    <el-link :underline="false" type="primary" @click="handleDetail(row.materialId)">{{ row.materialCode }}</el-link>
                  </template>
                  <template #ynPublic="{row}">
                    <dictDateView :value="row.ynPublic" :dict-data-list="dictDataList" dict-code="StlMaterial-ynPublic" />
                  </template>
                  <template #ynInviteTender="{row}">
                    <dictDateView :value="row.ynInviteTender" :dict-data-list="dictDataList" dict-code="StlMaterial-ynInviteTender" />
                  </template>
                  <template #materialType="{row}">
                    <dictDateView :value="row.materialType" :dict-data-list="dictDataList" dict-code="StlMaterial-ynInviteTender" />
                  </template>
                  <template #shelfStatus="{row}">
                    <dictDateView :value="row.shelfStatus" :dict-data-list="dictDataList" dict-code="StlMaterial-shelfStatus" />
                  </template>
                  <template #status="{row}">
                    <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                  </template>
                  <template #todo="{ row }">
                    <div class="todo">
                      <el-button v-hasPermi="['library:category:list']" size="small" type="text" @click="handleDetail(row.materialId)">查看</el-button>
                      <el-button v-hasPermi="['library:category:edit']" size="mini" type="text" @click="handleUpdate(row.materialId)">修改</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { categoryTreeSelect, listCategoryQuery } from '@/api/category.js'
import { handleTree } from '@/utils/index.js'
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
import { listMaterial, delMaterial } from '@/api/material.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      categoryName: '',
      treeLoading: false,
      categoryTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      categoryOptions: [],
      dictDataList: [],
      currentParams: {},
      queryParams: {},
      filterOptions: [{ label: '状态：', type: 'baseInput', optionsList: this.dictDataList, baseCode: 'System-status', placeholder: '请选择状态', value: 'status' }],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'materialCode', title: '物资编号', width: 200, fixed: 'left', visible: true, visibleDisabled: true, slots: { default: 'materialCode' } },
        { field: 'materialName', title: '物资名称', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'categoryCode', title: '分类编号', width: 120, visible: true },
        { field: 'categoryName', title: '分类名称', width: 120, visible: true },
        { field: 'sn', title: '序列号', width: 200, visible: true },
        { field: 'modelType', title: '规格型号', width: 180, visible: true, showOverflw: true },
        { field: 'brandName', title: '品牌', width: 120, visible: true },
        { field: 'color', title: '颜色', width: 120, visible: true },
        { field: 'unitName', title: '计量单位', width: 120, visible: true },
        { field: 'alterUnitName', title: '换算单位', width: 160, visible: true },
        { field: 'alterUnitNum', title: '换算数量', width: 160, visible: true },
        { field: 'price', title: '单价（元）', width: 160, visible: true, formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 160, visible: true },
        { field: 'taxValue', title: '税额（元）', width: 160, visible: true, formatter: 'formatMoney' },
        { field: 'ynPublic', title: '是否公开', width: 160, visible: true, slots: { default: 'ynPublic' } },
        { field: 'ynInviteTender', title: '是否招标', width: 160, visible: true, slots: { default: 'ynInviteTender' } },
        { field: 'materialType', title: '物资类型', width: 160, visible: true, slots: { default: 'materialType' } },
        { field: 'deadStorage', title: '备用库存', width: 160, visible: true, formatter: 'formatMoney' },
        { field: 'centralizedBusinessName', title: '业务归口', width: 160, visible: true },
        { field: 'shelfStatus', title: '上架状态', width: 160, visible: true, slots: { default: 'shelfStatus' } },
        { field: 'status', title: '状态', width: 160, visible: true, slots: { default: 'status' } },
        { field: 'updateDate', title: '更新时间', width: 160, visible: true },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  created() {
    this.getDictData()
    this.init()
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
      listCategoryQuery().then((res) => {
        this.categoryOptions = handleTree(res.rows, 'categoryId')
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
      listMaterial(this.currentParams)
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    handleNodeClick() {},
    // 新增||修改
    handleUpdate(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/library/material',
          module: 'Library',
          fullPath: '/library/material/edit',
          title: '修改物资',
          condition: { id }
        })
        return
      }
      window.$wujie.props.route({
        path: '/library/material',
        module: 'Library',
        fullPath: '/library/material/add',
        title: '新增物资'
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除物资编号为 "' + row.materialCode + '"，物资名称为"' + row.materialName + '"的数据项？').then(() => {
        delMaterial(row.materialId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    handleDetail(id) {
      window.$wujie.props.route({
        path: '/library/material',
        module: 'Library',
        fullPath: '/library/material/detail',
        title: '物资详情',
        condition: { id }
      })
    },
    getDictData() {
      var dictCodes = 'StlMaterial-ynPublic' // 是否公开
      dictCodes += ',StlMaterial-ynInviteTender' // 是否招标
      dictCodes += ',StlMaterial-materialType' // 物资类型
      dictCodes += ',StlMaterial-shelfStatus' // 上架状态
      dictCodes += ',System-status' // 状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/library/material/export', { ...this.queryParams }, `物资基础_${new Date().getTime()}.xlsx`)
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