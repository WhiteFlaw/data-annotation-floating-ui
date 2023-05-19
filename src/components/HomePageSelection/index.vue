<template>
  <login-slot>
    <template slot="login">
      <div class="btn-container">
        <div class="btn-bg" @click="selectMark('2')">
          <div class="btn-wrapper">
            <img
              alt=""
              srcset="../../assets/images/2DMark.png"
              src="../../assets/images/2DMark.png">
            <div class="text-class">2D标注</div>
          </div>
        </div>
        <div class="btn-bg" @click="selectMark('3')">
          <div class="btn-wrapper">
            <img
              alt=""
              srcset="../../assets/images/3DMark.png"
              src="../../assets/images/3DMark.png">
            <div class="text-class">3D标注</div>
          </div>
        </div>
      </div>
    </template>
  </login-slot>
</template>
<script>
import {mapGetters} from 'vuex'
import LoginSlot from '@/components/LoginSlot'

export default {
  name: 'HomePageSelection',
  components: {LoginSlot},
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  mounted() {
    // 返回监听
    if (window.history && window.history.pushState) {
      if (window.history.length > 1) {
        const state = {
          key: Math.random() * new Date().getTime()
        }
        window.history.pushState(state, null, document.URL)
      }
      window.addEventListener('popstate', this.backFn, false)
    }
  },
  methods: {
    backFn() {
      // 返回执行逻辑 此处还可以添加对话框
      const state = {
        key: Math.random() * new Date().getTime()
      }
      window.history.pushState(state, null, document.URL)
    },
    destroyed() {
      // 销毁监听
      window.removeEventListener('popstate', this.backFn, false)
    },
    selectMark(val) { // 点击图片触发事件
      // TODO 根据选择入口不同跳转不同对页面
      console.log(val)
      if (this.roles.indexOf('admin') !== -1) {
        this.$router.push({name: 'DataManagement'})
      } else if ((this.roles.indexOf('manager') !== -1 || this.roles.indexOf('teamLeader') !== -1) && this.roles.indexOf('admin') === -1) {
        this.$router.push({name: 'Dashboard'})
      } else if (this.roles.indexOf('tagger') !== -1) {
        this.$router.push({name: 'AnnotatedItemList'})
      } else if (this.roles.indexOf('qc') !== -1) {
        this.$router.push({name: 'ItemList'})
      } else if (this.roles.indexOf('at') !== -1) {
        this.$router.push({name: 'ProjectList'})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  .btn-bg {
    cursor: pointer;
    background: no-repeat url("../../assets/images/annotatedBackground.png");
    background-size: cover;
    width: 360px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1366px) {
      width:300px;
      background-size:100% 100%;
    }

    .btn-wrapper {
      display: flex;
      align-items: center;

      .text-class {
        margin-left: 11px;
        font-size: 40px;
        font-weight: bold;
        color: #FFFFFF;
        opacity: 1;
      }
    }
  }

}

</style>
