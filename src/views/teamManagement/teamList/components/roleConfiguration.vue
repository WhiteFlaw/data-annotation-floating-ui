<!--
* @FileDescription: 团队管理-团队列表-修改角色
* @Author: Gu Xunqin
* @Date: 2023-03-28
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
      <span class="user-name">{{ formData.nickName }}</span><!--昵称-->
      <span>{{ formData.email }}</span><!--邮箱-->
    </div>
    <el-divider />
    <div class="checkbox-div">
      <span>角色:</span>
      <el-radio-group v-model="formData.roleId">
        <el-radio v-for="item in teamRole" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
      </el-radio-group>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="updateUserRole">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import {addOrUpdateUserData} from '@/api/teamList'

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
    },
    teamRole: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
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
    this.formData = {...this.rowData}
    this.formData.roleId = String(this.formData.roleId)
    this.teamRole.forEach(item => {
      item.id = String(item.id)
    })
  },
  methods: {
    updateUserRole() { // 修改用户角色
      addOrUpdateUserData([{...this.formData, roleId: Number(this.formData.roleId)}]).then(res => {
        if (res.msg === 'success') {
          this.$message.success('操作成功！')
          this.$emit('search-data-list')
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
  .user-name {
    font-weight: bold;
  }
}
.checkbox-div{
  display: flex;
  .el-radio-group {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
