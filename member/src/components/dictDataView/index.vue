<template>
  <span>{{ getText() }}</span>
</template>
<script>
export default {
  name: 'DictDateView',
  props: {
    dictCode: {
      type: String,
      default: ''
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    labelName: {
      type: String,
      default: 'itemsName'
    },
    valueName: {
      type: String,
      default: 'itemsValue'
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    }
  },
  data() {
    return {
      obj: {}
    }
  },
  computed: {
    list() {
      if (this.dictCode) {
        return this.dictDataList.filter((item) => {
          return item.dictionaryCode == this.dictCode
        })
      } else {
        return this.dictDataList
      }
    }
  },
  methods: {
    getText() {
      var data = this.list.find((item) => {
        return item[this.valueName] == this.value
      })
      return data ? data[this.labelName] : ''
    }
  }
}
</script>
<style lang="scss" scoped>
</style>