<template>
  <div>
    <div class="pt-10 mb-10">
      <selectMaterial
        v-if="formData.accepterMethod && formData.accepterMethod != 1 && showBtn && formData.ynGenLine != 1"
        :query="selectMaterialQuery"
        class="pr-10"
        size="mini"
        :selected-data="formData.accepterMethod != 1 ? tableData : []"
        @confirm="selectMaterialHandler"
      />
      <el-button
        v-if="showBtn && formData.ynGenLine != 1 && formData.accepterMethod != 1"
        icon="el-icon-download"
        :disabled="tableData.length == 0"
        size="mini"
        type="primary"
        plain
        @click="downloadAssetDetail('asset')"
      >下载资产标准</el-button>
      <el-button
        v-if="showBtn && formData.ynGenLine != 1 && formData.accepterMethod == 1"
        icon="el-icon-download"
        :disabled="tableData.length == 0"
        type="primary"
        plain
        size="mini"
        @click="downloadAssetDetail('receipt')"
      >下载申购资产明细</el-button>
      <uploadFile v-if="showBtn && formData.ynGenLine != 1" class="pl-10" plain size="mini" url="/asset/receipt/importData" @uploadSuccess="uploadSuccess" />
      <uploadImg v-if="showBtn && editForm && formData.ynGenLine != 1" size="mini" :disabled="btnDisabled" class="pl-10 pr-10" @success="uploadImgSuccess" />
      <setUser v-if="showBtn && editForm && formData.ynGenLine != 1" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="setUserHandler" />
      <selectArea v-if="showBtn && editForm && formData.ynGenLine != 1" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" />
      <selectShelf v-if="showBtn && editForm" :disabled="btnDisabled" size="mini" :query="{ parentId: formData.warehouseId }" class="pr-10" @confirm="selectShelfHandler" />
      <!-- <Pint v-if="formData.ynGenLine == 1 && formData.status == 1" v-bind="{ selectRows }" class="mr-10" type="qrCode" :disabled="btnDisabled"></Pint>-->
      <el-button size="mini" icon="el-icon-upload2" :disabled="tableData.length == 0" @click="exportAssetDeatil">导出</el-button>
      <el-button v-if="showBtn && editForm" size="mini" :disabled="btnDisabled" type="danger" icon="el-icon-delete" plain @click="batchDeleteRow">删除</el-button>
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
      :columns="tableColumn"
      :row-config="{ isHover: true, isCurrent: true }"
      :edit-config="{ trigger: 'manual', mode: 'row', showIcon: false, autoClear: false }"
      class="vxeTable"
      stripe
      highlight-current-row
      :edit-rules="validRules"
      show-footer
      show-overflow="tooltip"
      :footer-method="getFooterData"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template v-slot:pictureName="{ row }">
        <div v-if="$refs.xTable.isActiveByRow(row) && (formData.status == 0 || !formData.status)" class="flex j-center">
          <img height="34px" :src="row.pictureRui" style="cursor: pointer" alt @click="openImg(row)" />
          <uploadImg v-if="$refs.xTable.isActiveByRow(row)" type="icon" class="pr-10" @success="rowUploadImgSuccess" />
        </div>
        <img v-else height="34px" :src="row.pictureRui" alt style="cursor: pointer" @click="openImg(row)" />
      </template>
      <template #serialNum="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.serialNum" placeholder="序列号" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.serialNum }}</span>
      </template>
      <template #alterUnitNum="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.alterUnitNum" placeholder="购买数量" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.alterUnitNum, { digits: 2 }) }}</span>
      </template>
      <template #receiptQuantity="{ row }">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.receiptQuantity" controls-position="right" :precision="2" :min="1" placeholder="入库数量" />
        <span v-else>{{ $vxe.commafy(row.receiptQuantity, { digits: formData.materialType == 1 ? 0 : 3 }) }}</span>
      </template>
      <template #priceExcludTax="{ row }">
        <el-input-number
          v-if="$refs.xTable.isActiveByRow(row)"
          v-model="row.priceExcludTax"
          controls-position="right"
          :precision="8"
          :min="0"
          placeholder="不含税单价（元）"
          @change="calculateRow(row)"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.priceExcludTax, { digits: 8 }) }}</span>
      </template>
      <template #taxRate="{ row }">
        <el-input-number
          v-if="$refs.xTable.isActiveByRow(row)"
          v-model="row.taxRate"
          controls-position="right"
          :precision="0"
          step-strictly
          :min="1"
          placeholder="税率（%）"
          @change="calculateRow(row)"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.taxRate, { digits: 2 }) }}</span>
      </template>
      <template #taxAmount="{ row }">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.taxAmount" controls-position="right" :precision="2" :min="0" placeholder="税额（元）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.taxAmount, { digits: 8 }) }}</span>
      </template>
      <template #priceIncludTax="{ row }">
        <span>{{ $vxe.commafy(row.priceIncludTax, { digits: 8 }) }}</span>
      </template>
      <template #discountAmount="{ row }">
        <el-input-number
          v-if="$refs.xTable.isActiveByRow(row) && !formData.assetReceiptId && !row.assetReceiptDetailId"
          v-model="row.discountAmount"
          controls-position="right"
          :precision="2"
          :min="1"
          placeholder="优惠金额（元）"
        />
        <span v-else>{{ $vxe.commafy(row.discountAmount, { digits: 2 }) }}</span>
      </template>
      <template #currentUserName="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="使用人" @focus="userDialogVisible = true" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.currentUserName }}</span>
      </template>

      <template #currentLocationName="{ row }">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
          ref="categoryCascader"
          v-model="row.currentLocationId"
          :props="{ label: 'label', value: 'id', children: 'children' }"
          :options="useAreaTree"
          placeholder="具体位置"
          :filterable="true"
          clearable
          style="width: 100%"
          @change="useAreaChange($event, row)"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
        <span v-else>{{ row.currentEreaName }} {{ row.currentLocationName ? '/' + row.currentLocationName : '' }}</span>
      </template>
      <template #firstShelfName="{ row }">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
          :value="[row.firstShelfId, row.secondShelfId]"
          :options="shelfList"
          :props="props"
          placeholder="存放货架"
          @change="changeShelfName($event, row)"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.firstShelfName }}/{{ row.secondShelfName }}</span>
      </template>

      <template #assetCharacteristic="{ row }">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetCharacteristic"
          :value.sync="row.assetCharacteristic"
          :options-list="assetPhysicalStateList"
          placeholder="资产特性"
          @change="changeAssetCharacteristic(row)"
        />
        <dictDateView v-if="!$refs.xTable.isActiveByRow(row)" :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #assetPhysicalState="{ row }">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetPhysicalState"
          :value.sync="row.assetPhysicalState"
          :options-list="dictDataList"
          placeholder="资产物态"
          @change="changeAssetPhysicalState(row)"
        />
        <dictDateView v-if="!$refs.xTable.isActiveByRow(row)" :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>

      <template #qualityGuaranteePeriod="{ row }">
        <el-date-picker
          v-if="$refs.xTable.isActiveByRow(row) && !formData.assetReceiptId && !row.assetReceiptDetailId"
          v-model="row.qualityGuaranteePeriod"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择质保期"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.toDateString(row.qualityGuaranteePeriod, 'yyyy-MM-dd') }}</span>
      </template>
      <template #termValidity="{ row }">
        <el-date-picker
          v-if="$refs.xTable.isActiveByRow(row) && !formData.assetReceiptId && !row.assetReceiptDetailId"
          v-model="row.termValidity"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择有效期"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.toDateString(row.termValidity, 'yyyy-MM-dd') }}</span>
      </template>
      <template #startDate="{ row }">
        <el-date-picker v-if="$refs.xTable.isActiveByRow(row)" v-model="row.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择启用日期" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.toDateString(row.startDate, 'yyyy-MM-dd') }}</span>
      </template>
      <template #schemeName="{ row }">
        <el-select v-if="$refs.xTable.isActiveByRow(row)" v-model="row.schemeName" placeholder="方案名称">
          <el-option v-for="(item, i) in schemeList" :key="i" :label="item.schemeName" :value="item.schemeName" />
        </el-select>

        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.schemeName }}</span>
      </template>
      <template #ynInviteTender="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row) && !formData.assetReceiptId && !row.assetReceiptDetailId" v-model="row.ynInviteTender" placeholder="招标资产编码" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.ynInviteTender }}</span>
      </template>
      <template #remarks="{ row }">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.remarks" placeholder="备注" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.remarks }}</span>
      </template>
      <template #todo="{ row, rowIndex }">
        <div class="todo">
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" type="text" size="mini" @click="editRow(row)">编辑</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="deleteRow(row, rowIndex)">删除</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" type="text" size="mini" @click="saveRow(row)">保存</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="cancelRowEvent(row)">取消</el-button>
        </div>
      </template>
    </vxe-grid>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import { listDictItems, listSchemeQuery, queryAddressTreeSelect, queryUnShippedByPurchaseApplicationId, queryCompanyWarehouseShelfTreeList } from '@/api/base.js'
import vxeTable from '@/mixins/vxeTable'
export default {
  name: 'AssetReceiptDetail',
  mixins: [vxeTable],
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    useAreaTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    editForm: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      selectRows: [],
      loading: false,
      tableData: [],
      userDialogVisible: false,
      dictDataList: [],
      schemeList: [],
      btnDisabled: true,
      shelfList: [],
      imageView: false,
      imgList: [],
      elImageViewer: false,
      materialType: '1',
      props: {
        label: 'label',
        value: 'id'
      }
    }
  },

  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'materialCode', title: '物资编号', width: 150, fixed: 'left', visible: this.formData.ynGenLine == 1 },
        { field: 'assetCode', title: '资产编号', width: 150, fixed: 'left', visible: this.formData.ynGenLine == 1 },
        { field: 'materialName', title: '资产名称', width: 150, fixed: 'left' },
        { field: 'categoryName', title: '资产分类', width: 130 },
        { field: 'pictureName', title: '资产图片', width: 90, slots: { default: 'pictureName', edit: 'pictureName' }, editRender: {} },
        { field: 'serialNum', title: '序列号', width: 160, slots: { default: 'serialNum', edit: 'serialNum' }, editRender: {} },
        { field: 'specificationModel', title: '规格型号', width: 100 },
        { field: 'brandName', title: '品牌', width: 100 },
        { field: 'buyQuantity', title: '购买数量', width: 100, visible: this.formData.accepterMethod == 1 },
        {
          field: 'receiptQuantity',
          title: '入库数量',
          width: 100,
          headerAlign: 'center',
          align: 'right',
          slots: { default: 'receiptQuantity', edit: 'receiptQuantity' },
          editRender: {}
        },
        { field: 'quantityUnit', title: '数量单位', width: 80 },
        {
          field: 'priceExcludTax',
          title: '不含税单价（元）',
          headerAlign: 'center',
          align: 'right',
          width: 160,
          slots: { default: 'priceExcludTax', edit: 'priceExcludTax' },
          editRender: {}
        },
        { field: 'taxRate', title: '税率（%）', headerAlign: 'center', align: 'center', width: 130, slots: { default: 'taxRate', edit: 'taxRate' }, editRender: {} },
        {
          field: 'taxAmount',
          title: '税额（元）',
          headerAlign: 'center',
          align: 'right',
          width: 130,
          slots: { default: 'taxAmount', edit: 'taxAmount' },
          editRender: { name: '$input' }
        },
        { field: 'priceIncludTax', title: '含税单价（元）', headerAlign: 'center', align: 'right', width: 130, slots: { default: 'priceIncludTax' } },
        { field: 'subtotal', title: '金额小计（元）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        {
          field: 'discountAmount',
          title: '优惠金额（元）',
          width: 150,
          headerAlign: 'center',
          align: 'right',
          slots: { default: 'discountAmount', edit: 'discountAmount' },
          editRender: {}
        },
        { field: 'currentUserName', title: '使用人', width: 80, slots: { default: 'currentUserName', edit: 'currentUserName' }, editRender: {} },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentLocationName', title: '使用区域', width: 160, slots: { default: 'currentLocationName', edit: 'currentLocationName' }, editRender: {} },
        { field: 'firstShelfName', title: '存放货架', width: 160, slots: { default: 'firstShelfName', edit: 'firstShelfName' }, editRender: {} },
        { field: 'assetCharacteristic', title: '资产特性', width: 90, slots: { default: 'assetCharacteristic', edit: 'assetCharacteristic' }, editRender: {} },
        { field: 'assetPhysicalState', title: '资产物态', width: 90, slots: { default: 'assetPhysicalState', edit: 'assetPhysicalState' }, editRender: {} },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 100, slots: { default: 'qualityGuaranteePeriod', edit: 'qualityGuaranteePeriod' }, editRender: {} },
        { field: 'termValidity', title: '有效期', width: 100, slots: { default: 'termValidity', edit: 'termValidity' }, editRender: {} },
        { field: 'startDate', title: '启用日期', width: 100, slots: { default: 'startDate', edit: 'startDate' }, editRender: {} },
        { field: 'schemeName', title: '方案名称', width: 130, slots: { default: 'schemeName', edit: 'schemeName' }, editRender: {} },
        { field: 'ynInviteTender', title: '招标资产编码', width: 130, slots: { default: 'ynInviteTender', edit: 'ynInviteTender' }, editRender: {} },
        { field: 'remarks', title: '备注', width: 100, headerAlign: 'center', align: 'left', slots: { default: 'remarks', edit: 'remarks' }, editRender: {} },
        { field: 'todo', title: '操作', width: 100, slots: { default: 'todo' }, fixed: 'right', visible: this.showBtn && this.editForm }
      ]
    },
    selectMaterialQuery() {
      return [
        {
          labelName: 'centralizedBusinessName',
          valueName: 'centralizedBusinessId',
          label: this.formData.centralizedBusinessName,
          value: this.formData.centralizedBusinessId,
          require: true,
          text: '业务类别'
        },
        { valueName: 'materialType', value: this.materialType, disabled: true }
      ]
    },
    validRules() {
      return {
        pictureName: [{ required: this.formData.ynGenLine == 1, message: '请上传图片' }],
        receiptQuantity: [{ required: true, message: '请输入入库数量' }],
        priceExcludTax: [{ required: true, message: '请输入不含税单价' }],
        priceIncludTax: [{ required: true, message: '请输入含税单价' }],
        taxRate: [{ required: true, message: '请输入税率' }],
        taxAmount: [{ required: true, message: '请输入税额' }],
        assetCharacteristic: [{ required: true, message: '请选择资产特性' }],
        assetPhysicalState: [{ required: true, message: '请选择资产物态' }],
        serialNum: [{ required: this.materialType == 1 && this.formData.ynGenLine == 1, message: '请选择序列号' }]
      }
    },
    assetPhysicalStateList() {
      var list = this.dictDataList.filter((item) => {
        return ['1', '8', '9'].includes(item.itemsValue)
      })
      return list
    }
  },
  watch: {
    'formData.purchaseApplicationId': {
      handler(newVal, oldVal) {
        if (!this.formData.assetReceiptId && newVal != oldVal && newVal && this.formData.accepterMethod) {
          this.init()
        } else {
          this.tableData = []
        }
      }
    },
    'formData.almAssetReceiptDetailList': {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          var data = newVal.map((item) => {
            item.subtotal = this.$vxe.multiply(item.receiptQuantity, item.priceIncludTax)
            return item
          })
          this.tableData = data ? JSON.parse(JSON.stringify(data)) : []
          this.materialType = this.tableData.length > 0 ? this.tableData[0].materialType : ''
          this.$emit('calculate', this.tableData)
        }
      },
      immediate: true,
      deep: true
    },
    'formData.warehouseId': {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal) {
          queryCompanyWarehouseShelfTreeList({ parentIds: newVal }).then((res) => {
            this.shelfList = res.data
          })
        }
      },
      immediate: true
    },
    'formData.currentEreaId': {
      handler(newVal, oldVal) {
        if (this.tableData.length) {
          this.tableData.forEach((item) => {
            this.$set(item, 'currentEreaId', this.formData.currentEreaId)
            this.$set(item, 'currentEreaName', this.formData.currentEreaName)
            this.$set(item, 'currentLocationId', this.formData.currentLocationId)
            this.$set(item, 'currentLocationName', this.formData.currentLocationName)
          })
        }
      }
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    init() {
      queryAddressTreeSelect({ parentId: this.formData.warehouseId })
      this.loading = true
      queryUnShippedByPurchaseApplicationId({ purchaseApplicationId: this.formData.purchaseApplicationId })
        .then((res) => {
          this.tableData = res.rows.map((item) => {
            if (this.formData.currentLocationId) {
              this.$set(item, 'currentEreaId', this.formData.currentEreaId)
              this.$set(item, 'currentEreaName', this.formData.currentEreaName)
              this.$set(item, 'currentLocationId', this.formData.currentLocationId)
              this.$set(item, 'currentLocationName', this.formData.currentLocationName)
            }
            return {
              ...item,
              ...{
                assetName: item.materialName,
                subtotal: this.$vxe.multiply(item.buyQuantity, item.priceIncludTax)
              }
            }
          })
          this.$emit('calculate', this.tableData)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 计算税额等
    calculateRow(row) {
      if (row.priceExcludTax && row.taxRate) {
        this.$set(row, 'taxAmount', this.$vxe.multiply(row.priceExcludTax, this.$vxe.divide(row.taxRate, 100)))
      }
      if (row.priceExcludTax && row.priceExcludTax && row.taxRate) {
        this.$set(row, 'priceIncludTax', this.$vxe.add(row.priceExcludTax, this.$vxe.multiply(row.priceExcludTax, this.$vxe.divide(row.taxRate, 100))))
      }
      if (row.priceIncludTax && row.receiptQuantity) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.priceIncludTax, row.receiptQuantity))
      }
      if (this.$refs.xTable) {
        this.$refs.xTable.updateFooter()
      }
      this.$emit('calculate', this.tableData)
    },
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
    },
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
    async saveRow(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$refs.xTable.clearActived(row)
        this.calculateRow(row)
        return
      }
      this.$message({
        type: 'warning',
        message: '请填写完整数据'
      })
    },
    cancelRowEvent(row) {
      this.$refs.xTable.clearActived().then((res) => {
        this.$refs.xTable.revertData(row)
      })
    },
    deleteRow(row, rowIndex) {
      this.$confirm('确认删除资产明细单资产编号为"' + row.materialCode + '"的数据项？').then(() => {
        this.tableData.splice(rowIndex, 1)
        this.$emit('calculate', this.tableData)
      })
    },
    uploadImgSuccess(val) {
      // 图片上传成功
      var list = this.$refs.xTable.getCheckboxRecords()
      console.log(list)
      list.forEach((item) => {
        this.$set(item, 'pictureRui', val.url)
        this.$set(item, 'pictureName', val.name)
      })
    },
    setUserHandler(val) {
      // 设置使用人
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'currentUserId', val.userId)
        this.$set(item, 'currentUserName', val.userName)
        this.$set(item, 'currentOrgId', val.companyId)
        this.$set(item, 'currentOrgName', val.companyName)
      })
    },
    selectMaterialHandler(val, materialType) {
      this.materialType = materialType
      this.tableData = val.map((item) => {
        if (this.formData.currentLocationId) {
          this.$set(item, 'currentEreaId', this.formData.currentEreaId)
          this.$set(item, 'currentEreaName', this.formData.currentEreaName)
          this.$set(item, 'currentLocationId', this.formData.currentLocationId)
          this.$set(item, 'currentLocationName', this.formData.currentLocationName)
        }
        return {
          ...item,
          ...{
            subtotal: this.$vxe.multiply(item.buyQuantity, item.priceIncludTax),
            assetCode: item.materialCode,
            assetName: item.materialName,
            quantityUnit: item.unitName,
            assetPhysicalState: 1
          }
        }
      })
      this.$emit('calculate', this.tableData)
    },
    userSelect(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'currentUserId', val.userId)
      this.$set(row, 'currentUserName', val.userName)
      this.$set(row, 'currentOrgId', val.deptId)
      this.$set(row, 'currentOrgName', val.deptName)
    },
    useAreaChange(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      if (val.length == 2) {
        var leftData = this.useAreaTree.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])

        this.$set(row, 'currentEreaId', val[0])
        this.$set(row, 'currentEreaName', leftData.label)
        this.$set(row, 'currentLocationId', val[1])
        this.$set(row, 'currentLocationName', rightData.label)
      } else {
        this.$set(row, 'currentEreaId', '')
        this.$set(row, 'currentEreaName', '')
        this.$set(row, 'currentLocationId', '')
        this.$set(row, 'currentLocationName', '')
      }
    },
    changeCheck() {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = this.selectRows.length <= 0
    },
    rowUploadImgSuccess(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'pictureRui', val.url)
      this.$set(row, 'pictureName', val.name)
    },
    // 设置具体位置
    selectAreaHandler(val) {
      var flag = false
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        if (item.currentUserId) {
          this.$set(item, 'currentEreaId', val.data.parentId)
          this.$set(item, 'currentEreaName', val.data.parentName)
          this.$set(item, 'currentLocationId', val.data.locationAddressId)
          this.$set(item, 'currentLocationName', val.data.locationName)
        } else {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '未选择使用人的数据，无发设置具体位置'
        })
      }
    },
    // 设置货架
    selectShelfHandler(val) {
      var list = this.$refs.xTable.getCheckboxRecords()
      var flag = false
      list.forEach((item) => {
        if (item.currentUserId) {
          this.$set(item, 'firstShelfId', val.parentId)
          this.$set(item, 'firstShelfName', val.parentName)
          this.$set(item, 'secondShelfId', val.locationAddressId)
          this.$set(item, 'secondShelfName', val.locationName)
        } else {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '未选择使用人的数据，无发设置货架'
        })
      }
    },
    // 行设置货架
    changeShelfName(val) {
      var row = this.$refs.xTable.getActiveRecord().row

      if (val.length == 2) {
        var leftData = this.shelfList.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])
        this.$set(row, 'firstShelfId', val[0])
        this.$set(row, 'firstShelfName', leftData.label)
        this.$set(row, 'secondShelfId', val[1])
        this.$set(row, 'secondShelfName', rightData.label)
      } else {
        this.$set(row, 'firstShelfId', '')
        this.$set(row, 'firstShelfName', '')
        this.$set(row, 'secondShelfId', '')
        this.$set(row, 'secondShelfName', '')
      }
    },
    // 批量删除行数据
    batchDeleteRow() {
      var list = this.$refs.xTable.getCheckboxRecords()
      if (list.length == 0 || !list) {
        this.$message({
          message: `请选择数据！`,
          type: 'warning'
        })
        return
      }
      this.$confirm('确认批量删除资产明细信息？').then((res) => {
        list.forEach((item) => {
          var index = this.tableData.findIndex((temp) => {
            if (item.assetReceiptDetailId) {
              return item.assetReceiptDetailId == temp.assetReceiptDetailId
            } else if (item.materialId) {
              return item.materialId == temp.materialId
            }
          })
          this.tableData.splice(index, 1)
        })
      })
    },
    // 下载资产明细  下载申购明细
    downloadAssetDetail(type) {
      var obj = {
        receipt: '申购资产明细',
        asset: '资产标准'
      }
      this.download('/asset/receipt/download', { jsonString: JSON.stringify(this.tableData) }, `${obj[type]}_${new Date().getTime()}.xlsx`)
    },
    // 导出资产明细
    exportAssetDeatil() {
      this.download('/asset/assetReceiptDetail/export', { assetCollectId: this.formData.assetCollectId }, `资产领用明细_${new Date().getTime()}.xlsx`)
    },
    // 批量导入
    uploadSuccess(res) {
      res.data.forEach((item) => {
        for (var i in item) {
          if (item.receiptQuantity > item.buyQuantity) {
            item.receiptQuantity = item.buyQuantity
          }
          if (!item[i]) delete item[i]
        }
        var index = this.tableData.findIndex((temp) => {
          return item.materialCode == temp.materialCode && item.materialName == temp.materialName
        })
        if (index >= 0) {
          if (this.formData.currentEreaId) {
            this.$set(item, 'currentEreaId', this.formData.currentEreaId)
            this.$set(item, 'currentEreaName', this.formData.currentEreaName)
            this.$set(item, 'currentLocationId', this.formData.currentLocationId)
            this.$set(item, 'currentLocationName', this.formData.currentLocationName)
          }
          this.$set(this.tableData, index, { ...this.tableData[index], ...item })
        }
      })
      this.$emit('calculate', this.tableData)
    },
    // 图片查看大图
    openImg(row) {
      this.imgList = [row.pictureRui]
      this.elImageViewer = true
    },
    // 关闭大图查看
    imgViewerClose() {
      this.elImageViewer = false
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      var obj = {
        buyQuantity: this.formData.materialType == 1 ? 0 : 3,
        receiptQuantity: this.formData.materialType == 1 ? 0 : 3,
        priceExcludTax: 8,
        taxAmount: 8,
        priceIncludTax: 8,
        subtotal: 2,
        discountAmount: 2
      }
      return this.footerMethod(columns, data, '', obj, 1)
    },
    // 改变资产特性
    changeAssetCharacteristic(val) {
      this.tableData.forEach((item) => {
        if (!item.assetCharacteristic) {
          this.$set(item, 'assetCharacteristic', val.assetCharacteristic)
        }
      })
      var list = this.$refs.xTable.getCheckboxRecords()
      if (list && list.length) {
        list.forEach((item) => {
          this.$set(item, 'assetCharacteristic', val.assetCharacteristic)
        })
      }
    },
    // 该边资产物态
    changeAssetPhysicalState(val) {
      this.tableData.forEach((item) => {
        if (!item.assetPhysicalState) {
          this.$set(item, 'assetPhysicalState', val.assetPhysicalState)
        }
      })
      var list = this.$refs.xTable.getCheckboxRecords()
      if (list && list.length) {
        list.forEach((item) => {
          this.$set(item, 'assetPhysicalState', val.assetPhysicalState)
        })
      }
    },
    // 校验明细表
    async validTable() {
      var row = this.$refs.xTable.getActiveRecord()
      if (row) {
        this.saveRow(row.row)
      }
      return new Promise((resolve) => {
        this.$refs.xTable.fullValidate(this.tableData).then((res) => {
          resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
