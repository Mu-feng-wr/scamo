<template>
  <div class="card-container app-container">
    <el-container>
      <el-aside class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="treeName" size="small" placeholder="请输入分类名称" clearable @change="changeInput" />
          </div>

          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="treeList"
            :props="treeProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <div class="pl-10 pt-10 pr-10" style="height:100%;">
          <el-container>
            <el-header>
              <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
                <div class="flex">
                  <div class="searchLeft">
                    <el-row :gutter="14">
                      <el-col :span="4">
                        <el-input v-model="queryParams.assetCode" size="small" placeholder="资产编码" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.assetName" size="small" placeholder="资产名称" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input size="small" placeholder="标准物资编码" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input size="small" placeholder="标准物资名称" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.serialNum" size="small" placeholder="序列号" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.specificationModel" size="small" placeholder="规格型号" clearable @keyup.enter.native="load" />
                      </el-col>
                    </el-row>
                    <el-row v-show="showAllSearch" class="mt-10" :gutter="14">
                      <el-col :span="4">
                        <el-input v-model="queryParams.quantityUnit" size="small" placeholder="数量单位" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.subscriptionCode" size="small" placeholder="申购单编号" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.subscriberName" size="small" placeholder="申购人姓名" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.acceptedOrderCode" size="small" placeholder="入库单编号" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.acceptedUserName" size="small" placeholder="验收人姓名" clearable @keyup.enter.native="load" />
                      </el-col>
                      <el-col :span="4">
                        <el-input v-model="queryParams.endSheetCode" size="small" placeholder="终结单编号" clearable @keyup.enter.native="load" />
                      </el-col>
                    </el-row>
                  </div>
                  <div class="ml-10 searchRight">
                    <el-button type="primary" icon="el-icon-search" size="small" @click="load">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
                    <MoreQuery label-width="170px" :filter-options="filterOptions" :form-data.sync="queryParams" @reload="load" />
                  </div>
                </div>
              </SearchArea>
            </el-header>
            <el-main>
              <el-container>
                <el-header>
                  <el-row class="mb-15">
                    <el-col :span="12">
                      <el-button plain icon="el-icon-download" size="mini" @click="handleExport">导出列表</el-button>
                    </el-col>
                    <el-col :span="12" class="text-right">
                      <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                      <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
                      <!-- <Pint v-bind="{selectRows}" class="ml-10"></Pint> -->
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
                    auto-resize
                    :resizable="true"
                    :columns="tableColumn"
                    :row-config="{isHover:true,isCurrent:true}"
                    class="vxeTable"
                    show-footer
                    :footer-method="getFooterData"
                    show-overflow="tooltip"
                    @page-change="handlePageChange"
                    @checkbox-all="changeCheck"
                    @checkbox-change="changeCheck"
                  >
                    <template #seqHeader>序号</template>
                    <template #assetCode="{row}">
                      <el-link :underline="false" type="primary" @click="detailHandle(row.materialAccountId)">{{ row.assetCode }}</el-link>
                    </template>
                    <template #currentLocationName="{row}">{{ row.currentEreaName }}{{ row.currentLocationName?'/'+row.currentLocationName:'' }}</template>
                    <template #firstShelfName="{row}">{{ row.firstShelfName }}{{ row.secondShelfName?'/'+row.secondShelfName:'' }}</template>
                    <template #assetCharacteristic="{row}">
                      <dictDateView :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
                    </template>
                    <template #assetPhysicalState="{row}">
                      <dictDateView :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
                    </template>
                    <template #pictureName="{row}">
                      <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
                    </template>
                    <template v-slot:status="{ row }">
                      <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-status" />
                    </template>

                    <template v-slot:todo="{ row }">
                      <div class="todo">
                        <el-button size="mini" type="text" @click="detailHandle(row.materialAccountId)">查看</el-button>
                      </div>
                    </template>
                  </vxe-grid>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </div>
      </el-main>
    </el-container>
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { categoryTreeSelect } from '@/api/category.js'
import { listAccount, listAccountMy } from '@/api/materialAccount'
import { listDictItems, deptTreeSelect } from '@/api/base.js'
import { addressTreeSelect } from '@/api/address.js'
export default {
  mixins: [vxeTable],
  props: {
    type: {
      type: String,
      default: '' // classificationMaterialAccount分类  organizationMaterialAccount组织  locationMaterialAccount库位  personage个人
    }
  },
  data() {
    return {
      treeLoading: false,
      treeList: [],
      treeProps: {},
      treeName: '',
      queryParams: {},
      currentParams: {},
      showAllSearch: false,
      categoryIds: '',
      dictDataList: [],
      elImageViewer: false,
      imgList: [],
      tableColumn: [
        { type: 'checkbox', width: 70, align: 'center', fixed: 'left', visible: true },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetCode', title: '资产编码', width: 160, visibleDisabled: true, fixed: 'left', slots: { default: 'assetCode' } },
        { visible: true, field: 'assetName', title: '资产名称', width: 180, visibleDisabled: true, fixed: 'left' },
        { visible: true, field: 'pictureName', title: '资产图片', width: 120, slots: { default: 'pictureName' } },
        { visible: true, field: 'serialNum', title: '序列号', width: 160 },
        { visible: true, field: 'specificationModel', title: '规格型号', width: 160 },
        { visible: true, field: 'brandName', title: '品牌', width: 130 },
        { visible: true, field: 'receiptQuantity', title: '入库数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'inventoryQuantity', title: '库存数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'reservedQuantity', title: '留库数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'quantityUnit', title: '数量单位', width: 130 },
        { visible: true, field: 'conversionUnit', title: '换算单位', width: 130 },
        { visible: true, field: 'conversionQuantity', title: '换算数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'priceExcludTax', title: '不含税单价（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'taxRate', title: '税率（%）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'discountAmount', title: '优惠金额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'contractName', title: '合同', width: 130 },
        { visible: true, field: 'supplierName', title: '供应商', width: 130 },
        { visible: true, field: 'accountName', title: '出账公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'projectName', title: '项目', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'schemeName', title: '方案', width: 130 },
        { visible: true, field: 'currentUserName', title: '使用人', width: 130 },
        { visible: true, field: 'currentOrgName', title: '使用部门', width: 130 },
        { visible: true, field: 'currentCompanyName', title: '使用公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'currentLocationName', title: '具体位置', width: 220, slots: { default: 'currentLocationName' } },
        { visible: true, field: 'warehouseName', title: '资产所属仓库名称', width: 200 },
        { visible: true, field: 'assetCompanyName', title: '资产所属公司名称', width: 200, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'firstShelfName', title: '存放货架', width: 220, slots: { default: 'firstShelfName' } },
        { visible: true, field: 'assetCharacteristic', title: '资产特性', width: 130, slots: { default: 'assetCharacteristic' } },
        { visible: true, field: 'assetPhysicalState', title: '资产物态', width: 130, slots: { default: 'assetPhysicalState' } },
        { visible: true, field: 'qualityGuaranteePeriod', title: '保质期', width: 130 },
        { visible: true, field: 'termValidity', title: '有效期', width: 130 },
        { visible: true, field: 'ynPublic', title: '是否公开', width: 130 },
        { visible: true, field: 'ynInviteTender', title: '是否招标', width: 130 },
        { visible: true, field: 'centralizedBusinessName', title: '业务归口名称', width: 130 },
        { visible: true, field: 'subscriptionCode', title: '申购单编号', width: 130 },
        { visible: true, field: 'subscriberName', title: '申购人姓名', width: 130 },
        { visible: true, field: 'subscriptionDate', title: '申购日期', width: 130 },
        { visible: true, field: 'acceptedOrderCode', title: '入库单编号', width: 130 },
        { visible: true, field: 'acceptedUserName', title: '验收人姓名', width: 130 },
        { visible: true, field: 'acceptedDate', title: '入库日期', width: 130 },
        { visible: true, field: 'endSheetCode', title: '终结单编号', width: 130 },
        { visible: true, field: 'terminatorName', title: '终结人姓名', width: 130 },
        { visible: true, field: 'endData', title: '终结日期', width: 130 },
        { visible: true, field: 'endSheetMethod', title: '终结方式', width: 130 },
        { visible: true, field: 'endAssetPictureName', title: '终结资产图片名称', width: 150 },
        { visible: true, field: 'recycleResidualValue', title: '回收残值', width: 130 },
        { visible: true, field: 'termValidity1', title: '启用日期', width: 130 },
        { visible: true, field: 'lastCountUserName', title: '最后盘点人姓名', width: 130 },
        { visible: true, field: 'lastCountOrgName', title: '最后盘点部门名称', width: 200 },
        { visible: true, field: 'lastCountDate', title: '最后盘点日期', width: 130 },
        { visible: true, field: 'status', title: '资产状态', width: 130, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 130, fixed: 'right', slots: { default: 'todo' } }
      ],
      selectRows: []
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '当前使用人姓名：', type: 'input', placeholder: '请输入当前使用人姓名', value: 'valuecurrentUserName1' },
        { label: '当前使用部门名称：', type: 'input', placeholder: '请输入当前使用部门名称', value: 'currentOrgName' },
        { label: '当前使用公司名称：', type: 'input', placeholder: '请输入当前使用公司名称', value: 'currentCompanyName' },
        { label: '资产分类名称：', type: 'input', placeholder: '请输入资产分类名称', value: 'categoryName' },
        { label: '品牌名称：', type: 'baseInput', baseCode: 'listBrand', placeholder: '请选择品牌名称', value: 'brandId', labelName: 'brandName', valueName: 'brandId' },
        { label: '库存数量期间：', type: 'numberRange', valueStart: 'inventoryQuantityStart', valueEnd: 'inventoryQuantityEnd' },
        { label: '含税单价（元）期间：', type: 'numberRange', valueStart: 'priceIncludTaxStart', valueEnd: 'priceIncludTaxEnd' },
        {
          label: '资产所属公司名称：',
          type: 'baseInput',
          baseCode: 'companyList',
          resultLabel: 'data',
          labelName: 'deptName',
          valueName: 'deptId',
          placeholder: '仓库公司',
          value: 'companyId'
        },
        {
          label: '资产所属仓库名称：',
          type: 'baseInput',
          baseCode: 'listAddressWarehouse',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          placeholder: '仓库名称',
          value: 'warehouseId',
          relyOn: 'companyId',
          query: { companyId: this.queryParams.companyId }
        },
        {
          label: '资产存储一级货架名称：',
          type: 'baseInput',
          baseCode: 'listAddress',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          placeholder: '资产存储一级货架名称',
          relyOn: 'parentId',
          query: { parentId: this.queryParams.warehouseId },
          value: 'firstShelfId'
        },
        {
          label: '资产存储二级货架名称：',
          type: 'baseInput',
          baseCode: 'listAddress',
          labelName: 'locationName',
          valueName: 'locationAddressId',
          placeholder: '资产存储二级货架名称',
          relyOn: 'parentId',
          query: { parentId: this.queryParams.firstShelfId },
          value: 'secondShelfId'
        },
        { label: '供应商名称：', type: 'baseInput', baseCode: 'listSupplier', labelName: 'supplierName', valueName: 'supplierId', value: 'supplierId' },
        { label: '出账公司名称：', type: 'baseInput', baseCode: 'listAccount', labelName: 'companyName', valueName: 'accountId', value: 'accountId' },
        { label: '合同名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '项目名称：', type: 'baseInput', baseCode: 'listProject', labelName: 'projectName', valueName: 'projectId', value: 'projectId' },
        { label: '方案名称：', type: 'baseInput', baseCode: 'listScheme', labelName: 'schemeName', valueName: 'schemeId', placeholder: '请输入方案名称', value: 'schemeId' },
        { label: '资产特性：', type: 'baseInput', baseCode: 'AamMaterialAccount-assetCharacteristic', value: 'assetCharacteristic' },
        { label: '资产物态：', type: 'baseInput', baseCode: 'AamMaterialAccount-assetPhysicalState', value: 'assetPhysicalState' },
        { label: '状态：', type: 'baseInput', baseCode: 'AamMaterialAccount-status', value: 'status' },
        { label: '申购日期期间：', type: 'daterange', valueStart: 'subscriptionDateStart', valueEnd: 'subscriptionDateEnd' },
        { label: '入库日期期间：', type: 'daterange', valueStart: 'acceptedDateStart', valueEnd: 'acceptedDateEnd' },
        { label: '终结方式：', type: 'baseInput', baseCode: 'AamMaterialAccount-endSheetMethod', value: 'endSheetMethod' },
        { label: '是否公开：', type: 'baseInput', baseCode: 'AamMaterialAccount-ynPublic', value: 'ynPublic' },
        { label: '终结日期期间：', type: 'daterange', valueStart: 'endDataStart', valueEnd: 'endDataEnd' },
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
        { label: '保质期期间：', type: 'daterange', valueStart: 'qualityGuaranteePeriodStart', valueEnd: 'qualityGuaranteePeriodEnd' },
        { label: '是否招标：', type: 'baseInput', baseCode: 'AamMaterialAccount-ynInviteTender', value: 'ynInviteTender' },
        { label: '业务归口名称：', type: 'baseInput', baseCode: 'listType', labelName: 'businessName', valueName: 'businessId', value: 'centralizedBusinessId' },
        { label: '资产卡片编号：', type: 'input', placeholder: '请输入资产卡片编号', value: 'assetCardNo' },
        { label: '处置状态：', type: 'baseInput', baseCode: 'AamMaterialAccount-dealStatus', value: 'dealStatus' }
      ]
    }
  },
  created() {
    this.getDictData()
    this.init()
  },
  mounted() {
    window.$wujie.props.setFunc({ reload: this.reload })
  },
  methods: {
    // 全选  单选
    changeCheck() {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
    },
    init() {
      this.getTreeData()
      this.load()
    },
    getTreeData() {
      this.treeLoading = true
      let func = ''
      if (this.type == 'classificationMaterialAccount' || this.type == 'personage') {
        func = categoryTreeSelect
      } else if (this.type == 'organizationMaterialAccount') {
        func = deptTreeSelect
      } else if (this.type == 'locationMaterialAccount') {
        func = addressTreeSelect
      }
      func()
        .then((res) => {
          this.treeList = res.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.currentParams = {
        ...this.queryParams,
        ...{
          categoryIds: this.categoryIds,
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      var func = null
      if (this.type == 'personage') {
        func = listAccountMy
      } else {
        func = listAccount
      }
      func(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    // 重置
    reset() {
      this.queryParams = {}
      this.load()
    },
    handleNodeClick(data) {
      this.categoryIds = data.id
      this.load()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['receiptQuantity', 'inventoryQuantity', 'reservedQuantity', 'taxAmount', 'discountAmount', 'subtotal'])
    },
    getDictData() {
      let dictCodes = 'AamMaterialAccount-status' // 资产状态
      dictCodes += 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'library/materialAccount/export',
        {
          ...this.currentParams
        },
        `资产台账信息_${new Date().getTime()}.xlsx`
      )
    },
    // 图片查看大图
    openImg(row) {
      this.imgList = [row.pictureRui]
      this.elImageViewer = true
    },
    // 关闭大图预览
    imgViewerClose() {
      this.elImageViewer = false
    },
    detailHandle(id) {
      switch (this.type) {
        case 'classificationMaterialAccount':
          window.$wujie.props.route({
            path: '/standbook/classificationMaterialAccount',
            module: 'Standbook',
            fullPath: '/standbook/classificationMaterialAccount/detail',
            title: '分类-资产信息详情',
            condition: { id }
          })
          break
        case 'organizationMaterialAccount':
          window.$wujie.props.route({
            path: '/standbook/organizationMaterialAccount',
            module: 'Standbook',
            fullPath: '/standbook/organizationMaterialAccount/detail',
            title: '组织-资产信息详情',
            condition: { id }
          })
          break
        case 'ocationMaterialAccount':
          window.$wujie.props.route({
            path: '/standbook/ocationMaterialAccount',
            module: 'Standbook',
            fullPath: '/standbook/ocationMaterialAccount/detail',
            title: '库位-资产信息详情',
            condition: { id }
          })
          break
        case 'personage':
          window.$wujie.props.route({
            path: '/standbook/indexMaterialAccount',
            module: 'Standbook',
            fullPath: '/standbook/indexMaterialAccount/detail',
            title: '我的-资产信息详情',
            condition: { id }
          })
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
<style lang="scss" scoped>
.aside {
  background: #fff;
  padding: 0;
  width: 230px !important;
}
.tree {
  height: calc(100% - 56px);
  overflow: auto;
}
.form-table .section-card__body .el-row:first-child {
  border: none;
}
</style>
