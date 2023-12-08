<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :showAllSearch.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.assetBorrowCode" placeholder="借用单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.userName" placeholder="使用人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.userOrgName" placeholder="使用部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantName" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantOrgName" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.borrowReason" placeholder="借用原因" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    baseCode="listType"
                    labelName="businessName"
                    valueName="businessId"
                    placeholder="业务归口类型"
                    clearable
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.accepterOrgId"
                    baseCode="companyList"
                    resultLabel="data"
                    labelName="deptName"
                    valueName="deptId"
                    placeholder="使用公司"
                    clearable
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.companyId"
                    baseCode="companyList"
                    resultLabel="data"
                    labelName="deptName"
                    valueName="deptId"
                    placeholder="申请公司"
                    clearable
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.projectId"
                    baseCode="listProject"
                    labelName="projectName"
                    valueName="projectId"
                    placeholder="项目名称"
                    clearable
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" baseCode="listScheme" labelName="schemeName" valueName="schemeId" placeholder="方案名称" clearable @change="load"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" baseCode="System-sourceTerminal" placeholder="使用终端" clearable @change="load"></base-input>
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filterOptions="filterOptions" :formData.sync="queryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['asset:borrow:add']" @click="addOrUpdateHandle()">新增借用</el-button>
                <el-button plain icon="el-icon-upload2" size="mini" v-hasPermi="['asset:borrow:export']" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              height="auto"
              v-loading="tableLoading"
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
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #assetBorrowCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetBorrowId)">{{ row.assetBorrowCode }}</el-link>
              </template>
              <template #useAreaName="{row}">{{ row.useAreaName }}{{ row.specificLocationName?'/'+row.specificLocationName:'' }}</template>
              <template #ynExpectReturn="{row}">
                <dictDateView :value="row.ynExpectReturn" :dictDataList="dictDataList" dictCode="AlmAssetBorrow-ynExpectReturn" />
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dictDataList="dictDataList" dictCode="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dictDataList="dictDataList" dictCode="AlmAssetBorrow-borrowStatus" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetBorrowId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" size="mini" type="text" @click="addOrUpdateHandle(row.assetBorrowId)" v-hasPermi="['asset:borrow:edit']">修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                    v-hasPermi="['asset:borrow:audit']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                  >审批</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                    v-hasPermi="['asset:borrow:recall']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                  >撤回</el-button>

                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                    v-hasPermi="['asset:borrow:register']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                  >登记</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                    v-hasPermi="['asset:borrow:recall']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId) "
                  >撤回</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                    v-hasPermi="['asset:borrow:invalid']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                  >作废</el-button>
                  <el-button size="mini" type="text" @click="audit(row,'user_confirm')" v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='CONFIRM')">确认</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior_asset_admin')"
                    v-hasPermi="['asset:collect:recall']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='CONFIRM'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                  >撤回</el-button>

                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['asset:borrow:remove']" v-if="row.status == 0 || row.status == 3 || row.status == 4">删除</el-button>
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
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    // 新增 || 编辑
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'borrow-borrowUpdate' : 'borrow-borrowAdd',
        query: {
          id: id
        }
      })
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
      let dictCodes = 'System-sourceTerminal' //来源终端
      dictCodes += ',AlmAssetBorrow-borrowStatus' //借用状态
      dictCodes += ',AlmAssetBorrow-ynExpectReturn' //借用是否需要归还
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 查看详情
    detailHandle(id) {
      this.$router.push({
        name: 'borrow-borrowDetail',
        query: {
          id: id
        }
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