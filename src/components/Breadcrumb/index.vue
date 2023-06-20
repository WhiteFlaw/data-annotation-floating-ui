<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      // let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: '标注平台' }}].concat(matched)
      // }

      this.levelList = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      if (this.levelList.length > 1 && this.levelList[1].name === 'jobDetailForAdmin') {
        this.levelList.splice(1, 0, {
          path: `/project-management/details`,
          name: 'ProjectManagementDetails',
          meta: {
            title: '项目详情'
          }
        })
      }
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path, name) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = pathToRegexp.compile(path)
      let compiledPath = null
      if (name === 'ProjectManagementDetails') {
        compiledPath = `${path}?id=${params.projectId}`
      } else {
        compiledPath = toPath(params)
      }

      return compiledPath
    },
    handleLink(item) {
      const { redirect, path, name } = item
      if (redirect) {
        if (redirect === '/myTask/taggingTask' && this.roles.indexOf('tagger') === -1 && this.roles.indexOf('teamLeader') === -1) {
          // 如果角色不包含是标注员
          this.$router.push(this.getRedirect('/myTask/roundOfInspection'))
        } else {
          this.$router.push(this.getRedirect(redirect))
        }
      } else {
        if (name !== 'dataStatistics') {
          this.$router.push(this.pathCompile(path, name))
        }
      }
    },
    getRedirect(path) {
      const startPos = path.indexOf(':')
      if (startPos !== -1) {
        const endPos = path.indexOf('/', startPos)
        const key = path.substring(startPos + 1, endPos)
        path = path.replace(':' + key, this.$route.params[key])
      }
      return path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
