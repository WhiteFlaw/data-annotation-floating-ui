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
    resizedHeight() {
      this.getTableMaxHeight()
    },
    getTableMaxHeight() {
      this.$nextTick(() => {
        const pageContentBoxHeight =
          document.getElementById('page-content-area').offsetHeight
        this.tableMaxHeight = pageContentBoxHeight - 42
      })
    }
  }
}
