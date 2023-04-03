<!--
* @FileDescription: 团队管理-用户管理-成员角色配置
* @Author: Gu Xunqin
* @Date: 2023-03-28
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="成员角色配置"
    width="300px"
    :close-on-click-modal="false"
    destroy-on-close
    class="el-dialog-border"
  >
    <div class="title-div">
      <i class="el-icon-user" />
      <span class="user-name">{{ rowData.nickname }}</span><!--昵称-->
      <span>{{ rowData.email }}</span><!--邮箱-->
    </div>
    <el-divider />
    <div class="radio-div">
      <span>角色:</span>
      <el-radio-group v-model="roleId">
        <el-radio :label="2">项目经理</el-radio>
        <el-radio :label="0">普通用户</el-radio>
      </el-radio-group>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="uploadLoading" @click="updateData">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {
  configurationUserData,
  deleteUserRoleData,
  queryUserRole
} from '@/api/userManagement'

export default {
  name: 'RoleConfiguration',
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
      id: '', // 存放角色的id
      uploadLoading: false,
      roleId: 0,
      storeUserRoleData: [], // 储存用户角色信息
      userRoleList: [] // 角色配置列表
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
  async mounted() {
    const result = await queryUserRole(this.rowData.id)
    const userRoleList = []
    result.data.forEach(item => {
      userRoleList.push(item.roleId)
    })
    this.roleId = userRoleList.indexOf(2) !== -1 ? 2 : 0
    const position = userRoleList.indexOf(2)
    this.id = position !== -1 ? result.data[position].id : ''
  },
  methods: {
    updateData() { // 配置用户角色
      this.uploadLoading = true
      if (this.roleId) {
        const updateObject = {
          roleId: this.roleId,
          userId: this.rowData.id,
          createdTime: this.rowData.createdTime,
          deleted: this.rowData.deleted
        }
        configurationUserData(updateObject).then(res => {
          this.uploadLoading = false
          if (res.msg === 'success') {
            this.$message.success('操作成功！')
            this.$emit('update-success')
            this.dialogVisible = false
          } else {
            this.$message.error('操作失败！')
          }
        }).catch(() => {
          this.uploadLoading = false
        })
      } else {
        const updateObject = {
          id: this.id,
          roleId: this.roleId,
          userId: this.rowData.id,
          createdTime: this.rowData.createdTime,
          deleted: this.rowData.deleted
        }
        deleteUserRoleData(updateObject).then(res => {
          this.uploadLoading = false
          if (res.msg === 'success') {
            this.$message.success('操作成功！')
            this.$emit('update-success')
          } else {
            this.$message.error('操作失败！')
          }
        }).catch(() => {
          this.uploadLoading = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.title-div{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
  width: 100%;
  justify-content: space-around;
  .el-icon-user {
    font-size: 80px;
    border-radius: 45px;
    border: 4px solid #606266;
  }
  .user-name {
    font-weight: bold;
  }
}
.radio-div{
  display: flex;
  .el-radio-group {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
