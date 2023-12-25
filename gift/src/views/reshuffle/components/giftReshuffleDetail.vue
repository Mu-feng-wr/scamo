<template>
  <div>
    <div class="pt-10 mb-10">
      <selectStandbook v-if="showBtn" size="mini" class="mr-10" :query="standBookQuery" @confirm="selectStandbookHandler" />
      <!-- <uploadImg size="mini" :disabled="btnDisabled" class="pl-10 pr-10" @success="uploadImgSuccess" /> -->
      <setUser v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="setUserHandler" />
      <selectArea v-if="showBtn" size="mini" :disabled="btnDisabled" class="pr-10" @confirm="selectAreaHandler" />
      <!-- <selectShelf size="mini" :disabled="btnDisabled" :query="{parentId:formData.warehouseId}" class="pr-10" @confirm="selectShelfHandler" /> -->

      <el-button size="mini" icon="el-icon-printer">打印资产标签</el-button>
      <el-button size="mini" icon="el-icon-upload2">导出</el-button>
      <el-button v-if="showBtn" size="mini">删除</el-button>
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
      :edit-config="{trigger: 'manual', mode: 'row',showIcon:false,autoClear:false}"
      class="vxeTable"
      :edit-rules="validRules"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template v-slot:pictureRui="{ row }">
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.pictureName }}</span>
        <div v-else class="flex j-center">
          <div class="u-line-1">{{ row.pictureName }}</div>
          <uploadImg v-if="$refs.xTable.isActiveByRow(row)" type="icon" class="pr-10" @success="rowUploadImgSuccess" />
        </div>
      </template>
      <template #serialNum="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.serialNum" placeholder="序列号" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.serialNum }}</span>
      </template>
      <template #alterUnitNum="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.alterUnitNum" placeholder="购买数量" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.alterUnitNum,{digits:2}) }}</span>
      </template>
      <template #buyQuantity="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.buyQuantity" controls-position="right" :precision="2" :min="1" placeholder="入库数量" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.buyQuantity,{digits:2}) }}</span>
      </template>
      <template #priceExcludTax="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.priceExcludTax" controls-position="right" :precision="2" :min="1" placeholder="不含税单价（元）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.priceExcludTax,{digits:2}) }}</span>
      </template>
      <template #taxRate="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.taxRate" controls-position="right" :precision="2" :min="1" placeholder="税率（%）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.taxRate,{digits:2}) }}</span>
      </template>
      <template #taxAmount="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.taxAmount" controls-position="right" :precision="2" :min="1" placeholder="税额（元）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.taxAmount,{digits:2}) }}</span>
      </template>
      <template #priceIncludTax="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.priceIncludTax" controls-position="right" :precision="2" :min="1" placeholder="含税单价（元）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.priceIncludTax,{digits:2}) }}</span>
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-if="$refs.xTable.isActiveByRow(row)" v-model="row.discountAmount" controls-position="right" :precision="2" :min="1" placeholder="优惠金额（元）" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.commafy(row.discountAmount,{digits:2}) }}</span>
      </template>
      <template #currentUserName="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.currentUserName" suffix-icon="el-icon-arrow-down" placeholder="使用人" @focus="userDialogVisible=true" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.currentUserName }}</span>
      </template>

      <template #currentLocationName="{row}">
        <el-cascader
          v-if="$refs.xTable.isActiveByRow(row)"
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
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.currentLocationName }}</span>
      </template>
      <template #firstShelfName="{row}">
        <el-cascader v-if="$refs.xTable.isActiveByRow(row)" :value="[ row.firstShelfId,row.secondShelfId]" :props="props" placeholder="存放货架" @change="changeShelfName($event,row)" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.firstShelfName }}/{{ row.secondShelfName }}</span>
      </template>

      <template #assetCharacteristic="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetCharacteristic"
          :value.sync="row.assetCharacteristic"
          :options-list="dictDataList"
          placeholder="资产特性"
        />

        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.assetCharacteristic }}</span>
      </template>
      <template #assetPhysicalState="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          base-code="AamMaterialAccount-assetPhysicalState"
          :value.sync="row.assetPhysicalState"
          :options-list="dictDataList"
          placeholder="资产物态"
        />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.assetPhysicalState }}</span>
      </template>

      <template #qualityGuaranteePeriod="{row}">
        <el-date-picker v-if="$refs.xTable.isActiveByRow(row)" v-model="row.qualityGuaranteePeriod" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择质保期" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.qualityGuaranteePeriod }}</span>
      </template>
      <template #termValidity="{row}">
        <el-date-picker v-if="$refs.xTable.isActiveByRow(row)" v-model="row.termValidity" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择有效期" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.termValidity }}</span>
      </template>
      <template #startDate="{row}">
        <el-date-picker v-if="$refs.xTable.isActiveByRow(row)" v-model="row.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择启用日期" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ $vxe.toDateString(row.startDate,'yyyy-MM-dd') }}</span>
      </template>
      <template #schemeName="{row}">
        <el-select v-if="$refs.xTable.isActiveByRow(row)" v-model="row.schemeName" placeholder="方案名称">
          <el-option v-for="(item,i) in schemeList" :key="i" :label="item.schemeName" :value="item.schemeName" />
        </el-select>

        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.schemeName }}</span>
      </template>
      <template #ynInviteTender="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.ynInviteTender" placeholder="招标资产编码" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.ynInviteTender }}</span>
      </template>
      <template #remarks="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.remarks" placeholder="备注" />
        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.remarks }}</span>
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
import { queryUnShippedByPurchaseApplicationId, listAddressQuery, queryAddressTreeSelect, listDictItems, listSchemeQuery } from '@/api/base.js'
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
      // giftReshuffleDetailId
      loading: false,
      tableData: [],
      userDialogVisible: false,
      dictDataList: [],
      schemeList: [],
      btnDisabled: true,
      props: {
        lazy: true,
        label: 'locationName',
        value: 'locationAddressId',
        lazyLoad: (node, resolve) => {
          var { level } = node
          if (level == 0) {
            listAddressQuery({ parentId: this.formData.warehouseId }).then((res) => {
              resolve(
                res.rows.map((item) => {
                  return {
                    ...item,
                    ...{
                      leaf: level >= 1
                    }
                  }
                })
              )
            })
          } else if (level == 1) {
            listAddressQuery({ parentId: node.data.locationAddressId }).then((res) => {
              resolve(
                res.rows.map((item) => {
                  return {
                    ...item,
                    ...{
                      leaf: level >= 1
                    }
                  }
                })
              )
            })
          }
        }
      },
      validRules: {
        buyQuantity: [{ required: true, message: '请输入入库数量' }],
        priceExcludTax: [{ required: true, message: '请输入不含税单价' }],
        priceIncludTax: [{ required: true, message: '请输入含税单价' }],
        taxRate: [{ required: true, message: '请输入税率' }],
        taxAmount: [{ required: true, message: '请输入税额' }]
      }
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 50, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'materialCode', title: '礼品编码', width: 180, fixed: 'left' },
        { field: 'materialName', title: '礼品名称', width: 200, fixed: 'left' },
        { field: 'categoryName', title: '礼品分类', width: 150, fixed: 'left' },
        { field: 'pictureRui', title: '礼品图片', width: 250, showOverflow: true, slots: { default: 'pictureRui', edit: 'pictureRui' }, editRender: {} },
        { field: 'serialNum', title: '序列号', width: 160, slots: { default: 'serialNum', edit: 'serialNum' }, editRender: {} },
        { field: 'specificationModel', title: '规格型号', width: 160 },
        { field: 'brandName', title: '品牌', width: 120 },
        { field: 'alterUnitNum', title: '领用/借用数量', width: 120, visible: this.formData.accepterMethod == 1 },
        { field: 'buyQuantity', title: '异动数量', width: 140, headerAlign: 'center', align: 'right', slots: { default: 'buyQuantity', edit: 'buyQuantity' }, editRender: {} },
        // { field: 'buyQuantity', title: '入库数量', width: 140, headerAlign: 'center', align: 'right', slots: { default: 'buyQuantity', edit: 'buyQuantity' }, editRender: {} },
        { field: 'unitName', title: '数量单位', width: 120 },
        {
          field: 'priceExcludTax',
          title: '不含税单价（元）',
          headerAlign: 'center',
          align: 'right',
          width: 160,
          slots: { default: 'priceExcludTax', edit: 'priceExcludTax' },
          editRender: {}
        },
        { field: 'taxRate', title: '税率（%）', headerAlign: 'center', align: 'right', width: 130, slots: { default: 'taxRate', edit: 'taxRate' }, editRender: {} },
        { field: 'taxAmount', title: '税额（元）', headerAlign: 'center', align: 'right', width: 130, slots: { default: 'taxAmount', edit: 'taxAmount' }, editRender: { name: '$input' } },
        {
          field: 'priceIncludTax',
          title: '含税单价（元）',
          headerAlign: 'center',
          align: 'right',
          width: 160,
          slots: { default: 'priceIncludTax', edit: 'priceIncludTax' },
          editRender: {}
        },
        { field: 'subtotal', title: '金额小计（元）', width: 160, formatter: 'formatMoney', headerAlign: 'center', align: 'right' },
        // { field: 'discountAmount', title: '优惠金额（元）', width: 160, headerAlign: 'center', align: 'right', slots: { default: 'discountAmount', edit: 'discountAmount' }, editRender: {} },

        { field: 'currentUserName', title: '使用人', width: 160, slots: { default: 'currentUserName', edit: 'currentUserName' }, editRender: {} },
        { field: 'currentOrgName', title: '使用部门', width: 160 },
        { field: 'currentEreaName', title: '使用区域', width: 160 },
        { field: 'currentLocationName', title: '具体位置', width: 160, slots: { default: 'currentLocationName', edit: 'currentLocationName' }, editRender: {} },

        { field: 'firstShelfName', title: '存放货架', width: 160, slots: { default: 'firstShelfName', edit: 'firstShelfName' }, editRender: {} },
        { field: 'firstShelfName', title: '仓库名称', width: 160, slots: { default: 'firstShelfName', edit: 'firstShelfName' }, editRender: {} },
        { field: 'currentUserName', title: '新使用人', width: 160, slots: { default: 'currentUserName', edit: 'currentUserName' }, editRender: {} },
        { field: 'currentOrgName', title: '新使用部门', width: 160 },
        { field: 'currentEreaName', title: '新使用区域', width: 160 },
        { field: 'currentLocationName', title: '新具体位置', width: 160, slots: { default: 'currentLocationName', edit: 'currentLocationName' }, editRender: {} },
        { field: 'firstShelfName', title: '新存放货架', width: 160, slots: { default: 'firstShelfName', edit: 'firstShelfName' }, editRender: {} },
        { field: 'firstShelfName', title: '新仓库名称', width: 160, slots: { default: 'firstShelfName', edit: 'firstShelfName' }, editRender: {} },
        { field: 'assetCharacteristic', title: '礼品特性', width: 160, slots: { default: 'assetCharacteristic' } },
        { field: 'assetPhysicalState', title: '礼品物态', width: 160, slots: { default: 'assetPhysicalState' } },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 160, slots: { default: 'qualityGuaranteePeriod', edit: 'qualityGuaranteePeriod' }, editRender: {} },
        { field: 'termValidity', title: '有效期', width: 160, slots: { default: 'termValidity', edit: 'termValidity' }, editRender: {} },
        { field: 'startDate', title: '启用日期', width: 160, slots: { default: 'startDate', edit: 'startDate' }, editRender: {} },
        { field: 'schemeName', title: '方案名称', width: 160, slots: { default: 'schemeName', edit: 'schemeName' }, editRender: {} },
        { field: 'ynInviteTender', title: '招标礼品编码', width: 160, slots: { default: 'ynInviteTender', edit: 'ynInviteTender' }, editRender: {} },
        // { field: 'remarks', title: '备注', width: 300, headerAlign: 'center', align: 'left', slots: { default: 'remarks', edit: 'remarks' }, editRender: {} },
        { field: 'todo', title: '操作', width: 160, slots: { default: 'todo' }, fixed: 'right' }
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
    'formData.accepterMethod': {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal == 1 && this.formData.giftReceiptDetailId) {
          this.init()
        } else {
          this.tableData = []
        }
      }
    },
    'formData.giftReceiptDetailId': {
      handler(newVal, oldVal) {
        if (newVal != oldVal && newVal && this.formData.accepterMethod) {
          this.init()
        }
      }
    },
    'formData.almAssetReceiptDetailList': {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.tableData = newVal ? JSON.parse(JSON.stringify(newVal)) : []
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
      queryAddressTreeSelect({ parentId: this.formData.warehouseId })
      this.loading = true
      queryUnShippedByPurchaseApplicationId({ giftReceiptDetailId: this.formData.giftReceiptDetailId })
        .then((res) => {
          this.tableData = res.rows.map((item) => {
            return {
              ...item,
              ...{
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
        this.$set(row, 'subtotal', this.$vxe.multiply(row.buyQuantity, row.priceIncludTax))
        this.$emit('calculate', this.tableData)
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
      this.$modal.confirm('确认删除资产明细单资产编号为"' + row.materialCode + '"的数据项？').then(() => {
        this.tableData.splice(rowIndex, 1)
        this.$emit('calculate', this.tableData)
      })
    },
    uploadImgSuccess(val) {
      // 图片上传成功
      var list = this.$refs.xTable.getCheckboxRecords()
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
    selectMaterialHandler(val) {
      this.tableData = val.map((item) => {
        return {
          ...item,
          ...{
            subtotal: this.$vxe.multiply(item.buyQuantity, item.priceIncludTax)
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
    rowUploadImgSuccess(val) {
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'pictureRui', val.url)
      this.$set(row, 'pictureName', val.name)
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
