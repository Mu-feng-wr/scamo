<template>
  <div class="card-container app-container" :class="$route.meta.isTab?'app-container':''">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.asset_return_code" size="mini" placeholder="归还单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.user_name" size="mini" placeholder="使用人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.user_org_name" size="mini" placeholder="使用部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicant_name" size="mini" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicant_org_name" size="mini" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.returnReason" size="mini" placeholder="归还原因" clearable @keyup.enter.native="load" />
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
                    :value.sync="queryParams.accepterOrgId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="使用公司"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.companyId"
                    base-code="companyList"
                    result-cabel="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="申请公司"
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.projectId" base-code="listProject" label-name="projectName" value-name="projectId" placeholder="项目名称" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" base-code="listScheme" label-name="schemeName" value-name="schemeId" placeholder="方案名称" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input :value.sync="queryParams.sourceTerminal" size="mini" base-code="System-sourceTerminal" placeholder="使用终端" @change="load" />
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
                <el-button v-hasPermi="['srm:return:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增归还单</el-button>
                <el-button v-hasPermi="['srm:return:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              <template #assetReturnCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetReturnId)">{{ row.assetReturnCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetReturn-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetReturnId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:return:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetReturnId)">修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:return:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:return:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>

                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['asset:return:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.getters.userInfo.userId)"
                    v-hasPermi="['asset:return:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['asset:return:invalid']"
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
import { listReturn, delReturn } from '@/api/return.js'
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      printVisible: false,

      showAllSearch: false,
      form: {},
      queryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetReturnCode', title: '归还单号', fixed: 'left', width: 160, visibleDisabled: true, slots: { default: 'assetReturnCode' } },
        { visible: true, field: 'returnDate', title: '归还日期', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'userName', title: '使用人', width: 130 },
        { visible: true, field: 'userOrgName', title: '使用部门', width: 130 },
        { visible: true, field: 'returnReason', title: '归还原因', width: 270, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 200, fixed: 'right', slots: { default: 'todo' } }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '归还日期期间：', type: 'daterange', placeholder: '请选择归还日期期间', valueStart: 'returnDateStart', valueEnd: 'returnDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '请选择创建日期期间', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '请选择更新日期期间', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetReturn-status', options: this.dictDataList, placeholder: '请选择状态', value: 'status' }
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
      listReturn(this.currentParams)
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
    // 新增  修改
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/asset/return',
          module: 'Asset',
          fullPath: '/asset/return/edit',
          title: '编辑资产归还',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/asset/return',
          module: 'Asset',
          fullPath: '/asset/return/add',
          title: '新增资产归还'
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
        path: '/asset/return',
        module: 'Asset',
        fullPath: '/asset/return/edit',
        title: `资产归还${statusObj[todo]}`,
        condition: { id: row.assetReturnId, todo: todo }
      })
    },
    // 查看详情
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/asset/return',
        module: 'Asset',
        fullPath: '/asset/return/detail',
        title: '资产归还详情',
        condition: { id }
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除资产归还单信息编号为"' + row.assetReturnCode + '"的数据项？', '删除', { type: 'warning' }).then(() => {
        delReturn(row.assetReturnId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 打印
    printHandle(id) {
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printRef.init(id)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/asset/return/export',
        {
          ...this.currentParams
        },
        `return_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['assetQuantity', 'assetAmount'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',AlmAssetReturn-status' // 归还状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>