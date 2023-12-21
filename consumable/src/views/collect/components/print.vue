<template>
  <vxe-modal v-model="visible" v-loading="submitLoading" title="预览" :close-on-click-modal="false" height="70%" width="1200px" @hide="close">
    <div>
      <el-button type="primary" icon="el-icon-printer" size="small" style="margin-bottom: 10px" @click="handlePrint">打印</el-button>
      <el-button v-show="false" ref="printBtn" v-print="printObj" type="primary">打印</el-button>
    </div>

    <el-form ref="form" :model="form" label-width="95px" label-suffix="：" class="bg-white">
      <div id="printWrap" ref="demo" class="print_obj bgClass">
        <div v-html="styleText"></div>
        <el-card class="box-card" style="page-break-after: always">
          <div slot="header" class="clearfix text-tip">{{ $store.state.user.info.companyName }}</div>
          <div slot="header" class="clearfix text-tip">{{ $vxe.toDateString(printData.collectDate,'yyyy')+'年'+$vxe.toDateString(printData.collectDate,'MM')+'月' }}耗材领用出库签收单</div>

          <el-row>
            <el-col :span="8">
              <el-form-item label="领用单号">{{ printData.consumableCollectCode }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用日期">{{ printData.collectDate }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务类别">{{ printData.centralizedBusinessName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="使用人">{{ printData.userName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用部门">{{ printData.userOrgName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="制单日期">{{ $vxe.toDateString(new Date(), "yyyy-MM-dd") }}</el-form-item>
            </el-col>
          </el-row>

          <table class="el-table">
            <thead>
              <tr>
                <td>资产编号</td>
                <td>资产名称</td>
                <td>数量</td>
                <td>单位</td>
                <td>含税单价（元）</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in printData.clmConsumableCollectDetailList" :key="index">
                <td>{{ item.assetCode }}</td>
                <td>
                  {{ item.serialNum?item.serialNum+'-':'' }}
                  {{ item.specificationModel?item.specificationModel+'-':'' }}
                  {{ item.brandName }}
                  {{ item.assetName?'-'+item.assetName:'' }}
                </td>
                <td>{{ item.collectQuantity }}</td>
                <td>{{ item.quantityUnit }}</td>
                <td>{{ $vxe.commafy(item.priceIncludTax,{digits:3}) }}</td>
                <td>
                  {{ item.currentEreaName }}{{ item.currentLocationName?'/'+item.currentLocationName:'' }}
                  {{ item.collectReason&&item.currentEreaName?'-'+item.collectReason:item.collectReason }}
                  {{ item.remarks?'-'+item.remarks:'' }}
                </td>
              </tr>
              <template v-if="printData.clmConsumableCollectDetailList && printData.clmConsumableCollectDetailList.length < 3">
                <tr>
                  <td v-for="(item, index) in 6" :key="index"></td>
                </tr>
                <tr>
                  <td v-for="(item, index) in 6" :key="index"></td>
                </tr>
              </template>
              <tr>
                <td>情况说明</td>
                <td colspan="5">
                  <div class="u-line-1">{{ printData.collectReason }}</div>
                  <div class="u-line-1">{{ getRecords() }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <el-row>
            <el-col :span="8">
              <el-form-item label="签收人" />
            </el-col>
            <el-col :span="8">
              <el-form-item label="签收日期" />
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产管理员" />
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-form>
  </vxe-modal>
</template>

<script>
import printMixin from '@/mixins/print-mixin'
export default {
  mixins: [printMixin],
  props: {
    printData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    printVisible: {
      type: Boolean,
      default: false
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      visible: false
    }
  },
  created() {
    this.visible = this.printVisible
  },
  methods: {
    close() {
      this.$emit('update:printVisible', false)
    },
    getRecords() {
      var text = ''
      var arr = ['ASSET_ADMINISTRATOR_REGISTRATION', 'DIRECT_SUPERIOR_APPROVAL', 'PROCESS_INITIATE']
      arr.forEach((item) => {
        if (this.printData.assetReviewAuditList && this.printData.assetReviewAuditList.length > 0) {
          var index = this.printData.assetReviewAuditList.findIndex((temp) => temp.processId == item)
          if (index >= 0) {
            var data = this.printData.assetReviewAuditList[index]
            text += data.curProcessDate + `【${data.curProcessorName}】`
            text += data.curProcessStepName + '-' + data.curProcessOptions + '；'
          }
        }
      })
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
/* 打印 */
.bgClass {
  color: #333333;
}
.print_obj >>> .el-table tr td:last-child {
  height: 25px;
}

@page {
  size: portrait; /**portrait纵向，landscape横向*/
  margin-top: 6mm;
  margin-left: 8mm;
  margin-right: 8mm;
  margin-bottom: 2mm;
}
@media print {
  html,
  body {
    height: inherit;
  }
  .bgClass {
    -webkit-print-color-adjust: exact;
    /* font-size: 10px; */
    font-size: 14px;
    width: 98%;
  }
}
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>
