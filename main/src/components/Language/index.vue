
<template>
  <div class="language">
    <span>
      <el-dropdown placement="bottom">
        <span class="el-dropdown-link">
          简体中文
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>简体中文</el-dropdown-item>
          <el-dropdown-item>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.language {
  margin-top: 60px;
  position: relative;
  height: 1px;
  border-top: 1px solid #e9eaec;
  text-align: center;

  span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -12px;
    white-space: nowrap;
    background-color: #fff;
    z-index: 1;
    padding: 0 12px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #4e5469;
  }
}
</style>
