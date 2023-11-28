<template>
  <div @click="to">
    待办
    <el-input v-model="value" />
    <com-one />
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
    console.log('todo======')
    // console.log(this.$store.getters.userInfo, '==========1111')
  },
  methods: {
    to() {}
  }
}
</script>

<style>
</style>