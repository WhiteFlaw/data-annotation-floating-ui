<template>
  <el-dialog :visible="visible" :title="title" width="480px" top="10vh" append-to-body destroy-on-close @open="initLogDialog" @close="closeDialog">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>
<script>
import { getTaskLog } from '@/api/projectManagement'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: Number,
      default: 0
    },
    taskName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '',
      taskInfo: {},
      activities: []
    }
  },
  methods: {
    async initLogDialog() {
      this.title = ` 任务：${this.taskName}(${this.taskId}) - 操作日志`
      const res = await getTaskLog(this.taskId)
      if (res.success) {
        this.taskInfo = { ...res.data }
        this.activities = [
          {
            content: '项目创建',
            timestamp: this.taskInfo.createdTime
          },
          {
            content: `${this.taskInfo.name} 任务开始(标注员：${this.taskInfo.userNickname})`,
            timestamp: this.taskInfo.startTime
          },
          {
            content: `${this.taskInfo.name} 标注完成(标注员：${this.taskInfo.userNickname})`,
            timestamp: this.taskInfo.endTime
          },
          {
            content: `${this.taskInfo.name} 一检结束(质检员：${this.taskInfo.checkUserNickname})`,
            timestamp: this.taskInfo.checkTime
          },
          {
            content: `${this.taskInfo.name} 二检结束(质检员：${this.taskInfo.recheckUserNickname})`,
            timestamp: this.taskInfo.recheckTime
          }

        ]
      } else {
        this.$message.error(res.msg)
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped></style>
