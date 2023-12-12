<template>
  <div style="display:inline-block">
    <el-button :disabled="disabled" type="primary" :size="size" icon="el-icon-plus" plain @click="openDialog">{{ title }}</el-button>
    <vxe-modal :title="title" v-model="dialogVisible" width="70%" height="90%" esc-closable resize @hide="close">
      <el-container>
        <el-header class="mb-10" style="overflow:hidden;">
          <el-row :gutter="14">
            <el-col :span="4">
              <el-input size="mini" v-model="queryParams.assetCode" placeholder="资产编码" clearable />
            </el-col>
            <el-col :span="4">
              <el-input size="mini" v-model="queryParams.assetName" placeholder="资产名称" clearable />
            </el-col>
            <el-col :span="4">
              <el-input size="mini" v-model="queryParams.subscriptionCode" placeholder="申购单编号" clearable />
            </el-col>
            <el-col :span="4">
              <base-input size="mini" :value.sync="queryParams.assetCompanyId" baseCode="companyList" resultLabel="data" labelName="deptName" valueName="deptId" placeholder="公司名称"></base-input>
            </el-col>
            <el-col :span="4">
              <base-input
                size="mini"
                :disabled="disabledSelect.centralizedBusinessId"
                :label.sync="queryParams.centralizedBusinessName"
                :value.sync="queryParams.centralizedBusinessId"
                :preStore="disabledSelect.centralizedBusinessId?[{businessId:queryParams.centralizedBusinessId,businessName:queryParams.centralizedBusinessName}]:[]"
                baseCode="listType"
                labelName="businessName"
                valueName="businessId"
                placeholder="业务类型"
              ></base-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <vxe-grid
            ref="xTable"
            height="auto"
            :loading="tableLoading"
            header-align="center"
            align="center"
            :data="tableData"
            :pager-config="tablePage"
            border
            :resizable="true"
            :columns="tableColumn"
            :row-config="{isHover:true,isCurrent:true}"
            class="vxeTable"
            @page-change="handlePageChange"
            @cell-click="cellClick"
          >
            <template #seqHeader>序号</template>
            <template #pictureName="{row}">
              <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
            </template>
          </vxe-grid>
        </el-main>
        <el-footer style="height:35px;">
          <div class="text-right">
            <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
            <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
          </div>
        </el-footer>
      </el-container>
    </vxe-modal>
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listAccount } from '@/api/asset/account.js'
import { listAccount as listConsumeAccount } from '@/api/consume/account.js'
import { listAccount as listGiftAccount } from '@/api/gift/account.js'
export default {
  props: {
    title: {
      type: String,
      default: '检索台账'
    },
    type: {
      type: [Number, String],
      default: '1' // 1是资产，2是耗材，3是礼品
    },
    selectType: {
      type: String,
      default: 'checkbox'
    },
    query: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  mixins: [vxeTable],
  data() {
    return {
      dialogVisible: false,
      queryParams: {},
      disabledSelect: {},
      elImageViewer: false,
      imgList: [],
      tableColumn: [
        { type: this.selectType, width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '资产编码', width: 160, fixed: 'left' },
        { field: 'assetName', title: '资产名称', width: 180, fixed: 'left' },
        { field: 'pictureName', title: '资产图片名称', width: 150, slots: { default: 'pictureName' } },
        { field: 'serialNum', title: '序列号', width: 200 },
        { field: 'specificationModel', title: '规格型号', width: 200 },
        { field: 'brandName', title: '品牌', width: 130 },
        { field: 'receiptQuantity', title: '入库数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'inventoryQuantity', title: '库存数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'reservedQuantity', title: '留库数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'quantityUnit', title: '数量单位', width: 130 },
        { field: 'conversionUnit', title: '换算单位', width: 130 },
        { field: 'conversionQuantity', title: '换算数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'discountAmount', title: '优惠金额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'contractName', title: '合同', width: 130 }
      ]
    }
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.queryParams = {
        ...this.queryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      let queryFunc = new Function()
      if (this.type == 1) {
        queryFunc = listAccount
      } else if (this.type == 2) {
        queryFunc = listConsumeAccount
      } else if (this.type == 3) {
        queryFunc = listGiftAccount
      }
      if (queryFunc !== undefined) {
        queryFunc(this.queryParams)
          .then((res) => {
            this.tableData = res.rows
            this.tablePage.total = res.total
          })
          .finally(() => {
            this.tableLoading = false
          })
      }
    },
    reset() {},
    openDialog() {
      this.disabledSelect = {}
      if (this.query && this.query.length > 0) {
        let text = ''
        this.query.forEach((item) => {
          if (item.require) {
            this.disabledSelect[item.valueName] = true
            this.queryParams[item.labelName] = item.label
            this.queryParams[item.valueName] = item.value
          }
          if (!item.value) {
            text = item.name
          }
        })
        if (text) {
          this.$message({
            type: 'warning',
            message: `请选择${text}`
          })
          return
        }
      }
      this.dialogVisible = true
      this.load()
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    cellClick({ row, column }) {
      if (column.type == 'checkbox') {
        return
      }
      if (this.selectType == 'radio') {
        this.$refs.xTable.setRadioRow(row, true)
      } else if (this.selectType == 'checkbox') {
        this.$refs.xTable.setCheckboxRow(row, true)
      }
    },
    confirm() {
      let list = this.$refs.xTable.getCheckboxRecords()
      this.$emit('confirm', list)
      this.close()
    },
    close() {
      this.dialogVisible = false
    },
    // 打开图片预览
    openImg(row) {
      this.elImageViewer = true
      this.imgList = [row.pictureRui]
    },
    // 关闭图片预览
    imgViewerClose() {
      this.elImageViewer = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
