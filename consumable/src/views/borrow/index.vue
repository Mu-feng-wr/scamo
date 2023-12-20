<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.consumableBorrowCode" size="mini" placeholder="借用单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userName" size="mini" placeholder="使用人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userOrgName" size="mini" placeholder="使用部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.borrowReason" size="mini" placeholder="借用原因" clearable @keyup.enter.native="load" />
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
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.accepterOrgId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="使用公司"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.companyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="申请公司"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.projectId"
                    base-code="listProject"
                    label-name="projectName"
                    value-name="projectId"
                    placeholder="项目名称"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.schemeId"
                    base-code="listScheme"
                    label-name="schemeName"
                    value-name="schemeId"
                    placeholder="方案名称"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" base-code="System-sourceTerminal" placeholder="使用终端" clearable @change="load" />
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
                <el-button v-hasPermi="['consume:borrow:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增借用</el-button>
                <el-button v-hasPermi="['consume:borrow:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              :pager-config="tablePage"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              show-footer
              :footer-method="getFooterData"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #consumableBorrowCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.consumableBorrowId)">{{ row.consumableBorrowCode }}</el-link>
              </template>
              <template #useAreaName="{row}">{{ row.useAreaName }}{{ row.specificLocationName?'/'+row.specificLocationName:'' }}</template>
              <template #ynExpectReturn="{row}">
                <dictDateView :value="row.ynExpectReturn" :dict-data-list="dictDataList" dict-code="AlmAssetBorrow-ynExpectReturn" />
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-ist="dictDataList" dict-code="AlmAssetBorrow-borrowStatus" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.consumableBorrowId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['consume:borrow:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.consumableBorrowId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['consume:borrow:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['consume:borrow:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['consume:borrow:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId) "
                    v-hasPermi="['consume:borrow:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['consume:borrow:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'CONFIRM')"
                    size="mini"
                    type="text"
                    @click="audit(row,'user_confirm')"
                  >确认</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO && row.assetReviewAuditVO.processId == 'CONFIRM'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:collect:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior_asset_admin')"
                  >撤回</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['consume:borrow:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listBorrow, getTotalAmount, delBorrow } from '@/api/borrow.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      printVisible: false,
      showAllSearch: false,
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        {
          visible: true,
          field: 'consumableBorrowCode',
          title: '借用单号',
          fixed: 'left',
          width: 140,
          visibleDisabled: true,
          slots: { default: 'consumableBorrowCode' }
        },
        { visible: true, field: 'borrowDate', title: '借用日期', formatter: 'formatDate', fixed: 'left', width: 120, visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 120, visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'consumableQuantity', title: '耗材数量', headerAlign: 'center', align: 'right', formatter: ['formatMoney', 3], width: 130 },
        { visible: true, field: 'consumableAmount', title: '耗材含税金额（元）', headerAlign: 'center', align: 'right', formatter: 'formatMoney', width: 150 },
        { visible: true, field: 'userName', title: '使用人', width: 120 },
        { visible: true, field: 'userOrgName', title: '使用部门', width: 160 },
        { visible: true, field: 'borrowReason', title: '借用原因', width: 200 },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'useAreaName', title: '使用区域', width: 170, slots: { default: 'useAreaName' }, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'ynExpectReturn', title: '是否需要归还', width: 130, slots: { default: 'ynExpectReturn' } },
        { visible: true, field: 'expectReturnDate', title: '预计归还日期', formatter: 'formatDate', width: 130 },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createDate', title: '创建时间', width: 130 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 130 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 200, fixed: 'right', slots: { default: 'todo' } }
      ],
      filterOptions: [
        { label: '借用日期期间：', type: 'daterange', placeholder: '请输入借用日期期间', valueStart: 'borrowDateStart', valueEnd: 'borrowDateEnd' },
        { label: '预计归还日期期间：', type: 'daterange', placeholder: '请输入预计归还日期期间', valueStart: 'expectReturnDateStart', valueEnd: 'expectReturnDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '请输入创建日期期间', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '请输入更新日期期间', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetBorrow-borrowStatus', options: this.dictDataList, placeholder: '请输入状态', value: 'status' }
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
        ...this.moreQueryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listBorrow(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
        })
        .finally(() => {
          this.tableLoading = false
        })
      getTotalAmount(this.currentParams).then((res) => {
        this.footerTotal = res.data
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
      this.$router.push({
        name: id ? 'consumableBorrow-borrowUpdate' : 'consumableBorrow-borrowAdd',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'consumableBorrow-borrowUpdate',
        query: {
          id: row.consumableBorrowId,
          todo: todo
        }
      })
    },
    // 获取字典表
    getDictData() {
      var dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetBorrow-borrowStatus' // 借用状态
      dictCodes += ',AlmAssetBorrow-ynExpectReturn' // 借用是否需要归还
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    detailHandle(id) {
      this.$router.push({
        name: 'consumableBorrow-borrowDetail',
        query: {
          id: id
        }
      })
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除资产借用单信息编号为"' + row.consumableBorrowCode + '"的数据项？').then(() => {
        delBorrow(row.consumableBorrowId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/consume/borrow/export',
        {
          ...this.currentParams
        },
        `borrow_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      var obj = {
        consumableQuantity: 3,
        consumableAmount: 2
      }
      return this.footerMethod(columns, data, this.footerTotal, obj)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
