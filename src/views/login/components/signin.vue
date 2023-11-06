<template>
  <div class="login-page">
    <div class="login-page__content">
      <div class="fs-30 fw-600 title">欢迎登录信息化平台</div>
      <div class="desc-text">Construction Productivity Auxiliary System </div>
      <form>
        <div class="input-group">
          <el-input v-model="form.username" placeholder="请输入账号">
            <template slot="prepend">
              <i class="icon icon-username" /></template>
          </el-input>
        </div>
        <div class="input-group">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password>
            <template slot="prepend"><i class="icon icon-password" /></template>
          </el-input>
        </div>

        <el-row>
          <el-col :span="12">
            <el-checkbox v-model="rememberPassword" class="login-check">记住我</el-checkbox>
          </el-col>
        </el-row>
        <el-button class="btn-login" type="primary" @click="handleSubmit">立 即 登 录</el-button>
        <el-alert v-if="isError" :title="errorTitle" :closable="false" type="error" show-icon />
      </form>

    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rememberPassword: false,
      isCheck: false,
      isError: false,
      errorTitle: '账号或者密码错误'
    }
  },
  mounted() {

  },

  created() {
  },
  methods: {
    handleSubmit() {
      this.$store.dispatch('system/loginHandler', { companyCode: 'test', password: '123456', username: '梁伟涛' })
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryColorText:#002340;
.login-page{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-page__content{
    .title{
			letter-spacing: 5px;
    }
    .desc-text{
      color: #666;
      margin: 2px 0 32px;
    }
    .input-group{
        margin: 0 auto 24px;
				text-align: left;
        v-deep .el-input__inner {
				padding: 10px 0px;
				height: 50px;
				font-size: 18px;
				border-left: none;
				border-color: #F2F3F5;
				color: $primaryColorText;
				background: #F2F3F5;
			}
    }
  }
}
</style>
