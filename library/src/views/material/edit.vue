<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="form-table form-table-edit">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="物资编号" prop="materialCode">
              <el-input v-model="formData.materialCode" :disabled="true" placeholder="自动生成物资编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资名称" prop="materialName">
              <el-input v-model="formData.materialName" placeholder="请输入物资名称" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资分类" prop="categoryId">
              <el-tree-select
                ref="treeSelect"
                v-model="formData.categoryId"
                only-final
                :props="{label:'categoryName'}"
                node-key="categoryId"
                :data="categoryOptions"
                filterable
                @node-click="categoryChange($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序列号">
              <el-input v-model="formData.sn" placeholder="请输入序列号" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="modelType">
              <el-input v-model="formData.modelType" placeholder="请输入规格型号" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称" prop="brandName">
              <base-input
                base-code="listBrand"
                :value.sync="formData.brandId"
                :name.sync="formData.brandName"
                label-name="brandName"
                value-name="brandId"
                placeholder="请选择品牌名称"
                :pre-store="[{brandName:formData.brandName,brandId:formData.brandId}]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="颜色">
              <el-input v-model="formData.color" placeholder="请输入颜色" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位" prop="unitName">
              <el-input v-model="formData.unitName" placeholder="请输入计量单位" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不含税单价（元）" prop="priceExcludTax">
              <el-input-number style="width: 100%" v-model.number="formData.priceExcludTax" :precision="8" :step="1" placeholder="请输入不含税单价（元）" :max="9999999999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="含税单价（元）" prop="price">
              <el-input-number style="width: 100%" v-model.number="formData.price" :precision="8" :step="1" placeholder="请输入含税单价（元）" :max="9999999999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率（%）" prop="taxRate">
              <el-input-number style="width: 100%" v-model.number="formData.taxRate" :step="1" placeholder="请输入税率（%）" :max="99999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税额（元）" prop="taxValue">
              <el-input-number style="width: 100%" v-model.number="formData.taxValue" :precision="2" :step="1" placeholder="请输入税额（元）" :max="9999999999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="createDate">
              <el-date-picker clearable v-model="formData.createDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备用数量" prop="deadStorage">
              <el-input-number style="width: 100%" v-model.number="formData.deadStorage" :precision="3" :step="1" placeholder="请输入备用数量" :max="9999999999.99" clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="状态" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="扩展信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="换算数量">
              <el-input-number v-model.number="formData.alterUnitNum" :precision="2" :step="1" placeholder="请输入换算数量" :max="99999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="换算单位">
              <el-input v-model="formData.alterUnitName" placeholder="请输入换算单位" maxlength="50" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资类型" prop="materialType">
              <base-input :value.sync="formData.materialType" :options-list="dictDataList" base-code="StlMaterial-materialType" placeholder="请选择物资类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务归口" prop="centralizedBusinessId">
              <base-input
                :value.sync="formData.centralizedBusinessId"
                :name.sync="formData.centralizedBusinessName"
                label-name="businessName"
                value-name="businessId"
                base-code="listType"
                placeholder="请选择业务归口"
                clearable
                :pre-store="[{businessName:formData.centralizedBusinessName,businessId:formData.centralizedBusinessId}]"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否公开">
              <base-input :value.sync="formData.ynPublic" :options-list="dictDataList" base-code="StlMaterial-ynPublic" placeholder="请选择是否公开" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否招标">
              <base-input :value.sync="formData.ynInviteTender" :options-list="dictDataList" base-code="StlMaterial-ynInviteTender" placeholder="请选择是否招标" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上架状态">
              <base-input
                style="width:calc((100% - 320px) / 3 - 16px);"
                :value.sync="formData.shelfStatus"
                :options-list="dictDataList"
                base-code="StlMaterial-shelfStatus"
                placeholder="请选择上架状态"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="255" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm" :disabled="submitButton">提 交</el-button>
    </div>
  </PageCard>
</template>
<script>
import { getMaterial, addMaterial, updateMaterial } from '@/api/material.js'
import { listDictItems, listTypeQuery, listBrandQuery } from '@/api/base.js'
import { listCategoryQuery } from '@/api/category.js'
import { handleTree } from '@/utils/index.js'
export default {
  data() {
    return {
      returnUrl: '/library/material',
      // 提交加载
      submitLoading: false,
      submitButton: false,
      editId: '',
      categoryOptions: [],
      formData: {},
      // 表单校验
      rules: {
        materialName: [{ required: true, message: '物资名称不能为空', trigger: 'blur' }],
        brandName: [{ required: true, message: '品牌不能为空', trigger: 'change' }],
        priceExcludTax: [{ required: true, message: '不含税单价（元）不能为空', trigger: ['blur', 'change'] }],
        price: [{ required: true, message: '含税单价（元）不能为空', trigger: ['blur', 'change'] }],
        taxRate: [{ required: true, message: '税率（%）不能为空', trigger: ['blur', 'change'] }],
        taxValue: [{ required: true, message: '税额（元）不能为空', trigger: ['blur', 'change'] }],
        createDate: [{ required: true, message: '创建时间不能为空', trigger: 'change' }],
        deadStorage: [{ required: true, message: '备用数量不能为空', trigger: ['blur', 'change'] }],
        categoryId: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        modelType: [{ required: true, message: '规格型号不能为空', trigger: 'blur' }],
        unitName: [{ required: true, message: '计量单位不能为空', trigger: 'blur' }],
        centralizedBusinessId: [{ required: true, message: '业务归口不能为空', trigger: 'blur' }],
        ynPublic: [{ required: true, message: '是否公开不能为空', trigger: 'blur' }],
        ynInviteTender: [{ required: true, message: '是否招标不能为空', trigger: 'blur' }],
        materialType: [{ required: true, message: '物资类型不能为空', trigger: 'blur' }],
        shelfStatus: [{ required: true, message: '上架状态不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      },
      dictDataList: []
    }
  },
  async created() {
    this.submitLoading = true
    await this.getSysDictionaryList()
    this.submitLoading = false
    this.editId = this.$route.query.id

    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getMaterial(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },

    // 获取字典数据
    async getSysDictionaryList() {
      var dictCodes = 'System-status' /** 系统-状态 */
      dictCodes += ',StlMaterial-shelfStatus' /** 上架状态 */
      dictCodes += ',StlMaterial-ynPublic' /** 是否公开 */
      dictCodes += ',StlMaterial-materialType' /** 物资类型 */
      dictCodes += ',StlMaterial-ynInviteTender' /** 是否招标 */
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      // 分类树
      var categoryOptions = await listCategoryQuery()
      this.categoryOptions = handleTree(categoryOptions.rows, 'categoryId')
    },

    /** 选择分类触发 */
    categoryChange(data) {
      this.formData.categoryId = data.categoryId
      this.formData.categoryCode = data.parentCodes
      this.formData.categoryName = data.categoryName
    },
    /** 清除物资分类 */
    categoryClearable() {
      if (!this.formData.categoryId) {
        this.formData.categoryCode = ''
        this.formData.categoryName = ''
      }
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitButton = true
          if (this.formData.materialId != null) {
            updateMaterial(this.formData)
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
            addMaterial(this.formData)
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
