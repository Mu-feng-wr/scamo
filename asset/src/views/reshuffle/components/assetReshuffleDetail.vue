<template>
  <div>
    <div v-if="showBtn" class="pt-10 mb-10">
      <selectStandbook v-if="showBtn" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <setUser v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="setUserHandler" />
      <selectShelf v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectShelfHandler" />
      <!-- <Pint v-bind="{selectRows}" class="mr-10" :disabled="btnDisabled"></Pint> -->
      <el-button size="mini" icon="el-icon-download" @click="handleExport">导出</el-button>
      <el-button size="mini" type="danger" icon="el-icon-delete" plain @click="handleDeleteBatch">删除</el-button>
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
      show-overflow="tooltip"
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
        <el-input-number v-model="row.discountAmount" :precision="3" placeholder="优惠金额" controls-position="right" />
      </template>
      <template #currentUserName="{row}">
        <el-input v-model="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="请选择使用人" @focus="userDialogVisible=true" />
      </template>
      <template #currentEreaName="{row}">
        <span>{{ row.currentEreaName }}{{ row.currentLocationName?'/'+row.currentLocationName:'' }}</span>
      </template>
      <template #firstShelfName="{row}">{{ row.firstShelfName }}/{{ row.secondShelfName }}</template>
      <template #newLocationName="{row}">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
          ref="categoryCascader"
          v-model="row.newLocation"
          :props="{ label: 'label',value: 'id', children: 'children'}"
          :options="useAreaTree"
          placeholder="具体位置"
          :filterable="true"
          clearable
          style="width: 100%"
          @change="newUseAreaChange($event,row)"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.newEreaName }}{{ row.newLocationName?'/' + row.newLocationName:'' }}</span>
      </template>

      <template #newWarehouseName="{row}">
        <base-input
          :options-list="warehouseList"
          value-name="locationAddressId"
          label-name="locationName"
          :return-obj="true"
          :value.sync="row.newWarehouseId"
          :name.sync="row.newWarehouseName"
          placeholder="请选择新所属仓库名称"
          :pre-store="[{locationAddressId:row.newWarehouseId,locationName:formData.newWarehouseName}]"
          @change="changeNewWarehouse"
        />
      </template>

      <template #newFirstShelfName="{row}">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
          :value="[row.newFirstShelfId,row.newSecondShelfId]"
          :props="{ label: 'label',value: 'id'}"
          :options="shelfList"
          placeholder="存放货架"
          @focus="getShelfList(row)"
          @change="changeShelfName($event,row)"
        />
        <span v-else>{{ row.newFirstShelfName }}{{ row.newSecondShelfName?'/'+row.newSecondShelfName:'' }}</span>
      </template>
      <template #assetPhysicalState="{ row }">
        <dictDateView :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #assetCharacteristic="{ row }">
        <dictDateView :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>

      <template #schemeName="{row}">
        <base-input
          :value.sync="row.schemeId"
          :label.sync="row.schemeName"
          :pre-store="[{schemeId:row.schemeId,schemeName:row.schemeName}]"
          label-name="schemeName"
          value-name="schemeId"
          placeholder="请选择方案名称"
          :options-list="schemeList"
        />
      </template>

      <template #remarks="{row}">
        <el-input v-model="row.remarks" placeholder="备注" :maxlength="300" show-word-limit />
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
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择变更人" @confirm="rowUserSelect" />
    <el-image-viewer v-if="elImageViewer" :on-close="imgViewerClose" :url-list="imgList" />
  </div>
</template>
<script>
import { listDictItems, listAddressQueryUseAreaTree, listSchemeQuery, listAddressQueryWarehouse, queryCompanyWarehouseShelfTreeList } from '@/api/base.js'
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
      validRules: {},
      btnDisabled: true,
      dictDataList: [],
      userDialogVisible: false,
      useAreaTree: [],
      schemeList: [],
      elImageViewer: false,
      imgList: [],
      warehouseList: [],
      shelfList: [],
      rowNewWarehouseId: '' // 当前编辑行的新仓库id  用于判断是否需要加载新货架数据
    }
  },

  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'assetCode', title: '资产编号', fixed: 'left', width: 130 },
        { field: 'assetName', title: '资产名称', fixed: 'left', width: 150 },
        { field: 'categoryName', title: '资产分类', width: 150 },
        { field: 'pictureName', title: '资产图片', width: 80, slots: { default: 'pictureName' } },
        { field: 'newUserName', title: '新使用人', width: 130, slots: { edit: 'currentUserName' }, editRender: {} },
        { field: 'newOrgName', title: '新使用部门', width: 130 },
        { field: 'newLocationName', title: '新使用区域', width: 160, slots: { default: 'newLocationName', edit: 'newLocationName' }, editRender: {} },
        { field: 'newWarehouseName', title: '新仓库名称', width: 160, slots: { edit: 'newWarehouseName' }, editRender: {} },
        { field: 'newFirstShelfName', title: '新存放货架', width: 160, slots: { default: 'newFirstShelfName', edit: 'newFirstShelfName' }, editRender: {} },
        { field: 'remarks', title: '备注', width: 160, slots: { edit: 'remarks' }, editRender: {} },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentEreaName', title: '使用区域', width: 160, slots: { default: 'currentEreaName' } },
        { field: 'firstShelfName', title: '存放货架', width: 160, slots: { default: 'firstShelfName' } },
        { field: 'serialNum', title: '序列号', width: 100 },
        { field: 'specificationModel', title: '规格型号', width: 100 },
        { field: 'brandName', title: '品牌', width: 100 },
        { field: 'inventoryQuantity', title: '库存/在用数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'reshuffleQuantity', title: '异动数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'quantityUnit', title: '数量单位', width: 80 },
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 160, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxAmount', title: '税额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'subtotal', title: '金额小计（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'discountAmount', title: '优惠金额（元）', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'assetCharacteristic', title: '资产特性', width: 160, slots: { default: 'assetCharacteristic' } },
        { field: 'assetPhysicalState', title: '资产物态', width: 160, slots: { default: 'assetPhysicalState' } },
        { field: 'schemeName', title: '方案名称', width: 160 },

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
    'formData.assetReshuffleDetail': {
      handler(newVal, oldVal) {
        this.tableData = newVal || []
      },
      immediate: true
    }
  },
  created() {
    this.getUserArea()
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
        delete item.createDate
        delete item.updateDate
        return {
          ...item,
          ...{
            reshuffleQuantity: item.inventoryQuantity,
            subtotal: this.$vxe.multiply(item.inventoryQuantity, item.priceIncludTax)
          }
        }
      })
      this.$emit('calculate', this.tableData)
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
    // 行编辑
    async editRow(row) {
      this.$set(row, 'location', [row.currentEreaId, row.currentLocationId])
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
        this.$set(row, 'subtotal', this.$vxe.multiply(row.reshuffleQuantity, row.priceIncludTax))
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
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
      })
      listAddressQueryWarehouse().then((res) => {
        // 所属仓库
        this.warehouseList = res.rows
      })
    },
    // 行  根据仓库获取货架  无仓库则不加载数据
    getShelfList(row) {
      if (row.newWarehouseId) {
        if (this.rowNewWarehouseId != row.newWarehouseId) {
          queryCompanyWarehouseShelfTreeList({ parentIds: row.newWarehouseId }).then((res) => {
            this.shelfList = res.data
          })
        }
        this.rowNewWarehouseId = row.newWarehouseId
      } else {
        this.shelfList = []
      }
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
      this.download('/asset/changeDetail/export', {}, `detail_${new Date().getTime()}.xlsx`)
    },
    // 校验明细表
    validTable() {
      return new Promise((resolve) => {
        this.$refs.xTable.fullValidate(this.tableData).then((res) => {
          resolve(res)
        })
      })
    },
    // 选择仓库
    changeNewWarehouse(row) {
      this.$set(row, 'newSecondShelfId', '')
      this.$set(row, 'newFirstShelfId', '')
      this.$set(row, 'newSecondShelfName', '')
      this.$set(row, 'newFirstShelfName', '')
    },
    // 行选择使用人
    rowUserSelect(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'currentUserId', val.userId)
      this.$set(row, 'currentUserName', val.userName)
      this.$set(row, 'currentOrgId', val.deptId)
      this.$set(row, 'currentOrgName', val.deptName)
    },
    // 行  选择新使用区域
    newUseAreaChange(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      if (val.length == 2) {
        var leftData = this.useAreaTree.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])

        this.$set(row, 'newEreaId', val[0])
        this.$set(row, 'newEreaName', leftData.label)
        this.$set(row, 'newLocationId', val[1])
        this.$set(row, 'newLocationName', rightData.label)
      } else {
        this.$set(row, 'newEreaId', '')
        this.$set(row, 'newEreaName', '')
        this.$set(row, 'newLocationId', '')
        this.$set(row, 'newLocationName', '')
      }
    },
    // 设置使用人
    setUserHandler(val) {
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'currentUserId', val.userId)
        this.$set(item, 'currentUserName', val.userName)
        this.$set(item, 'currentOrgId', val.companyId)
        this.$set(item, 'currentOrgName', val.companyName)
      })
    },
    // 设置货架
    selectShelfHandler(val) {
      var list = this.$refs.xTable.getCheckboxRecords()
      list.forEach((item) => {
        this.$set(item, 'firstShelfId', val.parentId)
        this.$set(item, 'firstShelfName', val.parentName)
        this.$set(item, 'secondShelfId', val.locationAddressId)
        this.$set(item, 'secondShelfName', val.locationName)
      })
    },
    // 行  选择新存放货架
    changeShelfName(val, row) {
      if (val.length == 2) {
        var leftData = this.shelfList.find((item) => item.id == val[0])
        var rightData = leftData.children.find((item) => item.id == val[1])
        this.$set(row, 'newFirstShelfId', val[0])
        this.$set(row, 'newFirstShelfName', leftData.label)
        this.$set(row, 'newSecondShelfId', val[1])
        this.$set(row, 'newSecondShelfName', rightData.label)
      } else {
        this.$set(row, 'newFirstShelfId', '')
        this.$set(row, 'newFirstShelfName', '')
        this.$set(row, 'newSecondShelfId', '')
        this.$set(row, 'newSecondShelfName', '')
      }
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
      return this.footerMethod(columns, data, '', ['inventoryQuantity', 'reshuffleQuantity', 'priceExcludTax', 'taxAmount', 'priceIncludTax', 'subtotal', 'discountAmount'], 1)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
