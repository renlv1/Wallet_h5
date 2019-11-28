<template>
  <div class="c-page">
    <div class="home">
      <div class="top-wrapper">
        <div class="top">
          <div class="back" @click="back" v-if="!$store.state.isWebLogin">
            <i class="cubeic-back customize"></i>
          </div>
          <div class="title">Rray</div>
          <div class="login-out" @click="$router.push('/asset')">{{$t('trade.text66')}}</div>
        </div>
        <div class="middle">
          <div class="income-text">
            <span class="text">{{currentIndex === 0 ? $t('trade.text57'): $t('trade.text58')}}</span>
            <span class="date">{{currentIndex === 0 ? '' : incomeDate}}</span>
          </div>
          <div class="income-content">{{currentIndex === 0 ? vbcBalance : dividendCoinsVBC}}</div>
        </div>
        <div class="bottom">
          <div class="btn" :class="{'balance': type === 1}" @click="choose(0)">{{$t('trade.text59')}}</div>
          <div class="btn" :class="{'balance': type === 0}" @click="choose(1)">{{$t('trade.text60')}}</div>
        </div>
      </div>
      <div class="menu">
        <div class="top-menu menu-list">
          <h5>{{$t('trade.text61')}}</h5>
          <ul>
            <li v-for="item in $t('topMenu')" :key="item.index" @click="jumpTop(item)">
              <img :src="item.icon" />
              <span class="text">{{item.text}}</span>
            </li>
          </ul>
        </div>
        <div class="bottom-menu menu-list">
          <h5>{{$t('trade.text62')}}</h5>
          <ul>
            <li v-for="(item, index) in $t('bottomMenu')" :key="item.index" @click="jump(item)" v-show="!(index === 8 && $store.state.bossFlag !== 1)">
              <img :src="item.icon" />
              <span class="text">{{item.text}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 弹窗 -->
      <confirm :confirmModalOptions="confirmCancelOptions" ref="loginOut"></confirm>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import confirm from '@/components/VDialog/VDialog'
export default {
  components: {confirm},
  name: 'home',
  data() {
    return {
      type: 0,
      shopUrl: '', // 商城地址
      leileiUrl: '', // 雷雷地址
      robotUrl: '', // 机器人竞猜地址
      incomeDate: '',
      vbcBalance: '',
      dividendCoinsVBC: '',
      currentIndex: 0,
      confirmCancelOptions: {
        title: "",
        message: this.$t('home.text19'), //提示
        confirmCancel: () => {
          this.$refs.loginOut.closeModel();
        },
        confirmSubmit: () => { // 确定操作
          this.logout()
          this.$refs.loginOut.closeModel()
        },
      }
    }
  },
  mounted() {
    this.getShopUrl()
    this.getLeiLeiUrl()
    this.getRobotUrl()
    this.getBalance()
    if (!this.$store.state.isWebLogin) {
      this.showWindowHref()
    }
  },
  methods: {
    getShopUrl() {
      this.$fetch.post(`mall/getmallurl`).then((res) => {
        this.shopUrl = res.data
      })
    },
    getLeiLeiUrl() {
      this.$fetch.post(`stormgame/getstormgamesurl`).then((res) => {
        let data = res.data
        this.leileiUrl = `${data.url}?sessionId=${data.sessionId}&sign=${data.sign}&timestamp=${data.timestamp}`
      })
    },
    getRobotUrl() {
      this.$fetch.post(`guess/getrobotguessurl`).then((res) => {
        let data = res.data
        this.robotUrl = `${data.url}?sessionId=${data.sessionId}&sign=${data.sign}&timestamp=${data.timestamp}`
      })
    },
    showWindowHref () {
      var url = window.location.hash

      var arglists= url.split('?');
      if (arglists[0] === url) {
        return '';
      }
      var arr = arglists[1].split('&');
      var obj = {};
      for (let i = 0; i < arr.length; i++) {
        var arg = arr[i].split('=');
        obj[arg[0]] = arg[1];
      }

      this.checkLogin(obj['sessionId'], obj['timestamp'], obj['sign'])

      if (obj['language'] === 1) {
        localStorage.setItem("lang", "cn")
      } else {
        localStorage.setItem("lang", "en")
      }
    },
    logout() {
      this.$fetch.post(`user/logout`).then(() => {
        this.$store.commit('SET_LOCK', false)
        this.$router.push('/login')
      })
    },
    openDialog() {
      this.$refs.loginOut.showModel()
    },
    back() {
      if (parseInt(this.$store.state.device) === 0) {
        window.android.back()
      } else {
        window.webkit.messageHandlers.back.postMessage(null)
      }
    },
    jumpTop(item) {
      this.$store.commit('SET_TAB_INDEX', 0)
      this.$store.commit("SET_LIST_RECORD", {})
      this.$router.push(item.link)
    },
    jump(item) {
      this.$store.commit('SET_TAB_INDEX', 0)
      this.$store.commit("SET_LIST_RECORD", {})
      if (item.isOutLink && item.link !== '') {
        window.location.href = item.link
      } else if (item.isOutLink && item.isOutLink === 3) {
        window.location.href = this.shopUrl
      } else if (item.isOutLink && item.isOutLink === 1) {
        window.location.href = this.leileiUrl
      } else if (item.isOutLink && item.isOutLink === 2) {
        window.location.href = this.robotUrl
      } else {
        this.$router.push(item.link)
      }
    },


    checkLogin(sessionId, timestamp, sign) {
      this.$fetch.post(`user/authlogin`, {
        sessionId: sessionId,
        timestamp: timestamp,
        sign: sign,
      }).then((res) => {
        if (res.success) {
          this.getBalance()
        } else {
          this.$toast(this.$t('trade.text63'))
        }
      })
    },
    getBalance() {
      this.$fetch.get(`user/balance`).then((res) => {
        this.dividendCoinsVBC = res.data.div && res.data.div.dividendCoinsVBC || 0
        this.vbcBalance = res.data.account.vbcBalance
        let date = res.data.div && res.data.div.day.substring(4)
        this.incomeDate = date && (date.slice(0, 2) + '-' + date.slice(2))
        this.$store.commit('SET_ACCOUNT', res.data)
      })
    },
    choose(type) {
      this.type = type
      this.currentIndex = type
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .home
    width 100%
    position absolute
    top 0
    .top-wrapper
      position relative
      background-color #31334f
      padding-bottom 30px
      .top
        height 44px
        line-height 44px
        .back
          position absolute
          left 15px
          font-size 20px
        .title
          text-align center
          color #fff
          font-size 16px
        .login-out
          position absolute
          right 15px
          font-size 16px
          top 0
          color #fff
      .middle
        padding 0 20px
        margin-top 25px
        .income-text
          height 35px
          display flex
          flex-direction row
          align-items center
          justify-content space-between
          .text
            font-size 12px
          color #fff
          .date
            font-size 18px
            color #b9c0cb
        .income-content
          margin 10px 0 20px
          color #fff
          font-size 26px
      .bottom
        padding 0 20px
        display flex
        justify-content space-between
        flex-direction row
        .btn
          width 46%
          height 45px
          text-align center
          line-height 45px
          font-size 14px
          border-radius 2px
          margin-top 0
          background: linear-gradient(to right, #72b6ff, #4e7dff);
          color #fff
        .balance
          background #edf3fc !important
          color #4d7cf9 !important
    .menu
      .top-menu
        margin-top 20px
      .bottom-menu
        margin-top 25px
      .menu-list
        h5
          padding 0 15px
          font-size 16px
          margin-bottom 15px
          color #464646
        ul
          display grid
          grid-template-columns repeat(auto-fill, 25%)
          li
            display flex
            flex-direction column
            align-items center
            margin-bottom 20px
            text-align center
            img
              width 50px
              height 50px
              margin-bottom 5px
            .text
              color #464646
              font-size 14px
</style>
