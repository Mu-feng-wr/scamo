<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.taskCode" size="mini" placeholder="盘点任务单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.taskTitle" size="mini" placeholder="盘点标题" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.planCode" size="mini" placeholder="盘点单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markType" size="mini" placeholder="盘点目标类型" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markObjectName" size="mini" placeholder="盘点目标对象名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.responsiblerName" size="mini" placeholder="责任人" clearable />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.responsiblerOrgName" size="mini" placeholder="责任部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.assistanterNames" size="mini" placeholder="助理人名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.planReason" size="mini" placeholder="计划原因" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.releaserName" size="mini" placeholder="下达人姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.releaserOrgName" size="mini" placeholder="下达部门名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.unifiedSystemNumber" size="mini" placeholder="客户统一系统编号" clearable />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filter-options="filterOptions" :form-data.sync="moreQueryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增盘点任务</el-button>
                <el-button v-hasPermi="['asset:receipt:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              <template v-slot:accepterMethod="{ row }">
                <dictDateView :value="row.accepterMethod" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-accepterMethod" />
              </template>
              <template v-slot:assetSource="{ row }">
                <dictDateView :value="row.assetSource" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-assetSource" />
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetReceiptId)">查看</el-button>
                  <el-button v-if="row.status == 0" v-hasPermi="['asset:receipt:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetReceiptId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:receipt:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:receipt:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:receipt:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION') && row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:receipt:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:receipt:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:receipt:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listTask, delTask } from '@/api/task.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },

        { showOverflow: true, visible: true, field: 'taskCode', title: '任务单号', width: 130, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'taskTitle', title: '盘点标题', width: 130, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'planYear', title: '计划年月', width: 130 },
        { showOverflow: true, visible: true, field: 'centralizedBusinessName', title: '业务归口', width: 130 },
        { showOverflow: true, visible: true, field: 'markType', title: '盘点目标类型', width: 130 },
        { showOverflow: true, visible: true, field: 'markObjectName', title: '盘点目标对象名称', width: 160 },
        { showOverflow: true, visible: true, field: 'planCode', title: '盘点单号', width: 130 },
        { showOverflow: true, visible: true, field: 'responsiblerName', title: '责任人', width: 130 },
        { showOverflow: true, visible: true, field: 'responsiblerOrgName', title: '责任部门', width: 130 },
        { showOverflow: true, visible: true, field: 'assistanterNames', title: '助理人名称', width: 130 },
        { showOverflow: true, visible: true, field: 'cycleInventory', title: '盘点周期', width: 130 },
        { showOverflow: true, visible: true, field: 'coverageRange', title: '覆盖范围', width: 130 },
        { showOverflow: true, visible: true, field: 'coverageDate', title: '覆盖数据', width: 130 },
        { showOverflow: true, visible: true, field: 'ynSelfInventory', title: '是否自盘', width: 130 },
        { showOverflow: true, visible: true, field: 'offereQuantity', title: '应盘数量', width: 130 },
        { showOverflow: true, visible: true, field: 'firmQuantity', title: '实盘数量', width: 130 },
        { showOverflow: true, visible: true, field: 'unscheduleQuantity', title: '未盘数量', width: 130 },
        { showOverflow: true, visible: true, field: 'inventoryQuantity', title: '盘点总数', width: 130 },
        { showOverflow: true, visible: true, field: 'quantityUnit', title: '数量单位', width: 130 },
        { showOverflow: true, visible: true, field: 'offereAssetTotalAmount', title: '盘点总金额（元）', width: 160 },
        { showOverflow: true, visible: true, field: 'startDate', title: '开始日期', width: 130 },
        { showOverflow: true, visible: true, field: 'endDate', title: '结束日期', width: 130 },
        { showOverflow: true, visible: true, field: 'planReason', title: '盘点原因', width: 130 },
        { showOverflow: true, visible: true, field: 'releaserName', title: '下达人', width: 130 },
        { showOverflow: true, visible: true, field: 'releaserOrgName', title: '下达部门', width: 130 },
        { showOverflow: true, visible: true, field: 'releaseDate', title: '下达日期', width: 130 },
        { showOverflow: true, visible: true, field: 'completerName', title: '完成人', width: 130 },
        { showOverflow: true, visible: true, field: 'completerOrgName', title: '完成部门', width: 130 },
        { showOverflow: true, visible: true, field: 'completeDate', title: '完成日期', width: 130 },
        { showOverflow: true, visible: true, field: 'createBy', title: '创建人', width: 130 },
        { showOverflow: true, visible: true, field: 'createDate', title: '创建时间', width: 130 },
        { showOverflow: true, visible: true, field: 'updateBy', title: '更新人', width: 130 },
        { showOverflow: true, visible: true, field: 'updateDate', title: '更新时间', width: 130 },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 130 },

        { field: 'todo', title: '操作', width: 200, align: 'center', fixed: 'right', slots: { default: 'todo' }, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        {
          label: '业务归口名称：',
          type: 'baseInput',
          baseCode: 'listType',
          labelName: 'businessName',
          valueName: 'businessId',
          placeholder: '业务归口名称',
          value: 'centralizedBusinessId'
        },
        { label: '计划年份：', type: 'year', placeholder: '计划年份', value: 'plan_year' },
        { label: '计划月份：', type: 'month', placeholder: '计划月份', value: 'plan_month' },
        { label: '盘点周期：', type: 'baseInput', baseCode: 'ImInventoryPlan-cycleInventory', value: 'cycle_inventory' },
        { label: '执行日期期间：', type: 'daterange', valueStart: 'startDate', valueEnd: 'endDate' },
        { label: '覆盖范围：', type: 'baseInput', baseCode: 'ImInventoryPlan-coverageRange', value: 'coverageRange' },
        { label: '覆盖数据：', type: 'baseInput', baseCode: 'listType', value: 'coverageDate' },
        { label: '资产状态：', type: 'baseInput', baseCode: 'ImInventoryPlan-assetStatus', value: 'assetStatus' },
        { label: '是否自盘：', type: 'baseInput', baseCode: 'ImInventoryPlan-ynSelfInventory', value: 'ynSelfInventory' },
        { label: '下达日期期间：', type: 'daterange', valueStart: 'releaseDateStart', valueEnd: 'releaseDateEnd' },
        { label: '完成日期期间：', type: 'daterange', valueStart: 'completeDateStart', valueEnd: 'completeDateEnd' },
        { label: '创建时间期间：', type: 'daterange', valueStart: 'createDateStart', valueEnd: 'createDateStart' }
      ]
    }
  },
  created() {
    this.load()
    this.getDictData()
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
      listTask(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    getDictData() {
      let dictCodes = 'AlmAssetReceipt-accepterMethod' // 入库方式
      dictCodes += ',AlmAssetReceipt-assetSource' // 资产来源
      dictCodes += ',System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetReceipt-status' // 入库状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    reset() {
      this.queryParams = {}
      this.load()
    },
    detailHandle(id) {
      this.$router.push({
        name: 'task-taskDetail',
        query: {
          id: id
        }
      })
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
    // 新增 编辑
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'task-taskUpdate' : 'task-taskAdd',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'receipt-receiptUpdate',
        query: {
          id: row.assetReceiptId,
          todo: todo
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$modal.confirm('是否确认删除盘点任务信息任务单号为"' + row.taskCode + '"的数据项？').then(() => {
        delTask(row.taskId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/inventory/task/export',
        {
          ...this.currentParams
        },
        `task_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['receiptQuantity', 'receiptExcTaxAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

