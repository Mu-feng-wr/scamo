<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetChangeCode" size="mini" placeholder="变更单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.changerName" size="mini" placeholder="变更人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.changerOrgName" size="mini" placeholder="变更部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.changeReason" size="mini" placeholder="变更原因" clearable @keyup.enter.native="load" />
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
                  <base-input
                    size="mini"
                    :value.sync="queryParams.changeCompanyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="变动公司"
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
                <el-col :span="4">
                  <base-input size="mini" base-code="System-sourceTerminal" :value.sync="queryParams.sourceTerminal" placeholder="使用终端" clearable @change="load" />
                </el-col>
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :start-value.sync="queryParams.changeDateStart"
                    :end-value.sync="queryParams.changeDateEnd"
                    start-placeholder="变动日期开始"
                    end-placeholder="变动日期结束"
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
                <el-button v-hasPermi="['asset:change:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增变动单</el-button>
                <el-button v-hasPermi="['asset:change:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              <template #assetChangeCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetChangeId)">{{ row.assetChangeCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetChange-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetChangeId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:change:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetChangeId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:change:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                    v-hasPermi="['asset:change:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:change:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                    v-hasPermi="['asset:change:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:change:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:change:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listChange, delChange } from '@/api/change.js'
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
        { showOverflow: true, visible: true, field: 'assetChangeCode', title: '变更单号', width: 150, visibleDisabled: true, fixed: 'left', slots: { default: 'assetChangeCode' } },
        { showOverflow: true, visible: true, field: 'changeDate', title: '变更日期', width: 130, visibleDisabled: true, fixed: 'left' },
        { showOverflow: true, visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 130 },
        { showOverflow: true, visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { showOverflow: true, visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { showOverflow: true, visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, visible: true, field: 'changerName', title: '变更人', width: 130 },
        { showOverflow: true, visible: true, field: 'changerOrgName', title: '变更部门', width: 130 },
        { showOverflow: true, visible: true, field: 'changeReason', title: '变更原因', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' }, fixed: 'right' }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '创建日期期间：', type: 'daterange', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetChange-status', value: 'status' }
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
      listChange(this.currentParams)
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
        '/asset/change/export',
        {
          ...this.currentParams
        },
        `变更单${new Date().getTime()}.xlsx`
      )
    },
    // 查看
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/asset/change',
        module: 'Asset',
        fullPath: '/asset/change/detail',
        title: '资产变更详情',
        condition: { id }
      })
    },
    // 新增 编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/asset/change',
          module: 'Asset',
          fullPath: '/asset/change/edit',
          title: '编辑资产变更',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/asset/change',
          module: 'Asset',
          fullPath: '/asset/change/add',
          title: '新增资产变更'
        })
      }
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'change-changeUpdate',
        query: {
          id: row.assetChangeId,
          todo: todo
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$modal.confirm('是否确认删除变更单信息编号为"' + row.assetChangeCode + '"的数据项？', '删除', { type: 'warning' }).then(() => {
        delChange(row.assetChangeId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['receiptQuantity', 'receiptExcTaxAmount'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetChange-status' // 变更状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>