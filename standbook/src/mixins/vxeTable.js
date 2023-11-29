export default {
  data() {
    return {
      tablePage: {
        align: 'center',
        background: true,
        total: 0,
        pageSizes: [10, 20, 30, 50],
        currentPage: 1,
        pageSize: 10,
        layouts: ['Total', 'Sizes', 'PrevPage', 'Number', 'NextPage', 'FullJump']
      },
      tableLoading: false,
      tableData: []
    }
  },
  methods: {
    footerMethod(colunm, data, amountData, fieldObj, textPosition) {
      var rows1 = []
      var rows2 = []
      var fieldArr = []
      if (fieldObj instanceof Array) {
        fieldArr = fieldObj
      } else if (typeof (fieldObj) == 'object') {
        fieldArr = Object.keys(fieldObj)
      }
      colunm.forEach((item, i) => {
        if (i == (textPosition || 0)) {
          rows1.push('小 计：')
          rows2.push('合 计：')
        } else if (fieldArr.includes(item.property)) {
          let amount = 0
          data.forEach(temp => {
            amount = this.$vxe.add(amount, temp[item.property])
          })
          rows1.push(this.$vxe.commafy(amount, { digits: fieldObj[item.property] || fieldObj[item.property] == 0 ? fieldObj[item.property] : 2 }))
          if (amountData) {
            rows2.push(this.$vxe.commafy(amountData[item.property + 'Total'] || 0, { digits: fieldObj[item.property] || fieldObj[item.property] == 0 ? fieldObj[item.property] : 2 }))
          }
        } else {
          rows1.push('')
          rows2.push('')
        }
      })
      if (amountData) {
        return [rows1, rows2]
      } else {
        return [rows1]
      }
    }
  }
}