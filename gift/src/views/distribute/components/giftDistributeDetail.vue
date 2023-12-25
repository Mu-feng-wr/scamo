<template>
  <div>
    <div v-if="showBtn" class="pt-10 mb-10">
      <selectStandbook v-if="showBtn" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <!-- <selectArea v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" />-->

      <el-button v-if="showBtn" size="mini" :disabled="btnDisabled">打印资产标签</el-button>
      <el-button v-if="showBtn" size="mini" :disabled="btnDisabled">导出</el-button>
      <el-button v-if="showBtn" icon="el-icon-delete" type="danger" size="mini" :disabled="btnDisabled" @click="handleDeleteBatch">删除</el-button>
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
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" placeholder="优惠金额" :precision="3" controls-position="right" />
      </template>
      <template #currentUserName="{row}">
        <el-input :value="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="选择使用人" @focus="userDialogVisible=true" />
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
      <template #schemeName="{row}">
        <base-input
          :value.sync="row.schemeId"
          :label.sync="row.schemeName"
          :code.sync="form.schemeCode"
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
  </div>
</template>
<script>
import { listAddressQueryUseAreaTree } from '@/api/base.js'
export default {
  props: {
    form: {
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
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      validRules: {},
      userDialogVisible: false,
      useAreaTree: [],
      btnDisabled: true
      // giftDistributeDetailId
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 50, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '礼品编码', width: 160 },
        { field: 'assetName', title: '礼品名称', width: 160 },
        { field: 'categoryName', title: '礼品分类', width: 130 },
        { field: 'pictureName', title: '礼品图片', width: 130 },
        { field: 'serialNum', title: '序列号', width: 160 },
        { field: 'specificationModel', title: '规格型号', width: 160 },
        { field: 'brandName', title: '品牌', width: 130 },
        { field: 'inventoryQuantity', title: '可派数量', width: 130 },
        // {  field: 'returnQuantity', title: '借用数量', width: 130 },
        { field: 'returnQuantity', title: '本次派发数量', width: 130 },
        { field: 'quantityUnit', title: '数量单位', width: 130 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        // {  field: 'discountAmount', title: '优惠金额（元）', width: 130, slots: { edit: 'discountAmount' }, editRender: {}, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'usePurpose', title: '使用目的', width: 160, slots: { default: 'usePurpose', edit: 'usePurpose' }, editRender: {} },
        { field: 'currentEreaName', title: '使用区域', width: 180 },
        { field: 'currentLocationName', title: '具体位置', width: 160, slots: { edit: 'currentLocationName' }, editRender: {} },
        { field: 'firstShelfName', title: '存放货架', width: 130 },
        { field: 'assetCharacteristic', title: '礼品特性', width: 130 },
        { field: 'assetPhysicalState', title: '礼品物态', width: 130 },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 130 },
        { field: 'termValidity', title: '有效期', width: 130 },
        { field: 'startDate', title: '启用日期', width: 130 },
        { field: 'ynInviteTender', title: '招标礼品编码', width: 130 },
        // {  field: 'schemeName', title: '方案名称', width: 160, slots: { edit: 'schemeName' }, editRender: {} },
        // {  field: 'remarks', title: '备注', width: 200, slots: { edit: 'remarks' }, editRender: {} },
        { field: 'todo', title: '操作', width: 160, slots: { default: 'todo' }, fixed: 'right', visible: this.showBtn }
      ]
    },
    standBookQuery() {
      return [
        {
          labelName: 'centralizedBusinessName',
          valueName: 'centralizedBusinessId',
          label: this.form.centralizedBusinessName,
          value: this.form.centralizedBusinessId,
          name: '业务类别',
          require: true
        }
      ]
    }
  },
  watch: {
    'form.almAssetReturnDetailList': {
      handler(newVal, oldVal) {
        this.tableData = newVal
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getUserArea()
  },
  methods: {
    // 列表 全选 单选
    changeCheck() {
      var list = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = list.length <= 0
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
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
