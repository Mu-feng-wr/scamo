<template>
  <div class="section-card-wrap">
    <div v-if="isHeader" class="section-card__header">
      <div class="r">
        <slot name="header-r"></slot>
      </div>
      <div class="l">
        <slot name="header-l">{{ title }}</slot>
      </div>
    </div>
    <div v-if="isShowBody" class="section-card__body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SectionCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '100%'
    },
    isShowBody: {
      type: Boolean,
      default: true
    },
    isHeaderSplit: {
      type: Boolean,
      default: false
    },
    isHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.section-card {
  &-wrap {
    display: flex;
    flex-direction: column;
    box-orient: vertical;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    background-color: #fff;
    margin-bottom: 8px;
    border-radius: 4px;
    &.noHeader {
      .section-card__header {
        display: none;
      }
    }
  }
  &__header {
    position: relative;
    // overflow: hidden;
    padding: 10px 16px;
    font-size: 15px;
    font-family: PingFang SC-Medium, PingFang SC;
    //font-weight: 600;
    color: #222943;
    & + .section-card__body {
      padding-top: 0;
    }

    &.borde-b {
      border-bottom: 1px solid #e1e7f6;
    }
    &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      margin-top: -4px;
      display: inline-block;
      background-color: #0099ff;
      display: none;
    }
    .l {
      float: left;
    }
    .r {
      float: right;
      cursor: pointer;
    }
  }
  &__body {
    flex: 1;
    //height: 0;
    // overflow-y: auto;
    flex-basis: auto;
    padding: 16px 16px;
  }
  &__footer {
    padding: 16px 0;
  }
}
</style>
