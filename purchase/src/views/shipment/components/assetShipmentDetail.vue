<template>
  <div>
    <div class="mb-10">
      <uploadImg v-if="showBtn" :disabled="btnDisabled" class="pr-10" @success="uploadImgSuccess" />
      <el-button
        v-if="showBtn&&(formData.materialType==1?formData.ynGenLine!=1:true)"
        icon="el-icon-download"
        type="primary"
        plain
        size="mini"
        :disabled="tableData.length==0"
        @click="downloadAssetDetail"
      >下载资产明细</el-button>
      <uploadFile v-if="showBtn&&(formData.materialType==1?formData.ynGenLine!=1:true)" class="pl-10 pr-10" url="/srm/shipment/importData" @uploadSuccess="uploadSuccess" />
      <el-button v-if="!showBtn" v-hasPermi="['srm:material:export']" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      <el-button v-if="showBtn" v-hasPermi="['srm:material:remove']" type="danger" plain icon="el-icon-delete" size="mini" @click="handleDeleteBatch">删除</el-button>
    </div>
    <vxe-grid
      ref="xTable"
      v-loading="tableLoading"
      max-height="500"
      header-align="center"
      align="center"
      :edit-config="{trigger: 'manual', mode: 'row',showIcon:false,autoClear:false}"
      :data="tableData"
      border
      :resizable="true"
      :columns="tableColumn"
      stripe
      highlight-current-row
      class="vxeTable"
      :edit-rules="validRules"
      show-footer
      auto-resize
      show-overflow="tooltip"
      :footer-method="getFooterData"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seq>
        <span>序号</span>
      </template>
      <template v-slot:pictureName="{ row }">
        <img v-if="!$refs.xTable.isActiveByRow(row)" height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
        <div v-else class="flex j-center">
          <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
          <uploadImg v-if="$refs.xTable.isActiveByRow(row)&&formData.ynGenLine!=1" type="icon" class="pr-10" @success="rowUploadImgSuccess" />
        </div>
      </template>
      <template v-slot:serialNum="{ row }">
        <el-input
          v-if="$refs.xTable.isActiveByRow(row)&&((formData.materialType==1?formData.ynGenLine==1:formData.ynGenLine!=1))"
          v-model="row.serialNum"
          size="mini"
          placeholder="请输入序列号"
        />
        <span v-else>{{ row.serialNum }}</span>
      </template>
      <template v-slot:specificationModel="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row)&&formData.ynGenLine!=1" v-model="row.specificationModel" size="mini" placeholder="请输入规格型号" />
        <span v-else>{{ row.specificationModel }}</span>
      </template>
      <template v-slot:shipmentQuantity="{ row }">
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.shipmentQuantity,{digits:formData.materialType==1?0:3}) }}</span>
        <el-input-number
          v-else
          v-model="row.shipmentQuantity"
          size="mini"
          controls-position="right"
          :precision="formData.materialType==1?0:3"
          :step-strictly="formData.materialType==1?true:false"
          :step="1"
          :min="1"
          :max="row.cacheUnShipmentQuantity"
          placeholder="请输入本次发货数量"
          @change="calculateRow(row)"
        />
      </template>
      <template #logisticsOrderNo="{row}">
        <el-input v-model="row.logisticsOrderNo" size="mini" placeholder="物流单号" />
      </template>
      <template #assetPhysicalState="{ row }">
        <dictDateView :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #assetCharacteristic="{ row }">
        <dictDateView :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template v-slot:todo="{ row,rowIndex }">
        <div class="todo">
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" v-hasPermi="['srm:material:edit']" size="mini" type="text" @click="editRow(row,rowIndex)">修改</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" v-hasPermi="['srm:material:remove']" size="mini" type="text" @click="handleDeleteRow(row,rowIndex)">删除</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" v-hasPermi="['srm:material:edit']" size="mini" type="text" @click="saveFormSubmit(row)">保存</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" v-hasPermi="['srm:material:remove']" size="mini" type="text" @click="cancelRowEvent(row,rowIndex)">取消</el-button>
        </div>
      </template>
    </vxe-grid>
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import { queryUnShippedByPurchaseApplicationId } from '@/api/shipment.js'
import { listDictItems } from '@/api/base.js'
import vxeTable from '@/mixins/vxeTable'
export default {
  mixins: [vxeTable],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    editId: {
      type: String,
      default: ''
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      btnDisabled: true,
      cacheList: [],
      dictDataList: [],
      elImageViewer: false
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seq' } },
        { field: 'materialCode', title: '物资编号', width: 150, fixed: 'left' },
        { field: 'materialName', title: '资产名称', width: 150, fixed: 'left' },
        { field: 'categoryName', title: '资产分类', width: 150 },
        { field: 'pictureName', title: '资产图片', width: 80, slots: { default: 'pictureName', edit: 'pictureName' }, editRender: {} },
        { field: 'serialNum', title: '序列号', width: 140, slots: { default: 'serialNum', edit: 'serialNum' }, editRender: {} },
        {
          field: 'shipmentQuantity',
          title: '本次发货数量',
          width: 120,
          headerAlign: 'center',
          align: 'right',
          slots: { default: 'shipmentQuantity', edit: 'shipmentQuantity' },
          editRender: {}
        },
        { field: 'logisticsOrderNo', title: '物流单号', width: 120, slots: { edit: 'logisticsOrderNo' }, editRender: {} },
        { field: 'buyQuantity', title: '购买数量', width: 120, headerAlign: 'center', align: 'right' },
        { field: 'unShipmentQuantity', title: '未发货数量', width: 120, headerAlign: 'center', align: 'right', visible: this.formData.ynGenLine != 1 },
        { field: 'unShipmentAmount', title: '未发货金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney', visible: this.formData.ynGenLine != 1 },
        { field: 'specificationModel', title: '规格型号', width: 140, slots: { default: 'specificationModel', edit: 'specificationModel' }, editRender: {} },
        { field: 'brandName', title: '品牌', width: 120 },
        { field: 'quantityUnit', title: '数量单位', width: 120 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 150, headerAlign: 'center', align: 'right', formatter: ['formatMoney', 8] },
        { field: 'taxRate', title: '税率（%）', width: 120, formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: ['formatMoney', 8] },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 150, headerAlign: 'center', align: 'right', formatter: ['formatMoney', 8] },
        { field: 'subtotal', title: '金额小计', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'assetCharacteristic', title: '资产特性', width: 120, slots: { default: 'assetCharacteristic' } },
        { field: 'assetPhysicalState', title: '资产物态', width: 120, slots: { default: 'assetPhysicalState' } },
        { field: 'schemeName', title: '方案名称', width: 120 },
        { field: 'remarks', title: '备注', width: 220, headerAlign: 'center', align: 'left' },
        { field: 'todo', title: '操作', width: 130, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: this.showBtn }
      ]
    },
    validRules() {
      return {
        logisticsOrderNo: [{ required: true, message: '请填写物流单号' }],
        shipmentQuantity: [{ required: true, message: '请填写本次发货数量' }],
        serialNum: [{ required: this.formData.materialType == 1 && this.formData.ynGenLine == 1, message: '请填写序列号' }]
      }
    }
  },
  watch: {
    'formData.purchaseApplicationId': {
      handler(newVal, oldVal) {
        if (newVal == oldVal) {
          return
        }
        if (!this.editId && this.formData.purchaseApplicationId) {
          this.init()
        } else {
          this.tableData =
            this.formData.assetDetail.map((item) => {
              if (!item.serialNum) {
                this.$set(item, 'serialNum', '')
              }
              this.$set(item, 'assetName', item.materialName)
              this.$set(item, 'cacheUnShipmentQuantity', this.$vxe.add(item.unShipmentQuantity))
              this.$set(item, 'unShipmentAmount', this.$vxe.multiply(this.formData.ynGenLine == 1 ? 1 : item.unShipmentQuantity, item.priceIncludTax))
              return item
            }) || []
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    init() {
      this.tableLoading = true
      queryUnShippedByPurchaseApplicationId({ purchaseApplicationId: this.formData.purchaseApplicationId })
        .then((res) => {
          var list = res.rows.filter((item) => {
            return item.unShipmentQuantity > 0
          })
          this.tableData = list.map((item) => {
            for (var i in item) {
              if (!item[i]) {
                delete item[i]
              }
            }
            return {
              ...item,
              ...{
                specificationModel: item.modelType,
                assetName: item.materialName,
                quantityUnit: item.unitName,
                shipmentQuantity: item.unShipmentQuantity,
                unShipmentQuantity: 0,
                unShipmentAmount: 0,
                cacheUnShipmentQuantity: this.$vxe.add(item.unShipmentQuantity, item.shipmentQuantity)
              }
            }
          })
          this.$emit('calculate', this.tableData)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 下载资产明细
    downloadAssetDetail() {
      var object = {}
      object.jsonString = JSON.stringify(this.tableData)
      this.download('/srm/shipment/download', object, `申购资产明细_${new Date().getTime()}.xlsx`)
    },
    // 导出
    handleExport() {
      var queryParams = {}
      queryParams['purchaseApplicationCode'] = this.formData.purchaseApplicationCode
      this.download(
        '/srm/shipment/export',
        {
          ...queryParams
        },
        `申购${this.formData.purchaseApplicationCode}资产明细_${new Date().getTime()}.xlsx`
      )
    },
    // 删除
    handleDeleteBatch() {
      var list = this.$refs.xTable.getCheckboxRecords()
      if (list.length == 0 || !list) {
        this.$message({
          message: `请选择数据！`,
          type: 'warning'
        })
        return
      }
      list.forEach((item) => {
        var index = this.tableData.findIndex((temp) => {
          return item.sort == temp.sort
        })
        this.tableData.splice(index, 1)
      })
      this.$emit('calculate', this.tableData)
    },
    // 行编辑
    async editRow(row) {
      var editRow = this.$refs.xTable.getActiveRecord()
      if (editRow) {
        this.calculateRow(editRow.row)
        var errMap = await this.$refs.xTable.validate(editRow.row).catch((errMap) => errMap)
        if (errMap) {
          this.$message({
            type: 'warning',
            message: '请完成正在编辑的行数据'
          })
          return
        }
      }
      this.$nextTick(() => {
        this.$refs.xTable.setActiveRow(row)
      })
    },
    handleDeleteRow(row, index) {
      this.$modal.confirm(`是否确认删除序号为 ${index + 1}；资产名称为 ${row.materialName} 的资产？`).then((res) => {
        this.tableData.splice(index, 1)
      })
      this.$emit('calculate', this.tableData)
    },
    // 保存行
    async saveFormSubmit(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$refs.xTable.clearActived(row)
        return
      }
      this.$message({
        type: 'warning',
        message: '请填写完整数据'
      })
    },
    // 自动计算数据
    calculateRow(row) {
      this.$set(row, 'unShipmentQuantity', this.$vxe.subtract(row.cacheUnShipmentQuantity, row.shipmentQuantity))
      this.$set(row, 'unShipmentAmount', this.$vxe.multiply(row.unShipmentQuantity, row.priceIncludTax))
      this.$emit('calculate', this.tableData)
      if (this.$refs.xTable) {
        this.$refs.xTable.updateFooter()
      }
    },
    cancelRowEvent(row) {
      this.$refs.xTable.clearActived().then((res) => {
        this.$refs.xTable.revertData(row)
      })
    },
    uploadImgSuccess(val) {
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'pictureRui', val.url)
        this.$set(item, 'pictureName', val.name)
      })
    },
    rowUploadImgSuccess(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'pictureRui', val.url)
      this.$set(row, 'pictureName', val.name)
    },
    changeCheck() {
      var list = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = list.length <= 0
    },
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 批量导入
    uploadSuccess(res) {
      res.data.forEach((item) => {
        for (var i in item) {
          if (!item[i]) delete item[i]
        }
        var index = this.tableData.findIndex((temp) => {
          return item.materialCode == temp.materialCode && item.materialName == temp.materialName
        })
        if (index >= 0) {
          this.calculateRow(item[index])
          this.$set(this.tableData, index, { ...this.tableData[index], ...item })
        }
      })
      this.$emit('calculate', this.tableData)
      if (this.$refs.xTable) {
        this.$refs.xTable.updateFooter()
      }
    },
    // 校验明细表
    validTable() {
      return new Promise((resolve) => {
        this.$refs.xTable.fullValidate(this.tableData).then((res) => {
          resolve(res)
        })
      })
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
    // 表尾合计
    getFooterData({ columns, data }) {
      var obj = {
        buyQuantity: this.formData.materialType == 1 ? 0 : 3,
        shipmentQuantity: this.formData.materialType == 1 ? 0 : 3,
        unShipmentQuantity: this.formData.materialType == 1 ? 0 : 3,
        unShipmentAmount: 2,
        taxAmount: 8,
        subtotal: 2,
        priceExcludTax: 8,
        priceIncludTax: 8
      }
      return this.footerMethod(columns, data, '', obj, 1)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
