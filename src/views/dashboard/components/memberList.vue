<!--
* @FileDescription: 工作台-成员列表
* @Author: Gu Xunqin
* @Date: 2023-04-25
-->
<template>
  <el-table
    v-loading="tableLoading"
    :data="tableData"
    border
    stripe
    highlight-current-row
    :max-height="tableMaxHeight"
    class="member-list-table"
  >
    <el-table-column header-align="center" prop="userNickName" label="成员名称" />
    <el-table-column header-align="center" prop="userRole" label="角色" />
    <el-table-column header-align="center" label="工作量">
      <template slot-scope="scope">
        <p v-show="scope.row.userRole === '标注员' || scope.row.userRole === '团队管理员'">标注数量 ： {{ scope.row.tagCount }}</p>
        <p v-show="scope.row.userRole === '质检员' || scope.row.userRole === '团队管理员'">一检数量 ： {{ scope.row.checkCount }}</p>
        <p v-show="scope.row.userRole === '质检员' || scope.row.userRole === '团队管理员'">二检数量 ： {{ scope.row.recheckCount }}</p>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button type="text" @click="updateRole(scope.row)">修改角色</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import tableMixin from '@/utils/tableMixin'

export default {
  name: 'MemberList',
  mixins: [tableMixin],
  props: {
    tableLoading: {
      default: false,
      type: Boolean
    },
    tableData: {
      default: () => [],
      type: Array
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    initPageData() { // 初始化
      this.getTableMaxHeight()
    },
    updateRole(val) { // 修改角色
      this.$emit('update-role', true, val)
    }
  }
}
</script>

<style scoped lang="scss">
.member-list-table{
  .el-table__body-wrapper{
    .el-table__body tbody{
      tr td {
        p{
          margin: 0;
        }
      }
    }
  }
}
</style>
