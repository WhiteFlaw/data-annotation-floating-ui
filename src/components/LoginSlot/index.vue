<!--
* @FileDescription:登录页面插槽
* @Author: Gu Xunqin
* @Date: 2023-05-04
-->
<template>
  <div class="login-container">
    <div class="box">
      <header><!--头部logo-->
        <img alt="" srcset="../../assets/images/ytxgkLog.png" src="../../assets/images/ytxgkLog.png">
      </header>
      <main>
        <div class="log-box">
          <slot name="login" /><!--登录部分-->
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginSlot'
}
</script>

<style lang="scss" scoped>
@import "src/views/login/login";
</style>
