<!--
* @FileDescription: 团队管理-团队列表-查看成员信息
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="查看成员信息"
    :close-on-click-modal="false"
    destroy-on-close
    width="760px"
    class="el-dialog-border"
    append-to-body
  >
    <el-form inline label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="性别">
            <span>{{ sex[detailedInformation.gender] }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="年龄">
            <span>{{ age[detailedInformation.age] }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="学历">
            <span>{{ educationalBackground[detailedInformation.education] }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="社会工龄">
            <span>{{ socialSeniority[detailedInformation.socialSeniority] }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注工龄">
            <span>{{ detailedInformation.labelSeniority +' 年' }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注项目经验">
            <span>{{ labelProjectExperience[detailedInformation.labelProExp] }}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="英语水平">
            <span>{{ englishLevel[detailedInformation.englishLevel] }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {queryDetailedInformation} from '@/api/teamList'
import {USER_INFO_CONSTANT} from '@/utils/constant'
export default {
  name: 'EditInformation',
  mixins: [USER_INFO_CONSTANT],
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    rowData: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      detailedInformation: {}, // 接收用户详细信息
      ...USER_INFO_CONSTANT
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(newVal) {
        return this.$emit('update:visible', newVal)
      }
    }
  },
  mounted() {
    // 查询人员详细信息
    queryDetailedInformation({teamId: this.rowData.teamId, userId: this.rowData.userId}).then(res => {
      this.detailedInformation = res.data
    })
  }
}
</script>

<style scoped lang="scss">
.el-dialog-border {
  .el-dialog__body{
    .el-form{
      .el-row{
        .el-col{
          span{
            font-size: 15px;
            color: #99a9bf;
          }
        }
      }
    }
  }
}
</style>
