<template>
  <div class="app-container2">
    <enterprise :sys-dictionary-list="sysDictionaryList" />
    <invoice class="mt-8" :sys-dictionary-list="sysDictionaryList" />
    <mailingAddress class="mt-8" />
    <notice />
  </div>
</template>

<script>
import enterprise from './components/enterprise.vue'
import invoice from './components/invoice.vue'
import mailingAddress from './components/mailingAddress.vue'
import notice from './components/notice.vue'
import { findItemsByDictionariesCode } from '@/api/base.js'
export default {
  components: {
    enterprise,
    invoice,
    mailingAddress,
    notice
  },
  data() {
    return {
      sysDictionaryList: {
        'MmEnterprise-enterpriseNature': [], // 企业性质
        'MmInvoice-invoiceType': [] // 发票类型
      }
    }
  },
  created() {
    this.getSysDictionaryList()
  },
  methods: {
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = Object.keys(this.sysDictionaryList)
      findItemsByDictionariesCode(dictCodes.join(',')).then((res) => {
        res.data.forEach((item) => {
          let index = dictCodes.findIndex((temp) => item.itemsCode.startsWith(temp))
          this.sysDictionaryList[dictCodes[index]].push(item)
        })
      })
    }
  }
}
</script>
<style>
.app-container2 {
  height: 100%;
  overflow: auto;
}
</style>