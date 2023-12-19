<template>
  <div>
    <div v-if="showBtn" class="pt-10 mb-10">
      <selectMaterial
        v-if="formData.accepterMethod != 1&&!disabled"
        :disabled="disabled"
        :query="selectMaterialQuery"
        class="pr-10"
        :selected-data="tableData"
        :limit="200"
        @confirm="selectMaterialHandler"
      />
      <el-button v-if="!disabled" icon="el-icon-download" type="primary" plain size="mini" :disabled="tableData.length==0" @click="downloadAssetDetail">下载资产明细</el-button>
      <uploadFile v-if="!disabled" class="pl-10 pr-10" plain size="mini" url="/srm/material/importData" @uploadSuccess="uploadSuccess" />
      <el-button v-if="disabled" v-hasPermi="['srm:material:export']" icon="el-icon-download" :disabled="tableData.length==0" type="primary" plain size="mini" @click="handleExport">导出</el-button>
      <el-button v-if="!disabled" v-hasPermi="['srm:material:remove']" icon="el-icon-delete" :disabled="disabled||btnDisabled" type="danger" plain size="mini" @click="handleDeleteBatch">删除</el-button>
    </div>
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      header-align="center"
      align="center"
      :data="tableData"
      border
      auto-resize
      max-height="500"
      :resizable="true"
      keep-source
      :columns="tableColumn"
      :row-config="{isHover:true,isCurrent:true}"
      :edit-config="{trigger: 'manual', mode: 'row',showIcon:false,autoClear:false}"
      :edit-rules="validRules"
      show-footer
      stripe
      highlight-current-row
      :footer-method="getFooterData"
      class="vxeTable"
      @checkbox-all="changeCheck"
      @checkbox-change="changeCheck"
    >
      <template #seqHeader>序号</template>
      <template #buyQuantity="{row}">
        <el-input-number
          v-model="row.buyQuantity"
          size="mini"
          controls-position="right"
          :precision="formData.materialType == 1 ? 0 : 3"
          :step-strictly="formData.materialType == 1 ? true : false"
          :min="1"
          :step="1"
          :max="99999999.000"
          placeholder="购买数量"
          @change="calculateRow(row)"
        />
      </template>
      <template #priceExcludTax="{row}">
        <el-input-number v-model="row.priceExcludTax" size="mini" controls-position="right" :step="1" :precision="8" placeholder="不含税单价（元）" :max="99999999.99" @change="calculateRow(row)" />
      </template>
      <template #taxRate="{row}">
        <el-input-number v-model="row.taxRate" size="mini" controls-position="right" step-strictly :step="1" :max="100" placeholder="税率" @change="calculateRow(row)" />
      </template>
      <template #taxAmount="{row}">
        <el-input-number v-model="row.taxAmount" size="mini" controls-position="right" :step="1" :precision="8" placeholder="税额" />
      </template>
      <template #discountAmount="{row}">
        <el-input-number v-model="row.discountAmount" size="mini" controls-position="right" :min="0" :step="1" :precision="2" :max="999999.99" placeholder="优惠金额" />
      </template>

      <template #assetCharacteristic="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          size="mini"
          base-code="AamMaterialAccount-assetCharacteristic"
          :value.sync="row.assetCharacteristic"
          :options-list="assetPhysicalStateList"
          placeholder="资产特性"
          @change="changeAssetCharacteristic(row)"
        />

        <dictDateView v-if="!$refs.xTable.isActiveByRow(row)" :value="row.assetCharacteristic" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetCharacteristic" />
      </template>
      <template #assetPhysicalState="{row}">
        <base-input
          v-if="$refs.xTable.isActiveByRow(row)"
          size="mini"
          base-code="AamMaterialAccount-assetPhysicalState"
          :value.sync="row.assetPhysicalState"
          :options-list="dictDataList"
          placeholder="资产物态"
          @change="changeAssetPhysicalState(row)"
        />

        <dictDateView v-if="!$refs.xTable.isActiveByRow(row)" :value="row.assetPhysicalState" :dict-data-list="dictDataList" dict-code="AamMaterialAccount-assetPhysicalState" />
      </template>
      <template #schemeName="{row}">
        <el-select v-if="$refs.xTable.isActiveByRow(row)" v-model="row.schemeId" size="mini" placeholder="方案名称" @change="changesChemeId">
          <el-option v-for="(item,i) in schemeList" :key="i" :label="item.schemeName" :value="item.schemeId" />
        </el-select>

        <span v-if="!$refs.xTable.isActiveByRow(row)">{{ row.schemeName }}</span>
      </template>
      <template #remarks="{row}">
        <el-input v-model="row.remarks" size="mini" placeholder="备注" maxlength="300" show-word-limit />
      </template>
      <template #todo="{row,rowIndex}">
        <div class="todo">
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" :disabled="disabled" size="mini" type="text" @click="editRow(row)">编辑</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" :disabled="disabled" size="mini" type="text" @click="deleteRow(row,rowIndex)">删除</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="saveRow(row)">保存</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="cancelRowEvent(row)">取消</el-button>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
import { listSchemeQuery, listDictItems } from '@/api/base.js'
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
    disabled: {
      type: Boolean,
      default: false
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
      dictDataList: [],
      schemeList: [],
      btnDisabled: true,
      validRules: {
        buyQuantity: [{ required: true, message: '请输入购买数量' }],
        priceExcludTax: [{ required: true, message: '请输入不含税单价' }],
        taxRate: [{ required: true, message: '请输入税率' }],
        assetCharacteristic: [{ required: true, message: '请选择资产特性' }],
        assetPhysicalState: [{ required: true, message: '请选择资产物态' }]
      }
    }
  },
  computed: {
    tableColumn() {
      return [
        { type: 'checkbox', width: 40, align: 'center', fixed: 'left', visible: !this.disabled && this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, showOverflow: true, field: 'materialCode', title: '资产编号', width: 150, fixed: 'left' },
        { visible: true, showOverflow: true, field: 'materialName', title: '资产名称', width: 150, fixed: 'left' },
        { visible: true, showOverflow: true, field: 'categoryName', title: '资产分类', width: 150 },
        { visible: true, showOverflow: true, field: 'modelType', title: '规格型号', width: 100 },
        { visible: true, showOverflow: true, field: 'brandName', title: '品牌', width: 80 },
        {
          visible: true,
          showOverflow: true,
          field: 'buyQuantity',
          title: '购买数量',
          width: 160,
          formatter: ['formatMoney', this.formData.materialType == 1 ? 0 : 3],
          headerAlign: 'center',
          align: 'right',
          slots: { edit: 'buyQuantity' },
          editRender: {}
        },
        { visible: true, showOverflow: true, field: 'unitName', title: '数量单位', width: 80 },
        {
          visible: true,
          showOverflow: true,
          field: 'priceExcludTax',
          title: '不含税单价（元）',
          width: 160,
          formatter: ['formatMoney', 8],
          headerAlign: 'center',
          align: 'right',
          slots: { edit: 'priceExcludTax' },
          editRender: {}
        },
        {
          visible: true,
          showOverflow: true,
          field: 'taxRate',
          title: '税率（%）',
          width: 130,
          formatter: 'formatMoney',
          headerAlign: 'center',
          align: 'right',
          slots: { edit: 'taxRate' },
          editRender: {}
        },
        {
          visible: true,
          showOverflow: true,
          field: 'taxAmount',
          title: '税额（元）',
          width: 160,
          formatter: ['formatMoney', 8],
          headerAlign: 'center',
          align: 'right',
          slots: { edit: 'taxAmount' },
          editRender: {}
        },
        {
          visible: true,
          showOverflow: true,
          field: 'priceIncludTax',
          title: '含税单价（元）',
          width: 160,
          formatter: ['formatMoney', 8],
          headerAlign: 'center',
          align: 'right'
        },
        { visible: true, showOverflow: true, field: 'subtotal', title: '金额小计（元）', width: 160, formatter: ['formatMoney', 2], headerAlign: 'center', align: 'right' },
        {
          visible: true,
          showOverflow: true,
          field: 'discountAmount',
          title: '优惠金额（元）',
          width: 150,
          formatter: ['formatMoney', 2],
          headerAlign: 'center',
          align: 'right',
          slots: { edit: 'discountAmount' },
          editRender: {}
        },
        {
          visible: true,
          showOverflow: true,
          field: 'assetCharacteristic',
          title: '资产特性',
          width: 150,
          slots: { default: 'assetCharacteristic', edit: 'assetCharacteristic' },
          editRender: {}
        },
        {
          visible: true,
          showOverflow: true,
          field: 'assetPhysicalState',
          title: '资产物态',
          width: 150,
          slots: { default: 'assetPhysicalState', edit: 'assetPhysicalState' },
          editRender: {}
        },
        { visible: true, showOverflow: true, field: 'schemeName', title: '方案名称', width: 150, slots: { default: 'schemeName', edit: 'schemeName' }, editRender: {} },

        { visible: true, showOverflow: true, field: 'remarks', title: '备注', width: 100, slots: { edit: 'remarks' }, editRender: {}, headerAlign: 'center', align: 'left' },
        { field: 'todo', title: '操作', width: 100, fixed: 'right', slots: { default: 'todo' }, visible: !this.disabled && this.showBtn }
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
        { valueName: 'materialType', value: this.formData.materialType, disabled: this.tableData.length > 0 }
      ]
    },
    assetPhysicalStateList() {
      var obj = {
        1: ['1', '8', '9'],
        2: ['2', '3', '5'],
        3: ['4', '6', '7']
      }
      var list = this.dictDataList.filter((item) => {
        return obj[this.formData.materialType].includes(item.itemsValue)
      })
      return list
    }
  },
  watch: {
    'formData.assetApplicationDetail': {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.tableData = this.formData.assetApplicationDetail.map((item) => {
            for (var i in item) {
              if (!item[i] && item[i] != 0) {
                delete item[i]
              }
            }
            return item
          })
        }
      }
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    selectMaterialHandler(val, materialType) {
      this.$emit('update:formData', { ...this.formData, ...{ materialType } })
      for (var i in val) {
        var item = val[i]
        var index = this.tableData.findIndex((temp) => {
          return item.materialId == temp.materialId
        })
        if (this.tableData.length < 200) {
          if (index < 0) {
            this.tableData.push({
              ...item,
              ...{
                taxAmount: item.taxValue,
                priceIncludTax: item.price
              }
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '只能选择200条数据，超出部门自动剔除'
          })
          break
        }
      }
      this.$emit('calculate', this.tableData)
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
      listSchemeQuery().then((response) => {
        // 方案信息
        this.schemeList = response.rows
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
      if (row.priceIncludTax && row.buyQuantity) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.priceIncludTax, row.buyQuantity))
      }
      if (this.$refs.xTable) {
        this.$refs.xTable.updateFooter()
      }
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
    // 保存行
    async saveRow(row) {
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
    changesChemeId(val) {
      var data = this.schemeList.find((item) => item.schemeId == val)
      var row = this.$refs.xTable.getActiveRecord().row
      this.$set(row, 'schemeName', data.schemeName)
    },
    downloadAssetDetail() {
      var list = this.$refs.xTable.getCheckboxRecords()
      if (list.length == 0) {
        list = JSON.stringify(this.tableData)
      } else {
        list = JSON.stringify(list)
      }
      this.download('/srm/material/exportAssetDetail', { jsonString: JSON.stringify(this.tableData) }, `申购资产明细_${new Date().getTime()}.xlsx`)
    },
    handleExport() {
      var queryParams = {}
      queryParams['purchaseApplicationCode'] = this.formData.purchaseApplicationCode
      this.download(
        '/srm/application/export',
        {
          ...queryParams
        },
        `申购${this.formData.purchaseApplicationCode}资产明细_${new Date().getTime()}.xlsx`
      )
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
      this.$confirm(`<div style='word-wrap: break-word;'>是否确认删除资产编号为"${list.map((item) => item.materialCode).join()}"的数据项？</div>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        list.forEach((item) => {
          var index = this.tableData.findIndex((temp) => {
            return item.materialId == temp.materialId
          })
          this.tableData.splice(index, 1)
        })
      })
      this.$emit('calculate', this.tableData)
    },
    // 批量导入
    uploadSuccess(res) {
      var truelist = res.data.filter((item) => item.isError == 0)
      var falselist = res.data.filter((item) => item.isError == 1)
      if (this.tableData.length == 0 && truelist && truelist.length > 0) {
        this.formData.materialType = truelist[0].materialType
        this.tableData = [...truelist]
      } else {
        truelist.forEach((item) => {
          for (var i in item) {
            if (!item[i]) delete item[i]
          }
          var index = this.tableData.findIndex((temp) => {
            return item.materialCode == temp.materialCode && item.materialName == temp.materialName
          })
          if (index >= 0) {
            this.$set(this.tableData, index, { ...this.tableData[index], ...item })
          } else {
            this.tableData.push(item)
          }
        })
      }
      if (falselist && falselist.length > 0) {
        this.download('/srm/material/exportAssetDetail', { jsonString: JSON.stringify(falselist) }, `明细表导入失败数据_${new Date().getTime()}.xlsx`)
      }
      this.$emit('calculate', this.tableData)
    },
    // 校验明细表
    validTable() {
      return new Promise((resolve) => {
        this.$refs.xTable.fullValidate(this.tableData).then((res) => {
          resolve(res)
        })
      })
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
    // 改变资产物态
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
    // 表尾合计
    getFooterData({ columns, data }) {
      var obj = []
      if (this.formData.materialType == 1) {
        obj = {
          buyQuantity: 0,
          taxAmount: 8,
          subtotal: 2,
          discountAmount: 2,
          priceExcludTax: 8,
          priceIncludTax: 8
        }
      } else {
        obj = {
          buyQuantity: 3,
          taxAmount: 8,
          subtotal: 2,
          discountAmount: 2,
          priceExcludTax: 8,
          priceIncludTax: 8
        }
      }
      return this.footerMethod(columns, data, '', obj, 1)
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

