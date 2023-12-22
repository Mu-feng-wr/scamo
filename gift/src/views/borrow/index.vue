<template>
  <div class="card-container" :class="$route.meta.isTab?'app-container':''">
    <el-container v-show="$route.meta.isTab">
      <el-header>
        <SearchArea :showAllSearch.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.giftBorrowCode" placeholder="借用单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.userName" placeholder="使用人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.userOrgName" placeholder="使用部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantName" placeholder="申请人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicantOrgName" placeholder="申请部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.borrowReason" placeholder="借用原因" clearable />
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.centralizedBusinessId" baseCode="listType" labelName="businessName" valueName="businessId" placeholder="业务归口类型"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.accepterOrgId" baseCode="companyList" resultLabel="data" labelName="deptName" valueName="deptId" placeholder="使用公司"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.companyId" baseCode="companyList" resultLabel="data" labelName="deptName" valueName="deptId" placeholder="申请公司"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.projectId" baseCode="listProject" labelName="projectName" valueName="projectId" placeholder="项目名称"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" baseCode="listScheme" labelName="schemeName" valueName="schemeId" placeholder="方案名称"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" baseCode="System-sourceTerminal" placeholder="使用终端"></base-input>
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :startValue.sync="queryParams.borrowDateStart"
                    :endValue.sync="queryParams.borrowDateEnd"
                    startPlaceholder="借用日期开始"
                    endPlaceholder="借用日期结束"
                    valueFormat="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    clearable
                  />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filterOptions="filterOptions" :formData.sync="moreQueryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb15">
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
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              show-footer
              :footer-method="getFooterData"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.giftBorrowId)">查看</el-button>
                  <el-button size="mini" type="text" @click="addOrUpdateHandle(row.giftBorrowId)" v-hasPermi="['gift:collect:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['gift:collect:remove']">删除</el-button>
                </div>
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
import { listBorrow, delBorrow } from '@/api/gift/borrow'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { showOverflow: true, visible: true, field: 'giftBorrowCode', title: '借用单号', fixed: 'left', width: 120, visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'borrowDate', title: '借用日期', formatter: 'formatDate', fixed: 'left', width: 120, visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 120, visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantCompanyName', title: '申请公司', width: 120 },
        { showOverflow: true, visible: true, field: 'giftQuantity', title: '礼品数量', headerAlign: 'center', align: 'right', formatter: 'formatMoney', width: 130 },
        { showOverflow: true, visible: true, field: 'giftAmount', title: '礼品金额（元）', headerAlign: 'center', align: 'right', formatter: 'formatMoney', width: 150 },
        { showOverflow: true, visible: true, field: 'userName', title: '使用人', width: 120 },
        { showOverflow: true, visible: true, field: 'userOrgName', title: '使用部门', width: 160 },
        { showOverflow: true, visible: true, field: 'borrowReason', title: '借用原因', width: 200, showOverflow: true },
        { showOverflow: true, visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { showOverflow: true, visible: true, field: 'projectName', title: '项目名称', width: 200, showOverflow: true },
        { showOverflow: true, visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { showOverflow: true, visible: true, field: 'schemeName', title: '方案名称', width: 200, showOverflow: true },

        // { showOverflow: true, visible: true, field: 'specificLocationName', title: '具体位置', width: 200, showOverflow: true },
        // { showOverflow: true, visible: true, field: 'useAreaName', title: '使用区域', width: 130 },
        // { showOverflow: true, visible: true, field: 'ynExpectReturn', title: '是否需要归还', width: 130 },
        // { showOverflow: true, visible: true, field: 'expectReturnDate', title: '预计归还日期', formatter: 'formatDate', width: 130 },
        // { showOverflow: true, visible: true, field: 'sourceTerminal', title: '使用终端', width: 130 },

        { showOverflow: true, visible: true, field: 'createBy', title: '创建人', width: 130 },
        { showOverflow: true, visible: true, field: 'createDate', title: '创建时间', width: 130 },
        { showOverflow: true, visible: true, field: 'updateBy', title: '更新人', width: 130 },
        { showOverflow: true, visible: true, field: 'updateDate', title: '更新时间', width: 130 },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 130 },
        { visible: true, field: 'todo', title: '操作', width: 160, fixed: 'right', slots: { default: 'todo' } }
      ],
      filterOptions: [
        { label: '使用人：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用人', value: 'assetCompanyId' },
        { label: '使用部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用部门', value: 'companyId' },
        { label: '业务类型：', type: 'baseInput', placeholder: '请输入业务类型', value: 'accepterMethod', options: this.dictDataList, baseCode: 'AlmAssetReceipt-accepterMethod' },
        {
          label: '申请人：',
          type: 'baseInput',
          baseCode: 'companyList',
          resultLabel: 'data',
          labelName: 'applicantName',
          valueName: 'applicantId',
          placeholder: '申请人',
          value: 'applicantId'
        },
        { label: '申请部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请部门', value: 'companyId' },
        { label: '申请公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请公司', value: 'companyId' },
        { label: '项目名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '方案名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '借用日期期间：', type: 'daterange', placeholder: '请输入借用日期期间', valueStart: 'borrowDateStart', valueEnd: 'borrowDateEnd' },
        // { label: '预计归还日期期间：', type: 'daterange', placeholder: '请输入预计归还日期期间', valueStart: 'expectReturnDateStart', valueEnd: 'expectReturnDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '请输入创建日期期间', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '请输入更新日期期间', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '借用状态：', type: 'baseInput', baseCode: 'AlmAssetBorrow-borrowStatus', placeholder: '请输入状态', value: 'status' }
      ]
    }
  },
  created() {
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
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'giftBorrow-borrowUpdate' : 'giftBorrow-borrowAdd',
        query: {
          id: id
        }
      })
    },
    detailHandle(id) {
      this.$router.push({
        name: 'giftBorrow-borrowDetail',
        query: {
          id: id
        }
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除资产借用单信息编号为"' + row.giftBorrowCode + '"的数据项？').then(() => {
        delBorrow(row.giftBorrowId).then(() => {
          this.reload()
          this.$message.success('删除成功')
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
      return this.footerMethod(columns, data, '', ['giftQuantity', 'giftAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>