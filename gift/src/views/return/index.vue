<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.giftReturnCode" size="mini" placeholder="归还单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.user_name" size="mini" placeholder="使用人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.user_org_name" size="mini" placeholder="使用部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicant_name" size="mini" placeholder="申请人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicant_org_name" size="mini" placeholder="申请部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.returnReason" size="mini" placeholder="归还原因" clearable />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.centralizedBusinessId" base-code="listType" label-name="businessName" value-name="businessId" placeholder="业务归口类型" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.accepterOrgId" base-code="companyList" result-label="data" label-name="deptName" value-name="deptId" placeholder="使用公司" />
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.companyId" base-code="companyList" result-label="data" label-name="deptName" value-name="deptId" placeholder="申请公司" />
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
                    :start-value.sync="queryParams.returnDateStart"
                    :end-value.sync="queryParams.returnDateEnd"
                    start-placeholder="归还日期开始"
                    end-placeholder="归还日期结束"
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
                <el-button v-hasPermi="['srm:return:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增归还</el-button>
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
              auto-resize
              show-overflow="tooltip"
              show-footer
              :footer-method="getFooterData"
            >
              <template #seqHeader>序号</template>
              <template #giftReturnCode="{row}">
                <el-link :underline="false" type="primary" @click="detailHandle(row.giftReturnId)">{{ row.giftReturnCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.giftReturnId)">查看</el-button>
                  <el-button v-hasPermi="['asset:receipt:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.giftReturnId)">修改</el-button>
                  <el-button v-hasPermi="['asset:receipt:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listReturn, delReturn } from '@/api/return.js'
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      form: {},
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, field: 'giftReturnCode', title: '归还单号', fixed: 'left', width: 160, visibleDisabled: true, slots: { default: 'giftReturnCode' } },
        { visible: true, field: 'returnDate', title: '归还日期', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 130 },
        { visible: true, field: 'giftQuantity', title: '礼品数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'giftAmount', title: '礼品金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'userName', title: '使用人', width: 130 },
        { visible: true, field: 'userOrgName', title: '使用部门', width: 130 },
        { visible: true, field: 'returnReason', title: '归还原因', width: 130 },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 130 },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 130 },

        // { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createBy', title: '创建人', width: 130 },
        { visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { visible: true, field: 'createBy', title: '更新人', width: 130 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { visible: true, field: 'status', title: '状态', width: 130 },
        { visible: true, field: 'todo', title: '操作', width: 160, fixed: 'right', slots: { default: 'todo' } }
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
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        // { label: '领用日期期间：', type: 'daterange', placeholder: '领用日期', valueStart: 'collectDateStart', valueEnd: 'collectDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '创建日期', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '更新日期', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '归还日期期间：', type: 'daterange', placeholder: '请选择归还日期期间', valueStart: 'returnDateStart', valueEnd: 'returnDateEnd' },
        { label: '归还状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', options: this.dictDataList, value: 'status' }
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
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/gift/return',
          module: 'Gift',
          fullPath: '/gift/return/edit',
          title: '编辑礼品归还',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/gift/return',
          module: 'Gift',
          fullPath: '/gift/return/add',
          title: '新增礼品归还'
        })
      }
    },
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/gift/return',
        module: 'Gift',
        fullPath: '/gift/return/detail',
        title: '礼品归还详情',
        condition: { id }
      })
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除资产归还单信息编号为"' + row.assetReturnCode + '"的数据项？', '', { type: 'warning' }).then(() => {
        delReturn(row.giftReturnId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
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
      return this.footerMethod(columns, data, '', ['giftQuantity', 'giftAmount'])
    },
    // 获取字典数据
    getDictData() {
      var dictCodes = 'System-sourceTerminal' // 终端来源
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>