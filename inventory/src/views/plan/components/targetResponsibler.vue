<template>
  <div>
    <div class="pt-10 mb-10">
      <el-button size="mini" type="primary" icon="el-icon-plus" plain @click="addRow()">新增一行</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        :disabled="addDataDisabled?addDataDisabled!='compony':false"
        :loading="addDataDisabled=='compony'"
        plain
        @click="addAll('compony')"
      >一键添加全部公司</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        :disabled="addDataDisabled?addDataDisabled!='warehouse':false"
        :loading="addDataDisabled=='warehouse'"
        plain
        @click="addAll('warehouse')"
      >一键添加全部仓库</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        :disabled="addDataDisabled?addDataDisabled!='centre':false"
        :loading="addDataDisabled=='centre'"
        plain
        @click="addAll('centre')"
      >一键添加全部中心</el-button>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        :disabled="addDataDisabled?addDataDisabled!='depart':false"
        :loading="addDataDisabled=='depart'"
        plain
        @click="addAll('depart')"
      >一键添加全部部门</el-button>
      <el-button size="mini" icon="el-icon-upload2">导出</el-button>
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
      <template #markType="{row}">
        <base-input v-if="$refs.xTable.isActiveByRow(row)" :options-list="dictDataList" base-code="ImInventoryPlan-markType" :value.sync="row.markType" @change="changeMarkType" />
        <dictDateView v-else :value="row.markType" :dict-data-list="dictDataList" dict-code="ImInventoryPlan-markType" />
      </template>
      <template #markObjectName="{row}">
        <base-input
          v-if="row.markType==1"
          :value.sync="row.markObjectId"
          :label.sync="row.markObjectName"
          base-code="companyList"
          result-label="data"
          label-name="deptName"
          value-name="deptId"
          placeholder="请选择公司"
        />
        <el-input v-if="row.markType==2" suffix-icon="el-icon-arrow-down" :value="row.markObjectName" placeholder="请选择中心" @focus="openComponyDept(row.markType)" />
        <el-input v-if="row.markType==3" suffix-icon="el-icon-arrow-down" :value="row.markObjectName" placeholder="请选择部门" @focus="openComponyDept(row.markType)" />
        <el-input v-if="row.markType==4" suffix-icon="el-icon-arrow-down" :value="row.markObjectName" placeholder="请选择仓库" @focus="selectWarehouseDialog=true" />
        <el-input v-if="row.markType==5" suffix-icon="el-icon-arrow-down" :value="row.markObjectName" placeholder="请选择项目" @focus="projectDialogVisible=true" />
      </template>
      <!-- <template #responsiblerName="{row}">
        <el-input size="small" suffix-icon="el-icon-arrow-down" :value="row.responsiblerName" placeholder="请选择责任人" @focus="userDialogVisible=true" />
      </template>-->
      <template #assistanterNames="{row}">
        <el-input size="small" suffix-icon="el-icon-arrow-down" :value="row.assistanterNames" placeholder="请选择助理人员" @focus="userDialogVisibleMultiple=true" />
      </template>
      <template #coverageRange="{row}">
        <!-- <base-input v-if="$refs.xTable.isActiveByRow(row)" :value.sync="row.coverageRange" baseCode="ImInventoryPlan-coverageRange" :optionsList="propDictDataList" placeholder="覆盖范围" /> -->
        <dictDateView :value="row.coverageRange" :dict-data-list="propDictDataList" dict-code="ImInventoryPlan-coverageRange" />
      </template>
      <template #coverageDate="{row}">
        <!-- <base-input v-if="$refs.xTable.isActiveByRow(row)" labelName="businessName" valueName="businessId" :value.sync="row.coverageDate" :optionsList="typeList" placeholder="覆盖数据" /> -->
        <dictDateView :value="row.coverageDate" label-name="businessName" value-name="businessId" :dict-data-list="typeList" />
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
    <componyDept v-if="componyDeptDialog" :level="level" :visible.sync="componyDeptDialog" @confirm="seleceComponyDept" />
    <selectWarehouse v-if="selectWarehouseDialog" :visible.sync="selectWarehouseDialog" @confirm="selectWarehouse" />
    <project v-if="projectDialogVisible" :visible.sync="projectDialogVisible" @confirm="projectSelect" />
    <selectUser v-if="userDialogVisible" :visible.sync="userDialogVisible" title="选择责任人" @confirm="userSelect" />
    <selectUser v-if="userDialogVisibleMultiple" select-type="checkbox" :visible.sync="userDialogVisibleMultiple" title="选择助理人员" @confirm="userSelectMultiple" />
  </div>
</template>
<script>
import { listDictItems, listAddressQueryWarehouse, findCompanyList, getDeptByCompanyId } from '@/api/base.js'
export default {
  props: {
    propDictDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showBtn: false,
      btnDisabled: false,
      loading: false,
      tableData: [],
      addDataDisabled: null,
      user: this.$store.state.user.info,
      validRules: {
        markType: [{ required: true, message: '请选择盘点目标' }],
        markObjectName: [{ required: true, message: '请选择目标名称' }],
        // responsiblerName: [{ required: true, message: '请选择责任人' }],
        assistanterNames: [{ required: true, message: '请选择助理人员' }]
        // coverageRange: [{ required: true, message: '请选择覆盖范围' }],
        // coverageDate: [{ required: true, message: '请选择覆盖数量' }]
      },
      componyDeptDialog: false,
      selectWarehouseDialog: false,
      projectDialogVisible: false,
      userDialogVisible: false,
      userDialogVisibleMultiple: false,
      level: 1,
      tableColumn: [
        { type: 'checkbox', width: 50, align: 'center', fixed: 'left', visible: this.showBtn },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'markType', title: '盘点目标', width: 200, slots: { default: 'markType', edit: 'markType' }, editRender: {} },
        { field: 'markObjectName', title: '目标名称', width: 200, slots: { edit: 'markObjectName' }, editRender: {} },
        { field: 'responsiblerName', title: '责任人', width: 200 },
        { field: 'responsiblerOrgName', title: '责任部门', width: 200 },
        { field: 'assistanterNames', title: '助理人员', width: 200, slots: { edit: 'assistanterNames' }, editRender: {} },
        { field: 'coverageRange', title: '覆盖范围', width: 200, slots: { default: 'coverageRange' } },
        { field: 'coverageDate', title: '覆盖数据', width: 200, slots: { default: 'coverageDate' } },
        { field: 'offereQuantity', title: '资产数量', width: 200 },
        // { field: 'createDate', title: '创建时间', width: 200 },
        { field: 'remarks', title: '备注', width: 250, slots: { edit: 'remarks' }, editRender: {} },
        { field: 'todo', title: '操作', width: 160, slots: { default: 'todo' }, fixed: 'right', visible: this.showBtn }
      ]
    }
  },
  watch: {
    'formData.responsiblerId': {
      handler(newVal, oldVal) {
        this.tableData.forEach((item) => {
          this.$set(item, 'responsiblerId', this.formData.responsiblerId)
          this.$set(item, 'responsiblerName', this.formData.responsiblerName)
          this.$set(item, 'responsiblerOrgId', this.formData.responsiblerOrgId)
          this.$set(item, 'responsiblerOrgName', this.formData.responsiblerOrgName)
        })
      },
      immediate: true
    },
    'formData.coverageRange': {
      handler(newVal, oldVal) {
        this.tableData.forEach((item) => {
          this.$set(item, 'coverageRange', this.formData.coverageRange)
        })
      },
      immediate: true
    },
    'formData.coverageDate': {
      handler(newVal, oldVal) {
        this.tableData.forEach((item) => {
          this.$set(item, 'coverageDate', this.formData.coverageDate)
        })
      },
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
    // 一键添加
    addAll(type) {
      // 添加全部公司
      this.addDataDisabled = type
      var obj = {
        responsiblerId: this.formData.responsiblerId,
        responsiblerName: this.formData.responsiblerName,
        coverageRange: this.formData.coverageRange,
        coverageDate: this.formData.coverageDate,
        responsiblerOrgId: this.formData.responsiblerOrgId,
        responsiblerOrgName: this.formData.responsiblerOrgName
      }
      if (type == 'compony') {
        findCompanyList().then((res) => {
          res.data.forEach((item) => {
            this.tableData.push({
              ...{
                markType: 1,
                markObjectId: item.deptId,
                markObjectName: item.deptName
              },
              ...obj
            })
          })
          this.addDataDisabled = null
        })
      } else if (type == 'warehouse') {
        // 添加全部仓库
        listAddressQueryWarehouse().then((res) => {
          res.rows.forEach((item) => {
            this.tableData.push({
              ...{
                markType: 4,
                markObjectId: item.locationAddressId,
                markObjectName: item.locationName
              },
              ...obj
            })
          })
          this.addDataDisabled = null
        })
      } else if (type == 'centre') {
        // 添加全部中心
        getDeptByCompanyId(this.user.companyId).then((res) => {
          res.data.forEach((item) => {
            this.tableData.push({
              ...{
                markType: 2,
                markObjectId: item.deptId,
                markObjectName: item.deptName
              },
              ...obj
            })
          })
          this.addDataDisabled = null
        })
      } else if (type == 'depart') {
        // 添加全部部门
        getDeptByCompanyId(this.user.deptId).then((res) => {
          res.data.forEach((item) => {
            this.tableData.push({
              ...{
                markType: 3,
                markObjectId: item.deptId,
                markObjectName: item.deptName
              },
              ...obj
            })
          })
          this.addDataDisabled = null
        })
      }
    },
    // 新增一行数据
    async addRow() {
      var obj = {
        responsiblerId: this.formData.responsiblerId,
        responsiblerName: this.formData.responsiblerName,
        coverageRange: this.formData.coverageRange,
        coverageDate: this.formData.coverageDate,
        responsiblerOrgId: this.formData.responsiblerOrgId,
        responsiblerOrgName: this.formData.responsiblerOrgName
      }
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
      this.tableData.push(obj)
      this.$refs.xTable.setActiveRow(this.tableData[this.tableData.length - 1])
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
      this.$modal.confirm('确认删除目标责任人编号为"' + row.assetCode + '"的数据项？').then(() => {
        this.tableData.splice(rowIndex, 1)
        this.$emit('calculate', this.tableData)
      })
    },
    // 行保存
    async saveRow(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        this.$set(row, 'subtotal', this.$vxe.multiply(row.scrapQuantity, row.priceIncludTax))
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
    // 获取字典表数据
    getDictData() {
      var dictCodes = 'ImInventoryPlan-markType' // 目标类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    // 打开中心  部门  选择框
    openComponyDept(markType) {
      if (markType == 2) {
        this.level = 1
      } else if (markType == 3) {
        this.level = 2
      }
      this.componyDeptDialog = true
    },
    // 选择中心  部门
    seleceComponyDept(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'markObjectId', val.deptId)
      this.$set(editRow, 'markObjectName', val.deptName)
    },
    // 选择 仓库
    selectWarehouse(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'markObjectId', val.id)
      this.$set(editRow, 'markObjectName', val.label)
    },
    // 选择项目
    projectSelect(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'markObjectId', val.projectId)
      this.$set(editRow, 'markObjectName', val.projectName)
    },
    // 选择责任人
    userSelect(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'responsiblerId', val.userId)
      this.$set(editRow, 'responsiblerName', val.userName)
      this.$set(editRow, 'responsiblerOrgId', val.deptId)
      this.$set(editRow, 'responsiblerOrgName', val.deptName)
    },
    // 选择助理人
    userSelectMultiple(val) {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'assistanterIds', val.map((item) => item.userId).join('，'))
      this.$set(editRow, 'assistanterNames', val.map((item) => item.userName).join('，'))
    },
    // 改变盘点目标
    changeMarkType() {
      var editRow = this.$refs.xTable.getActiveRecord().row
      this.$set(editRow, 'markObjectId', '')
      this.$set(editRow, 'markObjectName', '')
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