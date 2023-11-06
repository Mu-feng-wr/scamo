<template>
  <el-container class="user-layout">
    <div class="login-left" :style="backgroundStyle" />
    <el-container class="user-layout login-right">
      <el-main>
        <signin />
      </el-main>
      <el-footer height="auto">
        <copyright />
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import bgImg1 from '@/assets/images/imgs/banner_1.png'
import bgImg2 from '@/assets/images/imgs/banner_2.png'
import bgImg3 from '@/assets/images/imgs/banner_3.png'
import bgImg4 from '@/assets/images/imgs/banner_4.png'
import signin from './components/signin.vue'
import copyright from '@/components/Copyright/index.vue'
export default {
  components: {
    signin,
    copyright
  },
  data() {
    return {
      backgroundImageUrls: [bgImg1, bgImg2, bgImg3, bgImg4]
    }
  },
  computed: {
    currentBackgroundIndex() {
      return localStorage.getItem('currentBackgroundIndex') || 0
    },
    backgroundStyle() {
      return {
        'background-image': `url(${this.backgroundImageUrls[this.currentBackgroundIndex]})`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-layout {
  height: 100%;
  background-color: #fff;
  .el-main {
    padding: 0;
    height: inherit;
  }
  .el-header {
    padding: 0;
  }
  .el-footer {
    padding: 8px 0;
  }
}
.login-left {
	width: 60%;
	position: relative;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	.logo{
		position: absolute;
		left: 80px;
		top: 40px;
	}
}
</style>
