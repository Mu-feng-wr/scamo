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
            <div class="scanDiv" @click="userLogin = !userLogin">
              <img v-if="userLogin" :src="require('@/assets/images/Handover.png')" />
              <img v-else :src="require('@/assets/images/Userover.png')" />
            </div>
            <div class="text-right" style="padding-bottom: 26px">
              <el-tag v-if="userLogin" @click="userLogin = !userLogin">扫码登录更方便</el-tag>
              <el-tag v-else @click="userLogin = !userLogin">账号密码登录</el-tag>
              <img :src="require('@/assets/images/triangle.png')" />
            </div>

            <div class="loginCon_box">
              <div v-if="userLogin">
                <div class="login_tabs mb-28">
                  <span class="el-tabs__item" :class="curent=='password'?'is-active':''" @click="curent='password'">密码登录</span>
                  <span class="el-tabs__item pl-20" :class="curent=='code'?'is-active':''" @click="curent='code'">验证码登录</span>
                </div>
                <div v-if="curent == 'password'">
                  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                    <el-form-item prop="username">
                      <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号/手机号/邮箱" clearable>
                        <img slot="prefix" src="@/assets/images/AccountNumber.png" />
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" show-password clearable @keyup.enter.native="handleLogin">
                        <img slot="prefix" src="@/assets/images/Password.png" />
                        <router-link slot="suffix" class="link-type forget" :to="'/forget'">忘记密码？</router-link>
                      </el-input>
                    </el-form-item>
                    <el-form-item v-if="captchaEnabled" prop="code">
                      <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
                        <svg-icon slot="prefix" icon-class="validCode" class="validCode_icon" />
                      </el-input>
                      <div class="login-code">
                        <img :src="codeUrl" class="login-code-img" @click="getCode" />
                      </div>
                    </el-form-item>

                    <div class="flex justify-between">
                      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
                    </div>

                    <el-form-item style="width: 100%">
                      <el-button :loading="loading" size="medium" type="primary" style="width: 100%; padding: 12px 20px; font-size: 16px" @click.native.prevent="handleLogin">
                        <span v-if="!loading">登 录</span>
                        <span v-else>登 录 中...</span>
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-if="curent == 'code'">
                  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                    <el-form-item prop="phone">
                      <el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="手机号" clearable>
                        <img slot="prefix" :src="require('@/assets/images/Mobilephone.png')" />
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="vcode">
                      <el-input v-model="loginForm.vcode" placeholder="验证码" @keyup.enter.native="handleLogin">
                        <img slot="prefix" src="@/assets/images/Verificationcode.png" />
                        <a slot="suffix" class="link-type fs-14 mr-10" :class="disabled ? 'disabled' : ''" @click="getPhoneVerificationCode">{{ computedVerifBtnText }}</a>
                      </el-input>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      <el-button :loading="loading" size="medium" type="primary" style="width: 100%; padding: 12px 20px; font-size: 16px" @click.native.prevent="handleLogin">
                        <span v-if="!loading">登 录</span>
                        <span v-else>登 录 中...</span>
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>

              <div v-else>
                <div class="login_tabs">
                  <span class="el-tabs__item is-active">小程序扫码登录</span>
                </div>
                <div class="text-center">
                  <div class="ewmBox">
                    <img :src="require('@/assets/images/ewm.jpg')" />
                  </div>
                  <h5 class="smallTitle">使用小程序扫码进行登录</h5>
                </div>
              </div>

              <div class="text-center text-gray fs-14">
                没有账号，
                <router-link class="link-type fs-14" :to="'/register'">免费注册</router-link>
              </div>
              <language />
            </div>
          </el-main>
          <el-footer style="height:auto;">
            <ComponyName />
            <Copyright />
          </el-footer>
        </el-container>
      </el-col>
    </el-row>

    <Vcode :show="isShow" :imgs="[img1, img2]" :slider-size="40" slider-text="向右拖动滑块完成拼图" @success="onSuccess" @close="onClose" />
  </div>
</template>

<script>
import { getVerificationCode } from '@/api/system.js'
import language from '@/components/Language/index.vue'
import Copyright from '@/components/Copyright/index.vue'
import ComponyName from '@/components/ComponyName/index.vue'
import Vcode from 'vue-puzzle-vcode'
import img1 from '@/assets/images/login_bottomBg.png'
import img2 from '@/assets/images/reBg.png'
export default {
  components: {
    language,
    Copyright,
    ComponyName,
    Vcode
  },
  data() {
    return {
      img1,
      img2,
      userLogin: true,
      curent: 'password',
      activeName: '',
      isShow: false,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', message: '请输入您的账号/手机号/邮箱' }],
        password: [{ required: true, trigger: 'change', message: '请输入您的密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        vcode: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      captchaEnabled: true,
      codeUrl: '',
      loading: false,
      computedVerifBtnText: '获取验证码'
    }
  },
  created() {
    let loginInfo = window.localStorage.getItem('loginInfo')
    if (loginInfo) {
      loginInfo = JSON.parse(loginInfo)
      this.loginForm = {
        username: loginInfo.username,
        password: loginInfo.password,
        rememberMe: loginInfo.rememberMe
      }
    }
    this.getCode()
  },
  methods: {
    // 获取验证码
    getCode() {
      getVerificationCode().then((res) => {
        this.codeUrl = 'data:image/gif;base64,' + res.img
        this.loginForm.uuid = res.uuid
      })
    },
    // 账号密码登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('system/loginHandler', this.loginForm).then((res) => {
            if (res.code == 200) {
              if (this.loginForm.rememberMe) {
                const loginInfo = {
                  username: this.loginForm.username,
                  password: this.loginForm.password,
                  rememberMe: this.loginForm.rememberMe
                }
                window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
              } else {
                window.localStorage.setItem('loginInfo', '')
              }

              this.$router.push({
                path: '/'
              })
            } else {
              this.getCode()
              this.loading = false
            }
          })
        }
      })
    },
    getPhoneVerificationCode() {
      this.isShow = true
    },
    onSuccess() {
      this.isShow = false
    },
    onClose() {
      this.isShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
