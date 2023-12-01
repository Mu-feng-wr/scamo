<template>
  <div class="more_query">
    <el-link class="advancedFilter" @click="filterMore">
      <i class="vxe-icon-funnel"></i>
      高级筛选
    </el-link>

    <el-drawer style="position: absolute;height:100%;" :show-close="showClose" :modal="false" append-to-body :visible.sync="show" direction="rtl" size="650px" @close="showClose=true">
      <div slot="title" class="disp-flex justify-between align-center">
        <span class="title">高级筛选</span>
        <i class="el-icon-close icon" @click="show=false"></i>
      </div>
      <div class="content">
        <div class="main">
          <el-form :label-position="labelPosition" :label-width="labelWidth">
            <el-row>
              <el-col v-for="(item, i) in filterOptions" :key="i" :span="['datetimerange', 'daterange','numberRange'].includes(item.type) ? 24 : 12">
                <el-form-item :label="item.label">
                  <el-input v-if="item.type == 'input'" v-model="form[item.value]" :placeholder="item.placeholder || '请输入'" :clearable="item.clearable||true" />

                  <el-select
                    v-if="item.type == 'select'"
                    v-model="form[item.value]"
                    :placeholder="item.placeholder || '请选择'"
                    :multiple="item.multiple"
                    :clearable="item.clearable||true"
                    :multiple-limit="item.multipleLimit"
                    :disabled="item.disabled"
                  >
                    <el-option v-for="(temp, index) in item.options" :key="index" :label="temp[item.labelName] || temp.itemsName" :value="temp[item.valueName] || item.value" />
                  </el-select>

                  <BaseInput
                    v-if="item.type == 'baseInput'"
                    :base-code="item.baseCode"
                    :label-name="item.labelName||'itemsName'"
                    :value-name="item.valueName||'itemsValue'"
                    :value.sync="form[item.value]"
                    :options-list="item.options||[]"
                    :result-label="item.resultLabel||'rows'"
                    :query="item.query||{}"
                    :rely-on="item.relyOn||''"
                    :clearable="item.clearable||true"
                    :size="item.size||'small'"
                    @change="change"
                  />

                  <InputRange
                    v-if="['daterange', 'datetimerange','numberRange'].includes(item.type)"
                    :format="item.format || (item.type == 'daterange'? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss') "
                    :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                    :type="item.type"
                    :start-value.sync="form[item.valueStart]"
                    :end-value.sync="form[item.valueEnd]"
                    :start-placeholder="item.startPlaceholder||'开始时间'"
                    :end-placeholder="item.endPlaceholder||'结束时间'"
                    :clearable="item.clearable||true"
                    :size="item.size||'small'"
                  />

                  <el-date-picker
                    v-if="item.type == 'date'"
                    v-model="form[item.value]"
                    align="right"
                    type="date"
                    :placeholder="item.placeholder || '选择日期'"
                    :clearable="item.clearable||true"
                  />
                  <el-date-picker
                    v-if="item.type == 'year'"
                    v-model="form[item.value]"
                    type="year"
                    value-format="yyyy"
                    :placeholder="item.placeholder || '选择年份'"
                    :clearable="item.clearable||true"
                  />
                  <el-date-picker
                    v-if="item.type == 'month'"
                    v-model="form[item.value]"
                    type="month"
                    value-format="MM"
                    :placeholder="item.placeholder || '选择月份'"
                    :clearable="item.clearable||true"
                  />
                  <el-input-number
                    v-if="item.type == 'inputNumber'"
                    v-model="form[item.value]"
                    controls-position="right"
                    :precision="item.precision"
                    :min="item.min"
                    :step="item.step || 1"
                    :max="item.max"
                    label="描述文字"
                    :placeholder="item.placeholder || '请输入'"
                    :clearable="item.clearable||true"
                  />

                  <el-cascader
                    v-if="item.type == 'cascader'"
                    v-model="form[item.value]"
                    :options="item.options"
                    filterable
                    :placeholder="item.placeholder || '请选择'"
                    :clearable="item.clearable||true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="footer text-center">
          <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: 'MoreQuery',
  props: {
    labelPosition: {
      type: String,
      default: 'right'
    },
    filterOptions: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      isshow: false,
      form: {},
      showClose: true
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        this.form = JSON.parse(JSON.stringify(newVal))
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    filterMore() {
      this.show = true
      this.$nextTick(() => {
        this.showClose = false
      })
    },
    // 查询
    refresh() {
      console.log(this.form)
      this.show = false
      this.$emit('update:formData', this.form)
      this.$emit('reload')
    },
    // 重置
    reset() {
      this.form = {}
      this.$emit('update:formData', this.form)
      this.$emit('reload')
    },
    change() {
      console.log(this.form)
      this.$emit('update:formData', this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
.more_query {
  display: inline-block;
}
::v-deep .el-drawer__header {
  padding: 12px 15px;
  margin-bottom: 0;
  box-shadow: 0 1px 5px #efefef;
}

.title {
  font-weight: 500;
  color: #222943;
}
.icon {
  font-size: 20px;
  cursor: pointer;
}
.content {
  height: 100%;
  .main {
    height: calc(100% - 60px);
    overflow-y: auto;
    box-shadow: 0 1px 5px #efefef;
    padding: 20px;
    box-sizing: border-box;
  }
  .footer {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
::v-deep.el-col {
  height: 52px;
}
.advancedFilter {
  color: #236dff !important;
  padding-left: 7px;
  font-size: 14px;

  i {
    font-weight: bold;
  }

  &.is-underline:hover:after {
    border-bottom: none;
  }
}
</style>
