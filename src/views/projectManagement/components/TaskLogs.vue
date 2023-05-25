<template>
  <el-dialog :close-on-click-modal="false" :visible="visible" :title="title" width="480px" top="10vh" append-to-body destroy-on-close @open="initLogDialog" @close="closeDialog">
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
            content: this.changeActivities(this.taskInfo, 0),
            timestamp: this.taskInfo.startTime
          },
          {
            content: this.changeActivities(this.taskInfo, 1),
            timestamp: this.taskInfo.endTime
          },
          {
            content: this.changeActivities(this.taskInfo, 2),
            timestamp: this.taskInfo.checkStartTime
          },
          {
            content: this.changeActivities(this.taskInfo, 3),
            timestamp: this.taskInfo.checkTime
          },
          {
            content: this.changeActivities(this.taskInfo, 4),
            timestamp: this.taskInfo.recheckStartTime
          },
          {
            content: this.changeActivities(this.taskInfo, 5),
            timestamp: this.taskInfo.recheckTime
          }
        ]
      } else {
        this.$message.error(res.msg)
      }
    },
    closeDialog() {
      this.$emit('update:visible', false)
    },
    changeActivities(val, qualityInspection) {
      let content
      if (qualityInspection === 0) {
        if (val.status === 0) {
          content = '任务未领取'
        }
        if (val.startTime) {
          content = `任务开始(标注员：${val.userNickname})`
        }
      }
      if (qualityInspection === 1) {
        if (val.status === 0) {
          content = '任务未领取'
        } else if (val.status === 1) {
          if (val.endTime) {
            content = `任务完成(标注员：${val.userNickname})`
          } else {
            content = `任务进行中(标注员：${val.userNickname})`
          }
        } else {
          content = `任务完成(标注员：${val.userNickname})`
        }
      }
      if (qualityInspection === 2) {
        if (val.status === 2) {
          if (val.checkUserId) {
            content = `一检开始(质检员：${val.checkUserNickname})`
          } else {
            content = '一检未被领取'
          }
        } else if (val.status === 0 || val.status === 1) {
          content = '一检未被领取'
        } else {
          content = `一检开始(质检员：${val.checkUserNickname})`
        }
      }
      if (qualityInspection === 3) {
        if (val.status === 4) {
          if (!val.recheckUserId) {
            content = `一检驳回(质检员：${val.checkUserNickname})`
          } else {
            content = `一检完成(质检员：${val.checkUserNickname})`
          }
        } else if (val.status === 2) {
          if (val.checkUserId) {
            if (val.checkTime) {
              content = `一检完成(质检员：${val.checkUserNickname})`
            } else {
              content = `一检进行中(质检员：${val.checkUserNickname})`
            }
          } else {
            content = '一检未被领取'
          }
        } else if (val.status === 0 || val.status === 1 || val.status === 5) {
          content = '一检未被领取'
        } else if (val.status === 8) {
          content = '验收驳回'
        } else {
          content = `一检完成(质检员：${val.checkUserNickname})`
        }
      }
      if (qualityInspection === 4) {
        if (val.status === 0 || val.status === 1 || val.status === 2 || val.status === 4 || val.status === 5 || val.status === 8) {
          content = '二检未被领取'
        }
        if (val.status === 4 && val.recheckUserId) {
          content = `二检开始(质检员：${val.recheckUserNickname})`
        }
        if (val.status === 3) {
          if (val.recheckUserId) {
            if (val.recheckStartTime) {
              content = `二检开始(质检员：${val.recheckUserNickname})`
            } else {
              content = '二检未被领取'
            }
          } else {
            content = '二检未被领取'
          }
        }
        if (val.status === 6 || val.status === 7) {
          content = `二检开始(质检员：${val.recheckUserNickname})`
        }
      }
      if (qualityInspection === 5) {
        if (val.status === 4 && val.recheckUserId) {
          content = `二检驳回(质检员：${val.recheckUserNickname})`
        } else if (val.status === 6 || val.status === 7) {
          content = `二检完成(质检员：${val.recheckUserNickname})`
        } else if (val.status === 0 || val.status === 1 || val.status === 2 || val.status === 8 || val.status === 5 || val.status === 4) {
          content = '二检未被领取'
        } else if (val.status === 3) {
          if (val.recheckUserId) {
            if (val.recheckTime) {
              content = `二检完成(质检员：${val.recheckUserNickname})`
            } else {
              content = `二检进行中(质检员：${val.recheckUserNickname})`
            }
          } else {
            content = '二检未被领取'
          }
        }
      }
      return content
    }
  }
}
</script>
<style lang="scss" scoped></style>
