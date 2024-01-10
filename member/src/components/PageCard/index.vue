<template>
  <div class="page-card">
    <el-container>
      <el-main style="padding:0;">
        <slot></slot>
      </el-main>
      <el-footer v-if="showFooter" class="footer" :class="align">
        <el-button class="mr-10" @click="closeRoutePage">关 闭</el-button>
        <slot name="footer"></slot>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'PageCard',
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'center'
    },
    returnUrl: {
      type: String,
      default: undefined
    }
  },
  methods: {
    closeRoutePage() {
      window.$wujie.props.closeCurrentPage({ path: this.returnUrl })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-card {
  height: 100%;

  ::v-deep .el-container {
    height: 100%;
  }
  ::v-deep .el-footer {
    padding: 0 16px;
  }
}
.footer {
  display: flex;
  align-items: center;
  background: #fff;
}
.left {
  justify-content: flex-start;
}
.center {
  justify-content: center;
}
.right {
  justify-content: flex-end;
}
</style>