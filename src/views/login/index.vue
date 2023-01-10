<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
      <div class="box">
        <header>
          <img srcset="../../assets/images/ytxgkLog.png, ../../assets/images/ytxgkLog2.png 2x" src="../../assets/images/ytxgkLog.png" />
        </header>
        <main>
          <img class="imgFirst" srcset="../../assets/images/backgroundImg.png, ../../assets/images/backgroundImg2.png 2x" src="../../assets/images/backgroundImg.png">
          <img class="imgSecond" srcset="../../assets/images/backImg.png, ../../assets/images/backImg2.png 2x" src="../../assets/images/backImg.png" />
          <div class="logBox">
            <h2>数据管理平台</h2>
            <h3>登录</h3>
            <el-form-item prop="username">
              <el-input ref="username" class="login-input" v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" tabindex="1" auto-complete="on"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="login-input" :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin"></el-input>
            </el-form-item>
            <p>
              <el-button class="inputBtn1" :loading="loading" type="primary" @click.native.prevent="handleLogin"> 登录 </el-button>
            </p>
            <p>
              <el-button class="inputBtn2"> 手机号登录 </el-button>
            </p>
          </div>
        </main>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
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
      redirect: undefined
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
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            window.location.href = 'http://10.30.13.8:8081'
          }).catch(() => {
            this.loading = false
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
