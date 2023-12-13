<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetBorrowCode" size="mini" placeholder="借用单号" clearable @keyup.enter.native="load" />
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
                    resultlabel="data"
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
                <el-button v-hasPermi="['asset:borrow:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增借用</el-button>
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
              :footer-method="getFooterData"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #assetBorrowCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetBorrowId)">{{ row.assetBorrowCode }}</el-link>
              </template>
              <template #useAreaName="{row}">{{ row.useAreaName }}{{ row.specificLocationName?'/'+row.specificLocationName:'' }}</template>
              <template #ynExpectReturn="{row}">
                <dictDateView :value="row.ynExpectReturn" :dict-data-list="dictDataList" dict-code="AlmAssetBorrow-ynExpectReturn" />
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetBorrow-borrowStatus" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetBorrowId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:borrow:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetBorrowId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:borrow:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['asset:borrow:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:borrow:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId) "
                    v-hasPermi="['asset:borrow:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:borrow:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='CONFIRM')" size="mini" type="text" @click="audit(row,'user_confirm')">确认</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='CONFIRM'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:collect:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior_asset_admin')"
                  >撤回</el-button>

                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:borrow:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listBorrow, delBorrow } from '@/api/borrow.js'
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
        { showOverflow: true, visible: true, field: 'assetBorrowCode', title: '借用单号', fixed: 'left', width: 140, visibleDisabled: true, slots: { default: 'assetBorrowCode' } },
        { showOverflow: true, visible: true, field: 'borrowDate', title: '借用日期', formatter: 'formatDate', fixed: 'left', width: 120, visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 120, visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'assetQuantity', title: '资产数量', headerAlign: 'center', align: 'right', formatter: 'formatMoney', width: 130 },
        { showOverflow: true, visible: true, field: 'assetAmount', title: '资产含税金额（元）', headerAlign: 'center', align: 'right', formatter: 'formatMoney', width: 150 },
        { showOverflow: true, visible: true, field: 'userName', title: '使用人', width: 120 },
        { showOverflow: true, visible: true, field: 'userOrgName', title: '使用部门', width: 160 },
        { showOverflow: true, visible: true, field: 'borrowReason', title: '借用原因', width: 220, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { showOverflow: true, visible: true, field: 'projectName', title: '项目名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { showOverflow: true, visible: true, field: 'schemeName', title: '方案名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'useAreaName', title: '使用区域', width: 170, slots: { default: 'useAreaName' }, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'ynExpectReturn', title: '是否需要归还', width: 130, slots: { default: 'ynExpectReturn' } },
        { showOverflow: true, visible: true, field: 'expectReturnDate', title: '预计归还日期', formatter: 'formatDate', width: 130 },
        { showOverflow: true, visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { showOverflow: true, visible: true, field: 'createDate', title: '创建时间', width: 130 },
        { showOverflow: true, visible: true, field: 'updateDate', title: '更新时间', width: 130 },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
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
    // 新增 || 编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/asset/borrow',
          module: 'Asset',
          fullPath: '/asset/borrow/edit',
          title: '编辑资产借用',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/asset/borrow',
          module: 'Asset',
          fullPath: '/asset/borrow/add',
          title: '新增资产借用'
        })
      }
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'borrow-borrowUpdate',
        query: {
          id: row.assetBorrowId,
          todo: todo
        }
      })
    },
    // 获取字典表
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetBorrow-borrowStatus' // 借用状态
      dictCodes += ',AlmAssetBorrow-ynExpectReturn' // 借用是否需要归还
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 查看详情
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/asset/borrow',
        module: 'Asset',
        fullPath: '/asset/borrow/detail',
        title: '资产领用详情',
        condition: { id }
      })
    },
    // 删除行
    handleDelete(row) {
      this.$confirm('是否确认删除资产借用单信息编号为"' + row.assetBorrowCode + '"的数据项？').then(() => {
        delBorrow(row.assetBorrowId).then(() => {
          this.reload()
          this.$message.success('删除成功！')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/asset/borrow/export',
        {
          ...this.queryParams
        },
        `borrow_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['assetQuantity', 'assetAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>