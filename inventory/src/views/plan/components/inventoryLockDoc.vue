<template>
  <div>
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
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      tableColumn: [
        { field: 'ynSelfInventory', title: '是否已盘', width: 130, fixed: 'left' }, // [字典项下拉选择]
        { field: 'assetCode', title: '资产编码', width: 130, fixed: 'left' },
        { field: 'assetName', title: '资产名称', width: 130, fixed: 'left' },
        { field: 'categoryName', title: '资产分类', width: 130, fixed: 'left' },
        { field: 'pictureName', title: '资产图片', width: 130 },
        { field: 'centralizedBusinessName', title: '业务归口', width: 130 },
        { field: '', title: '验收单号', width: 130 },
        { field: 'serialNum', title: '序列号', width: 130 },
        { field: 'specificationModel', title: '规格型号', width: 130 },
        { field: 'brandName', title: '品牌', width: 130 },
        { field: 'inventoryQuantity', title: '库存数量', width: 130 },
        { field: 'offereQuantity', title: '应盘数量', width: 130 },
        { field: 'firmQuantity', title: '实盘数量', width: 130 }, // [手动输入]
        { field: 'unscheduleQuantity', title: '未盘数量', width: 130 }, // [自动计算]
        { field: 'unassignQuantity', title: '未派数量', width: 130 },
        { field: 'quantityUnit', title: '数量单位', width: 130 },
        { field: 'conversionQuantity', title: '换算数量', width: 130 },
        { field: '', title: '换算数量单位', width: 130 },
        { field: 'inventoryCheckerName', title: '盘点人', width: 130 }, // [根据当前盘点用户自动带出姓名]
        { field: 'inventoryCheckerOrgName', title: '盘点部门', width: 130 }, // [根据当前盘点用户自动带出部门]
        { field: 'sourceTerminal', title: '盘点终端', width: 130 }, // [根据当前盘点用户自动带出终端]
        { field: '', title: '盘点时间', width: 130 }, // [默认当前盘点扫描日期]
        { field: 'unscheduleHandle', title: '未盘处理', width: 130 }, // [字典项下拉选择]
        { field: 'inventoryFeedback', title: '盘点反馈', width: 130 }, // [手动输入]
        { field: 'priceExcludTax', title: '不含税单价（元）', width: 150 },
        { field: 'taxRate', title: '税率（%）', width: 130 },
        { field: 'taxAmount', title: '税额（元）', width: 130 },
        { field: 'priceIncludTax', title: '含税单价（元）', width: 130 },
        { field: 'subtotal', title: '金额小计（元）', width: 130 },
        { field: 'currentUserName', title: '使用人', width: 130 },
        { field: 'currentOrgName', title: '使用部门', width: 130 },
        { field: 'currentEreaName', title: '使用区域', width: 130 },
        { field: 'currentLocationName', title: '具体位置', width: 130 },
        { field: 'firstShelfName', title: '存放货架', width: 130 },
        { field: 'warehouseName', title: '仓库名称', width: 130 },
        { field: 'assetCharacteristic', title: '资产特性', width: 130 },
        { field: 'assetPhysicalState', title: '资产物态', width: 130 },
        { field: 'qualityGuaranteePeriod', title: '质保期', width: 130 },
        { field: 'termValidity', title: '有效期', width: 130 },
        { field: '', title: '启用日期', width: 130 },
        { field: 'status', title: '资产状态', width: 130 }
      ]
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>