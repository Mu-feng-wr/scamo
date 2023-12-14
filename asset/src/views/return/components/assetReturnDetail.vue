<template>
  <div>
    <div class="pt-10 mb-10">
      <selectStandbook v-if="showBtn&&editForm" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <!-- <Pint v-if="!showBtn" :select-rows="tableData" class="mr-10"></Pint> -->
      <el-button size="mini" icon="el-icon-upload2" :disabled="tableData.length==0">导出</el-button>
      <el-button v-if="showBtn&&editForm" icon="el-icon-delete" type="danger" size="mini" plain :disabled="btnDisabled" @click="handleDeleteBatch">删除</el-button>
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
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template #pictureName="{row}">
        <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" placeholder="优惠金额" :precision="3" controls-position="right" />
      </template>
      <template #currentUserName="{row}">
        <el-input :value="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="选择使用人" @focus="userDialogVisible=true" />
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

        <span v-else>{{ row.currentEreaName }} {{ row.currentLocationName?'/'+row.currentLocationName:'' }}</span>
      </template>
      <template #firstShelfName="{row}">{{ row.firstShelfName }}{{ row.secondShelfName?'/'+row.secondShelfName:'' }}</template>
      <template #assetCharacteristic="{row}">
        <dictDateView :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #assetPhysicalState="{row}">
        <dictDateView :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #schemeName="{row}">
        <base-input
          :value.sync="row.schemeId"
          :label.sync="row.schemeName"
          :code.sync="formData.schemeCode"
          code-name="schemeCode"
          label-name="schemeName"
          value-name="schemeId"
          :options-list="schemeList"
          placeholder="方案名称"
        />
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
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import { listAddressQueryUseAreaTree, listDictItems } from '@/api/base.js'
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
    },
    schemeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    editForm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectRows: [],
      loading: false,
      tableData: [],
      validRules: {},
      userDialogVisible: false,
      useAreaTree: [],
      btnDisabled: true,
      elImageViewer: false,
      imgList: [],
      dictDataList: []
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left' },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '资产编号', fixed: 'left', width: 130 },
        { field: 'assetName', title: '资产名称', fixed: 'left', width: 150 },
        { field: 'categoryName', title: '资产分类', width: 150 },
        { field: 'pictureName', title: '资产图片', width: 90, slots: { default: 'pictureName' } },
        { field: 'remarks', title: '备注', width: 100, slots: { edit: 'remarks' }, editRender: {}, headerAlign: 'center', align: 'left' },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentLocationName', title: '使用区域', width: 200, slots: { default: 'currentLocationName' } },
        { field: 'returnQuantity', title: '借用/领用数量', width: 130, headerAlign: 'center', align: 'right' },
        { field: 'quantityUnit', title: '数量单位', width: 80 },
        { field: 'serialNum', title: '序列号', width: 100 },
        { field: 'specificationModel', title: '规格型号', width: 100 },
        { field: 'brandName', title: '品牌', width: 100 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'discountAmount', title: '优惠金额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'firstShelfName', title: '存放货架', width: 180, slots: { default: 'firstShelfName' } },
        { field: 'assetCharacteristic', title: '资产特性', width: 160, slots: { default: 'assetCharacteristic' } },
        { field: 'assetPhysicalState', title: '资产物态', width: 160, slots: { default: 'assetPhysicalState' } },
        { field: 'schemeName', title: '方案名称', width: 160 },
        { field: 'todo', title: '操作', width: 100, slots: { default: 'todo' }, fixed: 'right', visible: this.showBtn && this.editForm }
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
    'formData.almAssetReturnDetailList': {
      handler(newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          this.tableData = newVal
        }
      },
      immediate: true
    }
  },
  created() {
    this.getUserArea()
    this.getDictData()
  },
  methods: {
    // 列表 全选 单选
    changeCheck() {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = this.selectRows.length <= 0
    },
    // 选择台账
    selectStandbookHandler(list) {
      this.tableData = list.map((item) => {
        for (var i in item) {
          if (!item[i]) {
            delete item[i]
          }
        }
        this.$set(item, 'returnQuantity', item.inventoryQuantity)
        this.$set(item, 'subtotal', this.$vxe.multiply(item.returnQuantity, item.priceIncludTax))
        return item
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
    // 行保存
    async saveRow(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.returnQuantity, row.priceIncludTax))
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
    //  行选择使用人
    userSelect(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'currentUserName', val.userName)
      this.$set(editRow, 'currentUserId', val.userId)
      this.$set(editRow, 'currentOrgName', val.deptName)
      this.$set(editRow, 'currentOrgId', val.deptId)
    },
    // 行  选择使用区域
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
    // 获取使用区域树
    getUserArea() {
      listAddressQueryUseAreaTree().then((res) => {
        this.useAreaTree = res.data
        this.useAreaTree.forEach((item) => {
          if (!item.children) {
            item['disabled'] = true
          }
        })
      })
    },
    // 获取字典表数据
    getDictData() {
      var dictCodes = 'AamMaterialAccount-assetCharacteristic' // 资产特性
      dictCodes += ',AamMaterialAccount-assetPhysicalState' // 资产物态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 校验明细表
    validTable() {
      return new Promise((resolve) => {
        this.$refs.xTable.fullValidate(this.tableData).then((res) => {
          resolve(res)
        })
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
      return this.footerMethod(columns, data, '', ['returnQuantity', 'priceExcludTax', 'taxAmount', 'priceIncludTax', 'subtotal', 'discountAmount'], 1)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
