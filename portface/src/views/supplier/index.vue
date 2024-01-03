<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.supplierCode" size="small" placeholder="请输入供应商编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.supplierName" size="small" placeholder="请输入供应商名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.dutyCode" size="small" placeholder="请输入营业执照号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.abbreviation" size="small" placeholder="请输入供应商简称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.companyIntroduction" size="small" placeholder="请输入供应商介绍" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.performance" size="small" placeholder="请输入业绩情况" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.companyProfile" size="small" placeholder="请输入公司概况" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.brandAdvantage" size="small" placeholder="请输入品牌优势" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.enterpriseChangeColumn" size="small" placeholder="请输入企业变更栏" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.enterprisesInformationColumn" size="small" placeholder="请输入企业信息栏" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.enterpriseLegal" size="small" placeholder="请输入企业法人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.contactUser" size="small" placeholder="请输入联系人" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filter-options="filterOptions" :form-data.sync="queryParams" label-width="140px" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['datac:supplier:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:supplier:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              show-header-overflow
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['datac:supplier:list']" size="small" type="text" @click="handleDetail(row.supplierId)">查看</el-button>
                  <el-button v-hasPermi="['datac:supplier:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.supplierId)">修改</el-button>
                  <el-button v-hasPermi="['datac:supplier:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listSupplier, delSupplier } from '@/api/supplier.js'
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
        { field: 'supplierCode', title: '供应商编号', minWidth: 150, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'supplierName', title: '供应商名称', minWidth: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'dutyCode', title: '营业执照号', minWidth: 180, visible: true, visibleDisabled: true },
        { field: 'provinceName', title: '库位地址', minWidth: 250, visible: true, slots: { default: 'address' } },
        { field: 'storageDate', title: '入库日期', minWidth: 130, visible: true },
        { field: 'updateDate', title: '更新时间', minWidth: 180, visible: true },
        { field: 'status', title: '状态', minWidth: 120, slots: { default: 'status' }, visible: true },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '联系电话：', type: 'input', placeholder: '请输入联系电话：', value: 'telephone' },
        { label: '曾用名：', type: 'input', placeholder: '请输入曾用名', value: 'nameUsedBefore' },
        { label: '纳税人类型：', type: 'baseInput', baseCode: 'MsSupplier-taxpayerType', options: this.dictDataList, placeholder: '请选择纳税人类型', value: 'taxpayerType' },
        { label: '经营类型：', type: 'baseInput', baseCode: 'MsSupplier-businessType', options: this.dictDataList, placeholder: '请选择经营类型', value: 'businessType' },
        { label: '是否推荐：', type: 'baseInput', baseCode: 'MsSupplier-ynRecommend', options: this.dictDataList, placeholder: '是否推荐', value: 'ynRecommend' },
        { label: '推荐入库单位名称：', type: 'input', placeholder: '请输入推荐入库单位名称', value: 'recommendeUnitName' },
        { label: '入库日期：', type: 'date', placeholder: '请选择入库日期', value: 'storageDate' },
        { label: '状态：', type: 'baseInput', baseCode: 'System-status', options: this.dictDataList, placeholder: '请输入状态', value: 'status' },
        { label: '地区：', type: 'area', placeholder: '请选择地区', value: 'area' }
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
      listSupplier(this.currentParams)
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
          path: '/portface/supplier',
          module: 'Portface',
          fullPath: '/portface/supplier/edit',
          title: '编辑供应商',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/portface/supplier',
          module: 'Portface',
          fullPath: '/portface/supplier/add',
          title: '新增供应商'
        })
      }
    },
    // 查看
    handleDetail(id) {
      window.$wujie.props.route({
        path: '/portface/supplier',
        module: 'Portface',
        fullPath: '/portface/supplier/detail',
        title: '供应商详情',
        condition: { id }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除供应商编号为 "' + row.supplierCode + '"，供应商名称为 "' + row.supplierName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delSupplier(row.supplierId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 获取字典表
    getDictData() {
      var dictCodes = 'System-status' // 系统状态
      dictCodes += ',MsSupplier-taxpayerType' // 纳税人类型
      dictCodes += ',MsSupplier-ynRecommend' // 是否推荐
      dictCodes += ',MsSupplier-businessType' // 经营类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'datac/supplier/export',
        {
          ...this.queryParams
        },
        `供应商细信息_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>