<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetScrapCode" size="mini" placeholder="调拨单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="调拨原因" clearable @keyup.enter.native="load" />
                </el-col>
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
                  <base-input
                    size="mini"
                    :value.sync="queryParams.applicantCompanyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="申请公司"
                  />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.outCompanyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="调出公司"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.inCompanyId"
                    base-code="companyList"
                    resultlabel="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="调入公司"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.outProjectId" base-code="listProject" label-name="projectName" value-name="projectId" placeholder="调出项目" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.inProjectId" base-code="listProject" label-name="projectName" value-name="projectId" placeholder="调入项目" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.receiverId"
                    base-code="listUser"
                    :query="{pageNum: 1,pageSize: 1000000}"
                    label-name="userName"
                    value-name="userId"
                    placeholder="接收人"
                    clearable
                  />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" base-code="System-sourceTerminal" :value.sync="queryParams.sourceTerminal" placeholder="使用终端" clearable @change="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :form-data.sync="queryParams" :filter-options="filterOptions" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['asset:transfer:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增调拨</el-button>
                <el-button v-hasPermi="['asset:transfer:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
            >
              <template #seqHeader>序号</template>
              <template #assetTransferCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetTransferId)">{{ row.assetTransferCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetTransfer-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:transfer:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetTransferId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:transfer:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['asset:transfer:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:transfer:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:transfer:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:transfer:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:transfer:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listTransfer, getTotalAmount, delTransfer } from '@/api/transfer.js'
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
      footerTotal: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetTransferCode', title: '调拨单号', width: 160, fixed: 'left', visibleDisabled: true, slots: { default: 'assetTransferCode' } },
        { visible: true, field: 'transferDate', title: '调拨日期', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'receiverOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'outCompanyName', title: '调出公司', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'inCompanyName', title: '调入公司', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'transferReason', title: '调拨原因', width: 220, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'outProjectCode', title: '调出项目编号', width: 130 },
        { visible: true, field: 'outProjectName', title: '调出项目名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'inProjectCode', title: '调入项目编号', width: 130 },
        { visible: true, field: 'inProjectName', title: '调入项目名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createDate', title: '创建时间', width: 160 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 160 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },

        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' }, fixed: 'right' }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '调拨日期期间', type: 'daterange', valueStart: 'transferDateStart', valueEnd: 'transferDateEnd' },
        { label: '创建日期期间：', type: 'daterange', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetTransfer-status', options: this.dictDataList, placeholder: '请选择状态', value: 'status' }
      ]
    }
  },
  created() {
    if (window.$wujie) {
      window.$wujie.props.setFunc(this.reload)
    }
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
      listTransfer(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = res.total
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
    // 导出
    handleExport() {
      this.download(
        '/asset/transfer/export',
        {
          ...this.currentParams
        },
        `调拨单${new Date().getTime()}.xlsx`
      )
    },
    // 查看
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/asset/transfer',
        module: 'Asset',
        fullPath: '/asset/transfer/detail',
        title: '资产调拨详情',
        condition: { id }
      })
    },
    // 新增 编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/asset/transfer',
          module: 'Asset',
          fullPath: '/asset/transfer/edit',
          title: '编辑资产调拨',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/asset/transfer',
          module: 'Asset',
          fullPath: '/asset/transfer/add',
          title: '新增资产调拨'
        })
      }
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      var statusObj = {
        audit_superior: '审批',
        recall_add: '撤回',
        register_asset_admin: '登记',
        recall_superior: '撤回',
        invalid_add: '作废',
        user_confirm: '确认',
        recall_superior_asset_admin: '撤回'
      }
      window.$wujie.props.route({
        path: '/asset/transfer',
        module: 'Asset',
        fullPath: '/asset/transfer/edit',
        title: `资产调拨${statusObj[todo]}`,
        condition: { id: row.assetTransferId, todo: todo }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除调拨单信息编号为"' + row.assetTransferCode + '"的数据项？', '删除', { type: 'warning' }).then(() => {
        delTransfer(row.assetTransferId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, this.footerTotal, ['assetQuantity', 'assetAmount'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetTransfer-status' // 调拨状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>