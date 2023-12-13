<template>
  <div>
    <div class="pt-10 mb-10">
      <selectStandbook v-if="!showBtn&&editForm" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <selectArea v-if="!showBtn&&editForm" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" />
      <!-- <Pint v-if="showBtn&&editForm" :selectRows="selectRows.length>0?selectRows:tableData" class="mr-10"></Pint> -->
      <el-button size="mini" icon="el-icon-upload2">导出</el-button>
      <el-button icon="el-icon-delete" v-if="showBtn&&editForm" type="danger" :disabled="btnDisabled" plain size="mini" @click="handleDeleteBatch">删除</el-button>
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
      show-footer
      :footer-method="getFooterData"
    >
      <template #seqHeader>序号</template>
      <template #pictureName="{row}">
        <img height="34px" :src="row.pictureRui" style="cursor: pointer;" alt @click="openImg(row)" />
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" placeholder="优惠金额" :precision="3" controls-position="right"></el-input-number>
      </template>
      <template #currentUserName="{row}">
        <el-input :value="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="选择使用人" @focus="userDialogVisible=true"></el-input>
      </template>
      <template #currentLocationName="{row}">
        <el-cascader
          :props="{ label: 'label',value: 'id', children: 'children'}"
          :options="useAreaTree"
          v-if="$refs.xTable.isActiveByRow(row)"
          placeholder="具体位置"
          :filterable="true"
          clearable
          ref="categoryCascader"
          v-model="row.location"
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
      <template #firstShelfName="{row}">{{ row.firstShelfName }}/{{ row.secondShelfName }}</template>
      <template #assetCharacteristic="{row}">
        <dictDateView :value="row.assetCharacteristic" :dictDataList="dictDataList" dictCode="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #assetPhysicalState="{row}">
        <dictDateView :value="row.assetPhysicalState" :dictDataList="dictDataList" dictCode="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #remarks="{row}">
        <el-input v-model="row.remarks" type="text" placeholder="备注" :maxlength="300" :show-word-limit="true"></el-input>
      </template>
      <template #schemeName="{row}">
        <base-input :value.sync="row.schemeId" :label.sync="row.schemeName" labelName="schemeName" valueName="schemeId" :optionsList="schemeList" placeholder="方案名称"></base-input>
      </template>
      <template #usePurpose="{row}">
        <base-input v-if="$refs.xTable.isActiveByRow(row)" baseCode="AlmAssetCollect-usePurpose" :value.sync="row.usePurpose" :optionsList="dictDataList" placeholder="使用目的"></base-input>
        <dictDateView v-else :value="row.usePurpose" :dictDataList="dictDataList" dictCode="AlmAssetCollect-usePurpose" />
      </template>
      <template #todo="{row,rowIndex}">
        <div class="todo">
          <el-button size="mini" type="text" v-if="!$refs.xTable.isActiveByRow(row)" @click="editRow(row)">编辑</el-button>
          <el-button size="mini" type="text" v-if="!$refs.xTable.isActiveByRow(row)" @click="deleteRow(row,rowIndex)">删除</el-button>
          <el-button size="mini" type="text" v-if="$refs.xTable.isActiveByRow(row)" @click="saveRow(row)">保存</el-button>
          <el-button size="mini" type="text" v-if="$refs.xTable.isActiveByRow(row)" @click="cancelRowEvent(row)">取消</el-button>
        </div>
      </template>
    </vxe-grid>
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
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
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
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
  mixins: [vxeTable],
  data() {
    return {
      selectRows: [],
      elImageViewer: false,
      loading: false,
      tableData: [],
      validRules: {},
      btnDisabled: true,
      userDialogVisible: false,
      imgList: []
    }
  },
  watch: {
    'formData.almAssetBorrowDetailList': {
      handler(newVal, oldVal) {
        this.tableData = newVal
      },
      immediate: true
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { showOverflow: true, field: 'assetName', title: '资产名称', width: 130, fixed: 'left' },
        { showOverflow: true, field: 'categoryName', title: '资产分类', width: 150, fixed: 'left' },
        { showOverflow: true, field: 'pictureName', title: '资产图片', width: 90, slots: { default: 'pictureName' } },
        { showOverflow: true, field: 'serialNum', title: '序列号', width: 100 },
        { showOverflow: true, field: 'specificationModel', title: '规格型号', width: 100 },
        { showOverflow: true, field: 'usePurpose', title: '使用目的', width: 130, showOverflow: true, slots: { default: 'usePurpose', edit: 'usePurpose' }, editRender: {} },
        { showOverflow: true, field: 'currentLocationName', title: '使用区域', width: 160, slots: { default: 'currentLocationName', edit: 'currentLocationName' }, editRender: {} },
        { showOverflow: true, field: 'schemeName', title: '方案名称', width: 160, slots: { edit: 'schemeName' }, editRender: {} },
        { showOverflow: true, field: 'remarks', title: '备注', width: 100, slots: { edit: 'remarks' }, editRender: {}, headerAlign: 'center', align: 'left' },
        { showOverflow: true, field: 'borrowQuantity', title: '借用数量', width: 130 },
        { showOverflow: true, field: 'inventoryQuantity', title: '库存/在用数量', width: 130 },
        { showOverflow: true, field: 'quantityUnit', title: '数量单位', width: 80 },
        { showOverflow: true, field: 'brandName', title: '品牌', width: 130 },
        { showOverflow: true, field: 'priceExcludTax', title: '不含税单价（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, field: 'taxRate', title: '税率（%）', width: 90, headerAlign: 'center', align: 'right' },
        { showOverflow: true, field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, field: 'discountAmount', title: '优惠金额（元）', width: 130, editRender: {}, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { showOverflow: true, field: 'currentUserName', title: '使用人', width: 130, editRender: {} },
        { showOverflow: true, field: 'currentOrgName', title: '使用部门', width: 130 },
        { showOverflow: true, field: 'firstShelfName', title: '存放货架', width: 180, slots: { default: 'firstShelfName' } },
        { showOverflow: true, field: 'assetCharacteristic', title: '资产特性', width: 160, slots: { default: 'assetCharacteristic' } },
        { showOverflow: true, field: 'assetPhysicalState', title: '资产物态', width: 160, slots: { default: 'assetPhysicalState' } },
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
  methods: {
    // 全选  单选
    changeCheck() {
      this.selectRows = this.$refs.xTable.getCheckboxRecords()
      this.btnDisabled = this.selectRows.length > 0 ? false : true
    },
    // 选择台账
    selectStandbookHandler(list) {
      this.tableData = list.map((item) => {
        for (let i in item) {
          if (!item[i]) {
            delete item[i]
          }
        }
        this.$set(item, 'subtotal', this.$vxe.multiply(item.borrowQuantity, item.priceIncludTax))
        this.$set(item, 'borrowQuantity', item.inventoryQuantity)
        return item
      })
      this.$emit('calculate', this.tableData)
    },
    // 选择具体位置
    selectAreaHandler(val) {
      let list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'currentEreaId', val.data.parentId)
        this.$set(item, 'currentEreaName', val.data.parentName)
        this.$set(item, 'currentLocationId', val.data.locationAddressId)
        this.$set(item, 'currentLocationName', val.data.locationName)
      })
    },
    // 批量删除行
    handleDeleteBatch() {
      let list = this.$refs.xTable.getCheckboxRecords()
      if (list.length == 0 || !list) {
        this.$message({
          message: `请选择数据！`,
          type: 'warning'
        })
        return
      }
      list.forEach((item) => {
        let index = this.tableData.findIndex((temp) => {
          return item.sort == temp.sort
        })
        this.tableData.splice(index, 1)
      })
    },
    // 行编辑
    async editRow(row) {
      let editRow = this.$refs.xTable.getActiveRecord()
      if (editRow) {
        let errMap = await this.$refs.xTable.validate(editRow.row).catch((errMap) => errMap)
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
      let errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.borrowQuantity, row.priceIncludTax))
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
      let editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'currentUserName', val.userName)
      this.$set(editRow, 'currentUserId', val.userId)
      this.$set(editRow, 'currentOrgName', val.deptName)
      this.$set(editRow, 'currentOrgId', val.deptId)
    },
    // 行  选择使用区域
    useAreaChange(val) {
      let row = this.$refs.xTable.getActiveRecord().row
      if (val.length == 2) {
        let leftData = this.useAreaTree.find((item) => item.id == val[0])
        let rightData = leftData.children.find((item) => item.id == val[1])

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
      return this.footerMethod(columns, data, '', ['borrowQuantity', 'priceExcludTax', 'taxRate', 'taxAmount', 'priceIncludTax', 'subtotal', 'discountAmount'], 1)
    },
    // 校验明细表
    async validTable() {
      return new Promise(async (resolve) => {
        resolve(await this.$refs.xTable.fullValidate(this.tableData))
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
