<template>
  <WujieVue
    width="100%"
    height="100%"
    class="wujie"
    :url="url"
    :name="name"
    :props="{baseApp: 'wujie'}"
  />
</template>

<script>
export default {
  name: 'FlowModel',
  data() {
    return {
      url: 'http://192.168.10.10:9000/',
      name: 'crud'
    }
  }
}
</script>

<style lang="scss" scoped>
.wujie {
  display: block;
  position: relative;
}
</style>
