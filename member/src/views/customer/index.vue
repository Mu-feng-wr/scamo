<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.customerCode" size="mini" placeholder="客户编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.name" size="small" placeholder="客户姓名" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <input-range
                    type="daterange"
                    size="small"
                    :start-value.sync="queryParams.registryTimeRangeBegin"
                    :end-value.sync="queryParams.registryTimeRangeEnd"
                    start-placeholder="注册开始日期"
                    end-placeholder="注册结束日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.phoneNumber" size="small" placeholder="手机号码" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.acquisitionChannel"
                    :options-list="dictDataList"
                    base-code="MmCustomer-acquisitionChannel"
                    placeholder="请选择获客渠道"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-cascader v-model="queryParams.selectedOptions" size="small" :options="cityOptions" filterable placeholder="请选择注册城市" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['memberc:customer:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增客户</el-button>
                <el-button v-hasPermi="['memberc:customer:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
            >
              <template #seqHeader>序号</template>
              <template #sex="{ row }">
                <dictDateView :value="row.sex" :dictDataList="dictDataList" dict-code="SysUser-sex"></dictDateView>
              </template>
              <template #status="{ row }">
                <dictDateView :value="row.status" :dictDataList="dictDataList" dict-code="MmCustomer-status"></dictDateView>
              </template>
              <template #acquisitionChannel="{ row }">
                <dictDateView :value="row.acquisitionChannel" :dictDataList="dictDataList" dict-code="MmCustomer-acquisitionChannel"></dictDateView>
              </template>
              <template #ynFollowUpCall="{ row }">
                <dictDateView :value="row.ynFollowUpCall" :dictDataList="dictDataList" dict-code="System-whether"></dictDateView>
              </template>
              <template #yn7DayOnline="{ row }">
                <dictDateView :value="row.yn7DayOnline" :dictDataList="dictDataList" dict-code="System-whether"></dictDateView>
              </template>
              <template #ynOfflineScheme="{ row }">
                <dictDateView :value="row.ynOfflineScheme" :dictDataList="dictDataList" dict-code="System-whether"></dictDateView>
              </template>
              <template #ynTransaction="{ row }">
                <dictDateView :value="row.ynTransaction" :dictDataList="dictDataList" dict-code="System-whether"></dictDateView>
              </template>
              <template #todo="{row}">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.customerId)" v-hasPermi="['memberc:customer:query']">查看</el-button>
                  <el-button size="mini" type="text" @click="addOrUpdateHandle(row.customerId)" v-hasPermi="['memberc:customer:edit']">修改</el-button>
                  <el-button size="mini" type="text" v-if="row.applicationTryoutOrderId" @click="addOrUpdateHandle(row.customerId)" v-hasPermi="['memberc:customer:edit']">允许试用</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['memberc:customer:remove']">删除</el-button>
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
import { listDictItems } from '@/api/base.js'
import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data'
import { findListByCondition, delCustomer } from '@/api/customer.js'
import vxeTable from '@/mixins/vxeTable'
export default {
  mixins: [vxeTable],
  data() {
    return {
      cityOptions: provinceAndCityData,
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      dictDataList: [],
      tableColumn: [
        // { type: 'checkbox', width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'customerCode', title: '编号', width: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'name', title: '客户姓名', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'status', title: '客户状态', width: 120, visible: true, slots: { default: 'status' } },
        { field: 'phoneNumber', title: '手机号码', width: 120, visible: true },
        { field: 'sex', title: '性别', width: 120, visible: true, slots: { default: 'sex' } },
        { field: 'personalEmail', title: '邮箱', width: 180, visible: true },
        { field: 'position', title: '职位', width: 120, visible: true },
        { field: 'acquisitionChannel', title: '获客渠道', width: 160, visible: true, slots: { default: 'acquisitionChannel' } },
        { field: 'registrationDate', title: '注册时间', width: 160, visible: true },
        { field: 'productDemand', title: '产品需求', width: 120, visible: true },
        { field: 'budgetExpenses', title: '费用预算', width: 120, visible: true },
        { field: 'ynFollowUpCall', title: '是否已电话回访', width: 200, visible: true, slots: { default: 'ynFollowUpCall' } },
        { field: 'followUpUserId', title: '电话回访人', width: 120, visible: true },
        { field: 'followUpContent', title: '电话回访内容', width: 200, showOverflow: true, visible: true },
        { field: 'yn7DayOnline', title: '是否开通线上体验', width: 200, visible: true, slots: { default: 'yn7DayOnline' } },
        { field: 'experienceUser', title: '开通体验人', width: 120, visible: true },
        { field: 'experienceDate', title: '开通体验时间', width: 180, visible: true },
        { field: 'experienceFeedback', title: '体开通验反馈', width: 180, visible: true, showOverflow: true },
        { field: 'ynOfflineScheme', title: '是否线下方案预约', width: 150, visible: true, slots: { default: 'ynOfflineScheme' } },
        { field: 'schemeConcern', title: '线下方案关注点', width: 200, showOverflow: true, visible: true },
        { field: 'schemeDate', title: '线下方案交流时间', width: 150, visible: true },
        { field: 'schemeUser', title: '解决方案人', width: 200, visible: true },
        { field: 'ynTransaction', title: '是否已成交', width: 120, visible: true, slots: { default: 'ynTransaction' } },
        { field: 'transactionSales', title: '成交销售员', width: 200, showOverflow: true, visible: true },
        { field: 'transactionDate', title: '成交时间', width: 160, visible: true },
        { field: 'todo', title: '操作', width: 200, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
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
          pageSize: this.tablePage.pageSize,
          province: this.queryParams.selectedOptions ? CodeToText[this.queryParams.selectedOptions[0]] : '',
          city: this.queryParams.selectedOptions ? CodeToText[this.queryParams.selectedOptions[1]] : ''
        }
      }
    },
    reload(loading = true) {
      this.tableLoading = loading
      findListByCondition(this.currentParams)
        .then((res) => {
          this.tableData = res.data.list
          this.tablePage.total = res.data.currentPageTotalElements
        })
        .finally(() => {
          this.tableLoading = false
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
    reset() {
      this.queryParams = {}
      this.load()
    },
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/member/customer',
          module: 'Member',
          fullPath: '/member/customer/edit',
          title: '编辑客户',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/member/customer',
          module: 'Member',
          fullPath: '/member/customer/add',
          title: '新增客户'
        })
      }
    },
    detailHandle(id) {
      window.$wujie.props.route({
        path: '/member/customer',
        module: 'Member',
        fullPath: '/member/customer/detail',
        title: '客户详情',
        condition: { id }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除客户编号为"' + row.customerCode + '"的数据项？', '', { type: 'warning' }).then(() => {
        delCustomer(row.customerId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/memberc/customer/export',
        {
          ...this.queryParams
        },
        `客户信息_${new Date().getTime()}.xlsx`
      )
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'MmCustomer-status' // 客户状态
      dictCodes += ',SysUser-sex' // 性别
      dictCodes += ',MmCustomer-acquisitionChannel' // 获客渠道
      dictCodes += ',System-whether' // 系统状态（是否）
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>