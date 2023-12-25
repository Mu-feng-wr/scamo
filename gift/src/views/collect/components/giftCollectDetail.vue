<template>
  <div>
    <div v-if="showBtn" class="pt-10 mb-10">
      <selectStandbook v-if="showBtn" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <!-- <selectArea v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" /> -->

      <el-button v-if="showBtn" size="mini" icon="el-icon-printer">打印资产标签</el-button>
      <el-button v-if="showBtn" size="mini" icon="el-icon-upload2">导出</el-button>
      <el-button v-if="showBtn" plain icon="el-icon-delete" type="danger" size="mini" @click="handleDeleteBatch">删除</el-button>
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
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template #remarks="{row}">
        <el-input v-model="row.remarks" placeholder="备注" />
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" placeholder="优惠金额" :precision="2" controls-position="right" />
      </template>
      <template #currentLocationName="{row}">
        <el-cascader
          ref="categoryCascader"
          v-model="row.currentLocationId"
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
        <el-select v-if="$refs.xTable.isActiveByRow(row)" v-model="row.usePurpose" placeholder="使用目的">
          <el-option label="政府公关" value="1" />
          <el-option label="媒体公关" value="2" />
          <el-option label="新员工入职" value="3" />
        </el-select>
        <span v-else>{{ {1:"政府公关",2:"媒体公关",3:"新员工入职"}[row.usePurpose] }}</span>
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
  </div>
</template>
<script>
import { listSchemeQuery, listDictItems } from '@/api/base.js'
export default {
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
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      validRules: {},
      btnDisabled: true,
      dictDataList: [],
      schemeList: []
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 50, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '资产编码', width: 150, fixed: 'left' },
        { field: 'assetName', title: '资产名称', width: 150, fixed: 'left' },
        { field: 'categoryName', title: '资产分类 ', width: 150 },
        { field: 'pictureName', title: '资产图片', width: 200 },
        { field: 'serialNum', title: '序列号', width: 160, showOverflow: true },
        { field: 'specificationModel', title: '规格型号', width: 160, showOverflow: true },
        { field: 'brandName', title: '品牌', width: 130 },
        { field: 'inventoryQuantity', title: '库存数量', width: 130, headerAlign: 'center', align: 'right' },
        { field: 'collectQuantity', title: '领用数量', width: 130, headerAlign: 'center', align: 'right' },
        { field: 'usePurpose', title: '使用目的', width: 160, slots: { default: 'usePurpose', edit: 'usePurpose' }, editRender: {} },
        { field: 'quantityUnit', title: '数量单位', width: 130 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        { field: 'taxRate', title: '税率（%）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        { field: 'taxAmount', title: '税额（元）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        { field: 'subtotal', title: '金额小计', width: 130, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        // { field: 'discountAmount', title: '优惠金额（元）', width: 160, formatter: 'formatMoney', headerAlign: 'center', align: 'right', slots: { edit: 'discountAmount' }, editRender: {} },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentEreaName', title: '使用区域', width: 180 },
        { field: 'currentLocationName', title: '具体位置', width: 160, slots: { edit: 'currentLocationName' }, editRender: {} },
        { field: 'firstShelfName', title: '存放货架', width: 130 },
        { field: 'assetCharacteristic', title: '资产特性', width: 160, slots: { default: 'assetCharacteristic', edit: 'assetCharacteristic' }, editRender: {} },
        { field: 'assetPhysicalState', title: '资产物态', width: 160, slots: { default: 'assetPhysicalState', edit: 'assetPhysicalState' }, editRender: {} },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 130 },
        { field: 'termValidity', title: '有效期', width: 130 },
        { field: 'startDate', title: '启用日期', width: 130 },
        // { field: 'schemeName', title: '方案名称', width: 160, slots: { edit: 'schemeName' }, editRender: {} },
        { field: 'ynInviteTender', title: '招标资产编码', width: 130 },
        // { field: 'remarks', title: '备注', width: 250, slots: { edit: 'remarks' }, editRender: {} },
        { field: 'todo', title: '操作', width: 160, slots: { default: 'todo' }, fixed: 'right', visible: this.showBtn }
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
    // giftCollectDetailId
  },
  watch: {
    'formData.almAssetCollectDetailList': {
      handler(newVal, oldVal) {
        this.tableData = newVal || []
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
      var list = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = list.length <= 0
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
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
