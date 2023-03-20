<template>
  <section class="btn-container">
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
  </section>
</template>
<script>
export default {
  name: 'HomePageSelection',
  methods: {
    selectMark(val) { // 点击图片触发事件
      console.log(val)
      // TODO 根据选择入口不同跳转不同对页面
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped lang="scss">
.btn-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .btn-bg {
    cursor: pointer;
    background: no-repeat url("../../assets/images/annotatedBackground.png");
    background-size: cover;
    width: 360px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;

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
