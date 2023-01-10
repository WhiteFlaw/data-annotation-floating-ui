<template>
  <div class="dashboard-container">
    {{ name }}
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.container {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
