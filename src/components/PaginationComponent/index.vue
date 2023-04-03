<template>
  <el-pagination
    background
    :total="total"
    :current-page="pageIndex"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :layout="layout"
    @size-change="changeSizes"
    @current-change="changePage" />
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      changeData: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    pageSizes() {
      const sizes = [10, 15, 20, 30, 50, 100]
      if (this.total) sizes.push(this.total)
      return sizes
    }
  },
  watch: {
    changeData: {
      handler(newVal) {
        this.$emit('pagination', { ...newVal })
      },
      deep: true
    }
  },
  methods: {
    // 页面条目数量切换
    changeSizes(limit) {
      this.changeData.limit = limit
    },
    // 切换页码
    changePage(page) {
      this.changeData.page = page
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination{
  margin-top:10px;
  text-align: right;
}
</style>
