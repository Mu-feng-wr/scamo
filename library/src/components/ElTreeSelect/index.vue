<template>
  <el-select
    ref="selectTree"
    v-model="label"
    :popper-class="popperClass"
    :loading="loading"
    :disabled="disabled"
    :placeholder="placeholder"
    :size="size"
    :clearable="clearable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :filterable="filterable"
    :filter-method="selectFilterMethod"
    :popper-append-to-body="popperAppendToBody"
    @focus="onfocus"
    @clear="selectClearAll"
    @visible-change="selectVisibleChange"
    @remove-tag="selectRemoveTag"
  >
    <el-option v-show="false" value="1" />
    <el-tree
      ref="tree"
      :render-content="renderContent"
      :class="{onlyFinal:onlyFinal}"
      :node-key="nodeKey"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="expandOnClickNode"
      :data="data"
      :props="props"
      :check-strictly="checkStrictly"
      :highlight-current="highlightCurrent"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :filter-node-method="treeFilterNode"
      @node-click="treeNodeClick"
      @check="treeCheck"
      @current-change="treeCurrentChange"
      @check-change="treeCheckChange"
    />
  </el-select>
</template>

<script src="./index.js"></script>

<style scoped lang="scss">
::v-deep .el-tree__empty-block {
  min-height: 25px;
}
.onlyFinal {
  ::v-deep .el-tree-node__label.node-tree-isParent {
    color: #c0c4cc;
  }
}
</style>
