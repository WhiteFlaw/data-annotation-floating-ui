<!--
* @FileDescription: 团队管理-用户管理-新增用户信息
* @Author: Gu Xunqin
* @Date: 2023-04-14
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="新增成员信息"
    :close-on-click-modal="false"
    destroy-on-close
    top="5vh"
    class="el-dialog-border"
    width="800px"
  >
    <el-form ref="addUserForm" :model="addUserData" class="add-user-form" inline label-width="100px" :rules="addUserRules">
      <el-row>
        <el-col>
          <el-form-item label="账号" prop="name">
            <el-input
              v-model="addUserData.name"
              clearable
              @input="addUserData.name=inputRestriction(addUserData.name, '',true, true)"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addUserData.password"
              clearable
              show-password
              @input="addUserData.password = inputRestriction(addUserData.password, '', true, true)"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="成员名称" prop="nickname">
            <el-input v-model="addUserData.nickname" clearable />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="成员邮箱" prop="email">
            <el-input
              v-model="addUserData.email"
              clearable
              @input="addUserData.email=inputRestriction(addUserData.email,'',true)"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="性别">
            <el-radio-group v-model="addUserData.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="年龄">
            <el-radio-group v-model="addUserData.age">
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
            <el-radio-group v-model="addUserData.education">
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
            <el-radio-group v-model="addUserData.socialSeniority">
              <el-radio :label="1">0-5年</el-radio>
              <el-radio :label="2">6-10年</el-radio>
              <el-radio :label="3">10年以上</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注工龄">
            <el-input-number v-model="addUserData.labelSeniority" :min="0" :max="99" /> 年
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="标注项目经验">
            <el-radio-group v-model="addUserData.labelProExp">
              <el-radio :label="1">文本类标注经验</el-radio>
              <el-radio :label="2">图片类标注经验</el-radio>
              <el-radio :label="3">视频类标注经验</el-radio>
              <el-radio :label="4">音频类标注经验</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="英语水平">
            <el-radio-group v-model="addUserData.englishLevel">
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
      <el-button type="primary" :loading="addUserLoading" @click="confirmTheAddition">确定</el-button>
      <el-button type="primary" @click="newAddUser">添加并添加下一个</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addUserManagement} from '@/api/userManagement'
import {inputRestriction} from '@/utils/total'

export default {
  name: 'AddUserInformation',
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      addUserLoading: false,
      addUserData: {
        email: '', // 邮箱
        age: 0, // 年龄
        education: 0, // 学历
        englishLevel: 0, // 英语水平
        gender: 0, // 性别
        labelProExp: 0, // 标注项目经验
        labelSeniority: 0, //	标注工龄
        name: '', // 账号
        nickname: '', // 昵称
        password: '', // 密码
        socialSeniority: 0 // 社会工龄
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
    },
    addUserRules() {
      const name = (rule, value, callback) => {
        if (!value) {
          callback('账号不能为空')
        } else {
          callback()
        }
      }
      const password = (rule, value, callback) => {
        if (!value) {
          callback('密码不能为空')
        } else {
          callback()
        }
      }
      const nickname = (rule, value, callback) => {
        if (!value) {
          callback('成员名称不能为空')
        } else {
          callback()
        }
      }
      const email = (rule, value, callback) => {
        if (!value) {
          callback('邮箱不能为空')
        } else {
          callback()
        }
      }
      return {
        name: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: password, trigger: 'blur' }
        ],
        nickname: [
          { required: true, validator: nickname, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: email, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    inputRestriction,
    confirmTheAddition() { // 新增确定
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          this.addUserLoading = true
          addUserManagement(this.addUserData).then(res => {
            this.addUserLoading = false
            if (res.msg === '用户添加成功') {
              this.$message.success(res.msg)
              this.$emit('search-data')
              this.dialogVisible = false
            }
          }).catch(() => {
            this.addUserLoading = false
          })
        }
      })
    },
    newAddUser() { // 添加并新增下一个用户
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          this.addUserLoading = true
          addUserManagement(this.addUserData).then(res => {
            this.addUserLoading = false
            if (res.msg === '用户添加成功') {
              this.$message.success(res.msg)
              this.$emit('search-data')
              this.addUserData = {
                email: '', // 邮箱
                age: 0, // 年龄
                education: 0, // 学历
                englishLevel: 0, // 英语水平
                gender: 0, // 性别
                labelProExp: 0, // 标注项目经验
                labelSeniority: 0, //	标注工龄
                name: '', // 账号
                nickname: '', // 昵称
                password: '', // 密码
                socialSeniority: 0 // 社会工龄
              }
            }
          }).catch(() => {
            this.addUserLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .add-user-form{
  .el-row .el-col .el-form-item {
    margin-bottom: 16px;
    width: 100%;
    .el-form-item__content{
      width: calc(100% - 100px);
      .el-input{
        width: 100%;
        ::-ms-reveal {
          width: 0;
          height: 0;
        }
        .el-input__inner {
          width: 100%;
        }
      }
      .el-form-item__error{
        top: 95%;
      }
    }
  }
}
</style>
