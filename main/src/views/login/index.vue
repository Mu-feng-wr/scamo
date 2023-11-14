<template>
  <div class="container">
    <el-row class="commom_row">
      <el-col :span="16">
        <div class="loginCon_left">
          <div class="logo-box">
            <img :src="require('@/assets/images/img/logo.png')" />
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
              <img v-for="(item,i) in 5" :key="i" :src="require('@/assets/images/img/Frame' + (i + 1) + '.png')" />
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="loginCon_right">
          <div class="scanDiv" @click="userLogin = !userLogin">
            <img v-if="userLogin" :src="require('@/assets/images/img/Handover.png')" />
            <img v-else :src="require('@/assets/images/img/Userover.png')" />
          </div>
          <div class="text-right" style="padding-bottom: 26px">
            <el-tag v-if="userLogin" @click="userLogin = !userLogin">扫码登录更方便</el-tag>
            <el-tag v-else @click="userLogin = !userLogin">账号密码登录</el-tag>
            <img :src="require('@/assets/images/img/triangle.png')" />
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
                      <img slot="prefix" src="@/assets/images/img/AccountNumber.png" />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" show-password clearable @keyup.enter.native="handleLogin">
                      <img slot="prefix" src="@/assets/images/img/Password.png" />
                      <router-link slot="suffix" class="link-type forget" :to="'/forget'">忘记密码？</router-link>
                    </el-input>
                  </el-form-item>
                  <el-form-item v-if="captchaEnabled" prop="code">
                    <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
                      <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
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
                      <img slot="prefix" :src="require('@/assets/images/img/Mobilephone.png')" />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="vcode">
                    <el-input v-model="loginForm.vcode" placeholder="验证码" @keyup.enter.native="handleLogin">
                      <img slot="prefix" src="@/assets/images/img/Verificationcode.png" />
                      <a slot="suffix" class="vCode" :class="disabled ? 'disabled' : ''" @click="getVerificationCode">{{ computedVerifBtnText }}</a>
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
                  <img :src="require('@/assets/images/img/ewm.jpg')" />
                </div>
                <div class="smallTitle">使用小程序扫码进行登录</div>
              </div>
            </div>

            <div class="text-center text-gray">
              没有账号，
              <!-- <router-link class="link-type" :to="'/register'">免费注册</router-link> -->
            </div>
            <!-- <language></language> -->
          </div>
        </div>
        <!-- <foot></foot> -->
      </el-col>
    </el-row>

    <!-- <Vcode :show="isShow" :imgs="[img1, img2]" sliderText="向右拖动滑块完成拼图" :sliderSize="40" @success="onSuccess" @close="onClose" /> -->
  </div>
</template>

<script>
import { getVerificationCode } from '@/api/system.js'
export default {
  data() {
    return {
      userLogin: true,
      curent: 'password',
      activeName: '',
      isShow: false,
      loginForm: {},
      loginRules: {},
      captchaEnabled: true,
      codeUrl: '',
      loading: false
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    getCode() {
      getVerificationCode().then((res) => {
        this.codeUrl = 'data:image/gif;base64,' + res.img
      })
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
      background-image: url('~@/assets/images/img/login_bottomBg.png');
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
          background-image: url('~@/assets/images/img/10001.png');
          margin: auto;
        }
      }
    }
    .loginCon_right {
      height: calc(100% - 70px);
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
        }
      }
    }
  }
}
</style>
