<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.giftCollectCode" size="mini" placeholder="领用单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userName" size="mini" placeholder="使用人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userOrgName" size="mini" placeholder="使用部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.collectReason" size="mini" placeholder="领用原因" clearable />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.centralizedBusinessId" base-code="listType" label-name="businessName" value-name="businessId" placeholder="业务归口类型" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.companyId" base-code="companyList" result-label="data" label-name="deptName" value-name="deptId" placeholder="使用公司" />
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
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.projectId" base-code="listProject" label-name="projectName" value-name="projectId" placeholder="项目名称" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" base-code="listScheme" label-name="schemeName" value-name="schemeId" placeholder="方案名称" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" base-code="System-sourceTerminal" placeholder="使用终端" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :start-value.sync="queryParams.repairDateStart"
                    :end-value.sync="queryParams.repairDateEnd"
                    start-placeholder="验收日期开始"
                    end-placeholder="验收日期结束"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    clearable
                  />
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
                <el-button v-hasPermi="['asset:borrow:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增领用</el-button>
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
              :pager-config="tablePage"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              auto-resize
              show-overflow="tooltip"
              show-footer
              :footer-method="getFooterData"
            >
              <template #seqHeader>序号</template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #giftCollectCode="{row}">
                <el-link :underline="false" type="primary" @click="handleDetail(row)">{{ row.giftCollectCode }}</el-link>
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="handleDetail(row)">查看</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3" v-hasPermi="['asset:collect:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.giftCollectId)">修改</el-button>
                  <el-button v-if="row.status == 2 && !row.reviewBy" v-hasPermi="['asset:collect:audit']" size="mini" type="text" @click="audit(row,'audit_superior')">审批</el-button>
                  <el-button v-if="row.status == 2 && row.reviewBy" v-hasPermi="['asset:collect:register']" size="mini" type="text" @click="audit(row,'register_asset_admin')">登记</el-button>
                  <el-button
                    v-if="row.status == 2 && !row.reviewBy && row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:collect:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && !row.registerId && row.reviewBy == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:collect:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button v-if="row.status == 2 && !row.registerId" v-hasPermi="['asset:collect:invalid']" size="mini" type="text" @click="audit(row,'invalid_add')">作废</el-button>
                  <el-button v-hasPermi="['asset:collect:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listCollect, delCollect } from '@/api/collect.js'
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
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, field: 'giftCollectCode', title: '领用单号', width: 160, fixed: 'left', visibleDisabled: true, slots: { default: 'giftCollectCode' } },
        { visible: true, field: 'collectDate', title: '领用日期', width: 120, formatter: 'formatDate', fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 120 },
        { visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 120 },
        { visible: true, field: 'giftQuantity', title: '礼品数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'giftAmount', title: '礼品金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'userName', title: '使用人', width: 120 },
        { visible: true, field: 'userOrgName', title: '使用部门', width: 120 },
        { visible: true, field: 'collectReason', title: '领用原因', width: 120 },
        { visible: true, field: 'projectCode', title: '项目编号', width: 120 },
        { visible: true, field: 'projectName', title: '项目名称', width: 240 },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 120 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 120 },

        // { visible: true, field: 'specificLocationName', title: '具体位置', width: 120 },
        // { visible: true, field: 'useAreaName', title: '使用区域', width: 240 },
        // { visible: true, field: 'sourceTerminal', title: '使用终端', width: 120, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createBy', title: '创建人', width: 120 },
        { visible: true, field: 'createDate', title: '创建时间', width: 160 },
        { visible: true, field: 'updateBy', title: '更新人', width: 120 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 160 },
        { visible: true, field: 'status', title: '状态', width: 120 },
        { visible: true, field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' } }
      ],
      filterOptions: [
        { label: '使用人：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用人', value: 'assetCompanyId' },
        { label: '使用部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用部门', value: 'companyId' },
        { label: '业务类型：', type: 'baseInput', placeholder: '请输入业务类型', value: 'accepterMethod', options: this.dictDataList, baseCode: 'AlmAssetReceipt-accepterMethod' },
        { label: '申请人：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请人', value: 'assetCompanyId' },
        { label: '申请部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请部门', value: 'companyId' },
        { label: '申请公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请公司', value: 'companyId' },
        { label: '项目名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '方案名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '领用日期期间：', type: 'daterange', placeholder: '领用日期', valueStart: 'collectDateStart', valueEnd: 'collectDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '创建日期', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '更新日期', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', options: this.dictDataList, value: 'status' }
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
      listCollect(this.currentParams)
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
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',System-whether' // 系统状态   是否
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 新增  修改
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/gift/collect',
          module: 'Gift',
          fullPath: '/gift/collect/edit',
          title: '编辑礼品领用',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/gift/collect',
          module: 'Gift',
          fullPath: '/gift/collect/add',
          title: '新增礼品领用'
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
        invalid_add: '作废'
      }
      window.$wujie.props.route({
        path: '/gift/collect',
        module: 'Gift',
        fullPath: '/gift/collect/edit',
        title: `礼品领用${statusObj[todo]}`,
        condition: { id: row.giftCollectId, todo: todo }
      })
    },
    handleDetail(row) {
      window.$wujie.props.route({
        path: '/gift/collect',
        module: 'Gift',
        fullPath: '/gift/collect/detail',
        title: '礼品领用详情',
        condition: { id: row.giftCollectId }
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除资产领用单信息编号为"' + row.giftCollectCode + '"的数据项？').then(() => {
        delCollect(row.giftCollectId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
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
    // 导出
    handleExport() {
      this.download(
        '/asset/collect/export',
        {
          ...this.currentParams
        },
        `collect_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['giftQuantity', 'giftAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
