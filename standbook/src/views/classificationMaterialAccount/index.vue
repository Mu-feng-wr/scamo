<template>
  <div style="position:relative;">
    <span @click="dialogVisible=true">打开</span>
    <vxe-modal v-model="dialogVisible" position="center" title="选择合同" width="70%" height="90%" esc-closable resize />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true
    }
  }
}
</script>

<style>
</style>