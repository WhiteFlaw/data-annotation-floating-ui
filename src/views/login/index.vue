<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
      <div class="box">
        <header>
          <img srcset="../../assets/images/ytxgkLog.png, ../../assets/images/ytxgkLog2.png 2x" src="../../assets/images/ytxgkLog.png">
        </header>
        <main>
          <img class="imgFirst" srcset="../../assets/images/backgroundImg.png, ../../assets/images/backgroundImg2.png 2x" src="../../assets/images/backgroundImg.png">
          <img class="imgSecond" srcset="../../assets/images/backImg.png, ../../assets/images/backImg2.png 2x" src="../../assets/images/backImg.png">
          <template v-if="showLogin">
            <div class="logBox">
              <h2>数据管理平台</h2>
              <el-form-item prop="username">
                <el-input ref="username" v-model="loginForm.username" class="login-input" placeholder="请输入账号" name="username" type="text" tabindex="1" auto-complete="on" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input :key="passwordType" ref="password" v-model="loginForm.password" class="login-input" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
              </el-form-item>
              <p>
                <el-button class="inputBtn1" :loading="loading" type="primary" round @click.native.prevent="handleLogin"> 登录 </el-button>
              </p>
              <p>
                <el-button class="inputBtn2"> 手机号登录 </el-button>
              </p>
            </div>
          </template>
          <div v-else class="logBoxChoose">
            <home-page-selection /><!--账号密码正确后2d/3d选择-->
          </div>
        </main>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'

import HomePageSelection from '@/components/HomePageSelection'
export default {
  name: 'Login',
  components: {HomePageSelection},
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: 'admin',
        password: '123'
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      showLogin: true // 判断账号密码是否正确
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.showLogin = false
            // this.$router.push({ path: this.redirect || '/' })
            // window.location.href = 'http://10.30.13.8:8081'
          }).catch(() => {
            this.loading = false
            this.showLogin = true
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "login";
</style>
