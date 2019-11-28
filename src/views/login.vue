<template>
  <div class="page c-page">
    <img class="logo" src="../assets/img/login/logo.png" />
    <img class="rray-studio" src="../assets/img/login/RrayStudio.png" />
    <div class="login-wrap">
      <div class="input-wrap">
        <input type="text" class="input" v-model="username" :placeholder="$t('login.text4')">
      </div>
      <div class="input-wrap">
        <input type="password" class="input" v-model="password" :placeholder="$t('login.text5')">
        <span class="forget" @click="outLink(1)">{{$t('login.text6')}}</span>
      </div>
      <div class="btn-wrapper">
        <button class="login-btn btn" :loading="loading" @click="goLogin">
          <span>{{$t('login.text7')}}</span>
          <img src="../assets/img/login/row.png" />
        </button>
        <button class="registered btn" @click="outLink(2)">{{$t('login.text8')}}</button>
      </div>
      <div class="language" @click="langChang">
        <div class="span">{{$t('login.text1')}}</div>
      </div>
      <transition name="safeDialog">
      <div class="lang-dialog" v-if="selectShow">
        <div class="select" :class="{'active': selectShow }">
          <div class="lan lanCn" :class="{'active':  activeCn === 'CN'}" @click="chooseLanguage(1)">{{$t('login.text2')}}</div>
          <div class="lan lanEn" :class="{'active':  activeCn === 'EN'}" @click="chooseLanguage(2)">{{$t('login.text3')}}</div>
          <div class="lan close" @click="closeFn">{{$t('common.dialog.text1')}}</div>
        </div>
      </div>
      </transition>
    </div>
    <transition name="dialog">
      <div class="pay-popup" v-if="showDialog">
        <div class="pay-popup-wrap">
          <i class="el-icon-close close" @click="showDialog = false"></i>
          <div class="pay-popup-tit">{{$t('login.text9')}}</div>
          <div class="form">
            <div class="input-wrap">
              <input @input="resetButtonStatus" class="input" type="text" v-model="verifyCode" :placeholder="this.$t('login.text10')">
            </div>
          </div>
          <span style="color: #ff5032">{{errTips}}</span>
          <button @click="twoCheck" :loading="loading" class="btn" :class="{'prevent-btn': isPreventActive}">{{$t('login.text14')}}</button>
        </div>
      </div>
    </transition>
    <un-lock ref="unLockDialog" @changeFlag="changeFlag" @submit="submit" @cancel="cancel"></un-lock>
  </div>
</template>

<script>
  import Cube from 'cube-ui'
  import enUSMessages from '@/assets/js/en-US' // cube-ui 内置

import unLock from '@/components/unLock'

export default {
  components: {
    unLock
  },
  data() {
    return {
      activeCn: 'CN',
      selectShow: false,
      errTips: '',
      username: this.$store.state.userName,
      password: '',
      promptMessage: '',
      hintShow: false,
      loadingShow: false, // 登錄加載show
      goLoginActive: false,
      showDialog: false,
      loading: false,
      verifyCode: '',
      radarTwoCheck: {},
      isPreventActive: false
    }
  },
  created () {
    if (window.localStorage.getItem('lang') === 'CN') {
      this.activeCn = 'CN'
    } else {
      this.activeCn = 'EN'
    }
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.$refs.unLockDialog.show = false
    },
    submit() {
      this.$fetch.post('/entrust/unlock', {
        tradePwd: this.$refs.unLockDialog.tradePwd,
        mobileCode: this.$refs.unLockDialog.mobileCode ? this.$refs.unLockDialog.mobileCode : this.$refs.unLockDialog.tradePwd,
      }).then(res => {
        if (res.success) {
          this.$store.dispatch('getBalance')
          this.$router.push('/home')
        }
      })
    },
    changeFlag() {},
    chooseLanguage(index) {
      if (index === 1) {
        Cube.Locale.use('zh-CN')
        window.localStorage.setItem('lang', 'CN')
        this.$store.commit('SET_LANG', 'CN')
      } else {
        Cube.Locale.use('en-US', enUSMessages)
        window.localStorage.setItem('lang', 'EN')
        this.$store.commit('SET_LANG', 'EN')
      }
      window.location.reload()
      this.selectShow = false
    },
    closeFn () {
      this.selectShow = false
    },
    langChang () {
      this.selectShow = !this.selectShow
    },
    handle() {
      this.$refs.smscode.loading = true // 显示loading
      this.$fetch.post('/user/sendSmsCode', {
        type: 'code'
      }).then(res => {
        if (res.data.success) {
          this.$refs.smscode.start() // 开始倒计时
        }
      })
    },
    resetButtonStatus() {
      this.errTips = ''
      this.isPreventActive = false
    },
    goLogin() {
      const username = this.username
      const password = this.password
      if (!username) {
        this.$dialog({
          msg: this.$t('login.text11')
        })
      } else if (!password) {
        this.$dialog({
          msg: this.$t('login.text12')
        })
      } else {
        this.loading = true
        this.$fetch.post('/user/chatApplogin', {
          username,
          password,
          deviceId: this.$store.state.deviceId,
          clientType: 3
        }).then(res => {
          this.loading = false
          const data = res.data
          if (res.success) {
            if (data.isTwoCheck === 'true') {
              this.radarTwoCheck = res.data.radarTwoCheck
              this.showDialog = true
            } else {
              this.$store.commit('SET_GOOGLE', data.user.openGoogleCode)
              this.$store.commit('SET_MOBILE', data.user.openMobileCode)
              this.$store.commit('SET_TRADE', data.user.openTradePassword)
              this.$store.dispatch('getBalance')
              if (this.$store.state.isLock) {
                this.$refs.unLockDialog.show = true
              } else {
                this.$router.push('/home')
              }
            }
          } else {
            this.$dialog({
              msg: res.msg
            })
          }
        })
      }
    },
    twoCheck() {
      if (!this.isPreventActive) {
        this.loading = true
        this.isPreventActive = true
        this.$fetch.post('/user/chatAppLoginTwoCheck', {
          username: this.username,
          verifyCode: this.verifyCode,
          isPasswordLogin: 'true',
          deviceId: this.$store.state.deviceId,
          clientType: 3
        }).then(res => {
          this.loading = false
          if (res.success) {
            if (res.data.user) {
              this.$store.commit('SET_BOSS_FLAG', res.data.user.bossFlag)
              this.$store.commit('SET_LOGIN_TERMINAL', true)
              this.$store.commit('USER_NAME', this.username)
              this.$router.push('/home')
            } else {
              this.$dialog({
                // msg: '您的身份不是钱老板，登陆失败'
              })
            }
          } else {
            this.errTips = res.msg
          }
        })
      }
    },
    keyupHandle(e) {
      if (e.keyCode === 13) {
        if (this.username && this.password) {
          this.goLogin()
        }
      }
    },
    outLink(num) {
      if (num === 1) {
        window.location.href = 'https://t.radarlab.org/forgot'
      } else {
        window.location.href = 'https://t.radarlab.org/signup'
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keyupHandle)
  }
}
</script>

<style lang="less" scoped>
  .page {
    background: #fff;
    padding: 80px .4rem;
    border-radius: 6px;
  }

  .logo {
    width: 1.2rem;
    height: .85rem;
    margin-bottom: .4rem;
  }

  .rray-studio {
    display: block;
    width: 4.7rem;
    height: .7rem;
    margin-bottom: 1.6rem;
  }

  .input-wrap {
    margin-bottom: 20px;
    position: relative;
    .forget {
      position: absolute;
      right: 0;
      line-height: 1rem;
      color: #046991;
    }
  }

  .login-wrap {
    .input {
      line-height: 1rem;
      height: 1rem;
      border-bottom: 1px solid #f0f0f0;
      color: #000;
      width: 100%;
    }
    ::-webkit-input-placeholder {
      color: #ccc;
    }
    :-moz-placeholder { /* Firefox 18- */
      color: #ccc;
    }
    ::-moz-placeholder { /* Firefox 19+ */
      color: #ccc;
    }
    :-ms-input-placeholder {
      color: #ccc;
    }
  }

  .login-logo {
    text-align: center;
    margin-bottom: 30px;
  }

  .btn-wrapper {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .btn {
      width: 40%;
    }
    .login-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        margin-left: .2rem;
        width: .35rem;
        height: .3rem;
      }
    }
    .registered {
      background: #fff;
      color: #046991;
    }
  }
  .language{
    width: 40%;
    height: .9rem;
    line-height: .9rem;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 0.32rem;
    color: #b3b3b3;
    .span{
      flex: 1;
    }
    .icon{
      width: 13px;
      height: 8px;
      background: url("../assets/img/login/select.png") no-repeat center;
      background-size: contain;
    }
    .select{
      position: absolute;
      left: 0;
      right: 0;
      top: .9rem;
      width: 100%;
      height: 0;
      opacity: 0;
      background-color: #fff;
      border: 1px solid #f0f0f0;
      overflow: hidden;
      transition: all .3s linear;
      padding: 0 20px;
      &.active{
        opacity: 1;
        height: 1.8rem;
      }
    }
  }
  .lang-dialog{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, .5);
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    &.safeDialog-enter, &.safeDialog-leave-to{
      opacity: 0;
      .select{
        transform: translate(0, 50%);
      }
    }
    &.safeDialog-enter-active{
      transition: .2s cubic-bezier(0,.36,.98,.4);
      .select{
        transition: .2s cubic-bezier(0,.36,.98,.4);
      }
    }
    &.safeDialog-leave-active{
      transition: .2s cubic-bezier(0,.36,.98,.4);
      .select{
        transition: .2s cubic-bezier(0,.36,.98,.4);
      }
    }
    .select{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 0;
      opacity: 0;
      background-color: #fff;
      border: 1px solid #f0f0f0;
      overflow: hidden;
      transition: all .3s linear;
      padding: 0 20px;
      &.active{
        opacity: 1;
        height: 3rem;
      }
      .lan{
        height: .9rem;
        line-height: .9rem;
        text-align: center;
        font-size: .32rem;
      }
      .lanCn{
        &.active{
          color: #27a2db;
        }
      }
      .lanEn{
        &.active{
          color: #27a2db;
        }
      }
      .close{
        border-top: 1px solid #f0f0f0;
      }
    }
  }
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .prevent-btn
    background none !important
    background-color: #ccc !important

  .pay-popup
    display: flex
    align-items center
    justify-content center
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 200
    color #000
    background-color: rgba(0, 0, 0, .4)
    &.dialog-enter, &.dialog-leave-to
      opacity: 0;
      .dialog-safe
        transform: translate(0, -5%)
    &.dialog-enter-active
      transition: .3s;
      .dialog-safe
        transition: .3s
    &.dialog-leave-active
      transition: .1s;
      .dialog-safe
        transition: .1s
    .pay-popup-wrap
      width: 6.9rem
      background-color: #fff
      position: relative
      border-radius 4px
      color #17161f
      font-size: .28rem;
      transform: translate(0, 0)
      padding: .4rem
      .pay-popup-tit
        font-size: .32rem
        font-weight: bold
        color #17161f
        padding: .5rem 0 .6rem
        text-align: center
      .g-dialog-btn-wrap
        margin-top 1rem
        display: flex
        align-items center
        justify-content center
        border-top: 1px dashed #000
      .form
        margin-bottom: .4rem
        .input
          border-bottom 1px solid #000
          width: 100%
          height: 1rem
          /*border-radius .4rem*/
          /*background-color: #f5f6fa*/
          /*padding: 0 .3rem*/
          color #000
      .err-ms
        color: #ff717d;
        font-size .24rem
        margin-top: .3rem;
      .shortMsg
        position relative
        .payMsg-box
          .payMsg
            width 100%
            height .8rem
            background-color #f5f6fa
            border-radius .4rem
            font-size .28rem
            padding 0 .3rem
          .sendMsg
            position absolute
            top 0
            right 0
            height: 100%
            padding: 0 .2rem
            background-color transparent
            border none
            outline none
            font-size: .28rem
            color #00a6f1
      .g-dialog-btn
        text-align center
        flex 1
      .comfirm
        width: 100%
        height: 1rem
        display: flex
        align-items center
        justify-content center
        color #b79961
</style>
