<!--
* @FileDescription: 我的任务-项目列表
* @Author: guo hongwei
* @Date: 2023-04-07
-->
<template>
  <PageContainer has-search>
    <div slot="search">
      <el-form inline>
        <el-form-item label="项目名称：">
          <el-input v-model="queryCondition.name" placeholder="输入任务名称进行搜索" />
        </el-form-item>
        <el-form-item label="项目状态：">
          <el-select v-model="queryCondition.status">
            <el-option :value="0" label="全部" />
            <el-option :value="1" label="进行中" />
            <el-option :value="2" label="验收中" />
            <el-option :value="3" label="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型：">
          <el-select v-model="queryCondition.type">
            <el-option :value="0" label="全部" />
            <el-option :value="1" label="2D" />
            <el-option :value="2" label="3D" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handleFiltrate">筛选</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div slot="content">
      <!--      表格列字段名待调整-->
      <el-table
        :data="tableData"
        style="width: 100%"
        :max-height="tableMaxHeight"
        border
        stripe
        highlight-current-row
      >
        <el-table-column prop="id" label="项目编号" min-width="180" align="center" />
        <el-table-column prop="name" label="项目名称" min-width="180" align="center" />
        <el-table-column prop="type" label="项目类型" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '2D' : '3D' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="项目状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="handleStatus(scope.row.status, 'type')">{{ handleStatus(scope.row.status, 'value') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="toBeClaimedCount" label="待领取" min-width="100" align="center" />
        <el-table-column label="我的标注" align="center">
          <el-table-column prop="toBeRepairedCount" label="待返修" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.toBeRepairedCount||0 }}
            </template>
          </el-table-column>
          <el-table-column prop="annotatedCount" label="标注中" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.annotatedCount||0 }}
            </template>
          </el-table-column>
          <el-table-column prop="markedCount" label="已标注" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.markedCount||0 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationComponent v-if="total" :page-index="queryCondition.pageIndex" :page-size="queryCondition.pageSize" :total="total" @pagination="handlePage" />
    </div>
  </PageContainer>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent'
import PageContainer from '@/components/PageContainer'
import {getProjectList} from '@/api/task'
import tableMixin from '@/utils/tableMixin'
export default {
  name: 'TaggingTask',
  components: {
    PaginationComponent,
    PageContainer
  },
  mixins: [tableMixin],
  data() {
    return {
      tableData: [],
      queryCondition: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        status: 0,
        type: 0,
        distinction: 0
      },
      total: 0
    }
  },
  mounted() {
    this.initPageData()
    this.handleFiltrate()
  },
  methods: {
    initPageData() {
      this.getTableMaxHeight()
    },
    // 筛选按钮
    handleFiltrate() {
      this.queryCondition.pageIndex = 1
      this.queryCondition.pageSize = 20
      this.handlePage()
    },
    // 筛选分页
    handlePage() {
      getProjectList(this.queryCondition).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    // 处理表格项目状态列数据
    handleStatus(val, sort) {
      let value = ''
      let type = ''
      if (val === 0) {
        value = '未领取'
        type = ''
      } else if (val === 1) {
        value = '进行中'
        type = ''
      } else if (val === 2) {
        value = '验收中'
        type = ''
      } else if (val === 3) {
        value = '已完成'
        type = 'success'
      }
      if (sort === 'value') {
        return value
      } else {
        return type
      }
    },
    // 重置
    handleReset() {
      this.queryCondition = this.$options.data().queryCondition
      this.handleFiltrate()
    },
    // 点击详情按钮
    handleDetail(info) {
      this.$router.push({name: 'taskDetail', params: {
        projectId: info.id
      }})
    }
  }
}
</script>

<style scoped lang="scss">
</style>
