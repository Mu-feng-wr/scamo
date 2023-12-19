<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="申购单号" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.subscriptionReason" size="mini" placeholder="申购原因" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantName" size="mini" placeholder="申请人" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantOrgName" size="mini" placeholder="申请部门" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.applicantCompanyName" size="mini" placeholder="申请公司" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.arrivalContact" size="mini" placeholder="联系人" clearable @keydown.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.arrivalMobile" size="mini" placeholder="联系人电话" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.arrivalRequirement" size="mini" placeholder="到货要求" clearable @keydown.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    base-code="listType"
                    label-name="businessName"
                    value-name="businessId"
                    placeholder="业务类型"
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
                    placeholder="供应商"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.accountId"
                    base-code="listAccount"
                    label-name="companyName"
                    value-name="accountId"
                    placeholder="出账公司"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.contractId"
                    base-code="listContract"
                    label-name="contractName"
                    value-name="contractId"
                    placeholder="合同名称"
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
                <el-button v-hasPermi="['srm:application:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增申购</el-button>
                <el-button v-hasPermi="['srm:application:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
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
              stripe
              highlight-current-row
              :footer-method="getFooterData"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #purchaseApplicationCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.purchaseApplicationId)">{{ row.purchaseApplicationCode }}</el-link>
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="PoPurchaseApplication-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.purchaseApplicationId)">查看</el-button>
                  <el-button
                    v-if="row.status == 0 || row.status == 3"
                    v-hasPermi="['srm:application:edit']"
                    size="mini"
                    type="text"
                    @click="addOrUpdateHandle(row.purchaseApplicationId)"
                  >修改</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['srm:application:audit']"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                    v-hasPermi="['srm:application:register']"
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                  >登记</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')&& row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['srm:application:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.getters.userInfo.userId)"
                    v-hasPermi="['srm:application:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                    v-hasPermi="['srm:application:invalid']"
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                  >作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['srm:application:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listApplication, delApplication, getTotalAmount } from '@/api/application.js'
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
      statusObj: {
        0: '草稿',
        1: '审批通过',
        2: '审批中',
        3: '审批不通过',
        4: '作废'
      },
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        {
          visible: true,
          field: 'purchaseApplicationCode',
          title: '申购单号',
          width: 170,
          fixed: 'left',
          visibleDisabled: true,
          slots: { default: 'purchaseApplicationCode' }
        },
        { visible: true, field: 'applicantDate', title: '申请日期', width: 130, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 130 },
        { visible: true, field: 'subscriptionReason', title: '申购原因', width: 220, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'subscriptionQuantity', title: '申购数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'subscriptionTaxAmount', title: '申购总金额（元）', width: 140, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'supplierCode', title: '供应商编号', width: 130 },
        { visible: true, field: 'supplierName', title: '供应商名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'accountNumber', title: '出账公司编号', width: 130 },
        { visible: true, field: 'accountName', title: '出账公司名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'contractCode', title: '合同编号', width: 130 },
        { visible: true, field: 'contractName', title: '合同名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'ereaName', title: '使用区域', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'locationName', title: '具体位置', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'arrivalContact', title: '到货联系人', width: 130 },
        { visible: true, field: 'arrivalMobile', title: '到货联系电话', width: 130 },
        { visible: true, field: 'arrivalDate', title: '到货日期', width: 130 },
        { visible: true, field: 'arrivalRequirement', title: '到货要求', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'tenderAgreementCode', title: '招标协议编号', width: 130 },
        { visible: true, field: 'tenderAgreementName', title: '招标协议名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'sourceTerminal', title: '来源终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: '', title: '采购单号', width: 130 },
        { visible: true, field: '', title: '采购人', width: 130 },
        { visible: true, field: '', title: '采购部门', width: 130 },
        { visible: true, field: '', title: '验收单号', width: 130 },
        { visible: true, field: '', title: '验收人', width: 130 },
        { visible: true, field: '', title: '验收部门', width: 130 },
        { visible: true, field: 'createDate', title: '创建时间', width: 160 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 160 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 220, fixed: 'right', slots: { default: 'todo' } }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
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
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', options: this.dictDataList, value: 'sourceTerminal' },
        { label: '申购日期期间：', type: 'daterange', valueStart: 'subscriptionDateStart', valueEnd: 'subscriptionDateEnd' },
        { label: '到货日期期间：', type: 'daterange', valueStart: 'arrivalDateStart', valueEnd: 'arrivalDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', value: 'status' }
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
      listApplication(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
        })
        .finally(() => {
          this.tableLoading = false
        })

      getTotalAmount(this.currentParams).then((res) => {
        this.footerTotal = res.data
        if (this.$refs.xTable) {
          this.$refs.xTable.updateFooter()
        }
      })
    },
    // 重置
    reset() {
      this.queryParams = {}
      this.load()
    },
    // 分页
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
    // 获取字典数据
    getDictData() {
      var dictCodes = 'System-sourceTerminal' // 来源终端
      dictCodes += ',	PoPurchaseApplication-status' // 申购状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, this.footerTotal, ['subscriptionQuantity', 'subscriptionTaxAmount'])
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/srm/application/export',
        {
          ...this.currentParams
        },
        `申购_${new Date().getTime()}.xlsx`
      )
    },
    // 新增  编辑
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'application-applicationUpdate' : 'application-applicationAdd',
        query: {
          id: id
        }
      })
    },
    // 查看
    detailHandle(id) {
      this.$router.push({
        name: 'application-applicationDetail',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'application-applicationUpdate',
        query: {
          id: row.purchaseApplicationId,
          todo: todo
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除申购单号为 "' + row.purchaseApplicationCode + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delApplication(row.purchaseApplicationId).then((res) => {
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
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>