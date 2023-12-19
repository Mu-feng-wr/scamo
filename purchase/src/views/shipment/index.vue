<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.shipmentCode" size="mini" placeholder="请输入发货单号" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="请输入申购单号" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseCode" size="mini" clearable placeholder="请输入采购单号" @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseTitle" size="mini" placeholder="请输入采购标题" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaserTelephone" size="mini" placeholder="请输入联系电话" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.subscriptionReason" size="mini" placeholder="请输入申购原因" clearable @keydown.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" class="mt-10" :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseApplication" size="mini" placeholder="请输入申请人" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.shipperName" size="mini" placeholder="请输入发货人" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="请输入申请部门" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantCompanyName" size="mini" placeholder="请输入申请公司" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    :query-function="listTypeQuery"
                    label-name="businessName"
                    value-name="businessId"
                    placeholder="请选择业务归口类型"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.supplierId"
                    base-code="listSupplier"
                    label-name="supplierName"
                    value-name="supplierId"
                    placeholder="请选择供应商"
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
                <el-button v-hasPermi="['srm:shipment:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增发货单</el-button>
                <el-button v-hasPermi="['srm:shipment:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              stripe
              highlight-current-row
              class="vxeTable"
              show-footer
              :footer-method="getFooterData"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #shipmentCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.shipmentId)">{{ row.shipmentCode }}</el-link>
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="PoPurchaseShipment-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.shipmentId)">查看</el-button>
                  <el-button v-if="row.status==0" v-hasPermi="['srm:shipment:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.shipmentId)">修改</el-button>
                  <el-button v-if="row.status==0" v-hasPermi="['srm:shipment:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listShipment, delShipment, getTotalAmount } from '@/api/shipment.js'
import { listDictItems, listTypeQuery } from '@/api/base.js'
export default {
  name: 'Shipment',
  mixins: [vxeTable],
  data() {
    return {
      printVisible: false,
      footerTotal: {},
      listTypeQuery: listTypeQuery, // 业务归口类型
      showAllSearch: false,
      queryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { visible: true, visibleDisabled: true, type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, visibleDisabled: true, field: 'shipmentCode', title: '发货单号', width: 150, fixed: 'left', slots: { default: 'shipmentCode' } },
        { visible: true, visibleDisabled: true, field: 'shipmentDate', title: '发货日期', width: 150, fixed: 'left' },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 120 },
        { visible: true, field: 'purchaseApplicationCode', title: '申购单号', width: 160 },
        { visible: true, field: 'subscriptionDate', title: '申购日期', width: 120 },
        { visible: true, field: 'subscriptionReason', title: '申购原因', width: 180, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'subscriptionQuantity', title: '申购数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'subscriptionTaxAmount', title: '申购金额（元）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'shipmentQuantity', title: '本次发货数量', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'shipmentAmount', title: '本次发货金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'unShipmentQuantity', title: '未发货数量', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'unShipmentAmount', title: '未发货金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'shipperName', title: '发货人', width: 120 },
        { visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'supplierCode', title: '供应商编号', width: 120 },
        { visible: true, field: 'supplierName', title: '供应商名称', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'accountNumber', title: '出账公司编号', width: 120 },
        { visible: true, field: 'accountName', title: '出账公司名称', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'contractCode', title: '合同编号', width: 120 },
        { visible: true, field: 'contractName', title: '合同名称', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'projectCode', title: '项目编号', width: 120 },
        { visible: true, field: 'projectName', title: '项目名称', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'ereaName', title: '使用区域', width: 120 },
        { visible: true, field: 'locationName', title: '具体位置', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'arrivalContact', title: '联系人', width: 120 },
        { visible: true, field: 'arrivalMobile', title: '联系电话', width: 120 },
        { visible: true, field: 'arrivalDate', title: '到货日期', width: 120 },
        { visible: true, field: 'arrivalRequirement', title: '到货要求', width: 120 },
        { visible: true, field: 'tenderAgreementCode', title: '招标协议编号', width: 120 },
        { visible: true, field: 'tenderAgreementTitle', title: '招标协议标题', width: 120, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 120, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'purchaseCode', title: '采购单号', width: 120 },
        { visible: true, field: 'purchaserName', title: '采购人', width: 120 },
        { visible: true, field: 'purchaserOrgName', title: '采购部门', width: 120 },
        { visible: true, field: 'acceptedOrderCode', title: '验收单号', width: 120 },
        { visible: true, field: 'accepterName', title: '验收人', width: 120 },
        { visible: true, field: 'accepterOrgName', title: '验收部门', width: 120 },
        { visible: true, field: 'status', title: '状态', width: 120, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 200, align: 'center', fixed: 'right', slots: { default: 'todo' } }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '出账公司：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
        { label: '合同名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
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
        { label: '招标协议：', type: 'baseInput', baseCode: 'listAgreement', labelName: 'tenderAgreementName', valueName: 'tenderAgreementId', value: 'tenderAgreementId' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '申购日期期间：', type: 'daterange', valueStart: 'subscriptionDateStart', valueEnd: 'subscriptionDateEnd' },
        { label: '发货日期期间：', type: 'daterange', valueStart: 'shipmentDateStart', valueEnd: 'shipmentDateDateEnd' },
        { label: '到货日期期间：', type: 'daterange', valueStart: 'arrivalDateStart', valueEnd: 'arrivalDateEnd' },
        { label: '状态：', type: 'baseInput', value: 'status', baseCode: 'PoPurchaseShipment-status', options: this.dictDataList }
      ]
    }
  },
  mounted() {
    this.getDictData()
    this.load()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
      this.getFooterTotal()
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
      listShipment(this.currentParams)
        .then((res) => {
          this.tableData = res.rows.map((item) => {
            // 提取申购单信息到列表
            var poPurchaseApplication = item.poPurchaseApplication || {}
            this.$vxe.subtract(item.subscriptionQuantity, item.shipmentQuantity)
            item = {
              ...item,
              ...{
                centralizedBusinessName: poPurchaseApplication.centralizedBusinessName,
                purchaseApplicationCode: poPurchaseApplication.purchaseApplicationCode,
                subscriptionDate: poPurchaseApplication.subscriptionDate,
                subscriptionReason: poPurchaseApplication.subscriptionReason,
                subscriptionQuantity: poPurchaseApplication.subscriptionQuantity,
                subscriptionTaxAmount: poPurchaseApplication.subscriptionTaxAmount,
                supplierCode: poPurchaseApplication.supplierCode,
                supplierName: poPurchaseApplication.supplierName,
                accountNumber: poPurchaseApplication.accountNumber,
                accountName: poPurchaseApplication.accountName,
                contractCode: poPurchaseApplication.contractCode,
                contractName: poPurchaseApplication.contractName,
                projectCode: poPurchaseApplication.projectCode,
                projectName: poPurchaseApplication.projectName,
                ereaName: poPurchaseApplication.ereaName,
                locationName: poPurchaseApplication.locationName,
                arrivalContact: poPurchaseApplication.arrivalContact,
                arrivalMobile: poPurchaseApplication.arrivalMobile,
                arrivalDate: poPurchaseApplication.arrivalDate,
                arrivalRequirement: poPurchaseApplication.arrivalRequirement,
                tenderAgreementCode: poPurchaseApplication.tenderAgreementCode,
                tenderAgreementTitle: poPurchaseApplication.tenderAgreementName,
                purchaseCode: poPurchaseApplication.purchaseCode,
                purchaserName: poPurchaseApplication.purchaserName,
                purchaserOrgName: poPurchaseApplication.purchaserOrgName,
                unShipmentQuantity: this.$vxe.subtract(poPurchaseApplication.subscriptionQuantity, item.shipmentQuantity),
                unShipmentAmount: this.$vxe.subtract(poPurchaseApplication.subscriptionTaxAmount, item.shipmentAmount)
              }
            }
            return item
          })
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
    // 获取表尾合计
    getFooterTotal() {
      getTotalAmount(this.currentParams).then((res) => {
        this.footerTotal = res.data
        this.$set(res.data, 'unShipmentAmountTotal', this.$vxe.subtract(res.data.subscriptionTaxAmountTotal, res.data.shipmentAmountTotal))
        if (this.$refs.xTable) {
          this.$refs.xTable.updateFooter()
        }
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
    detailHandle(id) {
      this.$router.push({
        name: 'shipment-shipmentDetail',
        query: {
          id: id
        }
      })
    },
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'shipment-shipmentUpdate' : 'shipment-shipmentAdd',
        query: {
          id: id
        }
      })
    },
    handleDelete(row) {
      const shipmentIds = row.shipmentId
      this.$modal
        .confirm('是否确认删除发货单信息编号为"' + row.shipmentCode + '"的数据项？')
        .then(() => {
          delShipment(shipmentIds).then(() => {
            this.reload()
            this.$modal.msgSuccess('删除成功')
          })
        })
        .catch(() => {})
    },
    getDictData() {
      var dictCodes = 'PoPurchaseShipment-status' // 发货状态
      dictCodes += ',System-sourceTerminal' // 来源终端
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'srm/shipment/export',
        {
          ...this.currentParams
        },
        `shipment_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, this.footerTotal, [
        'subscriptionQuantity',
        'subscriptionTaxAmount',
        'shipmentQuantity',
        'shipmentAmount',
        'unShipmentQuantity',
        'unShipmentAmount'
      ])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>