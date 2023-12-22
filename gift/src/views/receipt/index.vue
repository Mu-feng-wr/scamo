<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.giftReceiptCode" size="mini" placeholder="验收单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseApplicationCode" size="mini" placeholder="申购单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseCode" size="mini" placeholder="采购单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.purchaseTitle" size="mini" placeholder="采购标题" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.arrivalRequirement" size="mini" placeholder="到货要求" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.receiptReason" size="mini" placeholder="验收原因" clearable />
                </el-col>
              </el-row>
              <el-row v-show="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-input v-model="queryParams.accepterName" size="mini" placeholder="验收人" clearable />
                </el-col>
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
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :start-value.sync="queryParams.repairDateStart"
                    :end-value.sync="queryParams.repairDateEnd"
                    start-placeholder="申购日期开始"
                    end-placeholder="申购日期结束"
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
                <el-button v-hasPermi="['asset:receipt:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增入库</el-button>
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
              <template #giftReceiptCode="{row}">
                <el-link :underline="false" type="primary" @click="detailHandle(row.giftReceiptId)">{{ row.giftReceiptCode }}</el-link>
              </template>
              <template v-slot:accepterMethod="{ row }">
                <dictDateView :value="row.accepterMethod" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-accepterMethod" />
              </template>
              <template v-slot:giftSource="{ row }">
                <dictDateView :value="row.giftSource" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-giftSource" />
              </template>
              <template v-slot:sourceTerminal="{ row }">
                <dictDateView :value="row.sourceTerminal" :dict-data-list="dictDataList" dict-code="System-sourceTerminal" />
              </template>
              <template v-slot:status="{ row }">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AlmAssetReceipt-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.giftReceiptId)">查看</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3" v-hasPermi="['asset:receipt:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.giftReceiptId)">修改</el-button>
                  <el-button v-if="row.status == 2 && !row.reviewBy" v-hasPermi="['asset:receipt:audit']" size="mini" type="text" @click="audit(row,'audit_superior')">审批</el-button>
                  <el-button v-if="row.status == 2 && row.reviewBy" v-hasPermi="['asset:receipt:register']" size="mini" type="text" @click="audit(row,'register_asset_admin')">登记</el-button>
                  <el-button
                    v-if="row.status == 2 && !row.reviewBy && row.applicantId == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:receipt:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>
                  <el-button
                    v-if="row.status == 2 && !row.registerId && row.reviewBy == $store.getters.userInfo.userId"
                    v-hasPermi="['asset:receipt:recall']"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                  <el-button v-if="row.status == 2 && !row.registerId" v-hasPermi="['asset:receipt:invalid']" size="mini" type="text" @click="audit(row,'invalid_add')">作废</el-button>
                  <el-button v-if="row.status == 0 || row.status == 3 || row.status == 4" v-hasPermi="['asset:receipt:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
import { listReceipt, delReceipt } from '@/api/receipt.js'
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
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'giftReceiptCode', title: '验收单号', width: 140, fixed: 'left', visibleDisabled: true, slots: { default: 'giftReceiptCode' } },
        { visible: true, field: 'applicantDate', title: '验收日期', width: 120, formatter: 'formatDate', fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', width: 120, fixed: 'left', visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 120 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 120 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 180 },
        { visible: true, field: 'receiptQuantity', title: '验收数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'receiptExcTaxAmount', title: '验收金额（元）', headerAlign: 'center', width: 160, align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'accepterMethod', title: '验收方式', width: 180, slots: { default: 'accepterMethod' } },
        { visible: true, field: 'giftSource', title: '礼品来源', width: 120, slots: { default: 'giftSource' } },
        { visible: true, field: 'accepterName', title: '验收人', width: 120 },
        { visible: true, field: 'accepterOrgName', title: '验收部门', width: 200 },
        // { visible: true, field: 'assetCompanyName', title: '验收公司', width: 200 },
        { visible: true, field: 'receiptReason', title: '验收原因', width: 200 },
        { visible: true, field: 'warehouseName', title: '仓库名称', width: 200 },
        { visible: true, field: 'assetCompanyName', title: '礼品所属公司', width: 200 },
        { visible: true, field: 'purchaseApplicationCode', title: '申购单号', width: 120 },
        { visible: true, field: 'subscriptionDate', title: '申购日期', width: 120 },
        { visible: true, field: 'subscriptionReason', title: '申购原因', width: 120 },
        { visible: true, field: 'receiptQuantity', title: '申购数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'receiptExcTaxAmount', title: '申购金额（元）', headerAlign: 'center', width: 160, align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'supplierCode', title: '供应商编号', width: 120 },
        { visible: true, field: 'supplierName', title: '供应商名称', width: 200 },
        { visible: true, field: 'accountNumber', title: '出账公司编号', width: 120 },
        { visible: true, field: 'accountName', title: '出账公司名称', width: 200 },
        { visible: true, field: 'contractCode', title: '合同编号', width: 120 },
        { visible: true, field: 'contractName', title: '合同名称', width: 200 },
        { visible: true, field: 'projectCode', title: '项目编号', width: 160 },
        { visible: true, field: 'projectName', title: '项目名称', width: 200 },
        { visible: true, field: 'useAreaName', title: '使用区域', width: 130 },
        { visible: true, field: 'specificLocationName', title: '具体位置', width: 200, showOverflow: true },
        { visible: true, field: 'projectName', title: '联系人', width: 200 },
        { visible: true, field: 'projectName', title: '联系电话', width: 200 },
        { visible: true, field: 'arrivalDate', title: '到货日期', width: 120 },
        { visible: true, field: 'arrivalRequirement', title: '到货要求', width: 120 },
        { visible: true, field: 'tenderAgreementCode', title: '招标协议编号', width: 120 },
        { visible: true, field: 'tenderAgreementName', title: '招标协议标题', width: 200 },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 120, slots: { default: 'sourceTerminal' } },
        { visible: true, field: '', title: '创建人', width: 120 },
        { visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { visible: true, field: '', title: '更新人', width: 120 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { visible: true, field: 'status', title: '状态', width: 120, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        {
          label: '验收人：',
          type: 'baseInput',
          baseCode: 'companyList',
          resultLabel: 'data',
          labelName: 'accepterName',
          valueName: 'accepterId',
          placeholder: '验收人',
          value: 'accepterId'
        },
        {
          label: '申购人：',
          type: 'baseInput',
          baseCode: 'companyList',
          resultLabel: 'data',
          labelName: 'deptName',
          valueName: 'deptId',
          placeholder: '验收公司',
          value: 'assetCompanyId'
        },
        { label: '申购部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '仓库公司', value: 'companyId' },
        { label: '申购公司：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
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
        { label: '申请部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请公司', value: 'companyId' },
        { label: '申请公司：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
        { label: '验收方式：', type: 'baseInput', placeholder: '请输入验收方式', value: 'accepterMethod', options: this.dictDataList, baseCode: 'AlmAssetReceipt-accepterMethod' },
        { label: '礼品来源：', type: 'baseInput', placeholder: '礼品来源', value: 'giftSource', options: this.dictDataList, baseCode: 'AlmAssetReceipt-giftSource' },
        {
          label: '仓库名称：',
          type: 'baseInput',
          baseCode: 'listAddressWarehouse',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          placeholder: '仓库名称',
          value: 'warehouseId',
          relyOn: 'companyId',
          query: { companyId: this.moreQueryParams.companyId }
        },
        { label: '仓库公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '仓库公司', value: 'companyId' },
        { label: '使用公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '仓库公司', value: 'companyId' },
        { label: '供应商:', type: 'baseInput', baseCode: 'listSupplier', labelName: 'supplierName', valueName: 'supplierId', value: 'supplierId' },
        { label: '出账公司：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
        { label: '合同名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        {
          label: '具体位置：',
          type: 'baseInput',
          baseCode: 'listAddressSpecificLocation',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          value: 'locationId',
          relyOn: 'parentId',
          query: { parentId: this.moreQueryParams.ereaId }
        },
        { label: '招标协议：', type: 'baseInput', baseCode: 'listAgreement', labelName: 'tenderAgreementName', valueName: 'tenderAgreementId', value: 'tenderAgreementId' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '请输入创建日期期间', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '请输入更新日期期间', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '发货日期期间：', type: 'daterange', valueStart: 'shipmentDateStart', valueEnd: 'shipmentDateDateEnd' },
        { label: '验收状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', options: this.dictDataList, value: 'status' },
        { label: '联系电话：', type: 'input', placeholder: '请输入联系电话', value: 'mobile' }
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
        ...this.moreQueryParams,
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
          this.tablePage.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'AlmAssetReceipt-accepterMethod' // 入库方式
      dictCodes += ',AlmAssetReceipt-giftSource' // 资产来源
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
      window.$wujie.props.route({
        path: '/gift/receipt',
        module: 'Gift',
        fullPath: '/gift/receipt/detail',
        title: '礼品入库详情',
        condition: { id }
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
    // 新增 编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/gift/receipt',
          module: 'Gift',
          fullPath: '/gift/receipt/edit',
          title: '编辑礼品入库',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/gift/receipt',
          module: 'Gift',
          fullPath: '/gift/receipt/add',
          title: '新增礼品入库'
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
        path: '/gift/receipt',
        module: 'Gift',
        fullPath: '/gift/receipt/edit',
        title: `礼品入库${statusObj[todo]}`,
        condition: { id: row.giftReceiptId, todo: todo }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除礼品入库单信息编号为"' + row.giftReceiptCode + '"的数据项？').then(() => {
        delReceipt(row.giftReceiptId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'asset/receipt/export',
        {
          ...this.queryParams
        },
        `receipt_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['receiptQuantity', 'receiptExcTaxAmount'])
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

