<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="耗材派发单ID" prop="consumableDistributeId">
        <el-input
          v-model="queryParams.consumableDistributeId"
          placeholder="请输入耗材派发单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="耗材台账ID" prop="consumableAccountId">
        <el-input
          v-model="queryParams.consumableAccountId"
          placeholder="请输入耗材台账ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产编码" prop="assetCode">
        <el-input
          v-model="queryParams.assetCode"
          placeholder="请输入资产编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产名称" prop="assetName">
        <el-input
          v-model="queryParams.assetName"
          placeholder="请输入资产名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资基础ID" prop="materialId">
        <el-input
          v-model="queryParams.materialId"
          placeholder="请输入物资基础ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物资编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资分类ID" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入物资分类ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资分类名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入物资分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产图片名称" prop="pictureName">
        <el-input
          v-model="queryParams.pictureName"
          placeholder="请输入资产图片名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序列号" prop="serialNum">
        <el-input
          v-model="queryParams.serialNum"
          placeholder="请输入序列号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格型号" prop="specificationModel">
        <el-input
          v-model="queryParams.specificationModel"
          placeholder="请输入规格型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌ID" prop="brandId">
        <el-input
          v-model="queryParams.brandId"
          placeholder="请输入品牌ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌名称" prop="brandName">
        <el-input
          v-model="queryParams.brandName"
          placeholder="请输入品牌名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用目的，枚举值包括政府公关、媒体公关、新员工入职" prop="usePurpose">
        <el-input
          v-model="queryParams.usePurpose"
          placeholder="请输入使用目的，枚举值包括政府公关、媒体公关、新员工入职"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存数量" prop="inventoryQuantity">
        <el-input
          v-model="queryParams.inventoryQuantity"
          placeholder="请输入库存数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="派发数量" prop="distributeQuantity">
        <el-input
          v-model="queryParams.distributeQuantity"
          placeholder="请输入派发数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量单位" prop="quantityUnit">
        <el-input
          v-model="queryParams.quantityUnit"
          placeholder="请输入数量单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="换算单位" prop="conversionUnit">
        <el-input
          v-model="queryParams.conversionUnit"
          placeholder="请输入换算单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="换算数量" prop="conversionQuantity">
        <el-input
          v-model="queryParams.conversionQuantity"
          placeholder="请输入换算数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="不含税单价" prop="priceExcludTax">
        <el-input
          v-model="queryParams.priceExcludTax"
          placeholder="请输入不含税单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="含税单价" prop="priceIncludTax">
        <el-input
          v-model="queryParams.priceIncludTax"
          placeholder="请输入含税单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input
          v-model="queryParams.taxRate"
          placeholder="请输入税率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="税额" prop="taxAmount">
        <el-input
          v-model="queryParams.taxAmount"
          placeholder="请输入税额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠金额" prop="discountAmount">
        <el-input
          v-model="queryParams.discountAmount"
          placeholder="请输入优惠金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额小计" prop="subtotal">
        <el-input
          v-model="queryParams.subtotal"
          placeholder="请输入金额小计"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产所属仓库ID" prop="warehouseId">
        <el-input
          v-model="queryParams.warehouseId"
          placeholder="请输入资产所属仓库ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产所属仓库名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入资产所属仓库名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产所属公司ID" prop="assetCompanyId">
        <el-input
          v-model="queryParams.assetCompanyId"
          placeholder="请输入资产所属公司ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产所属公司名称" prop="assetCompanyName">
        <el-input
          v-model="queryParams.assetCompanyName"
          placeholder="请输入资产所属公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产存储货架ID" prop="firstShelfId">
        <el-input
          v-model="queryParams.firstShelfId"
          placeholder="请输入资产存储货架ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产存储货架名称" prop="firstShelfName">
        <el-input
          v-model="queryParams.firstShelfName"
          placeholder="请输入资产存储货架名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产存储二级货架ID" prop="secondShelfId">
        <el-input
          v-model="queryParams.secondShelfId"
          placeholder="请输入资产存储二级货架ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产存储二级货架名称" prop="secondShelfName">
        <el-input
          v-model="queryParams.secondShelfName"
          placeholder="请输入资产存储二级货架名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目ID" prop="projectId">
        <el-input
          v-model="queryParams.projectId"
          placeholder="请输入项目ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案ID" prop="schemeId">
        <el-input
          v-model="queryParams.schemeId"
          placeholder="请输入方案ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案编号" prop="schemeCode">
        <el-input
          v-model="queryParams.schemeCode"
          placeholder="请输入方案编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产特性枚举值包括1固定资产、2易耗物资、3活动物资 、4营销礼品、 5推广物资、6激励礼品、7礼品物资、8设备资产、9车辆资产" prop="assetCharacteristic">
        <el-input
          v-model="queryParams.assetCharacteristic"
          placeholder="请输入资产特性枚举值包括1固定资产、2易耗物资、3活动物资 、4营销礼品、 5推广物资、6激励礼品、7礼品物资、8设备资产、9车辆资产"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产物态枚举值包括1实物到货、2虚拟到货、3第三方托管、4第三方租赁" prop="assetPhysicalState">
        <el-input
          v-model="queryParams.assetPhysicalState"
          placeholder="请输入资产物态枚举值包括1实物到货、2虚拟到货、3第三方托管、4第三方租赁"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库单ID" prop="acceptedOrderId">
        <el-input
          v-model="queryParams.acceptedOrderId"
          placeholder="请输入入库单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库单编号" prop="acceptedOrderCode">
        <el-input
          v-model="queryParams.acceptedOrderCode"
          placeholder="请输入入库单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用人ID" prop="currentUserId">
        <el-input
          v-model="queryParams.currentUserId"
          placeholder="请输入当前使用人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用人姓名" prop="currentUserName">
        <el-input
          v-model="queryParams.currentUserName"
          placeholder="请输入当前使用人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用部门ID" prop="currentOrgId">
        <el-input
          v-model="queryParams.currentOrgId"
          placeholder="请输入当前使用部门ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用部门名称" prop="currentOrgName">
        <el-input
          v-model="queryParams.currentOrgName"
          placeholder="请输入当前使用部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用公司ID" prop="currentCompanyId">
        <el-input
          v-model="queryParams.currentCompanyId"
          placeholder="请输入当前使用公司ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用公司名称" prop="currentCompanyName">
        <el-input
          v-model="queryParams.currentCompanyName"
          placeholder="请输入当前使用公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用区域ID" prop="currentEreaId">
        <el-input
          v-model="queryParams.currentEreaId"
          placeholder="请输入当前使用区域ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用区域名称" prop="currentEreaName">
        <el-input
          v-model="queryParams.currentEreaName"
          placeholder="请输入当前使用区域名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用具体位置ID" prop="currentLocationId">
        <el-input
          v-model="queryParams.currentLocationId"
          placeholder="请输入当前使用具体位置ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用具体位置名称" prop="currentLocationName">
        <el-input
          v-model="queryParams.currentLocationName"
          placeholder="请输入当前使用具体位置名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务归口ID" prop="centralizedBusinessId">
        <el-input
          v-model="queryParams.centralizedBusinessId"
          placeholder="请输入业务归口ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务归口名称" prop="centralizedBusinessName">
        <el-input
          v-model="queryParams.centralizedBusinessName"
          placeholder="请输入业务归口名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字段1" prop="extendedField1">
        <el-input
          v-model="queryParams.extendedField1"
          placeholder="请输入扩展字段1"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字典2" prop="extendedField2">
        <el-input
          v-model="queryParams.extendedField2"
          placeholder="请输入扩展字典2"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字典3" prop="extendedField3">
        <el-input
          v-model="queryParams.extendedField3"
          placeholder="请输入扩展字典3"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字典5" prop="extendedField5">
        <el-date-picker clearable
          v-model="queryParams.extendedField5"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择扩展字典5">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="扩展字典6" prop="extendedField6">
        <el-date-picker clearable
          v-model="queryParams.extendedField6"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择扩展字典6">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="扩展字典7" prop="extendedField7">
        <el-date-picker clearable
          v-model="queryParams.extendedField7"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择扩展字典7">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="扩展字典8" prop="extendedField8">
        <el-input
          v-model="queryParams.extendedField8"
          placeholder="请输入扩展字典8"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字典9" prop="extendedField9">
        <el-input
          v-model="queryParams.extendedField9"
          placeholder="请输入扩展字典9"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扩展字典10" prop="extendedField10">
        <el-input
          v-model="queryParams.extendedField10"
          placeholder="请输入扩展字典10"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户统一系统编号" prop="unifiedSystemNumber">
        <el-input
          v-model="queryParams.unifiedSystemNumber"
          placeholder="请输入客户统一系统编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable
          v-model="queryParams.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateDate">
        <el-date-picker clearable
          v-model="queryParams.updateDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['consume:distribute:detail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['consume:distribute:detail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['consume:distribute:detail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['consume:distribute:detail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="耗材派发明细ID" align="center" prop="consumableDistributeDetailId" />
      <el-table-column label="耗材派发单ID" align="center" prop="consumableDistributeId" />
      <el-table-column label="耗材台账ID" align="center" prop="consumableAccountId" />
      <el-table-column label="资产编码" align="center" prop="assetCode" />
      <el-table-column label="资产名称" align="center" prop="assetName" />
      <el-table-column label="物资基础ID" align="center" prop="materialId" />
      <el-table-column label="物资编码" align="center" prop="materialCode" />
      <el-table-column label="物资分类ID" align="center" prop="categoryId" />
      <el-table-column label="物资分类名称" align="center" prop="categoryName" />
      <el-table-column label="资产图片名称" align="center" prop="pictureName" />
      <el-table-column label="资产图片URI" align="center" prop="pictureRui" />
      <el-table-column label="序列号" align="center" prop="serialNum" />
      <el-table-column label="规格型号" align="center" prop="specificationModel" />
      <el-table-column label="品牌ID" align="center" prop="brandId" />
      <el-table-column label="品牌名称" align="center" prop="brandName" />
      <el-table-column label="使用目的，枚举值包括政府公关、媒体公关、新员工入职" align="center" prop="usePurpose" />
      <el-table-column label="库存数量" align="center" prop="inventoryQuantity" />
      <el-table-column label="派发数量" align="center" prop="distributeQuantity" />
      <el-table-column label="数量单位" align="center" prop="quantityUnit" />
      <el-table-column label="换算单位" align="center" prop="conversionUnit" />
      <el-table-column label="换算数量" align="center" prop="conversionQuantity" />
      <el-table-column label="不含税单价" align="center" prop="priceExcludTax" />
      <el-table-column label="含税单价" align="center" prop="priceIncludTax" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="税额" align="center" prop="taxAmount" />
      <el-table-column label="优惠金额" align="center" prop="discountAmount" />
      <el-table-column label="金额小计" align="center" prop="subtotal" />
      <el-table-column label="资产所属仓库ID" align="center" prop="warehouseId" />
      <el-table-column label="资产所属仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="资产所属公司ID" align="center" prop="assetCompanyId" />
      <el-table-column label="资产所属公司名称" align="center" prop="assetCompanyName" />
      <el-table-column label="资产存储货架ID" align="center" prop="firstShelfId" />
      <el-table-column label="资产存储货架名称" align="center" prop="firstShelfName" />
      <el-table-column label="资产存储二级货架ID" align="center" prop="secondShelfId" />
      <el-table-column label="资产存储二级货架名称" align="center" prop="secondShelfName" />
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="方案ID" align="center" prop="schemeId" />
      <el-table-column label="方案编号" align="center" prop="schemeCode" />
      <el-table-column label="方案名称" align="center" prop="schemeName" />
      <el-table-column label="资产特性枚举值包括1固定资产、2易耗物资、3活动物资 、4营销礼品、 5推广物资、6激励礼品、7礼品物资、8设备资产、9车辆资产" align="center" prop="assetCharacteristic" />
      <el-table-column label="资产物态枚举值包括1实物到货、2虚拟到货、3第三方托管、4第三方租赁" align="center" prop="assetPhysicalState" />
      <el-table-column label="入库单ID" align="center" prop="acceptedOrderId" />
      <el-table-column label="入库单编号" align="center" prop="acceptedOrderCode" />
      <el-table-column label="当前使用人ID" align="center" prop="currentUserId" />
      <el-table-column label="当前使用人姓名" align="center" prop="currentUserName" />
      <el-table-column label="当前使用部门ID" align="center" prop="currentOrgId" />
      <el-table-column label="当前使用部门名称" align="center" prop="currentOrgName" />
      <el-table-column label="当前使用公司ID" align="center" prop="currentCompanyId" />
      <el-table-column label="当前使用公司名称" align="center" prop="currentCompanyName" />
      <el-table-column label="当前使用区域ID" align="center" prop="currentEreaId" />
      <el-table-column label="当前使用区域名称" align="center" prop="currentEreaName" />
      <el-table-column label="当前使用具体位置ID" align="center" prop="currentLocationId" />
      <el-table-column label="当前使用具体位置名称" align="center" prop="currentLocationName" />
      <el-table-column label="业务归口ID" align="center" prop="centralizedBusinessId" />
      <el-table-column label="业务归口名称" align="center" prop="centralizedBusinessName" />
      <el-table-column label="扩展字段1" align="center" prop="extendedField1" />
      <el-table-column label="扩展字典2" align="center" prop="extendedField2" />
      <el-table-column label="扩展字典3" align="center" prop="extendedField3" />
      <el-table-column label="扩展字典4" align="center" prop="extendedField4" />
      <el-table-column label="扩展字典5" align="center" prop="extendedField5" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.extendedField5, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扩展字典6" align="center" prop="extendedField6" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.extendedField6, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扩展字典7" align="center" prop="extendedField7" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.extendedField7, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扩展字典8" align="center" prop="extendedField8" />
      <el-table-column label="扩展字典9" align="center" prop="extendedField9" />
      <el-table-column label="扩展字典10" align="center" prop="extendedField10" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="客户统一系统编号" align="center" prop="unifiedSystemNumber" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处置状态枚举值包括0正常、1待报废、2维修中、3待捐赠、4调拨中" align="center" prop="dealStatus" />
      <el-table-column label="状态包括0草稿，1审批通过，2审批中，3审批不通过，4作废" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['consume:distribute:detail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['consume:distribute:detail:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改耗材派发明细信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="耗材派发单ID" prop="consumableDistributeId">
          <el-input v-model="form.consumableDistributeId" placeholder="请输入耗材派发单ID" />
        </el-form-item>
        <el-form-item label="耗材台账ID" prop="consumableAccountId">
          <el-input v-model="form.consumableAccountId" placeholder="请输入耗材台账ID" />
        </el-form-item>
        <el-form-item label="资产编码" prop="assetCode">
          <el-input v-model="form.assetCode" placeholder="请输入资产编码" />
        </el-form-item>
        <el-form-item label="资产名称" prop="assetName">
          <el-input v-model="form.assetName" placeholder="请输入资产名称" />
        </el-form-item>
        <el-form-item label="物资基础ID" prop="materialId">
          <el-input v-model="form.materialId" placeholder="请输入物资基础ID" />
        </el-form-item>
        <el-form-item label="物资编码" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物资编码" />
        </el-form-item>
        <el-form-item label="物资分类ID" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入物资分类ID" />
        </el-form-item>
        <el-form-item label="物资分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入物资分类名称" />
        </el-form-item>
        <el-form-item label="资产图片名称" prop="pictureName">
          <el-input v-model="form.pictureName" placeholder="请输入资产图片名称" />
        </el-form-item>
        <el-form-item label="资产图片URI" prop="pictureRui">
          <el-input v-model="form.pictureRui" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="序列号" prop="serialNum">
          <el-input v-model="form.serialNum" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specificationModel">
          <el-input v-model="form.specificationModel" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="品牌ID" prop="brandId">
          <el-input v-model="form.brandId" placeholder="请输入品牌ID" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="使用目的，枚举值包括政府公关、媒体公关、新员工入职" prop="usePurpose">
          <el-input v-model="form.usePurpose" placeholder="请输入使用目的，枚举值包括政府公关、媒体公关、新员工入职" />
        </el-form-item>
        <el-form-item label="库存数量" prop="inventoryQuantity">
          <el-input v-model="form.inventoryQuantity" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="派发数量" prop="distributeQuantity">
          <el-input v-model="form.distributeQuantity" placeholder="请输入派发数量" />
        </el-form-item>
        <el-form-item label="数量单位" prop="quantityUnit">
          <el-input v-model="form.quantityUnit" placeholder="请输入数量单位" />
        </el-form-item>
        <el-form-item label="换算单位" prop="conversionUnit">
          <el-input v-model="form.conversionUnit" placeholder="请输入换算单位" />
        </el-form-item>
        <el-form-item label="换算数量" prop="conversionQuantity">
          <el-input v-model="form.conversionQuantity" placeholder="请输入换算数量" />
        </el-form-item>
        <el-form-item label="不含税单价" prop="priceExcludTax">
          <el-input v-model="form.priceExcludTax" placeholder="请输入不含税单价" />
        </el-form-item>
        <el-form-item label="含税单价" prop="priceIncludTax">
          <el-input v-model="form.priceIncludTax" placeholder="请输入含税单价" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="税额" prop="taxAmount">
          <el-input v-model="form.taxAmount" placeholder="请输入税额" />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discountAmount">
          <el-input v-model="form.discountAmount" placeholder="请输入优惠金额" />
        </el-form-item>
        <el-form-item label="金额小计" prop="subtotal">
          <el-input v-model="form.subtotal" placeholder="请输入金额小计" />
        </el-form-item>
        <el-form-item label="资产所属仓库ID" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入资产所属仓库ID" />
        </el-form-item>
        <el-form-item label="资产所属仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入资产所属仓库名称" />
        </el-form-item>
        <el-form-item label="资产所属公司ID" prop="assetCompanyId">
          <el-input v-model="form.assetCompanyId" placeholder="请输入资产所属公司ID" />
        </el-form-item>
        <el-form-item label="资产所属公司名称" prop="assetCompanyName">
          <el-input v-model="form.assetCompanyName" placeholder="请输入资产所属公司名称" />
        </el-form-item>
        <el-form-item label="资产存储货架ID" prop="firstShelfId">
          <el-input v-model="form.firstShelfId" placeholder="请输入资产存储货架ID" />
        </el-form-item>
        <el-form-item label="资产存储货架名称" prop="firstShelfName">
          <el-input v-model="form.firstShelfName" placeholder="请输入资产存储货架名称" />
        </el-form-item>
        <el-form-item label="资产存储二级货架ID" prop="secondShelfId">
          <el-input v-model="form.secondShelfId" placeholder="请输入资产存储二级货架ID" />
        </el-form-item>
        <el-form-item label="资产存储二级货架名称" prop="secondShelfName">
          <el-input v-model="form.secondShelfName" placeholder="请输入资产存储二级货架名称" />
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="form.projectId" placeholder="请输入项目ID" />
        </el-form-item>
        <el-form-item label="项目编号" prop="projectCode">
          <el-input v-model="form.projectCode" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="方案ID" prop="schemeId">
          <el-input v-model="form.schemeId" placeholder="请输入方案ID" />
        </el-form-item>
        <el-form-item label="方案编号" prop="schemeCode">
          <el-input v-model="form.schemeCode" placeholder="请输入方案编号" />
        </el-form-item>
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="form.schemeName" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="资产特性枚举值包括1固定资产、2易耗物资、3活动物资 、4营销礼品、 5推广物资、6激励礼品、7礼品物资、8设备资产、9车辆资产" prop="assetCharacteristic">
          <el-input v-model="form.assetCharacteristic" placeholder="请输入资产特性枚举值包括1固定资产、2易耗物资、3活动物资 、4营销礼品、 5推广物资、6激励礼品、7礼品物资、8设备资产、9车辆资产" />
        </el-form-item>
        <el-form-item label="资产物态枚举值包括1实物到货、2虚拟到货、3第三方托管、4第三方租赁" prop="assetPhysicalState">
          <el-input v-model="form.assetPhysicalState" placeholder="请输入资产物态枚举值包括1实物到货、2虚拟到货、3第三方托管、4第三方租赁" />
        </el-form-item>
        <el-form-item label="入库单ID" prop="acceptedOrderId">
          <el-input v-model="form.acceptedOrderId" placeholder="请输入入库单ID" />
        </el-form-item>
        <el-form-item label="入库单编号" prop="acceptedOrderCode">
          <el-input v-model="form.acceptedOrderCode" placeholder="请输入入库单编号" />
        </el-form-item>
        <el-form-item label="当前使用人ID" prop="currentUserId">
          <el-input v-model="form.currentUserId" placeholder="请输入当前使用人ID" />
        </el-form-item>
        <el-form-item label="当前使用人姓名" prop="currentUserName">
          <el-input v-model="form.currentUserName" placeholder="请输入当前使用人姓名" />
        </el-form-item>
        <el-form-item label="当前使用部门ID" prop="currentOrgId">
          <el-input v-model="form.currentOrgId" placeholder="请输入当前使用部门ID" />
        </el-form-item>
        <el-form-item label="当前使用部门名称" prop="currentOrgName">
          <el-input v-model="form.currentOrgName" placeholder="请输入当前使用部门名称" />
        </el-form-item>
        <el-form-item label="当前使用公司ID" prop="currentCompanyId">
          <el-input v-model="form.currentCompanyId" placeholder="请输入当前使用公司ID" />
        </el-form-item>
        <el-form-item label="当前使用公司名称" prop="currentCompanyName">
          <el-input v-model="form.currentCompanyName" placeholder="请输入当前使用公司名称" />
        </el-form-item>
        <el-form-item label="当前使用区域ID" prop="currentEreaId">
          <el-input v-model="form.currentEreaId" placeholder="请输入当前使用区域ID" />
        </el-form-item>
        <el-form-item label="当前使用区域名称" prop="currentEreaName">
          <el-input v-model="form.currentEreaName" placeholder="请输入当前使用区域名称" />
        </el-form-item>
        <el-form-item label="当前使用具体位置ID" prop="currentLocationId">
          <el-input v-model="form.currentLocationId" placeholder="请输入当前使用具体位置ID" />
        </el-form-item>
        <el-form-item label="当前使用具体位置名称" prop="currentLocationName">
          <el-input v-model="form.currentLocationName" placeholder="请输入当前使用具体位置名称" />
        </el-form-item>
        <el-form-item label="业务归口ID" prop="centralizedBusinessId">
          <el-input v-model="form.centralizedBusinessId" placeholder="请输入业务归口ID" />
        </el-form-item>
        <el-form-item label="业务归口名称" prop="centralizedBusinessName">
          <el-input v-model="form.centralizedBusinessName" placeholder="请输入业务归口名称" />
        </el-form-item>
        <el-form-item label="扩展字段1" prop="extendedField1">
          <el-input v-model="form.extendedField1" placeholder="请输入扩展字段1" />
        </el-form-item>
        <el-form-item label="扩展字典2" prop="extendedField2">
          <el-input v-model="form.extendedField2" placeholder="请输入扩展字典2" />
        </el-form-item>
        <el-form-item label="扩展字典3" prop="extendedField3">
          <el-input v-model="form.extendedField3" placeholder="请输入扩展字典3" />
        </el-form-item>
        <el-form-item label="扩展字典4" prop="extendedField4">
          <el-input v-model="form.extendedField4" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="扩展字典5" prop="extendedField5">
          <el-date-picker clearable
            v-model="form.extendedField5"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择扩展字典5">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扩展字典6" prop="extendedField6">
          <el-date-picker clearable
            v-model="form.extendedField6"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择扩展字典6">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扩展字典7" prop="extendedField7">
          <el-date-picker clearable
            v-model="form.extendedField7"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择扩展字典7">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扩展字典8" prop="extendedField8">
          <el-input v-model="form.extendedField8" placeholder="请输入扩展字典8" />
        </el-form-item>
        <el-form-item label="扩展字典9" prop="extendedField9">
          <el-input v-model="form.extendedField9" placeholder="请输入扩展字典9" />
        </el-form-item>
        <el-form-item label="扩展字典10" prop="extendedField10">
          <el-input v-model="form.extendedField10" placeholder="请输入扩展字典10" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="客户统一系统编号" prop="unifiedSystemNumber">
          <el-input v-model="form.unifiedSystemNumber" placeholder="请输入客户统一系统编号" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标记" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标记" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updateDate">
          <el-date-picker clearable
            v-model="form.updateDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDetail, getDetail, delDetail, addDetail, updateDetail } from "@/api/consume/distributeDetail";

export default {
  name: "Detail",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 耗材派发明细信息表格数据
      detailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        consumableDistributeId: null,
        consumableAccountId: null,
        assetCode: null,
        assetName: null,
        materialId: null,
        materialCode: null,
        categoryId: null,
        categoryName: null,
        pictureName: null,
        pictureRui: null,
        serialNum: null,
        specificationModel: null,
        brandId: null,
        brandName: null,
        usePurpose: null,
        inventoryQuantity: null,
        distributeQuantity: null,
        quantityUnit: null,
        conversionUnit: null,
        conversionQuantity: null,
        priceExcludTax: null,
        priceIncludTax: null,
        taxRate: null,
        taxAmount: null,
        discountAmount: null,
        subtotal: null,
        warehouseId: null,
        warehouseName: null,
        assetCompanyId: null,
        assetCompanyName: null,
        firstShelfId: null,
        firstShelfName: null,
        secondShelfId: null,
        secondShelfName: null,
        projectId: null,
        projectCode: null,
        projectName: null,
        schemeId: null,
        schemeCode: null,
        schemeName: null,
        assetCharacteristic: null,
        assetPhysicalState: null,
        acceptedOrderId: null,
        acceptedOrderCode: null,
        currentUserId: null,
        currentUserName: null,
        currentOrgId: null,
        currentOrgName: null,
        currentCompanyId: null,
        currentCompanyName: null,
        currentEreaId: null,
        currentEreaName: null,
        currentLocationId: null,
        currentLocationName: null,
        centralizedBusinessId: null,
        centralizedBusinessName: null,
        extendedField1: null,
        extendedField2: null,
        extendedField3: null,
        extendedField4: null,
        extendedField5: null,
        extendedField6: null,
        extendedField7: null,
        extendedField8: null,
        extendedField9: null,
        extendedField10: null,
        sort: null,
        unifiedSystemNumber: null,
        remarks: null,
        createDate: null,
        updateDate: null,
        dealStatus: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询耗材派发明细信息列表 */
    getList() {
      this.loading = true;
      listDetail(this.queryParams).then(response => {
        this.detailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        consumableDistributeDetailId: null,
        consumableDistributeId: null,
        consumableAccountId: null,
        assetCode: null,
        assetName: null,
        materialId: null,
        materialCode: null,
        categoryId: null,
        categoryName: null,
        pictureName: null,
        pictureRui: null,
        serialNum: null,
        specificationModel: null,
        brandId: null,
        brandName: null,
        usePurpose: null,
        inventoryQuantity: null,
        distributeQuantity: null,
        quantityUnit: null,
        conversionUnit: null,
        conversionQuantity: null,
        priceExcludTax: null,
        priceIncludTax: null,
        taxRate: null,
        taxAmount: null,
        discountAmount: null,
        subtotal: null,
        warehouseId: null,
        warehouseName: null,
        assetCompanyId: null,
        assetCompanyName: null,
        firstShelfId: null,
        firstShelfName: null,
        secondShelfId: null,
        secondShelfName: null,
        projectId: null,
        projectCode: null,
        projectName: null,
        schemeId: null,
        schemeCode: null,
        schemeName: null,
        assetCharacteristic: null,
        assetPhysicalState: null,
        acceptedOrderId: null,
        acceptedOrderCode: null,
        currentUserId: null,
        currentUserName: null,
        currentOrgId: null,
        currentOrgName: null,
        currentCompanyId: null,
        currentCompanyName: null,
        currentEreaId: null,
        currentEreaName: null,
        currentLocationId: null,
        currentLocationName: null,
        centralizedBusinessId: null,
        centralizedBusinessName: null,
        extendedField1: null,
        extendedField2: null,
        extendedField3: null,
        extendedField4: null,
        extendedField5: null,
        extendedField6: null,
        extendedField7: null,
        extendedField8: null,
        extendedField9: null,
        extendedField10: null,
        sort: null,
        unifiedSystemNumber: null,
        remarks: null,
        delFlag: null,
        createDate: null,
        createBy: null,
        updateDate: null,
        updateBy: null,
        dealStatus: null,
        status: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.consumableDistributeDetailId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加耗材派发明细信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const consumableDistributeDetailId = row.consumableDistributeDetailId || this.ids
      getDetail(consumableDistributeDetailId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改耗材派发明细信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.consumableDistributeDetailId != null) {
            updateDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetail(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const consumableDistributeDetailIds = row.consumableDistributeDetailId || this.ids;
      this.$modal.confirm('是否确认删除耗材派发明细信息编号为"' + consumableDistributeDetailIds + '"的数据项？').then(function() {
        return delDetail(consumableDistributeDetailIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('consume/distributeDetail/export', {
        ...this.queryParams
      }, `detail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
