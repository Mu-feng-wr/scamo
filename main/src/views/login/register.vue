<template>
  <div class="container">
    <el-row class="commom_row">
      <el-col :span="16">
        <div class="loginCon_left">
          <div class="logo-box">
            <img :src="require('@/assets/images/logo.png')" />
            <div class="pt-8 pl-8">
              <div class="login-title">云蟾数字资产管理中台</div>
              <div class="subtitle">Smart Asset Cloud Middle Platform</div>
            </div>
          </div>
          <div class="login-info">
            <div class="title">我们都在使用云蟾数字资产管理中台</div>
            <div class="text">
              享用更简单、更全面、更可靠、更精准、更安全
              <br />更灵活、更自治、更经济的云蟾SAC五星级服务
            </div>
            <div class="frameBox">
              <img v-for="(item,i) in 5" :key="i" :src="require('@/assets/images/Frame' + (i + 1) + '.png')" />
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <el-container class="h-100">
          <el-main class="loginCon_right">
            <div class="loginCon_box">
              <div class="login_tabs pt-50 mb-28">
                <span class="el-tabs__item is-active">免费注册</span>
              </div>
              <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form">
                <el-form-item prop="enterpriseName">
                  <el-input v-model="registerForm.enterpriseName" type="text" auto-complete="off" placeholder="企业名称">
                    <img slot="prefix" src="@/assets/images/enterpriseIcon.png" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="contact">
                  <el-input v-model="registerForm.contact" type="text" auto-complete="off" placeholder="联系人姓名">
                    <img slot="prefix" src="@/assets/images/AccountNumber.png" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="邮箱">
                    <img slot="prefix" src="@/assets/images/emailIcon.png" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="username">
                  <el-input v-model="registerForm.username" type="text" clearable auto-complete="off" placeholder="手机号">
                    <img slot="prefix" src="@/assets/images/Mobilephone.png" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input v-model="registerForm.code" placeholder="验证码" @keyup.enter.native="handleRegister">
                    <img slot="prefix" src="@/assets/images/Verificationcode.png" />
                    <a slot="suffix" class="link-type fs-14 mr-10" :class="disabled ? 'disabled' : ''" @click="getSMSVerificationCode">{{ computedVerifBtnText }}{{ count==60?'':count+'S' }}</a>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="设置密码（8-12位，包含数字和字母）" show-password @keyup.enter.native="handleRegister">
                    <img slot="prefix" src="@/assets/images/Password.png" />
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button :loading="loading" size="medium" type="primary" style="width: 100%; padding: 12px 20px; font-size: 16px" @click.native.prevent="handleRegister">
                    <span v-if="!loading">注 册</span>
                    <span v-else>注 册 中...</span>
                  </el-button>
                </el-form-item>

                <div class="text-center text-gray">
                  已有账号，
                  <router-link class="link-type" :to="'/login'">去登录</router-link>
                </div>

                <language />
              </el-form>
            </div>
          </el-main>
          <el-footer style="height:auto;">
            <ComponyName />
            <Copyright />
          </el-footer>
        </el-container>
      </el-col>
    </el-row>

    <Vcode :show="isShow" :imgs="[img1, img2]" slider-text="向右拖动滑块完成拼图" :slider-size="40" @success="onSuccess" @close="onClose" />
  </div>
</template>

<script>
import language from '@/components/Language/index.vue'
import Vcode from 'vue-puzzle-vcode'
import img1 from '@/assets/images/login_bottomBg.png'
import img2 from '@/assets/images/reBg.png'
import { sendSMS, register } from '@/api/system.js'
import rsa from '@/utils/rsa.js'
import Copyright from '@/components/Copyright/index.vue'
import ComponyName from '@/components/ComponyName/index.vue'
export default {
  name: 'Register',
  components: {
    Vcode,
    Copyright,
    ComponyName,
    language
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      img1,
      img2,
      registerForm: {
        uuid: 'registry'
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' },
          {
            min: 2,
            max: 20,
            message: '用户账号长度必须介于 2 和 20 之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' },
          {
            min: 5,
            max: 20,
            message: '用户密码长度必须介于 5 和 20 之间',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '请再次输入您的密码' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        phone: [{ required: true, trigger: 'change', message: '请输入手机号' }]
      },
      loading: false,
      computedVerifBtnText: '获取验证码',
      isShow: false,
      disabled: false,
      count: 60
    }
  },
  created() {},
  methods: {
    getSMSVerificationCode() {
      if (this.disabled) {
        return
      }
      this.$refs.registerForm.validateField('username', (valid) => {
        if (!valid) {
          this.getVerificationCode()
        }
      })
    },
    getVerificationCode() {
      this.isShow = true
    },
    onSuccess() {
      this.isShow = false // 通过验证后，需要手动关闭模态框
      if (!this.disabled) {
        this.getVerifBtnTextTiming()
      }
      rsa.encrypt(this.registerForm.username).then((res) => {
        const param = {
          cellPhoneNumber: res.encryptContext,
          headerParam: res.headerParam,
          businessCode: 'registry'
        }
        sendSMS(param).then((result) => {
          if (result.code == 120001) {
            setTimeout(() => {
              this.$router.push({
                path: '/login',
                query: { cellPhoneNumber: this.registerForm.username }
              })
            }, 200)
            return
          }
          this.$message.success('验证码已发送，请留意手机短信！')
        })
      })
    },
    onClose() {
      this.isShow = false
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.registerForm.cellPhoneNumber = this.registerForm.username
          register(this.registerForm)
            .then((res) => {
              const username = this.registerForm.username
              this.$confirm("<font color='red'>恭喜你，您的账号 " + username + ' 注册成功！</font>', '系统提示', {
                dangerouslyUseHTMLString: true,
                type: 'success'
              })
                .then(() => {
                  this.$router.push('/login')
                })
                .catch(() => {})
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getVerifBtnTextTiming() {
      if (this.count == 0) {
        this.disabled = false
        this.computedVerifBtnText = '获取验证码'
        this.count = 60
        return
      }
      setTimeout(() => {
        this.disabled = true
        this.computedVerifBtnText = '重新获取'
        this.count--
        this.getVerifBtnTextTiming()
      }, 1000)
    }
  }
}
</script>

<style  lang="scss" scoped>
.container {
  height: 100%;
  color: #222943;
  .commom_row {
    height: 100%;
    .el-col {
      height: 100%;
    }
    .loginCon_left {
      position: relative;
      height: 100%;
      width: 100%;
      background-color: #fbfbfb;
      background-size: 100%;
      background-position: center bottom;
      background-repeat: no-repeat;
      background-image: url('~@/assets/images/login_bottomBg.png');
      .logo-box {
        padding: 40px;
        display: flex;
        font-family: PingFang SC-Medium, PingFang SC;
        .login-title {
          color: #222943;
          font-weight: 500;
          font-size: 27px;
        }
        .subtitle {
          padding-top: 10px;
          color: #222943;
          font-size: 12px;
        }
      }
      .login-info {
        text-align: center;
        .title {
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #222943;
          font-size: 30px;
          margin: 0;
        }
        .text {
          font-size: 16px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #4e5469;
          line-height: 1.7;
          margin: 27px 0;
        }
        .frameBox {
          width: 444px;
          height: 222px;
          background-image: url('~@/assets/images/10001.png');
          margin: auto;
        }
      }
    }
    .loginCon_right {
      position: relative;
      padding: 20px 50px;
      .scanDiv {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }
      .loginCon_box {
        width: 70%;
        margin: auto;
        .el-tabs__item {
          font-size: 20px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #7a7f8e;
          padding: 0;
        }
        .is-active {
          font-size: 24px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: #222943;
        }
        .login-code {
          width: 33%;
          height: 44px;
          float: right;

          img {
            cursor: pointer;
            vertical-align: middle;
            width: 100%;
            height: 100%;
          }
        }
        .login-form {
          ::v-deep .el-input__inner {
            height: 44px;
          }
          ::v-deep .el-input--prefix .el-input__inner {
            padding-left: 40px;
          }
          ::v-deep .el-input__prefix {
            line-height: 44px;
            margin-left: 10px;
            margin-top: 4px;
          }
          .forget {
            position: relative;
            padding-left: 10px;
            float: right;
            margin-left: 10px;

            &::before {
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              content: '';
              display: inline-block;
              height: 12px;
              width: 1px;
              background-color: #e9eaec;
            }
          }
          .validCode_icon {
            height: 36px;
            width: 18px;
          }
          ::v-deep .el-button--primary {
            background-color: rgb(35, 109, 255);
          }
        }
      }
      .ewmBox {
        margin: 28px auto 0;
        width: 244px;
        height: 244px;
        background-repeat: no-repeat;
        background-image: url('~@/assets/images/rectangle.png');
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .smallTitle {
        font-size: 14px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #7a7f8e;
      }
    }
  }
}
.link-type {
  font-size: 16px;
  color: #236dff;
}
.text-gray {
  color: #aaa;
}
.disabled {
  color: #bdbfc7;
}
</style>
