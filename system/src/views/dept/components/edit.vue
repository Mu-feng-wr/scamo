<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织编号" prop="code">
            <el-input v-model="form.code" placeholder="请输入组织编号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入部门名称" maxlength="250" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parentId" v-if="form.parentId != 0">
            <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" @select="deptChange" placeholder="选择上级部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组织类型" prop="orgType">
            <el-select v-model="form.orgType" placeholder="组织类型" style="width: 100%">
              <el-option v-for="item in orgTypeList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" rows="3" v-model="form.remark" clearable placeholder="备注" maxlength="500" show-word-limit style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门状态">
            <el-select v-model="form.status" placeholder="部门状态" style="width: 100%">
              <el-option v-for="item in statusList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {}
</script>

<style>
</style>