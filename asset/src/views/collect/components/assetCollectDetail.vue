<template>
  <div>
    <div class="pt-1 mb-8">
      <selectStandbook v-if="showBtn&&editForm" :type="1" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <selectArea v-if="showBtn&&editForm" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" />
      <!-- <Pint v-if="editForm.status==1" :select-rows="selectRows.length>0?selectRows:tableData" v-bind="{selectRows}" class="mr-10" :disabled="btnDisabled"></Pint> -->
      <el-button size="mini" icon="el-icon-upload2" @click="exportAssetDeatil">导出</el-button>
      <el-button v-if="showBtn&&editForm" icon="el-icon-delete" :disabled="btnDisabled" type="danger" size="mini" plain @click="handleDeleteBatch">删除</el-button>
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
      show-footer
      :footer-method="getFooterData"
      show-overflow="tooltip"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template #pictureName="{row}">
        <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
      </template>
      <template #remarks="{row}">
        <el-input v-model="row.remarks" placeholder="备注" />
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" placeholder="优惠金额" :precision="2" controls-position="right" />
      </template>
      <template #currentLocationName="{row}">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
          ref="categoryCascader"
          v-model="row.location"
          :props="{ label: 'label',value: 'id', children: 'children'}"
          :options="useAreaTree"
          placeholder="具体位置"
          :filterable="true"
          clearable
          style="width: 100%"
          @change="useAreaChange($event,row)"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
        <span v-else>{{ row.currentEreaName }}/{{ row.currentLocationName }}</span>
      </template>
      <template #firstShelfName="{row}">
        <span>{{ row.firstShelfName }}{{ row.secondShelfName?'/'+row.secondShelfName:'' }}</span>
      </template>
      <template #assetCharacteristic="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetCharacteristic"
          :value.sync="row.assetCharacteristic"
          :options-list="dictDataList"
          placeholder="资产特性"
        />
        <dictDateView v-else :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #assetPhysicalState="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetPhysicalState"
          :value.sync="row.assetPhysicalState"
          :options-list="dictDataList"
          placeholder="资产物态"
        />
        <dictDateView v-else :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #schemeName="{row}">
        <el-select v-model="row.schemeName" placeholder="方案名称">
          <el-option v-for="(item,i) in schemeList" :key="i" :label="item.schemeName" :value="item.schemeName" />
        </el-select>
      </template>
      <template #usePurpose="{row}">
        <base-input v-if="$refs.xTable.isActiveByRow(row)" base-code="AlmAssetCollect-usePurpose" :value.sync="row.usePurpose" :options-list="dictDataList" placeholder="使用目的" />
        <dictDateView v-else :value="row.usePurpose" :dict-data-list="dictDataList" dict-code="AlmAssetCollect-usePurpose" />
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
import { listDictItems, listSchemeQuery } from '@/api/base.js'
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
      validRules: {
        usePurpose: [{ required: true, message: '请选择使用目的' }],
        currentLocationName: [{ required: true, message: '请选择使用区域' }]
      },
      btnDisabled: true,
      dictDataList: [],
      schemeList: [],
      elImageViewer: false,
      imgList: []
    }
  },

  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: this.formData.status == 1 },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '资产编号', width: 130, fixed: 'left' },
        { field: 'assetName', title: '资产名称', width: 150, fixed: 'left' },
        { field: 'categoryName', title: '资产分类', width: 150 },
        { field: 'pictureName', title: '资产图片', width: 80, slots: { default: 'pictureName' } },
        { field: 'serialNum', title: '序列号', width: 100, showOverflow: true },
        { field: 'specificationModel', title: '规格型号', width: 100, showOverflow: true },
        { field: 'usePurpose', title: '使用目的', width: 130, slots: { default: 'usePurpose', edit: 'usePurpose' }, editRender: {} },
        {
          field: 'currentLocationName',
          title: '使用区域',
          width: 160,

          slots: { default: 'currentLocationName', edit: 'currentLocationName' },
          editRender: {}
        },
        { field: 'schemeName', title: '方案名称', width: 160, slots: { edit: 'schemeName' }, editRender: {} },
        { field: 'remarks', title: '备注', width: 100, slots: { edit: 'remarks' }, editRender: {} },
        {
          field: 'collectQuantity',
          title: '领用数量',
          width: 80,
          headerAlign: 'center',
          align: 'right',
          formatter: ['formatMoney', this.formData.materialType == 1 ? 0 : 3]
        },
        {
          field: 'inventoryQuantity',
          title: '库存/在用数量',
          width: 110,
          headerAlign: 'center',
          align: 'right',
          formatter: ['formatMoney', this.formData.materialType == 1 ? 0 : 3]
        },
        { field: 'quantityUnit', title: '数量单位', width: 80 },
        { field: 'brandName', title: '品牌', width: 100 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, formatter: ['formatMoney', 8], headerAlign: 'center', align: 'right' },
        { field: 'taxRate', title: '税率（%）', width: 90, formatter: 'formatMoney', headerAlign: 'center', align: 'center' },
        { field: 'taxAmount', title: '税额（元）', width: 130, formatter: ['formatMoney', 8], headerAlign: 'center', align: 'right' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, formatter: ['formatMoney', 8], headerAlign: 'center', align: 'right' },
        { field: 'subtotal', title: '金额小计（元）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        { field: 'discountAmount', title: '优惠金额（元）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right', editRender: {} },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'firstShelfName', title: '存放货架', width: 180, slots: { default: 'firstShelfName' } },
        { field: 'assetCharacteristic', title: '资产特性', width: 160, slots: { default: 'assetCharacteristic', edit: 'assetCharacteristic' }, editRender: {} },
        { field: 'assetPhysicalState', title: '资产物态', width: 160, slots: { default: 'assetPhysicalState', edit: 'assetPhysicalState' }, editRender: {} },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 130 },
        { field: 'termValidity', title: '有效期', width: 130 },
        { field: 'startDate', title: '启用日期', width: 130 },
        { field: 'ynInviteTender', title: '招标资产编码', width: 130 },
        { field: 'todo', title: '操作', width: 100, slots: { default: 'todo' }, fixed: 'right', visible: this.editForm && this.showBtn }
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
    'formData.almAssetCollectDetailList': {
      handler(newVal, oldVal) {
        this.tableData = newVal
      },
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
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      dictCodes += ',AlmAssetCollect-usePurpose' // 使用目的
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
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
      this.$set(row, 'location', [row.currentEreaId, row.currentLocationId])
      this.$refs.xTable.setActiveRow(row)
    },
    // 行删除
    deleteRow(row, rowIndex) {
      this.$modal.confirm('确认删除资产明细单资产编号为"' + row.assetCode + '"的数据项？').then(() => {
        this.tableData.splice(rowIndex, 1)
        this.$emit('calculate', this.tableData)
      })
    },
    // 行取消
    cancelRowEvent(row) {
      this.$refs.xTable.clearActived().then((res) => {
        this.$refs.xTable.revertData(row)
      })
    },
    // 行保存
    async saveRow(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$refs.xTable.clearActived(row)
        this.$set(row, 'subtotal', this.$vxe.multiply(row.buyQuantity, row.priceIncludTax))
        this.$emit('calculate', this.tableData)
        return
      }
      this.$message({
        type: 'warning',
        message: '请填写完整数据'
      })
    },
    // 选择使用区域
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
    selectStandbookHandler(list) {
      this.tableData = list.map((item) => {
        delete item.createDate
        delete item.updateDate
        this.$set(item, 'collectQuantity', item.inventoryQuantity)
        this.$set(item, 'currentUserId', this.formData.userId)
        this.$set(item, 'currentUserName', this.formData.userName)
        this.$set(item, 'currentOrgId', this.formData.userOrgId)
        this.$set(item, 'currentOrgName', this.formData.userOrgName)
        return item
      })
      this.$emit('calculate', this.tableData)
    },
    // 设置具体位置
    selectAreaHandler(val) {
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'currentEreaId', val.data.parentId)
        this.$set(item, 'currentEreaName', val.data.parentName)
        this.$set(item, 'currentLocationId', val.data.locationAddressId)
        this.$set(item, 'currentLocationName', val.data.locationName)
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
      this.$emit('calculate', this.tableData)
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
        inventoryQuantity: this.formData.materialType == 1 ? 0 : 3,
        collectQuantity: this.formData.materialType == 1 ? 0 : 3,
        taxAmount: 8,
        priceIncludTax: 8,
        priceExcludTax: 8,
        subtotal: 2,
        discountAmount: 2
      }
      return this.footerMethod(columns, data, '', obj, 0)
    },
    // 导出
    exportAssetDeatil() {},
    // 校验明细表
    validTable() {
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
