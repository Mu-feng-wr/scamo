<template>
  <div style="display:inline-block">
    <el-button :disabled="disabled" type="primary" :size="size" icon="el-icon-s-tools" plain @click="userDialogVisible=true">{{ title }}</el-button>
    <selectUser v-if="userDialogVisible" :select-type="selectType" :visible.sync="userDialogVisible" title="选择使用人" @confirm="userSelect" />
  </div>
</template>
<script>
export default {
  name: 'SetUser',
  props: {
    title: {
      type: String,
      default: '设置使用人'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    selectType: {
      type: String,
      default: 'radio'
    }
  },
  data() {
    return {
      userDialogVisible: false
    }
  },
  methods: {
    userSelect(val) {
      this.userDialogVisible = false
      this.$emit('confirm', val)
    }
  }
}
</script>