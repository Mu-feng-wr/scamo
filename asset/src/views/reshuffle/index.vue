<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetScrapCode" size="mini" placeholder="异动单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.terminatorOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="异动原因" clearable @keyup.enter.native="load" />
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
                    @change="load"
                  />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.crossCompanyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="跨公司名称"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.crossOrgName" size="mini" placeholder="跨部门名称" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" base-code="System-sourceTerminal" :value.sync="queryParams.sourceTerminal" placeholder="使用终端" clearable @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :options-list="dictDataList"
                    base-code="AlmAssetReshuffle-reshuffleStatus"
                    :value.sync="queryParams.status"
                    placeholder="状态"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :start-value.sync="queryParams.scrapDateStart"
                    :end-value.sync="queryParams.scrapDateEnd"
                    start-placeholder="异动日期开始"
                    end-placeholder="异动日期结束"
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
                <el-button v-hasPermi="['asset:reshuffle:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增异动</el-button>
                <el-button v-hasPermi="['asset:reshuffle:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #assetReshuffleCode="{ row }">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetReshuffleId)">{{ row.assetReshuffleCode }}</el-link>
              </template>
              <template #reshuffleType="{ row }">
                <dictDateView :value="row.reshuffleType" :dict-data-list="dictDataList" dict-code="AlmAssetReshuffle-reshuffleType" />
              </template>
              <template #sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-datalist="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetReshuffle-reshuffleStatus" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetReshuffleId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:reshuffle:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetReshuffleId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:reshuffle:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['asset:reshuffle:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:reshuffle:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:reshuffle:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:reshuffle:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:reshuffle:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
                  <!-- <el-button size="mini" type="text" @click="detailHandle(row.assetReshuffleId)">查看</el-button>
                  <el-button v-if="row.status==0" size="mini" type="text" @click="addOrUpdateHandle(row.assetReshuffleId)" v-hasPermi="['asset:reshuffle:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['asset:reshuffle:remove']">删除</el-button>-->
                </div>
              </template>
            </vxe-grid>
          </el-main>

          <!-- <Print ref="printRef" v-if="printVisible"></Print> -->
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listReshuffle, delReshuffle, getTotalAmount } from '@/api/reshuffle.js'
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
        { visible: true, field: 'assetReshuffleCode', title: '异动单号', width: 150, fixed: 'left', visibleDisabled: true, slots: { default: 'assetReshuffleCode' } },
        { visible: true, field: 'reshuffleDate', title: '异动日期', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'reshuffleType', title: '异动类型', width: 130, slots: { default: 'reshuffleType' } },
        { visible: true, field: 'reshuffleUserName', title: '异动人', width: 130 },
        { visible: true, field: 'reshuffleOrgName', title: '异动部门', width: 130 },
        { visible: true, field: 'crossCompanyName', title: '跨公司名称', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'crossOrgName', title: '跨部门名称', width: 130 },
        { visible: true, field: 'reshuffleReason', title: '异动原因', width: 220, headerAlign: 'center', align: 'left' },
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
      listReshuffle(this.currentParams)
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
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    // 导出
    handleExport() {
      this.download(
        '/asset/reshuffle/export',
        {
          ...this.currentParams
        },
        `异动单${new Date().getTime()}.xlsx`
      )
    },
    // 查看
    detailHandle(id) {
      this.$router.push({
        name: 'reshuffle-reshuffleDetail',
        query: {
          id: id
        }
      })
    },
    // 新增 编辑
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'reshuffle-reshuffleUpdate' : 'reshuffle-reshuffleAdd',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'reshuffle-reshuffleUpdate',
        query: {
          id: row.assetReshuffleId,
          todo: todo
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除异动单信息编号为"' + row.assetReshuffleCode + '"的数据项？').then(() => {
        delReshuffle(row.assetReshuffleId).then(() => {
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
      dictCodes += ',AlmAssetReshuffle-reshuffleType' // 异动类型
      dictCodes += ',AlmAssetReshuffle-reshuffleStatus' // 异动状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>