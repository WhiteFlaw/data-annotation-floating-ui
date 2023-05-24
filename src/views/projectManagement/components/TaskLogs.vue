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
            content: `任务${this.taskInfo.userNickname ? `开始(标注员：${this.taskInfo.userNickname})` : '未被领取'}`,
            timestamp: this.taskInfo.startTime
          },
          {
            content: `标注${this.taskInfo.userNickname ? `完成(标注员：${this.taskInfo.userNickname})` : '未完成'}`,
            timestamp: this.taskInfo.endTime
          },
          {
            content: `一检${this.taskInfo.checkUserNickname && this.taskInfo.checkStartTime ? `开始(质检员：${this.taskInfo.checkUserNickname})` : '未开始'}`,
            timestamp: this.taskInfo.checkStartTime
          },
          {
            content: `一检${this.taskInfo.checkUserNickname && this.taskInfo.checkTime ? `结束(质检员：${this.taskInfo.checkUserNickname})` : `${this.taskInfo.checkStartTime ? '未结束' : '未开始'}`}`,
            timestamp: this.taskInfo.checkTime
          },
          {
            content: `二检${this.taskInfo.recheckUserNickname && this.taskInfo.recheckStartTime ? `开始(质检员：${this.taskInfo.recheckUserNickname})` : '未开始'}`,
            timestamp: this.taskInfo.recheckStartTime
          },
          {
            content: `二检${this.taskInfo.recheckUserNickname && this.taskInfo.recheckTime ? `结束(质检员：${this.taskInfo.checkUserNickname})` : `${this.taskInfo.recheckStartTime ? '未结束' : '未开始'}`}`,
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
