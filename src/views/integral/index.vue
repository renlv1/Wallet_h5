<template>
  <div class="c-page">
    <app-header>{{$t('integral.text1')}}</app-header>
    <div class="main">
      <div class="info">
        <div class="money">
          <p>{{$t('integral.text2')}}：</p>
          <h3>{{$store.state.allUserInfo.pointAccount.balance | f4}}</h3>
          <span @click="showTips">{{$t('integral.text3')}}</span>
        </div>
      </div>
      <div class="web-list">
        <div class="item" v-for="(item, index) in list" :key="index" @click="jump(item.link)">
          <div class="text">
            <p>{{item.text}}</p>
            <span class="cubeic-arrow"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      list: this.$t('integral.list')
    };
  },
  mounted() {
    this.$store.dispatch('getBalance')
    // this.getData()
  },
  methods: {
    getData() {
      this.$fetch.post("/bountymap/bountyMapIndex").then(res => {
        if (res.success) {
          this.detail = res.data
        }
      })
    },
    jump(link) {
      this.$store.commit("SET_LIST_RECORD", {})
      this.$store.commit("SET_TAB_INDEX", 0)
      this.$router.push(link)
    },
    showTips () {
      this.$dialog(this.$t('integral.text4'))
    },
    backApp () {
      window.webkit.messageHandlers.scan.postMessage()
    },
  }
};
</script>

<style lang="less" scoped>
.info {
  .money {
    color: #fff;
    height: 2.8rem;
    background: url(~@img/jifen_bg.png) no-repeat;
    background-size: 100%;
    font-size: 0.34rem;
    padding: .3rem;
    h3 {
      font-size: 0.54rem;
      font-weight: bold;
      margin: 0.45rem 0 .15rem;
    }
    p{
      padding-top: 0.2rem;
    }
    span{
      opacity: .7;
      font-size: 0.26rem;
    }
  }
}
.web-list{
  border-top: .2rem solid #f5f6fa;
}
</style>
