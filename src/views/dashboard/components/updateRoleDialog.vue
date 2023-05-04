<!--
* @FileDescription: 工作台-成员列表-修改角色
* @Author: Gu Xunqin
* @Date: 2023-04-26
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="修改角色"
    width="300px"
    :close-on-click-modal="false"
    destroy-on-close
    class="el-dialog-border"
    append-to-body
  >
    <div class="title-div">
      <i class="el-icon-user" />
      <span>{{ formData.userNickName }}</span><!--昵称-->
      <span>所属团队：{{ formData.teamName }}</span>
    </div>
    <el-divider />
    <div class="radio-div">
      <span>角色:</span>
      <el-radio-group v-if="formData.userRoleId !== '3' && status === 0" v-model="formData.userRoleId">
        <el-radio v-for="item in teamRole" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
      </el-radio-group>
      <span v-else-if="formData.userRoleId === '3' && status === 0">团队管理员</span>
      <span v-else>{{ formData.userRole }}</span>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :disabled="status !== 0" @click="updateTeamRole">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {configurationUserData, getUserRole} from '@/api/userManagement'

export default {
  name: 'UpdateRoleDialog',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    rowData: {
      default: () => {},
      type: Object
    },
    teamId: {
      default: '',
      type: String
    },
    status: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      teamRole: [],
      formData: {}
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
    this.formData = {...this.rowData, userRoleId: String(this.rowData.userRoleId)}
    this.searchUserRole()
  },
  methods: {
    async searchUserRole() { // 查询角色
      if (this.status === 0 && this.formData.userRoleId !== '3') {
        const res = await getUserRole(Number(this.teamId)) // 根据团队id获取角色配置
        res.data.forEach(item => {
          item.id = String(item.id)
        })
        this.teamRole = res.data
      }
    },
    updateTeamRole() { // 更改角色
      const updateRole = {
        id: this.formData.relRoleUserId,
        roleId: Number(this.formData.userRoleId),
        teamId: Number(this.teamId),
        userId: this.formData.userId
      }
      configurationUserData(updateRole).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.$emit('search-data', this.teamId)
          this.dialogVisible = false
        } else {
          this.$message.error('操作失败！')
        }
      })
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
  span {
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
