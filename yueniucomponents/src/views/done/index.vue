<template>
  <div>
    已办
    <el-input v-model="value" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  created() {
    console.log('done======')
  }
}
</script>

<style>
</style>