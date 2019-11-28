<template>
  <div id="app" @touchstart="touchstart">
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <img src="@img/loading2.gif" alt="">
        <p>正在提交中...</p>
      </div>
    </div>

    <!-- 解决安卓页面之间切换不流畅 -->

    <transition v-if="$store.state.device !== 0" :name="$store.state.slideMode ? 'slideNext' : 'slidePrev'">
      <router-view class="main-container"/>
    </transition>
    <router-view v-if="$store.state.device === 0" class="main-container"/>
  </div>
</template>
<script>

import Fingerprint from 'fingerprintjs'

export default {
  data () {
    return {
      x: 0,
      y: 0,
      timestamp: 0,
      dir: ''
    }
  },
  created() {
    if (location.href.includes('sessionId')) {
      this.$store.commit('SET_DEVICE', -1)
      document.documentElement.classList.add('isApp')
      this.$store.dispatch('getBalance')
    } else {
      this.$fetch.get('/user/balance').then(res => {
        if (!res.success) {
         //  this.login()
        } else {
          this.$store.commit('SET_ACCOUNT', res.data)
        }
      })
    }

    if(this.isIphoneX()){
      document.querySelector('#app').style.paddingBottom="88px";
    }

    if (/iphone/gi.test(navigator.userAgent)) {
      if (screen.height >= 812) {
        document.documentElement.classList.add('iosx-app')
      } else {
        document.documentElement.classList.add('ios-app')
      }
    }

    // 解决vuex刷新数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })

  },
  mounted() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.$store.commit('SET_DEVICE', 0)
    } else {
      this.$store.commit('SET_DEVICE', 1)
    }
    if (isiOS) {
      this.$store.commit('SET_DEVICE', 1)
    } else {
      this.$store.commit('SET_DEVICE', 0)
    }
    var fingerprint = new Fingerprint().get();
    this.$store.commit('SET_DEVICE_ID', fingerprint)
  },
  methods: {
    isIphoneX(){
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(/iphone/gi.test(window.navigator.userAgent) && isiOS){
        /* iPhone X、iPhone XS */
        var x=(window.screen.width === 375 && window.screen.height === 812);
        /* iPhone XS Max */
        var xsMax=(window.screen.width === 414 && window.screen.height === 896);
        /* iPhone XR */
        var xR=(window.screen.width === 414 && window.screen.height === 896);
        if(x || xsMax || xR){
          return true;
        }else{
          return false;
        }
      }else{
        return false
      }
    },
    touchstart (e) {
      this.x = e.changedTouches[0].pageX
      this.y = e.changedTouches[0].pageY,
      this.timestamp = new Date().getTime()
      this.dir = ''
    },
    touchmove (e) {
      const endx = e.changedTouches[0].pageX
      const endy = e.changedTouches[0].pageY

      const direction = this.getDirection(this.x, this.y, endx, endy)
      switch (direction) {
        case 1:
          this.dir = 'left'
          e.preventDefault()
          break
        case 2:
          this.dir = 'right'
          e.preventDefault()
          break
      }
    },
    touchend () {
      // const endx = e.changedTouches[0].pageX
      // const endy = e.changedTouches[0].pageY
      // const direction = this.getDirection(this.x, this.y, endx, endy)

      // switch (direction) {
      //   case 1:
      //     this.dirHandler('left')
      //     break
      //   case 2:
      //     this.dirHandler('right')
      //     break
      // }
      if (this.dir) {
        this.dirHandler(this.dir)
      }
    },
    dirHandler (dir) {
      const store = this.$store
      const tabIndex = store.state.tabIndex
      const tabLen = document.querySelectorAll('.tab-item').length

      if (dir === 'left') {
        if (tabLen) {
          if (tabIndex < tabLen - 1) {
            store.commit('SET_TAB_INDEX', tabIndex + 1)
          }
        }
      } else if (dir === 'right') {
        if (tabLen) {
          if (tabIndex < 1) {
            this.$router.back()
          } else {
            store.commit('SET_TAB_INDEX', tabIndex - 1)
          }
        } else {
          if (this.$route.path !== '/home') {
            this.$router.back()
          }
        }
      }
    },
    getAngle (angx, angy) {
      return Math.atan2(angy, angx) * 180 / Math.PI
    },
    getDirection(startx, starty, endx, endy) {
      let angx = endx - startx;
      let angy = endy - starty;
      let result = 0;

      //如果滑动距离太短
      if (Math.abs(angx) < 50) {
          return result
      }

      let angle = this.getAngle(angx, angy)
      if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 1
      } else if (angle >= -45 && angle <= 45) {
        result = 2
      }

      return result
    },
    login () {
      // const username = 'qwer0123'
      // const password = 'qwer123456'
      const username = 'juni'
      const password = '123123aa'
      this.$fetch.post('/user/applogin', {
        username,
        password,
        deviceId: new Date().getTime(),
        clientType: 3
      }).then(res => {
        const data = res.data
        if (res.success) {
          if (data.isTwoCheck === 'true') {
            this.radarTwoCheck = res.data.radarTwoCheck
            this.$dialog({
              type: 'prompt',
              title: `请输入${username}的谷歌验证码`,
              okFn: (e, promptValue) => {
                this.$fetch.post('/user/appLoginTwoCheck', {
                  username,
                  verifyCode: promptValue,
                  isPasswordLogin: 'true',
                  deviceId: new Date().getTime(),
                  clientType: 3
                }).then(res => {
                  if (res.success) {
                    this.$dialog({
                      msg: JSON.stringify(res)
                    })
                    this.getBalance()
                  } else {
                    this.$dialog({
                      msg: res.data.msg
                    })
                  }
                })
              }
            })
          } else {
            this.getBalance()
          }
        } else {
          this.$dialog({
            msg: res.msg
          })
        }
      })
    },
    getBalance () {
      this.$fetch.get('/user/balance').then(res => {
        this.$store.commit('SET_ACCOUNT', res.data)
      })
    }
  }
};
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/common.less";
* { touch-action: pan-y; }
#app {
  font-size: 0.28rem;
  color: #191919;
  min-height: 80vh;
}
.global-loading {
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  z-index: 98;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: .6rem;
  }
}

.slidePrev-leave,
.slidePrev-leave-to{
  z-index: 9999;
}
.slidePrev-leave-to {
  transform: translateX(100%);
  box-shadow: 0 0 10px rgba(0,0,0,.4);
}

.slidePrev-enter,
.slideNext-leave-to{
  transform: translateX(-20%);
}

.slideNext-enter{
  transform: translateX(100%);
}

.slidePrev-leave-to,
.slidePrev-enter-to,
.slideNext-enter-to,
.slideNext-leave-to{
  transition: transform .35s;

}
.slideNext-enter-to,
.slidePrev-leave-to{
  box-shadow: 0 0 10px rgba(0,0,0,.4);
}

// .isApp{
//   &.ios-app{
//     [class*="slidePrev"]{
//       margin-top: 20px;
//     }
//   }
//   &.iosx-app{
//     [class*="slidePrev"]{
//       margin-top: 44px;
//     }
//   }
// }

[class*="slidePrev"].main-container,
[class*="slideNext"].main-container {
  min-height: 100vh;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.ajax-loading{
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .loading-content{
    position: absolute;
    width: 2.6rem;
    height: 2.6rem;
    background: rgba(0,0,0,.8);
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .vCenter;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    border-radius: 10px;
    padding-bottom: 0.2rem;
  }

  img{
    width: 1.8rem;
    text-align: left;
    margin-bottom: .16rem;
  }
}

</style>
<style>
.cube-dialog-content-def > p {
  word-break: break-word;
  font-size: 16px;
  color: #000;
}
.cube-dialog-content-def img {
  max-width: 100%;
}
</style>


