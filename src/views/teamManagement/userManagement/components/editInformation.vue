<!--
* @FileDescription: 团队管理-用户管理-编辑成员信息
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="编辑成员信息"
    :close-on-click-modal="false"
    destroy-on-close
    width="760px"
    class="el-dialog-border"
  >
    <el-form inline label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="性别">
            <el-radio-group v-model="memberData.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="年龄">
            <el-radio-group v-model="memberData.age">
              <el-radio :label="1">20岁及以下</el-radio>
              <el-radio :label="2">21-25岁</el-radio>
              <el-radio :label="3">26-30岁</el-radio>
              <el-radio :label="4">31-35岁</el-radio>
              <el-radio :label="5">36岁及以上</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="学历">
            <el-radio-group v-model="memberData.education">
              <el-radio :label="1">中专</el-radio>
              <el-radio :label="2">大专</el-radio>
              <el-radio :label="3">本科</el-radio>
              <el-radio :label="4">硕士</el-radio>
              <el-radio :label="5">博士</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="社会工龄">
            <el-radio-group v-model="memberData.socialSeniority">
              <el-radio :label="1">0-5年</el-radio>
              <el-radio :label="2">6-10年</el-radio>
              <el-radio :label="3">10年以上</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注工龄">
            <el-input-number v-model="memberData.labelSeniority" :min="0" :max="99" /> 年
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注项目经验">
            <el-radio-group v-model="memberData.labelProExp">
              <el-radio :label="1">文本类标注经验</el-radio>
              <el-radio :label="2">图片类标注经验</el-radio>
              <el-radio :label="3">视频类标注经验</el-radio>
              <el-radio :label="4">音频类标注经验</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="英语水平">
            <el-radio-group v-model="memberData.englishLevel">
              <el-radio :label="0">无</el-radio>
              <el-radio :label="1">CET-4</el-radio>
              <el-radio :label="2">CET-6</el-radio>
              <el-radio :label="3">专4</el-radio>
              <el-radio :label="4">专8</el-radio>
              <el-radio :label="5">托福</el-radio>
              <el-radio :label="6">雅思</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :disabled="rowData.status === 1" @click="updateData">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {updateUserData} from '@/api/userManagement'

export default {
  name: 'EditInformation',
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
      updateLoading: false,
      memberData: {
        gender: '',
        age: '',
        education: '',
        socialSeniority: '',
        labelSeniority: '',
        labelProExp: '',
        nonLabelledProExp: '',
        englishLevel: ''
      }
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
    this.memberData = {...this.rowData}
  },
  methods: {
    updateData() { // 修改信息
      this.updateLoading = true
      updateUserData(this.memberData).then(res => {
        this.updateLoading = false
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.$emit('update-success')
          this.dialogVisible = false
        } else {
          this.$message.error('操作失败！')
        }
      }).catch(() => {
        this.updateLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .el-input-number {
    .el-input .el-input__inner{
      text-align: left;
    }
  }
}

</style>
