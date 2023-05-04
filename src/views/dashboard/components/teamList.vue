<!--
* @FileDescription: 工作台-团队列表
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
    class="team-list-table"
  >
    <el-table-column prop="teamName" label="团队名称" min-width="100" />
    <el-table-column prop="teamLeaders" label="团队管理员" min-width="150px" />
    <el-table-column align="center" prop="teamStatus" label="团队是否有效" min-width="50px">
      <template slot-scope="scope">
        {{ scope.row.teamStatus === 1 ? '无效' : '有效' }}
      </template>
    </el-table-column>
    <el-table-column label="进度" min-width="150px">
      <template slot-scope="scope">
        <p>标注数量 ： {{ scope.row.tagCount }}</p>
        <p>一检数量 ： {{ scope.row.checkCount }}</p>
        <p>二检数量 ： {{ scope.row.recheckCount }}</p>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import tableMixin from '@/utils/tableMixin'

export default {
  name: 'TeamList',
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
    }
  }
}
</script>

<style scoped lang="scss">
.team-list-table{
  .el-table__body-wrapper{
    .el-table__body tbody{
      tr td {
        min-height: 94px;
        p{
          margin: 0;
        }
      }
    }
  }
}
</style>
