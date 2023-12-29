<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" :model="formData" :rules="rules" label-width="130px" label-suffix="：">
      <SectionCard title="基本信息" style="margin-bottom: 0">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标签名称" prop="markName">
              <el-input v-model="formData.markName" placeholder="请输入标签名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标签样本图片" prop="markIcon">
              <el-radio v-model="formData.markIcon" label="1">二维码</el-radio>
              <el-radio v-model="formData.markIcon" label="2">条码</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用" prop="ynUse">
              <el-radio v-model="formData.ynUse" :label="true">是</el-radio>
              <el-radio v-model="formData.ynUse" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="标签设置">
        <div class="markBox">
          <el-row>
            <el-col :span="8">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <span v-else class="avatar-uploader-icon">公司logo</span>
              </el-upload>
            </el-col>
            <el-col v-if="formData.markIcon == 2" :span="16" style="margin-top: 20px">
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col v-else :span="16" class="text-right qrcodeBox">
              <div class="qrcodeImg">
                <div ref="qrcode"></div>
                <img v-if="qrcodeVisible" :src="defaultLogo" class="defaultLogo" />
              </div>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资产名称" prop="assetName">
                <el-input v-model="formData.assetName" placeholder="请输入资产名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资产编码" prop="markCode">
                <el-input v-model="formData.markCode" placeholder="请输入资产编码" @blur="blurFun" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <el-form-item label="规格型号" prop="model">
                <el-input v-model="formData.model" placeholder="请输入规格型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.markIcon != 2">
            <el-col :span="24">
              <el-form-item label="启用日期" prop="activationDate">
                <el-date-picker v-model="formData.activationDate" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择启用日期" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="formData.markIcon == 2" :span="24">
              <img ref="barcode" style="max-width: 100%" />
            </el-col>
          </el-row>
        </div>

        <div class="markBox">
          <h4 class="tipTitle">展示信息</h4>
          <el-row :gutter="10">
            <el-col v-for="(item, key) in obj" :key="key" :span="6">
              <el-tag type="info" class="elTag">{{ item }}</el-tag>
            </el-col>
          </el-row>
        </div>
      </SectionCard>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </PageCard>
</template>
<script>
import { getMark, addMark, updateMark } from '@/api/mark.js'
import jsbarcode from 'jsbarcode'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      returnUrl: '/library/mark',
      defaultLogo: require('@/assets/images/img/logo-blue.png'),
      submitLoading: false,
      formData: {},
      obj: {
        markLogo: '公司logo',
        companyName: '公司名称',
        QRCode: '二维码',
        jsbarcode: '条形码',
        assetName: '资产名称',
        model: '规格型号',
        markCode: '资产编码',
        activationDate: '启用日期'
      },
      rules: {
        markName: {
          required: true,
          message: '标签名称不能为空',
          trigger: 'blur'
        },
        markIcon: {
          required: true,
          message: '标签样本图片不能为空',
          trigger: 'change'
        },
        ynUse: {
          required: true,
          message: '是否启用不能为空',
          trigger: 'change'
        }
      },
      imageUrl: '',

      barcodeVisible: false,
      qrcodeVisible: false,
      editId: ''
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
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getMark(this.editId)
        .then((response) => {
          this.formData = response.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    goBack() {
      this.$router.push({
        name: 'library-mark'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.materialMarkId != null) {
            updateMark(this.formData).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addMark(this.formData).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isImg = ['image/jpeg', 'image/jpg', 'image/png']
      const isJPG = isImg.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传logo图片只能是 图片 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传logo图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    blurFun() {
      if (this.formData.markIcon == 2) {
        this.barcodeFun()
      } else {
        this.qrcodeFun()
      }
    },
    /* 生成条形码 */
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
    // 生成二维码
    qrcodeFun() {
      if (this.formData.markCode) {
        this.qrcodeVisible = true
        this.$nextTick(function () {
          this.$refs['qrcode'].innerHTML = ''
          new QRCode(this.$refs['qrcode'], {
            width: 100, // 宽度
            height: 100, // 高度
            text: this.formData.markCode, // 二维码内容
            correctLevel: QRCode.CorrectLevel.L // 容错级别
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