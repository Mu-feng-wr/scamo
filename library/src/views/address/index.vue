<template>
  <div class="card-container app-container">
    <el-container>
      <el-aside class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="address" prefix-icon="el-icon-search" placeholder="请输入库位地址" size="small" clearable @change="changeInput" />
          </div>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="addressList"
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
                      <el-input v-model="queryParams.locationCode" placeholder="请输入地址编码" size="small" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.locationName" size="small" placeholder="请输入地址名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.companyName" size="small" placeholder="请输入所属公司名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.projectName" size="small" placeholder="请输入所属项目名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.locationType" size="small" base-code="StlLocationAddress-locationType" placeholder="请选择地址类型" clearable @change="load" />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.ynPublic" size="small" base-code="StlLocationAddress-ynPublic" placeholder="请选择是否公开" clearable @change="load" />
                    </el-col>
                  </el-row>
                  <el-row v-if="showAllSearch" class="mt-10" :gutter="14">
                    <el-col :span="8">
                      <el-cascader
                        ref="addressChoose"
                        v-model="queryParams.address"
                        :options="cityOptions"
                        size="small"
                        filterable
                        clearable
                        placeholder="请选择城市"
                        @change="handleAddressChange"
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
                  <template #categoryCode="{row}">
                    <el-link :underline="false" type="primary" @click="handleDetail(row.locationAddressId)">{{ row.categoryCode }}</el-link>
                  </template>
                  <template #locationType="{row}">
                    <dictDateView :value="row.locationType" :dict-data-list="dictDataList" dict-code="StlLocationAddress-locationType" />
                  </template>
                  <template #ynPublic="{row}">
                    <dictDateView :value="row.ynPublic" :dict-data-list="dictDataList" dict-code="StlLocationAddress-ynPublic" />
                  </template>
                  <template #address="row">{{ row.provinceName }}{{ row.cityName }}{{ row.districtCountyName }}{{ row.address }}</template>
                  <template #status="{ row }">
                    <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                  </template>
                  <template #todo="{ row }">
                    <div class="todo">
                      <el-button v-hasPermi="['library:category:list']" size="small" type="text" @click="handleDetail(row.locationAddressId)">查看</el-button>
                      <el-button v-hasPermi="['library:category:edit']" size="mini" type="text" @click="handleUpdate(row.locationAddressId)">修改</el-button>
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
import { listAddress, delAddress } from '@/api/address.js'
import { addressTreeSelect, listDictItems } from '@/api/base.js'
import { regionData } from 'element-china-area-data'
import vxeTable from '@/mixins/vxeTable'
export default {
  mixins: [vxeTable],
  data() {
    return {
      cityOptions: regionData,
      address: '',
      treeLoading: false,
      addressList: [],
      showAllSearch: false,
      dictDataList: [],
      currentParams: '',
      queryParams: {},
      tableColumn: [
        // { type: 'checkbox', width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'locationCode', title: '地址编号', width: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'locationName', title: '地址名称', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'parentCode', title: '父地址编号', width: 120, visible: true },
        { field: 'parentName', title: '父地址名称', width: 120, visible: true },
        { field: 'locationType', title: '地址类型', width: 200, visible: true, slots: { default: 'locationType' } },
        { field: 'ynPublic', title: '是否公开', width: 180, visible: true, showOverflw: true, slots: { default: 'ynPublic' } },
        { field: 'companyName', title: '所属公司名称', width: 120, visible: true },
        { field: 'projectName', title: '所属项目名称', width: 120, visible: true },
        { field: 'provinceName', title: '地址', width: 120, visible: true, slots: { default: 'address' } },
        { field: 'longitude', title: '经度', width: 160, visible: true },
        { field: 'latitude', title: '纬度', width: 160, visible: true },
        { field: 'remarks', title: '备注', width: 160, visible: true },
        { field: 'updateDate', title: '更新时间', width: 160, visible: true },
        { field: 'status', title: '状态', width: 120, visible: true, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  created() {
    this.getAddressTree()
    this.getSysDictionaryList()
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
        ...this.moreQueryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listAddress(this.queryParams)
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
    handleDelete(row) {
      this.$confirm('是否确认删除库位编号为 "' + row.locationCode + '"，库位名称为 "' + row.locationName + '"的数据项？', '', { type: 'warning' }).then(function () {
        delAddress(row.locationAddressId).then(() => {
          this.$message.success('删除成功')
          this.reload()
        })
      })
    },
    getAddressTree() {
      this.treeLoading = true
      addressTreeSelect()
        .then((res) => {
          this.addressList = res.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleUpdate(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/library/address',
          module: 'Library',
          fullPath: '/library/address/edit',
          title: '修改库位',
          condition: { id }
        })
        return
      }
      window.$wujie.props.route({
        path: '/library/address',
        module: 'Library',
        fullPath: '/library/address/add',
        title: '新增库位'
      })
    },
    handleDetail(id) {
      window.$wujie.props.route({
        path: '/library/address',
        module: 'Library',
        fullPath: '/library/address/detail',
        title: '库位详情',
        condition: { id }
      })
    },
    handleNodeClick(data) {
      this.queryParams.parentIds = data.id
      this.load()
    },
    getSysDictionaryList() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',StlLocationAddress-locationType' // 地址类型
      dictCodes += ',StlLocationAddress-ynPublic' // 是否公开
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleAddressChange(value) {
      this.queryParams.provinceId = value ? value[0] : ''
      this.queryParams.cityId = value ? value[1] : ''
      this.queryParams.districtCountyId = value ? value[2] : ''
    },
    handleExport() {
      this.download(
        'library/address/export',
        {
          ...this.queryParams
        },
        `库位地址_${new Date().getTime()}.xlsx`
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