<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" class="form-table form-table-edit" style="margin-bottom: 8px">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="formData.contractCode" placeholder="请输入合同编号" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="formData.contractName" placeholder="请输入合同名称" maxlength="250" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="typeName">
              <el-input v-model="formData.typeName" placeholder="请输入合同类型" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="甲方" prop="purchaseUnitId">
              <base-input
                size="small"
                :value.sync="formData.purchaseUnitId"
                result-label="data"
                base-code="companyList"
                label-name="deptName"
                value-name="deptId"
                placeholder="请选择甲方"
                clearable
                :pre-store="[{ deptId: formData.purchaseUnitId, deptName: formData.purchaseUnitName }]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乙方" prop="saleUnitId">
              <base-input
                size="small"
                :value.sync="formData.saleUnitId"
                base-code="listSupplier"
                label-name="supplierName"
                value-name="supplierId"
                placeholder="请选择采购单位名称"
                clearable
                :pre-store="[{ supplierId: formData.saleUnitId, supplierName: formData.saleUnitName }]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="丙方" prop="constructeCtlUnitId">
              <base-input
                size="small"
                :value.sync="formData.constructeCtlUnitId"
                base-code="listSupplier"
                label-name="supplierName"
                value-name="supplierId"
                placeholder="请选择监理单位"
                clearable
                :pre-store="[{ supplierId: formData.constructeCtlUnitId, supplierName: formData.constructeCtlUnitName }]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="丁方" prop="tradeUnitId">
              <base-input
                size="small"
                :value.sync="formData.tradeUnitId"
                base-code="listSupplier"
                label-name="supplierName"
                value-name="supplierId"
                placeholder="请选择监理单位"
                clearable
                :pre-store="[{ supplierId: formData.tradeUnitId, supplierName: formData.tradeUnitName }]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同造价(元)" prop="totalPrice">
              <el-input-number v-model.number="formData.totalPrice" style="width: 100%" :precision="2" :step="1" placeholder="请输入合同造价(元)" :max="9999999999.99" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率(%)" prop="taxRate">
              <el-input-number v-model.number="formData.taxRate" style="width: 100%" placeholder="请输入税率(%)" :min="0" :precision="0" :step="1" :max="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker v-model="formData.signDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择签订日期" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效时间">
              <input-range type="daterange" :start-value.sync="formData.startDate" :end-value.sync="formData.endDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数期(天)" prop="severalIssues">
              <el-input-number v-model.number="formData.severalIssues" style="width: 100%" placeholder="请输入数期(天)" :min="0" :precision="0" :max="999999" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算方式" prop="settingMethod">
              <base-input size="small" :value.sync="formData.settingMethod" base-code="CmContract-settingMethod" :options-list="dictDataList" placeholder="请选择结算方式" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方式" prop="procurementMethod">
              <base-input size="small" :value.sync="formData.procurementMethod" base-code="CmContract-procurementMethod" :options-list="dictDataList" placeholder="请选择采购方式" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="滞纳金计算方式" prop="overdueFeeMethod">
              <base-input size="small" :value.sync="formData.overdueFeeMethod" base-code="CmContract-overdueFeeMethod" :options-list="dictDataList" placeholder="请选择滞纳金计算方式" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否为含税价" prop="isTaxPrice">
              <base-input size="small" :value.sync="formData.isTaxPrice" base-code="CmContract-isTaxPrice" :options-list="dictDataList" placeholder="请输入是否为含税价" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票类型" prop="invoiceType">
              <base-input size="small" :value.sync="formData.invoiceType" base-code="CmContract-invoiceType" :options-list="dictDataList" placeholder="请选择发票类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <base-input size="small" :value.sync="formData.status" base-code="CmContract-status" :options-list="dictDataList" placeholder="状态" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同内容" class="noProp-item-textarea">
              <el-input v-model="formData.content" type="textarea" placeholder="请输入合同内容" maxlength="1000" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" :disabled="submitButton" @click="submitForm">提 交</el-button>
    </div>
  </PageCard>
</template>
<script>
import { getContract, addContract, updateContract } from '@/api/contract.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/portface/contract',
      submitLoading: false,
      submitButton: false,

      editId: '',
      formData: {},
      dictDataList: [],
      // 表单校验
      rules: {
        contractCode: [{ required: true, message: '合同编号不能为空', trigger: 'change' }],
        contractName: [{ required: true, message: '合同名称不能为空', trigger: 'change' }],
        purchaseUnitId: [{ required: true, message: '甲方id不能为空', trigger: 'change' }],
        purchaseUnitName: [{ required: true, message: '甲方名称不能为空', trigger: 'change' }],
        saleUnitId: [{ required: true, message: '乙方ID不能为空', trigger: 'change' }],
        saleUnitName: [{ required: true, message: '乙方名称不能为空', trigger: 'change' }],
        totalPrice: [{ required: true, message: '合同造价(元)不能为空', trigger: 'change' }],
        content: [{ required: true, message: '合同内容不能为空', trigger: 'change' }],
        invoiceType: [{ required: true, message: '发票类型不能为空', trigger: 'change' }],
        signDate: [{ required: true, message: '签订日期不能为空', trigger: 'change' }],
        isTaxPrice: [{ required: true, message: '是否为含税价不能为空', trigger: 'change' }],
        delFlag: [{ required: true, message: '删除标记不能为空', trigger: 'change' }],
        createDate: [{ required: true, message: '创建时间不能为空', trigger: 'change' }],
        createBy: [{ required: true, message: '创建人ID不能为空', trigger: 'change' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
        typeName: [{ required: true, message: '合同类型不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getContract(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },

    /** 获取供应商信息 */
    // getSupplierList() {
    //   listSupplierQuery().then((response) => {
    //     this.supplierList = response.rows
    //   })
    // },
    /** 获取组织架构公司信息 */
    // getCompanyList() {
    //   findCompanyList().then((response) => {
    //     this.companyList = response.data
    //   })
    // },

    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'CmContract-status' // 状态
      dictCodes += ',CmContract-overdueFeeMethod' // 滞纳金计算方式
      dictCodes += ',CmContract-settingMethod' // 结算方式
      dictCodes += ',CmContract-procurementMethod' // 采购方式
      dictCodes += ',CmContract-invoiceType' // 发票类型
      dictCodes += ',CmContract-isTaxPrice' // 是否为含税价
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 列表和查看页面枚举值转换 */
    stateFormat(val, list) {
      val = val === null || val === undefined ? '' : val.toString()
      let itemsName = ''
      list.forEach((item) => {
        if (item.itemsValue === val) {
          return (itemsName = item.itemsName)
        }
      })
      return itemsName
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton = true
          if (!this.editId) {
            updateContract(this.formData)
              .then((response) => {
                this.$message.success('修改成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
              })
              .finally(() => {
                this.submitButton = false
              })
          } else {
            addContract(this.formData)
              .then((response) => {
                this.$message.success('新增成功')
                setTimeout(() => {
                  window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
                }, 500)
              })
              .finally(() => {
                this.submitButton = false
              })
          }
        }
      })
    }
  }
}
</script>
