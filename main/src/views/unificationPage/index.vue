<template>
  <WujieVue width="100%" height="100%" class="wujie" :url="url" :name="name" :props="{baseApp: 'wujie456'}" />
</template>

<script>
export default {
  name: 'FlowModel',
  data() {
    return {
      url: '',
      name: 'crud'
    }
  },
  created() {
    console.log(this.$route)
    this.url = 'http://192.168.10.10:9001/#/' + this.$route.path
  }
}
</script>

<style lang="scss" scoped>
.wujie {
  display: block;
  position: relative;
}
</style>
