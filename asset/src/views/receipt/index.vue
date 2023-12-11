<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetReceiptCode" size="mini" placeholder="入库单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="申购单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseCode" size="mini" placeholder="采购单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseTitle" size="mini" placeholder="采购标题" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.arrivalRequirement" size="mini" placeholder="到货要求" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.receiptReason" size="mini" placeholder="验收原因" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.accepterName" size="mini" placeholder="验收人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.accepterOrgName" size="mini" placeholder="验收部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申购人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申购部门" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    base-code="listType"
                    label-name="businessName"
                    value-name="businessId"
                    placeholder="业务归口类型"
                    clearable
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
                    placeholder="申购公司"
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
                <el-button v-hasPermi="['asset:receipt:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增入库单</el-button>
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
              ref="xTable"
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
              stripe
              highlight-current-row
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
              @page-change="handlePageChange"
            >
              <template v-slot:seqHeader>序号</template>
              <template v-slot:assetReceiptCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetReceiptId)">{{ row.assetReceiptCode }}</el-link>
              </template>
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
                  <el-button v-if="row.status == 0|| row.status == 3" v-hasPermi="['asset:receipt:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.assetReceiptId)">修改</el-button>
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
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.getters.userInfo.userId) "
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
            </vxe-grid>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listReceipt, delReceipt, getTotalAmount } from '@/api/receipt.js'
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
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { showOverflow: true, visible: true, field: 'assetReceiptCode', title: '入库单号', width: 150, fixed: 'left', visibleDisabled: true, slots: { default: 'assetReceiptCode' } },
        { showOverflow: true, visible: true, field: 'applicantDate', title: '入库日期', width: 120, formatter: 'formatDate', fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 120, fixed: 'left', visibleDisabled: true },
        { showOverflow: true, visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { showOverflow: true, visible: true, field: 'applicantCompanyName', title: '申请公司', width: 180, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'receiptQuantity', title: '入库数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, visible: true, field: 'receiptTaxAmount', title: '入库含税金额（元）', headerAlign: 'center', width: 160, align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, visible: true, field: 'accepterMethod', title: '入库方式', width: 180, slots: { default: 'accepterMethod' } },
        { showOverflow: true, visible: true, field: 'assetSource', title: '资产来源', width: 120, slots: { default: 'assetSource' } },
        { showOverflow: true, visible: true, field: 'accepterName', title: '验收人', width: 120 },
        { showOverflow: true, visible: true, field: 'accepterOrgName', title: '验收部门', width: 200 },
        { showOverflow: true, visible: true, field: 'receiptReason', title: '验收原因', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'warehouseName', title: '仓库名称', width: 200 },
        { showOverflow: true, visible: true, field: 'assetCompanyName', title: '资产所属公司', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'purchaseApplicationCode', title: '申购单号', width: 120 },
        { showOverflow: true, visible: true, field: 'subscriptionDate', title: '申购日期', width: 120, formatter: 'formatDate' },
        { showOverflow: true, visible: true, field: 'supplierCode', title: '供应商编号', width: 120 },
        { showOverflow: true, visible: true, field: 'supplierName', title: '供应商名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'accountNumber', title: '出账公司编号', width: 120 },
        { showOverflow: true, visible: true, field: 'accountName', title: '出账公司名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'contractCode', title: '合同编号', width: 120 },
        { showOverflow: true, visible: true, field: 'contractName', title: '合同名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'projectCode', title: '项目编号', width: 160 },
        { showOverflow: true, visible: true, field: 'projectName', title: '项目名称', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'currentEreaName', title: '使用区域', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'currentLocationName', title: '具体位置', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'arrivalDate', title: '到货日期', width: 120, formatter: 'formatDate' },
        { showOverflow: true, visible: true, field: 'arrivalRequirement', title: '到货要求', width: 120, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'tenderAgreementCode', title: '招标协议编号', width: 120 },
        { showOverflow: true, visible: true, field: 'tenderAgreementName', title: '招标协议标题', width: 200, headerAlign: 'center', align: 'left' },
        { showOverflow: true, visible: true, field: 'sourceTerminal', title: '使用终端', width: 120, slots: { default: 'sourceTerminal' } },
        { showOverflow: true, visible: true, field: 'status', title: '状态', width: 120, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 250, align: 'center', fixed: 'right', slots: { default: 'todo' }, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        {
          label: '验收公司：',
          type: 'baseInput',
          baseCode: 'companyList',
          resultLabel: 'data',
          labelName: 'deptName',
          valueName: 'deptId',
          placeholder: '验收公司',
          value: 'assetCompanyId'
        },
        { label: '验收方式：', type: 'baseInput', placeholder: '请输入验收方式', value: 'accepterMethod', options: this.dictDataList, baseCode: 'AlmAssetReceipt-accepterMethod' },
        { label: '资产来源：', type: 'baseInput', placeholder: '资产来源', value: 'assetSource', options: this.dictDataList, baseCode: 'AlmAssetReceipt-assetSource' },
        { label: '仓库公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '仓库公司', value: 'companyId' },
        {
          label: '仓库名称：',
          type: 'baseInput',
          baseCode: 'listAddressWarehouse',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          placeholder: '仓库名称',
          value: 'warehouseId',
          relyOn: 'companyId',
          query: { companyId: this.queryParams.companyId }
        },
        { label: '供应商:', type: 'baseInput', baseCode: 'listSupplier', labelName: 'supplierName', valueName: 'supplierId', value: 'supplierId' },
        { label: '出账公司：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
        { label: '合同名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '招标协议：', type: 'baseInput', baseCode: 'listAgreement', labelName: 'tenderAgreementName', valueName: 'tenderAgreementId', value: 'tenderAgreementId' },
        { label: '使用区域：', type: 'baseInput', baseCode: 'listAddressUseArea', labelName: 'locationName', valueName: 'locationAddressId', value: 'ereaId' },
        {
          label: '具体位置：',
          type: 'baseInput',
          baseCode: 'listAddressSpecificLocation',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          value: 'locationId',
          relyOn: 'parentId',
          query: { parentId: this.queryParams.ereaId }
        },
        { label: '验收日期期间：', type: 'daterange', valueStart: 'acceptedDateStart', valueEnd: 'acceptedDateEnd' },
        { label: '申购日期期间：', type: 'daterange', valueStart: 'subscriptionDateStart', valueEnd: 'subscriptionDateEnd' },
        { label: '到货日期期间：', type: 'daterange', valueStart: 'arrivalDateStart', valueEnd: 'arrivalDateEnd' },
        { label: '发货日期期间：', type: 'daterange', valueStart: 'shipmentDateStart', valueEnd: 'shipmentDateEnd' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', options: this.dictDataList, value: 'status' }
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
      getTotalAmount(this.currentParams).then((res) => {
        this.footerTotal = res.data
        if (this.$refs.xTable) {
          this.$refs.xTable.updateFooter()
        }
      })
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
      listReceipt(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
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
        name: 'receipt-receiptDetail',
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
        name: id ? 'receipt-receiptUpdate' : 'receipt-receiptAdd',
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
      this.$confirm('是否确认删除资产入库单信息编号为"' + row.assetReceiptCode + '"的数据项？', '删除').then(() => {
        delReceipt(row.assetReceiptId).then(() => {
          this.reload()
          this.$message.success('删除成功！')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/asset/receipt/export',
        {
          ...this.currentParams
        },
        `receipt_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, this.footerTotal, ['receiptQuantity', 'receiptTaxAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

