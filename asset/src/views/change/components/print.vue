<template>
  <vxe-modal title="预览" :close-on-click-modal="false" v-model="visible" height="70%" width="1200px" v-loading="submitLoading" @hide="close">
    <div>
      <el-button type="primary" icon="el-icon-printer" size="small" style="margin-bottom: 10px" @click="handlePrint">打印</el-button>
      <el-button ref="printBtn" v-show="false" type="primary" v-print="printObj">打印</el-button>
    </div>

    <el-form :model="form" ref="form" label-width="95px" label-suffix="：" class="bg-white">
      <div ref="demo" id="printWrap" class="print_obj">
        <div v-html="styleText"></div>
        <el-card class="box-card" style="page-break-after: always">
          <div slot="header" class="clearfix text-tip">{{ $store.getters.userInfo.companyName }}</div>
          <div slot="header" class="clearfix text-tip">{{ $vxe.toDateString(printData.changeDate,'yyyy')+'年'+$vxe.toDateString(printData.changeDate,'MM')+'月' }}资产变更确认单</div>

          <el-row>
            <el-col :span="8">
              <el-form-item label="变更单号">{{ printData.assetChangeCode }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="变更日期">{{ printData.changeDate }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务类别">{{ printData.centralizedBusinessName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="变更人">{{ printData.changerName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="变更部门">{{ printData.changerOrgName }}</el-form-item>
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
                <td>回收残值（元）</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in printData.almAssetChangeDetailList" :key="index">
                <td>{{ item.assetCode }}</td>
                <td>{{ item.serialNum }}-{{ item.specificationModel }}-{{item.brandName}}-{{ item.assetName }}</td>
                <td>{{ item.inventoryQuantity }}</td>
                <td>{{ item.quantityUnit }}</td>
                <td>{{ item.priceIncludTax }}</td>
                <td>{{ item.priceIncludTax }}</td>
                <td>{{ item.inventoryQuantity }}{{ item.remarks?'-'+item.remarks:'' }}</td>
              </tr>
              <template v-if=" printData.almAssetChangeDetailList &&printData.almAssetChangeDetailList.length < 3">
                <tr>
                  <td v-for="(item, index) in 7" :key="index"></td>
                </tr>
                <tr>
                  <td v-for="(item, index) in 7" :key="index"></td>
                </tr>
              </template>
              <tr>
                <td>情况说明</td>
                <td colspan="6">
                  <div class="u-line-1">{{ printData.changeReason }}</div>
                  <div class="u-line-1">{{ getRecords() }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <el-row>
            <el-col :span="8">
              <el-form-item label="确认人"></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="确认日期"></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产管理员"></el-form-item>
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
      let text = ''
      let arr = ['ASSET_ADMINISTRATOR_REGISTRATION', 'DIRECT_SUPERIOR_APPROVAL', 'PROCESS_INITIATE']
      arr.forEach((item) => {
        if (this.printData.assetReviewAuditList && this.printData.assetReviewAuditList.length > 0) {
          let index = this.printData.assetReviewAuditList.findIndex((temp) => temp.processId == item)
          if (index >= 0) {
            let data = this.printData.assetReviewAuditList[index]
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
    // -webkit-print-color-adjust: exact;
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
