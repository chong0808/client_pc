<template>
  <div id="wrapper">
      <div class="login">
        <div class="login-header-btn">
          <div>
            <p class="no-drag">  
              <i @click="changeView($event,'close')" class="el-icon-closes ex_btn"></i>
            </p>
          </div>
        </div>
        <div class="loginLeft">
        </div>
        <div class="loginRight">
          <div class="loginTop">
            <span>{{title}} |</span>
            <span>{{desc}}</span>
          </div>
          <div class="no-drag loginIn">
            <div class="input-group userName">
              <span></span>
              <input type="text" class="form-control" placeholder="用户"   v-model="account" aria-describedby="basic-addon1">
            </div>
            <div class="input-group passWord">
              <span></span>
              <input type="password" class="form-control" placeholder="密码"  v-model="password" aria-describedby="basic-addon1">
                
            </div>
            <p class='logon_error'>{{error}}</p>
          </div>
          <div class="no-drag loginBottom">
            <button class="btn-primary" @click="clickSub">{{loging}}</button>
            <div class="btnFooter">
              <input  v-model="remPw" type="checkbox" name="">
              <span>记住密码</span>
              <input  v-model="autoLogin" type="checkbox" name="">
              <span>自动登陆</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  import '../../assets/base.css'
  import './../assets/login.css'
  import api from './../../axios/loginApi.js'
  import axios from 'axios'
  // import md5 from 'js-md5'
  export default {
    name: 'login',
    components: {},
    data () {
      return {
        title: '艺通琴行管理系统',
        desc: '卡坦斯琴行 | 教育机构管理系统',
        password: '12',
        account: 'zc_c',
        autoLogin: false,
        loging:'登录',
        remPw: false,
        isLogin: false,
        isPwTrue: true,
        error:'',
        win: null
      }
    },
    methods: {
      clickSub (data) {
        this.isLogin = !this.isLogin
        if (this.isLogin) {
          var params = {
            username: this.account,
            password: this.password, // md5(this.password),
            type: 1
          }
          this.error = '';
          this.loging = '正在登录'
          api.login('/login', params).then(data => {
            this.loging = '登录'
            if (data.data && data.success) {
              this.$electron.ipcRenderer.send(this.$_IPC.LOGIN, {
                user: data.data,
                access_token: data.access_token,
                loginSetting: {
                  autoLogin: this.autoLogin,
                  remPw: this.remPw
                }
              })
              this.$electron.ipcRenderer.once(this.$_IPC.LOGIN, (event, arg) => {
                if (arg && arg.success) {
                  this.win.close()
                } else {
                  this.isLogin = !this.isLogin
                }
              })
            } else {
              this.error = data.msg;
              this.isLogin = !this.isLogin
            }
          }).catch(data => {
            this.isLogin = !this.isLogin
            this.error = '网络超时'
            this.loging = "登陆"
          })
        }
      },

      changeView (ev, msg) {
        msg == 'min' && this.win.minimize()
        msg == 'close' && this.win.close()
      },
  
      openDev () {
        console.log('aa')
      }
    },
    mounted () {
      this.win = this.$electron.remote.getCurrentWindow()
  }
  }
</script>
<style>
  
</style>
