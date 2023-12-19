<template>
  <div>
    <el-form ref="form" label-width="170px" class="form-table">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="盘点单号">{{ formData.planCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期">{{ formData.applicantDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类别">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人姓名">{{ formData.applicantName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请部门名称">{{ formData.applicantOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请公司名称">{{ formData.applicantCompanyName }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
      <SectionCard title="申请信息" class="mt-8">
        <el-row>
          <el-col :span="24">
            <el-form-item label="盘点标题">{{ formData.planTitle }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划年月">{{ formData.planYear }}{{ formData.planMonth }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行时间">{{ formData.startDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应盘资产数量">{{ formData.offereQuantity }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任人">{{ formData.reporterName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任部门">{{ formData.reporterOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应盘资产总金额（元）">{{ formData.offereAssetTotalAmount }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点周期">{{ formData.cycleInventory }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="覆盖范围">{{ formData.coverageRange }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="覆盖数据">{{ formData.coverageDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产状态">{{ formData.coverageStatus }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否自盘">{{ formData.ynSelfInventory }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="盘点原因" class="noProp-item-textarea">{{ formData.planReason }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="下达信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="下达人姓名">{{ formData.releaserName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下部门名称">{{ formData.releaserOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下达日期">{{ formData.releaseDate }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="任务信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="完成人姓名">{{ formData.completerName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完成部门名称">{{ formData.completerOrgName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="完成日期">{{ formData.completeDate }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="报告信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报告人姓名">{{ formData.reporteName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报告部门名称">{{ formData.reporteOrgName }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="完成报告时间">{{ formData.reporteDate }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>

    <SectionCard title="目标责任人列表" :isHeaderSplit="true" style="margin-top: 16px">
      <targetResponsibler ref="markList" v-bind="{isDetail: true}" />
    </SectionCard>

    <SectionCard title="资产明细" :isHeaderSplit="true">
      <inventoryLockDoc ref="lockList" v-bind="{ isList: false,  isDetail: true}" />
    </SectionCard>

    <handleRecords ref="handleRecords" />

    <div slot="footer" align="center">
      <el-button type="primary" icon="el-icon-printer">打 印</el-button>
    </div>
  </div>
</template>

<script>
import { getPlan } from '@/api/plan.js'
import targetResponsibler from './components/targetResponsibler.vue'
import inventoryLockDoc from './components/inventoryLockDoc.vue'

export default {
  components: {
    targetResponsibler,
    inventoryLockDoc
  },
  data() {
    return {
      isDisabled: false,
      visible: false,
      editId: '',
      formData: {}
    }
  },
  mounted() {
    this.editId = this.$route.query.id
  },
  methods: {
    init(id) {
      this.submitLoading = true
      getPlan(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
