<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :showAllSearch.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.planCode" placeholder="盘点单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.planTitle" placeholder="盘点标题" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantName" placeholder="申请人姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantOrgName" placeholder="申请部门名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantCompanyName" placeholder="申请公司名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.reporterOrgName" placeholder="部门名称" clearable />
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.releaserName" placeholder="下达人姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.releaserOrgName" placeholder="下达部门名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.reporterName" placeholder="盘点报告人姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.completerName" placeholder="完成人姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.completerOrgName" placeholder="完成部门名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.planReason" placeholder="计划原因" clearable />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filterOptions="filterOptions" labelWidth="150px" :formData.sync="moreQueryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['inventory:plan:add']" @click="addOrUpdateHandle()">新增盘点计划</el-button>
                <el-button plain icon="el-icon-upload2" size="mini" v-hasPermi="['inventory:plan:export']" @click="handleExport">导出</el-button>
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
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #planCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.inventoryPlanId)">{{ row.planCode }}</el-link>
              </template>
              <template #cycleInventory="{row}">
                <dictDateView :value="row.cycleInventory" :dictDataList="dictDataList" dictCode="ImInventoryPlan-cycleInventory" />
              </template>
              <template #coverageRange="{row}">
                <dictDateView :value="row.coverageRange" :dictDataList="dictDataList" dictCode="ImInventoryPlan-coverageRange" />
              </template>
              <template #coverageDate="{row}">
                <dictDateView :value="row.coverageDate" :dictDataList="typeList" labelName="businessName" valueName="businessId" />
              </template>
              <template #ynSelfInventory="{row}">
                <dictDateView :value="row.ynSelfInventory" :dictDataList="dictDataList" dictCode="ImInventoryPlan-ynSelfInventory" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dictDataList="dictDataList" dictCode="ImInventoryPlan-assetStatus" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.inventoryPlanId)">查看</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3" size="mini" type="text" @click="addOrUpdateHandle(row.inventoryPlanId)" v-hasPermi="['inventory:plan:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="audit(row,'audit_superior')" v-hasPermi="['inventory:plan:audit']" v-if="row.status == 2  && !row.reviewBy">审批</el-button>
                  <el-button size="mini" type="text" @click="audit(row,'register_asset_admin')" v-hasPermi="['inventory:plan:register']" v-if="row.status == 2  && row.reviewBy">登记</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                    v-hasPermi="['inventory:plan:recall']"
                    v-if="row.status == 2  && !row.reviewBy && row.applicantId == $store.state.user.info.userId"
                  >撤回</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                    v-hasPermi="['inventory:plan:recall']"
                    v-if="row.status == 2  && !row.registerId && row.reviewBy == $store.state.user.info.userId"
                  >撤回</el-button>
                  <el-button size="mini" type="text" @click="audit(row,'invalid_add')" v-hasPermi="['inventory:plan:invalid']" v-if="row.status == 2  && !row.registerId">作废</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['inventory:plan:remove']" v-if="row.status == 0 || row.status == 3 || row.status == 4">删除</el-button>
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
    <router-view></router-view>
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listPlan, delPlan } from '@/api/plan.js'
import { listTypeQuery, listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      dictDataList: [],
      typeList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'planCode', title: '盘点单号', width: 130, fixed: 'left', visibleDisabled: true, slots: { default: 'planCode' } },
        { visible: true, field: 'planTitle', title: '盘点标题', width: 220, fixed: 'left', visibleDisabled: true, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'planYear', title: '计划年月', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务归口', width: 130 },
        { visible: true, field: 'parentCode', title: '父盘点单号', width: 130 },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 130 },
        { visible: true, field: 'responsiblerName', title: '责任人', width: 130 },
        { visible: true, field: 'responsiblerOrgName', title: '责任部门', width: 130 },
        { visible: true, field: 'cycleInventory', title: '盘点周期', width: 130, slots: { default: 'cycleInventory' } },
        { visible: true, field: 'coverageRange', title: '覆盖范围', width: 130, slots: { default: 'coverageRange' } },
        { visible: true, field: 'coverageDate', title: '覆盖数据', width: 130, slots: { default: 'coverageDate' } },
        { visible: true, field: 'ynSelfInventory', title: '是否自盘', width: 130, slots: { default: 'ynSelfInventory' } },
        { visible: true, field: 'offereQuantity', title: '应盘数量', width: 130, headerAlign: 'center', align: 'right', formatter: ['formatMoney', 3] },
        { visible: true, field: '', title: '实盘数量', width: 130 },
        { visible: true, field: '', title: '未盘数量', width: 130 },
        { visible: true, field: '', title: '盘点总数', width: 130 },
        { visible: true, field: '', title: '数量单位', width: 130 },
        { visible: true, field: 'offereAssetTotalAmount', title: '盘点总金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'startDate', title: '开始日期', width: 130 },
        { visible: true, field: 'endDate', title: '结束日期', width: 130 },
        { visible: true, field: 'planReason', title: '盘点原因', width: 220, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'releaserName', title: '下达人', width: 130 },
        { visible: true, field: 'releaserOrgName', title: '下达部门', width: 130 },
        { visible: true, field: 'releaseDate', title: '下达日期', width: 130 },
        { visible: true, field: 'completerName', title: '完成人', width: 130 },
        { visible: true, field: 'completerOrgName', title: '完成部门', width: 130 },
        { visible: true, field: 'completeDate', title: '完成日期', width: 130 },
        { visible: true, field: '', title: '是否完成报告', width: 130 },
        { visible: true, field: '', title: '完成报告日期', width: 130 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '客户统一系统编号：', type: 'input', value: 'unifiedSystemNumber', placeholder: '客户统一系统编号' },
        { label: '业务归口名称：', type: 'baseInput', baseCode: 'listType', labelName: 'businessName', valueName: 'businessId', value: 'centralizedBusinessId' },
        { label: '申请日期：', type: 'date', value: 'applicantDate' },
        { label: '计划年份：', type: 'year', value: 'planYear' },
        { label: '计划月份：', type: 'month', value: 'planMonth' },
        { label: '盘点周期：', type: 'baseInput', baseCode: 'ImInventoryPlan-cycleInventory', value: 'cycleInventory' },
        { label: '执行日期期间：', type: 'daterange', valueStart: 'startDate', valueEnd: 'endDate' },
        { label: '覆盖范围：', type: 'baseInput', baseCode: 'ImInventoryPlan-coverageRange', value: 'coverageRange' },
        { label: '覆盖数据：', type: 'baseInput', baseCode: 'listType', value: 'coverageDate' },
        { label: '资产状态：', type: 'baseInput', baseCode: 'ImInventoryPlan-assetStatus', value: 'asset_status' },
        { label: '是否自盘：', type: 'baseInput', baseCode: 'ImInventoryPlan-ynSelfInventory', value: 'ynSelfInventory' },
        { label: '盘点报告时间期间：', type: 'daterange', value: 'offereQuantity' },
        { label: '下达日期期间：', type: 'daterange', value: 'offereAssetTotalAmount' },
        { label: '完成日期期间：', type: 'daterange', valueStart: 'completeDateStart', valueEnd: 'completeDateEnd' },
        { label: '创建时间期间：', type: 'daterange', valueStart: 'createDateStart', valueEnd: 'createDateStart' },
        { label: '来源终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' }
      ]
    }
  },
  mixins: [vxeTable],
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
      listPlan(this.currentParams)
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
    detailHandle(id) {
      this.$router.push({
        name: 'plan-planDetail',
        query: {
          id: id
        }
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    // 新增 编辑
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'plan-planUpdate' : 'plan-planAdd',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'plan-planUpdate',
        query: {
          id: row.assetReceiptId,
          todo: todo
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$modal.confirm('是否确认删除盘点计划单信息编号为"' + row.assetReceiptCode + '"的数据项？').then(() => {
        delPlan(row.assetReceiptId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/inventory/plan/export',
        {
          ...this.currentParams
        },
        `盘点计划${new Date().getTime()}.xlsx`
      )
    },
    getDictData() {
      let dictCodes = 'ImInventoryPlan-cycleInventory' //盘点周期
      dictCodes += ',ImInventoryPlan-ynSelfInventory' //是否自盘
      dictCodes += ',ImInventoryPlan-coverageRange' //覆盖范围
      dictCodes += ',ImInventoryPlan-assetStatus' //资产状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listTypeQuery().then((res) => {
        this.typeList = res.rows
      })
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      let obj = {
        offereQuantity: 3,
        offereAssetTotalAmount: 2
      }
      return this.footerMethod(columns, data, '', obj)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

