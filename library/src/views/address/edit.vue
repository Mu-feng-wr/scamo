<template>
  <PageCard v-loading="submitLoading">
    <el-form ref="form" :model="formData" :rules="rules" label-width="160px" class="form-table form-table-edit">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="地址编码" prop="locationCode">
              <el-input v-model="formData.locationCode" placeholder="请输入地址编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址名称" prop="locationName">
              <el-input v-model="formData.locationName" placeholder="请输入地址名称" maxlength="250" show-word-limit clearable />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="父级地址" prop="parentId">
              <el-tree-select
                ref="treeSelect"
                v-model="formData.parentId"
                size="small"
                only-final
                node-key="id"
                :props="{label:'locationName'}"
                :data="addressOptions"
                filterable
                @node-click="parentAddressChange($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址类型" prop="locationType">
              <base-input :value.sync="formData.locationType" :options-list="dictDataList" base-code="StlLocationAddress-locationType" placeholder="请选择地址类型" clearable />

              <!-- <el-select v-model="formData.locationType" :disabled="formData.locationAddressId ? true : false" clearable placeholder="地址类型" style="width: 100%">
                <el-option v-for="item in locationTypeList" :key="item.itemsValue" :label="item.itemsName" :value="Number(item.itemsValue)" :disabled="item.disabled"></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经度" prop="longitude">
              <el-input-number style="width: 100%" v-model.number="formData.longitude" :precision="2" :step="1" placeholder="请输入经度" :max="9999999999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number style="width: 100%" v-model.number="formData.latitude" :precision="2" :step="1" placeholder="请输入纬度" :max="9999999999.99"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="库位地址" prop="districtCountyName" class="addressPCD-first">
              <div class="flex">
                <el-cascader ref="addressChoose" v-model="formData.city" style="width:20%;" :options="cityOptions" filterable clearable placeholder="请选择城市" @change="handleAddressChange" />
                <el-input v-model="formData.address" placeholder="详细地址" maxlength="150" show-word-limit clearable style="width: 400px; margin-left: 10px"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否公开" prop="ynPublic">
              <el-select v-model="formData.ynPublic" clearable placeholder="是否公开" style="width: 100%">
                <el-option v-for="item in ynPublicList" :key="item.itemsValue" :label="item.itemsName" :value="Number(item.itemsValue)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属公司" prop="companyId">
              <el-select
                v-model="formData.companyName"
                @change="changeCompany"
                placeholder="请选择公司"
                style="width: 100%"
                :disabled="!formData.parentId && !formData.existChildren ? false : true"
              >
                <el-option v-for="item in companyList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId">
              <el-select v-model="formData.projectId" clearable placeholder="请选择所属项目" style="width: 100%" @change="projectChoose">
                <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="状态" style="width: 100%" :disabled="formData.existChildren">
                <el-option v-for="item in statusList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="排序" prop="sort">
              <el-input-number placeholder="请输入排序" style="width: calc(50% - 80px)" v-model="formData.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="noProp-item-textarea">
              <el-input v-model="formData.remarks" type="textarea" placeholder="请输入内容" maxlength="250" show-word-limit />
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
import { getAddress, addAddress, updateAddress, listAddressParent } from '@/api/address.js'
import { listDictItems } from '@/api/base.js'
import { handleTree } from '@/utils/index.js'
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      cityOptions: regionData,
      // 提交加载
      submitLoading: false,
      // 是否禁用提交按钮
      submitButton: false,

      // 库位树选项
      addressOptions: [],
      //字典集合
      sysDictionaryList: [],
      // 是否公开
      ynPublicList: [],
      // 状态集合
      statusList: [],
      // 上级数据
      parentData: {},
      // 公司树选项
      companyList: [],
      // 项目集合
      projectList: [],

      editId: '',
      formData: {},
      dictDataList: [],
      // 表单校验
      rules: {
        locationCode: [{ required: true, message: '地址编号不能为空', trigger: 'blur' }],
        locationName: [{ required: true, message: '地址名称不能为空', trigger: 'blur' }],
        locationType: [{ required: true, message: '地址类型不能为空', trigger: 'blur' }],
        ynPublic: [{ required: true, message: '是否公开不能为空', trigger: 'blur' }],
        companyId: [{ required: true, message: '所属公司不能为空', trigger: 'blur' }],
        company_name: [{ required: true, message: '所属公司不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
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
      getAddress(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    handleAddressChange() {
      const value = this.$refs.addressChoose.getCheckedNodes()[0]
      this.formData.provinceId = value.value
      this.formData.provinceName = value.label
      this.formData.cityId = value.parent.value
      this.formData.cityName = value.parent.label
      this.formData.districtCountyId = value.parent.parent.value
      this.formData.districtCountyName = value.parent.parent.label
    },
    //选择父级地址触发
    parentAddressChange(data) {
      this.formData.locationType = ''
      this.parentData = row
      if (data) {
        this.formData.parentId = data.locationAddressId
        this.formData.parentIds = data.parentIds
        this.formData.companyId = data.companyId
        this.formData.companyName = data.companyName
        this.formData.projectId = data.projectId
        this.formData.projectCode = data.projectCode
        this.formData.projectName = data.projectName
      } else {
        this.formData.parentId = undefined
        this.formData.parentIds = undefined
        this.formData.companyId = undefined
        this.formData.companyName = undefined
        this.formData.projectId = undefined
        this.formData.projectCode = undefined
        this.formData.projectName = undefined
      }
      this.dictDataList.forEach((item) => {
        if (item.dictionaryCode != 'StlLocationAddress-locationType') {
          return
        }
        if (!this.formData.parentId) {
          //未选父级地址，地址类型只允许选择1库位所属公司
          item['disabled'] = item.itemsValue == 1 ? false : true
        }
        if (this.parentData) {
          if (this.parentData.locationType == '1') {
            //父级地址是1库位所属公司，地址类型只允许选择2仓库和3使用区域

            item['disabled'] = item.itemsValue == 2 || item.itemsValue == 3 ? false : true
          } else if (this.parentData.locationType == '2') {
            //父级地址是2仓库，地址类型只允许选择5一级货架

            item['disabled'] = item.itemsValue == 5 ? false : true
          } else if (this.parentData.locationType == '3') {
            //父级地址是3使用区域，地址类型只允许选择4具体位置

            item['disabled'] = item.itemsValue == 4 ? false : true
          } else if (this.parentData.locationType == '5') {
            //父级地址是5一级货架，地址类型只允许选择6二级货架

            item['disabled'] = item.itemsValue == 6 ? false : true
          }
        }
      })
    },
    // 获取字典数据
    getSysDictionaryList() {
      listAddressParent().then((response) => {
        this.addressOptions = handleTree(response.rows, 'locationAddressId')
        console.log(this.addressOptions)
      })
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',StlLocationAddress-locationType' // 地址类型
      dictCodes += ',StlLocationAddress-ynPublic' // 是否公开
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },

    /** 选择项目触发 */
    projectChoose(val) {
      this.formData.projectCode = ''
      this.formData.projectName = ''
      this.projectList.forEach((item) => {
        if (item.projectId == val) {
          this.formData.projectId = item.projectId
          this.formData.projectCode = item.projectCode
          this.formData.projectName = item.projectName
        }
      })
    },

    /** 选择部门触发 */
    deptChange(row) {
      this.formData.deptId = row.deptId
      this.formData.deptName = row.deptName
    },
    /** 转换库位地址数据结构 */
    normalizerAddress(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.locationAddressId,
        label: node.locationName,
        children: node.children
      }
    },

    /** 选择公司触发 */
    changeCompany(val) {
      let companyObj = {}
      companyObj = this.companyList.find(function (item) {
        return item.deptId == val
      })
      this.formData.companyId = companyObj.deptId
      this.formData.companyName = companyObj.deptName
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.submitButton = true
          if (this.formData.locationAddressId != null) {
            updateAddress(this.formData).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.submitLoading = false
              this.submitButton = false

              this.$router.back()
            })
          } else {
            addAddress(this.formData).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.submitLoading = false
              this.submitButton = false

              this.$router.back()
            })
          }
        }
      })
    }
  }
}
</script>
