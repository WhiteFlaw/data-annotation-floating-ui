<template>
  <section class="page-container">
    <header id="page-title" class="page-title">
      <item :icon="titleIcon" :title="pageTitle" />
    </header>
    <section v-if="hasSearch" id="page-search-area" class="page-search-area">
      <slot name="search" />
    </section>
    <section
      id="page-content-area"
      class="page-content-area"
      :class="{ 'overflow-y-auto': isScrollY }">
      <slot name="content" />
    </section>
  </section>
</template>

<script>
import Item from '@/layout/components/Sidebar/Item.vue'
export default {
  name: 'PageContainer',
  components: {
    Item
  },
  props: {
    hasSearch: { // 是否启用查询区域
      type: Boolean,
      default: false
    },
    isScrollY: { // 内容区域是否需要纵向滚动，用作表格容器不需要，用作其他内容容器时，按需
      type: Boolean,
      default: false
    }
  },
  computed: {
    titleIcon() {
      return this.$route.meta.icon || 'page-common'
    },
    pageTitle() {
      return this.$route.meta.title
    }
  }
}
</script>

<style></style>
