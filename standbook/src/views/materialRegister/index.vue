<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetRegisterCode" size="mini" placeholder="登记编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.assetCode" size="mini" placeholder="资产编码" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.assetName" size="mini" placeholder="资产名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.categoryName" size="mini" placeholder="资产分类名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.eventListName" size="mini" placeholder="事件名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.eventListCode" size="mini" placeholder="事件单号" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.signerName" size="mini" placeholder="签收人姓名" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.signerOrgName" size="mini" placeholder="签收部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.ynSign" size="mini" placeholder="是否签收">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.currentCompanyId"
                    base-code="companyList"
                    result-label="data"
                    label-name="deptName"
                    value-name="deptId"
                    placeholder="当前使用公司"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申购部门" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.eventListType"
                    base-code="listType"
                    label-name="businessName"
                    value-name="businessId"
                    placeholder="事件类型"
                    clearable
                    @change="load"
                  />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <more-query :filter-options="filterOptions" :form-data.sync="queryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>

      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <table-header-config class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              ref="xTable"
              v-loading="tableLoading"
              height="auto"
              auto-resize
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
              show-overflow="tooltip"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #assetRegisterCode="{row}">
                <el-link :underline="false" type="primary" @click="toDetail(row)">{{ row.assetRegisterCode }}</el-link>
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
import { listRegister } from '@/api/materialRegister'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetRegisterCode', title: '登记编号', width: 150, slots: { default: 'assetRegisterCode' } },
        { visible: true, field: 'assetCode', title: '资产编码', width: 130 },
        { visible: true, field: 'assetName', title: '资产名称', width: 130 },
        { visible: true, field: 'pictureName', title: '资产图片', width: 130 },
        { visible: true, field: 'categoryName', title: '资产分类名称', width: 130 },
        { visible: true, field: 'eventListName', title: '事件名称', width: 130 },
        { visible: true, field: 'eventListCode', title: '事件单号', width: 130 },
        { visible: true, field: 'eventListType', title: '事件类型', width: 130 },
        { visible: true, field: 'thisTimeCount', title: '本次计数', width: 130 },
        { visible: true, field: 'occupiedQuantity', title: '占用数量', width: 130 },
        { visible: true, field: 'releaseQuantity', title: '释放数量', width: 130 },
        { visible: true, field: 'collectQuantity', title: '领用数量', width: 130 },
        { visible: true, field: 'borrowQuantity', title: '借用数量', width: 130 },
        { visible: true, field: 'returnQuantity', title: '归还数量', width: 130 },
        { visible: true, field: 'transferredQuantity', title: '调拨数量', width: 130 },
        { visible: true, field: 'dispatchQuantity', title: '派发数量', width: 130 },
        { visible: true, field: 'inventoryQuantity', title: '入库数量', width: 130 },
        { visible: true, field: 'ynSign', title: '是否签收', width: 130 },
        { visible: true, field: 'signerName', title: '签收人姓名', width: 130 },
        { visible: true, field: 'signerOrgName', title: '签收部门名称', width: 130 },
        { visible: true, field: 'signDate', title: '签收日期', width: 130 },
        { visible: true, field: 'signFeedback', title: '签收反馈', width: 130 },
        { visible: true, field: 'thisInventoryQuantity', title: '本次库存数量', width: 130 },
        { visible: true, field: 'triggerName', title: '触发人姓名', width: 130 },
        { visible: true, field: 'triggerOrgName', title: '触发部门名称', width: 130 },
        { visible: true, field: 'triggeDate', title: '触发时间', width: 130 },
        { visible: true, field: 'triggeReason', title: '触发原因', width: 130 },
        { visible: true, field: 'triggeReason1', title: '处理过程', width: 130 },
        { visible: true, field: 'currentUserName', title: '当前使用人姓名', width: 150 },
        { visible: true, field: 'currentOrgName', title: '当前使用部门名称', width: 150 },
        { visible: true, field: 'currentCompanyName', title: '当前使用公司名称', width: 150 },
        { visible: true, field: 'currentEreaName', title: '当前使用区域名称', width: 150 },
        { visible: true, field: 'currentLocationName', title: '当前使用具体位置', width: 150 },
        { visible: true, field: 'unifiedSystemNumber', title: '客户统一系统编号', width: 150 },
        { visible: true, field: 'remarks', title: '备注', width: 220 },
        { visible: true, field: 'status', title: '状态', width: 130 }
      ],
      filterOptions: [{ label: '签收日期期间：', type: 'daterange', valueStart: 'signDateStart', valueEnd: 'signDateEnd' }]
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
        ...{ pageNum: this.tablePage.currentPage, pageSize: this.tablePage.pageSize }
      }
    },
    reload() {
      this.tableLoading = true
      listRegister(this.currentParams)
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
    handlePageChange() {},
    getFooterData() {
      return [[]]
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/library/materialRegister/export',
        {
          ...this.queryParams
        },
        `登记信息_${new Date().getTime()}.xlsx`
      )
    },
    toDetail() {
      this.$router.push({
        path: '/standbook/materialRegister/detail'
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>