<template>
  <section class="page-container">
    <header class="page-title">
      <item
        :icon="titleIcon"
        :title="pageTitle"
      />
    </header>
    <section
      v-if="hasSearch"
      class="page-search-area"
    >
      <slot name="search" />
    </section>
    <section class="page-content-area">
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
    hasSearch: {
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
