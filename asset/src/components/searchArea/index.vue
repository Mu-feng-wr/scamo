<template>
  <div class="searchArea" :class="{ expand: showAllSearch }">
    <slot></slot>
    <a v-if="showToggleBtn" class="toggleBtn" @click="toggleSearch">
      <i :class="!showAllSearch ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
    </a>
  </div>
</template>
<script>
export default {
  name: 'SearchArea',
  props: {
    showAllSearch: {
      // 默认不展开全部
      type: Boolean,
      default: false
    },
    showToggleBtn: {
      // 显示操作按钮
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },

  computed: {},
  created() {},
  methods: {
    // 展开、收起
    toggleSearch() {
      this.$emit('update:showAllSearch', !this.showAllSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    // 重置
    reset() {
      this.$emit('resetTable')
    }
  }
}
</script>
<style lang="scss" scoped>
.searchArea {
  position: relative;
  margin-bottom: 20px;
  background: #f8f9f9;

  ::v-deep .el-button--small {
    padding-left: 6px;
    padding-right: 6px;
  }

  ::v-deep .operBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .el-form {
    // position: relative;
    overflow: hidden;
    height: 64px;
    overflow: hidden;
    padding: 16px 16px 0 16px;
    background: #f8f9f9;
    border-radius: 2px 2px 2px 2px;

    ::v-deep .el-form-item {
      margin-bottom: 16px;
    }
    ::v-deep .el-button + .el-button {
      margin-left: 7px;
    }
    ::v-deep .el-button--mini {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
  &.expand {
    .el-form {
      height: auto;
    }
  }

  .toggleBtn {
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #a7a9b4;
    border-radius: 0 0 20px 20px;
    padding: 1px 20px;
    color: #fff;
    display: inline-block;
    line-height: 8px;
    bottom: -14px;

    i {
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
