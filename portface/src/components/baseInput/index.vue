<template>
  <div class="base_input">
    <el-select
      ref="baseCode"
      v-model="templateValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :clearable="clearable"
      :loading="loading"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      :size="size"
      @change="change"
      @clear="clear"
      @focus="load"
    >
      <el-option v-for="(item,i) in options.length>0?options:preStore" :key="i" :disabled="item.disabled" :label="item[labelName]" :value="String(item[valueName])" />
    </el-select>
  </div>
</template>
<script>
import {
  listApplicationQuery,
  listDictItems,
  listTypeQuery,
  listAddressQueryWarehouse,
  listAddressQuerySpecificLocation,
  listAddressQueryUseArea,
  listAddressQuery,
  listAgreementQuery,
  listSupplierQuery,
  listContractQuery,
  listAccountQuery,
  findCompanyList,
  listSchemeQuery,
  listProjectQuery,
  listBrandQuery,
  listDept,
  listUser
} from '@/api/base.js'
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    labelName: {
      type: String,
      default: 'itemsName'
    },
    valueName: {
      type: String,
      default: 'itemsValue'
    },
    codeName: {
      type: String,
      default: 'itemsValue'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    optionsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    baseCode: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    preStore: {
      type: Array,
      default: () => {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 10
    },
    returnObj: {
      type: Boolean,
      default: false
    },
    queryFunction: {
      type: Function,
      default: undefined
    },
    resultLabel: {
      type: String,
      default: 'rows'
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    relyOn: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateValue: '',
      options: [],
      loading: false,
      getListFunc: {
        listApplication: listApplicationQuery, // 申购单
        listType: listTypeQuery, // 业务归口类型
        listAddressWarehouse: listAddressQueryWarehouse, // 库位||仓库
        listAddressSpecificLocation: listAddressQuerySpecificLocation, // 具体位置
        listAgreement: listAgreementQuery, // 招标协议
        listSupplier: listSupplierQuery, // 供应商
        listAccount: listAccountQuery, // 出账公司
        listContract: listContractQuery, // 合同
        listAddressUseArea: listAddressQueryUseArea, // 使用区域
        companyList: findCompanyList, // 公司列表
        listScheme: listSchemeQuery, // 方案名称
        listProject: listProjectQuery, // 项目名称
        listBrand: listBrandQuery, // 品牌
        listUser: listUser, // 用户
        listDept: listDept, // 部门
        listAddress: listAddressQuery
      }
    }
  },
  watch: {
    optionsList: {
      handler() {
        console.log(this.optionsList, '====================')
        if (this.optionsList.length > 0) {
          if (this.baseCode) {
            this.options = this.optionsList.filter((item) => item.dictionaryCode == this.baseCode)
          } else {
            this.options = this.optionsList
          }
        }
      },
      immediate: true,
      deep: true
    },
    value: {
      handler() {
        this.templateValue = String(this.value || '')
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    load() {
      if (this.relyOn) {
        this.options = []
      }
      if (Object.keys(this.query).length > 0 && this.relyOn && !this.query[this.relyOn]) {
        return
      }
      if ((!this.options || this.options.length == 0) && (!this.optionsList || this.optionsList.length == 0)) {
        this.loading = true
        // 如果是外部传入的请求方法，优先使用
        if (this.queryFunction) {
          this.queryFunction()
            .then((res) => {
              this.options = res[this.resultLabel]
            })
            .finally(() => {
              this.loading = false
            })
        } else if (this.getListFunc[this.baseCode]) {
          // 非字典表
          var func = this.getListFunc[this.baseCode]
          func(this.query)
            .then((res) => {
              this.options = res[this.resultLabel]
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          listDictItems(this.baseCode)
            .then((res) => {
              this.options = res.sysDictionaryItemsList
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
    change(value) {
      if (value) {
        this.$emit('update:value', value)
        var data = this.options.find((item) => {
          return item[this.valueName] == value
        })
        this.$emit('update:label', data[this.labelName])
        this.$emit('update:code', data[this.codeName])
        this.$emit('update:name', data[this.labelName])
        if (this.returnObj) {
          this.$emit('change', data)
          return
        }
      } else {
        this.$emit('update:value', '')
        if (this.returnObj) {
          this.$emit('change', {})
          return
        }
      }
      this.$emit('change')
    },
    clear() {
      this.$emit('clear')
    }
  }
}
</script>
<style lang="scss" scoped>
.tempalteCom {
  width: 100%;
}
</style>