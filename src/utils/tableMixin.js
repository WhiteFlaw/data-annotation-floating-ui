export default {
  data() {
    return {
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      tableMaxHeight: 0
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizedHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizedHeight)
  },
  methods: {
    // 页面尺寸变化时重新获取
    resizedHeight() {
      this.getTableMaxHeight()
    },
    // 获取table最大高度
    getTableMaxHeight(hasTab = false) {
      this.$nextTick(() => {
        const pageContentBoxHeight = document.getElementById('page-content-area').offsetHeight
        this.tableMaxHeight = !hasTab ? pageContentBoxHeight - 42 : pageContentBoxHeight - 42 - 56
      })
    }
  }
}
