export default {
  data() {
    return {
      styleText: "",

      visible: false,
      form: {},

      submitLoading: false,

      //打印相关
      printObj: {
        id: "printWrap", //打印区域 Dom ID
        popTitle: "",
        closeCallback: () => {
          document.head.getElementsByTagName("title")[0].innerText =
            "约纽科技-SAAS云蟾";
        },
      },
    }
  },

  beforeDestroy() {
    document.head.getElementsByTagName("title")[0].innerText =
      "约纽科技-SAAS云蟾";
  },
  methods: {
    //打印
    async handlePrint() {
      this.styleText =
        '<style type="text/css" media="print">\n' +
        "  @page { size: A4 portrait; font-size: 14px;margin: 4mm 2.8mm 4mm 6mm; }\n" +
        "  .print_obj .el-table tr th:nth-child(2) { width: 160px }\n" + 
        "</style>";
      var title = `${this.typeName}_` + this.$util.getNowTime(true);
      document.head.getElementsByTagName("title")[0].innerText = title;
      this.printObj.popTitle = title;

      this.$refs.printBtn.$el.click();
    },
  }
}
