<template>
  <div>
    <div v-if="showBtn" class="pt-10 mb-10">
      <selectStandbook v-if="showBtn" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <!-- <Pint v-bind="{selectRows}" :disabled="btnDisabled" class="mr-10"></Pint> -->
      <el-button size="mini" icon="el-icon-download" @click="handleExport">导出</el-button>
      <el-button size="mini" type="danger" :disabled="btnDisabled" icon="el-icon-delete" plain @click="handleDeleteBatch">删除</el-button>
    </div>
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      header-align="center"
      align="center"
      :data="tableData"
      border
      max-height="600"
      :resizable="true"
      keep-source
      :columns="tableColumn"
      :row-config="{isHover:true,isCurrent:true}"
      class="vxeTable"
      :edit-config="{trigger: 'manual', mode: 'row',showIcon:false,autoClear:false}"
      :edit-rules="validRules"
      auto-resize
      show-overflow="tooltip"
      show-footer
      :footer-method="getFooterData"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>

      <template #recovereResidualValue="{row}">
        <el-input-number v-model="row.recovereResidualValue" :precision="3" placeholder="回收残值（元）" controls-position="right" />
      </template>
      <template #pictureName="{row}">
        <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row.pictureRui)" />
      </template>
      <template #scrapPictureName="{ row }">
        <div v-if="$refs.xTable.isActiveByRow(row)" class="flex j-center">
          <img height="34px" :src="row.scrapPictureRui" style="cursor: pointer;" alt @click="openImg(row.scrapPictureRui)" />
          <uploadImg type="icon" class="pr-10" @success="rowUploadImgSuccess" />
        </div>
        <div v-else>
          <img height="34px" :src="row.scrapPictureRui" style="cursor: pointer;" alt @click="openImg(row.scrapPictureRui)" />
        </div>
      </template>
      <template #currentLocationName="{row}">{{ row.currentEreaName }}{{ row.currentLocationName?'/'+row.currentLocationName:'' }}</template>
      <template #firstShelfName="{row}">{{ row.firstShelfName }}/{{ row.secondShelfName }}</template>
      <template #assetPhysicalState="{ row }">
        <dictDateView :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #assetCharacteristic="{ row }">
        <dictDateView :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #remarks="{row}">
        <el-input v-model="row.remarks" placeholder="备注" />
      </template>
      <template #todo="{row,rowIndex}">
        <div class="todo">
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="editRow(row)">编辑</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="deleteRow(row,rowIndex)">删除</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="saveRow(row)">保存</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="cancelRowEvent(row)">取消</el-button>
        </div>
      </template>
    </vxe-grid>
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
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
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectRows: [],
      loading: false,
      tableData: [],
      validRules: {
        scrapPictureName: [{ required: true, message: '请上传终结资产图片' }],
        recovereResidualValue: [{ required: true, message: '请输入回收残值' }]
      },
      btnDisabled: true,
      elImageViewer: false,
      imgList: [],
      dictDataList: []
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', fixed: 'left', title: '资产编号', width: 150 },
        { field: 'assetName', fixed: 'left', title: '资产名称', width: 150 },
        { field: 'categoryName', title: '资产分类', width: 130 },
        { field: 'pictureName', title: '资产图片', width: 80, slots: { default: 'pictureName' } },
        { field: 'scrapPictureName', title: '终结图片', width: 90, slots: { default: 'scrapPictureName', edit: 'scrapPictureName' }, editRender: {} },
        {
          field: 'recovereResidualValue',
          title: '回收残值（元）',
          width: 150,
          slots: { edit: 'recovereResidualValue' },
          editRender: {},
          headerAlign: 'center',
          align: 'right',
          formatter: 'formatMoney'
        },
        { field: 'netSalvageValue', title: '净残值（元）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'subtotal', title: '金额小计（元）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'remarks', title: '备注', width: 100, slots: { edit: 'remarks' }, editRender: {} },
        { field: 'serialNum', title: '序列号', width: 100 },
        { field: 'specificationModel', title: '规格型号', width: 100 },
        { field: 'brandName', title: '品牌', width: 100 },
        { field: 'inventoryQuantity', title: '库存/在用数量', width: 110, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'scrapQuantity', title: '终结数量', width: 110, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'quantityUnit', title: '数量单位', width: 80 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 90, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'totalRepairNum', title: '累计维修次数', width: 130 },
        { field: 'totalRepairAmount', title: '累计维修金额（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentLocationName', title: '使用区域', width: 170, slots: { default: 'currentLocationName' } },
        { field: 'firstShelfName', title: '存放货架', width: 200, slots: { default: 'firstShelfName' } },
        { field: 'assetCharacteristic', title: '资产特性', width: 130, slost: { default: 'assetCharacteristic' } },
        { field: 'assetPhysicalState', title: '资产物态', width: 130, slost: { default: 'assetPhysicalState' } },
        { field: 'todo', title: '操作', slots: { default: 'todo' }, width: 100, fixed: 'right', visible: this.showBtn }
      ]
    },
    standBookQuery() {
      return [
        {
          labelName: 'centralizedBusinessName',
          valueName: 'centralizedBusinessId',
          label: this.formData.centralizedBusinessName,
          value: this.formData.centralizedBusinessId,
          name: '业务类别',
          require: true
        }
      ]
    }
  },
  watch: {
    'formData.almAssetScrapDetailList': {
      handler(newVal, oldVal) {
        this.tableData = newVal
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    changeCheck() {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = this.selectRows.length <= 0
    },
    // 选择台账列表
    selectStandbookHandler(list) {
      this.tableData = list.map((item) => {
        return {
          ...item,
          ...{
            scrapQuantity: item.inventoryQuantity,
            subtotal: this.$vxe.multiply(item.inventoryQuantity, item.priceIncludTax)
          }
        }
      })
      this.$emit('calculate', this.tableData)
    },
    // 行编辑
    async editRow(row) {
      var editRow = this.$refs.xTable.getActiveRecord()
      if (editRow) {
        var errMap = await this.$refs.xTable.validate(editRow.row).catch((errMap) => errMap)
        if (errMap) {
          this.$message({
            type: 'warning',
            message: '请完成正在编辑的行数据'
          })
          return
        }
      }
      this.$refs.xTable.setActiveRow(row)
    },
    // 行删除
    deleteRow(row, rowIndex) {
      this.$modal.confirm('确认删除资产明细单资产编号为"' + row.assetCode + '"的数据项？').then(() => {
        this.tableData.splice(rowIndex, 1)
        this.$emit('calculate', this.tableData)
      })
    },
    // 行保存
    async saveRow(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.scrapQuantity, row.priceIncludTax))
        this.$refs.xTable.clearActived(row)
        this.$emit('calculate', this.tableData)
        return
      }
      this.$message({
        type: 'warning',
        message: '请填写完整数据'
      })
    },
    // 行取消
    cancelRowEvent(row) {
      this.$refs.xTable.clearActived().then((res) => {
        this.$refs.xTable.revertData(row)
      })
    },
    // 获取字典信息
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 批量删除
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
    },
    // 按钮 - 导出
    handleExport() {
      this.download('/consumable/repairDetail/export', {}, `detail_${new Date().getTime()}.xlsx`)
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(
        columns,
        data,
        '',
        ['inventoryQuantity', 'scrapQuantity', 'priceExcludTax', 'taxAmount', 'priceIncludTax', 'subtotal', 'recovereResidualValue', 'netSalvageValue', 'totalRepairAmount'],
        1
      )
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
    openImg(url) {
      this.imgList = [url]
      this.elImageViewer = true
    },
    // 关闭大图查看
    imgViewerClose() {
      this.elImageViewer = false
    },
    // 行上传图片
    rowUploadImgSuccess(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'scrapPictureRui', val.url)
      this.$set(row, 'scrapPictureName', val.name)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
