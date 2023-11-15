<template>
  <div class="text-grey text-center fs-14">
    COPYRIGHT © 广州市约纽互联网科技有限公司2015-{{ year }}.
    <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">粤ICP备20015855号-1</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>
<style lang="scss" scoped>
.text-grey {
  color: #999;
  margin-bottom: 14px;
}
</style>
