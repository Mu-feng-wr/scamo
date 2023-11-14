<template>
  <div @click="to">待办</div>
</template>
<script>
export default {
  methods: {
    to() {
      console.log(window.$wujie.location)
    }
  }
}
</script>

<style>
</style>