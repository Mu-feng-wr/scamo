<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetScrapCode" size="mini" placeholder="终结单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorName" size="mini" placeholder="终结人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorOrgName" size="mini" placeholder="终结部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.scrapReason" size="mini" placeholder="终结原因" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    base-code="listType"
                    label-name="businessName"
                    value-name="businessId"
                    placeholder="业务归口类型"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.supplierId" size="mini" base-code="listSupplier" label-name="supplierName" value-name="supplierId" placeholder="供应商" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.sourceTerminal" size="mini" base-code="System-sourceTerminal" placeholder="使用终端" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.status" size="mini" base-code="AlmAssetScrap-status" :options-list="dictDataList" placeholder="状态" clearable @change="load" />
                </el-col>
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :start-value.sync="queryParams.scrapDateStart"
                    :end-value.sync="queryParams.scrapDateEnd"
                    start-placeholder="终结日期开始"
                    end-placeholder="终结日期结束"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    clearable
                    @change="load"
                  />
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
                <el-button v-hasPermi="['asset:scrap:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增处置</el-button>
                <el-button v-hasPermi="['asset:scrap:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              show-footer
              stripe
              highlight-current-row
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
            >
              <template #seqHeader>序号</template>
              <template #assetScrapCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetScrapId)">{{ row.assetScrapCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetScrap-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetScrapId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:return:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetScrapId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:scrap:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['asset:scrap:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:scrap:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:scrap:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:scrap:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:return:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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

      <!-- <Print ref="printRef" v-if="printVisible"></Print> -->
    </el-container>
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listScrap, delScrap } from '@/api/scrap.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      printVisible: false,
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetScrapCode', title: '终结单号', width: 150, visibleDisabled: true, fixed: 'left', slots: { default: 'assetScrapCode' } },
        { visible: true, field: 'scrapDate', title: '终结日期', width: 130, visibleDisabled: true, fixed: 'left' },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', visibleDisabled: true, width: 130, fixed: 'left' },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'terminatorName', title: '终结人', width: 130 },
        { visible: true, field: 'terminatorOrgName', title: '终结部门', width: 130 },
        { visible: true, field: 'scrapReason', title: '终结原因', width: 220, headerAlign: 'center', align: 'left' },
        {
          visible: true,
          field: 'totalRecovereResidualValue',
          title: '累计回收残值金额（元）',
          width: 180,
          headerAlign: 'center',
          align: 'right',
          formatter: 'formatMoney'
        },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'maintainerCompanyName', title: '回收供应商', width: 130 },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        // {  visible: true, field: 'createDate', title: '创建时间', width: 130 },
        // {  visible: true, field: 'updateDate', title: '更新时间', width: 130 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' }, fixed: 'right' }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '创建日期期间：', type: 'daterange', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' }
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
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listScrap(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
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
    // 导出
    handleExport() {
      this.download(
        '/asset/scrap/export',
        {
          ...this.currentParams
        },
        `终结单${new Date().getTime()}.xlsx`
      )
    },
    // 查看
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/asset/scrap',
        module: 'Asset',
        fullPath: '/asset/scrap/detail',
        title: '资产处置详情',
        condition: { id }
      })
    },
    // 新增 编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/asset/scrap',
          module: 'Asset',
          fullPath: '/asset/scrap/edit',
          title: '编辑资产处置',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/asset/scrap',
          module: 'Asset',
          fullPath: '/asset/scrap/add',
          title: '新增资产处置'
        })
      }
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'scrap-scrapUpdate',
        query: {
          id: row.assetScrapId,
          todo: todo
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除终结单信息编号为"' + row.assetScrapCode + '"的数据项？', '删除', { type: 'warning' }).then(() => {
        delScrap(row.assetScrapId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['assetQuantity', 'assetAmount', 'totalRecovereResidualValue'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetScrap-status' // 终结状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>