<template>
  <div class="breadcrumb pl-20 disp-flex align-center">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,i) in breadcrumbList" :key="i">
        <span>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    sidebarRouters() {
      return this.$store.getters.sidebarRouters
    },
    breadcrumbList() {
      var routeName = this.$route.name
      var menuLeftData = this.sidebarRouters.find((item) => item.name == routeName.split('-')[0])
      var topMenu = menuLeftData.children.find((item) => item.name == routeName)
      return [menuLeftData, topMenu]
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 31px;
  .el-breadcrumb__item {
    font-size: 12px;
    color: #7a7f8e;

    .el-breadcrumb__inner {
      color: #7a7f8e;
    }
    &:last-child .el-breadcrumb__inner {
      color: #222943;
      span {
        color: #222943;
      }
    }
  }
}
</style>