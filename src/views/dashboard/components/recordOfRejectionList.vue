<!--
* @FileDescription: 工作台-驳回记录
* @Author: Gu Xunqin
* @Date: 2023-06-12
-->
<template>
  <el-table
    v-loading="tableLoading"
    :data="tableData"
    border
    stripe
    highlight-current-row
    :max-height="tableMaxHeight"
  >
    <el-table-column align="center" prop="id" label="任务ID" min-width="150" />
    <el-table-column align="center" prop="name" label="任务名称" min-width="150" />
    <el-table-column prop="userNickname" align="center" label="标注员" min-width="100" />
    <el-table-column prop="checkUserNickname" align="center" label="一检员" min-width="100" />
    <el-table-column v-if="taskStatus === '4' || taskStatus === ''" prop="checkRejectCount" align="center" label="一检驳回次数" min-width="100" />
    <el-table-column v-if="taskStatus === '8' || taskStatus === ''" prop="recheckUserNickname" align="center" label="二检员" min-width="100" />
    <el-table-column v-if="taskStatus === '8' || taskStatus === ''" prop="acceptRejectCount" align="center" label="验收驳回次数" min-width="100" />
  </el-table>
</template>

<script>
import tableMixin from '@/utils/tableMixin'

export default {
  name: 'RecordOfRejectionList',
  mixins: [tableMixin],
  props: {
    tableLoading: {
      default: false,
      type: Boolean
    },
    tableData: {
      default: () => [],
      type: Array
    },
    rowData: {
      default: () => {},
      type: Object
    },
    taskStatus: {
      default: '',
      type: String
    }
  },
  mounted() {
    this.initPageData()
  },
  methods: {
    initPageData() { // 初始化
      this.getTableMaxHeight(true)
    }
  }
}
</script>

<style scoped>

</style>
