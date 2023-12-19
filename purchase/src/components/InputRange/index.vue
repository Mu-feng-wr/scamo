<template>
  <div class="templateCom">
    <!-- 日期时间范围选择  datetimerange-->
    <el-date-picker
      v-if="type=='datetimerange'"
      v-model="value"
      type="datetimerange"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :clearable="clearable"
      :format="format"
      :default-time="defaultTime"
      :value-format="valueFormat"
      :size="size"
      @clear="clear"
      @change="change"
    />
    <!-- 日期范围选择   daterange-->
    <el-date-picker
      v-if="type=='daterange'"
      v-model="value"
      type="daterange"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :format="format"
      :value-format="valueFormat"
      :default-time="defaultTime"
      :size="size"
      @change="change"
      @clear="clear"
    />
    <!-- 数量范围选择 -->
    <div v-if="type=='numberRange'" class="disp-flex">
      <el-input-number v-model="value1" :size="size" controls-position="right" :label="startPlaceholder" @change="changeValue1" />
      <span class="ml-10 mr-10">{{ rangeSeparator }}</span>
      <el-input-number v-model="value2" :size="size" controls-position="right" :label="endPlaceholder" @change="changeValue2" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'InputRange',
  props: {
    type: {
      type: String,
      required: true,
      default: ''
    },
    startValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    endValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    rangeSeparator: {
      type: String,
      default: '-'
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    defaultTime: {
      type: Array,
      default: () => {
        return ['00:00:00', '23:59:59']
      }
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      value: '',
      value1: null,
      value2: null
    }
  },
  watch: {
    startValue: {
      handler() {
        if (['daterange', 'datetimerange'].includes(this.type)) {
          this.value = [this.startValue, this.endValue]
        }
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    change(value) {
      if (value) {
        if (['datetimerange', 'daterange'].includes(this.type)) {
          this.$emit('update:startValue', value[0])
          this.$emit('update:endValue', value[1])
        }
      }
      this.$emit('change')
    },
    clear() {
      if (['datetimerange', 'daterange'].includes(this.type)) {
        this.$emit('update:startValue', '')
        this.$emit('update:endValue', '')
      }
    },
    changeValue1(val) {
      this.$emit('update:startValue', val)
    },
    changeValue2(val) {
      this.$emit('update:endValue', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.templateCom {
  width: 100%;
  line-height: 32px;
}
</style>
