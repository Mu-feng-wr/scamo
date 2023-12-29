<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="130px" label-suffix="：">
      <SectionCard title="基本信息" style="margin-bottom: 0">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标签名称">
              <span>{{ formData.markName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签样本图片">
              <span>{{ formData.markIcon == 2 ? "条码" : "二维码" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用">
              <span>{{ formData.ynUse ? "是" : "否" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="标签设置">
        <div class="markBox item">
          <el-row>
            <el-col :span="8">
              <el-col :span="8">
                <img v-if="formData.markLogo" :src="formData.markLogo" />
                <img v-else :src="defaultImg" />
              </el-col>
            </el-col>
            <el-col :span="16" v-if="formData.markIcon == 2" style="margin-top: 20px">
              <span>公司名称：</span>
              <span>{{ formData.companyName }}</span>
            </el-col>
            <el-col :span="16" class="text-right qrcodeBox" v-else>
              <div class="qrcodeImg">
                <div ref="qrcode"></div>
                <img :src="defaultLogo" class="defaultLogo" v-if="qrcodeVisible" />
              </div>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <span>公司名称：</span>
              <span>{{ formData.companyName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span>资产名称：</span>
              <span>{{ formData.assetName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span>资产编码：</span>
              <span>{{ formData.markCode }}</span>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <span>规格型号：</span>
              <span>{{ formData.model }}</span>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <span>启用日期：</span>
              <span>{{ formData.activationDate }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="formData.markIcon == 2">
              <img ref="barcode" style="max-width: 100%" />
            </el-col>
          </el-row>
        </div>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button @click="goBack">取 消</el-button>
    </div>
  </PageCard>
</template>
<script>
import { getMark } from '@/api/mark.js'
import jsbarcode from 'jsbarcode'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      returnUrl: '/library/mark',
      defaultImg: require('@/assets/images/img/Headimage.png'),
      defaultLogo: require('@/assets/images/img/logo-blue.png'),
      submitLoading: false,
      formData: {},
      barcodeVisible: false,
      qrcodeVisible: false
    }
  },
  watch: {
    'formData.markIcon': function (v) {
      if (v == 2) {
        this.barcodeFun()
      } else {
        this.qrcodeFun()
      }
    }
  },
  created() {
    this.init(this.$route.query.id)
  },
  methods: {
    init(id) {
      this.formData.materialMarkId = id || null
      if (this.formData.materialMarkId) {
        getMark(this.formData.materialMarkId).then((response) => {
          this.formData = response.data
        })
      }
    },
    goBack() {
      this.$router.push({
        name: 'library-mark'
      })
    },
    /*生成条形码 */
    barcodeFun() {
      if (this.formData.markCode) {
        this.barcodeVisible = true
        this.$nextTick(function () {
          jsbarcode(this.$refs['barcode'], this.formData.markCode, {
            format: 'CODE128',
            lineColor: '#000',
            background: '#EBEEF5',
            width: 2,
            height: 50
            // displayValue: false,
          })
        })
      }
    },
    //生成二维码
    qrcodeFun() {
      if (this.formData.markCode) {
        this.qrcodeVisible = true
        this.$nextTick(function () {
          this.$refs['qrcode'].innerHTML = ''
          new QRCode(this.$refs['qrcode'], {
            width: 100, //宽度
            height: 100, // 高度
            text: this.formData.markCode, // 二维码内容
            correctLevel: QRCode.CorrectLevel.L //容错级别
          })
        })
      }
    }
  }
}
</script>
<style lang='scss'>
.markBox {
  width: 380px;
  border: 1px solid #eee;
  padding: 12px;
  margin-bottom: 15px;

  .el-form-item {
    margin-bottom: 7px;

    .el-form-item__label {
      text-align: left;
      width: 90px !important;
    }

    .el-form-item__content {
      margin-left: 90px !important;
    }
  }

  .elTag {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }

  .tipTitle {
    font-size: 16px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 600;
    color: #222943;
    margin-top: 0;
    margin-bottom: 12px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 12px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  background: #f5f4f7;
  display: block;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  &.el-icon-plus {
    font-size: 28px;
  }
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.qrcodeImg {
  position: relative;
  float: right;
  width: 100px;
  height: 100px;

  .defaultLogo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}
</style>