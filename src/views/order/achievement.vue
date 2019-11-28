<template>
  <div class="c-page has-fixed">
    <app-header>{{$t('order.text1')}}</app-header>
    <div class="main">
      <div class="total">
        <div class="money">
          <p>{{$t('order.text2')}}（VBC）</p>
          <h3>{{reward | f4}}</h3>
        </div>
      </div>
      <!--备注GG-->
      <tab v-if="activeCn" :arr="[`持币算力(${detail.totalDividendVRank})`, `推广算力(${detail.totalDividendVSprd})`]" @click="changeTab"></tab>
      <tab v-else :arr="[`holding Hashrate(${detail.totalDividendVRank})`, `Promotion hashrate(${detail.totalDividendVSprd})`]" @click="changeTab"></tab>
      <div class="">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="cell">
            <span>{{item.nick}}</span>
            <span class="cred" v-if="activeIndex === 0">+{{item.DividendVRank}}</span>
            <span class="cred" v-else>+{{item.DividendVSprd}}</span>
          </div>
        </div>
      </div>
      <div class="fixed-btn" style="padding:0;">
        <div class="btn plain" style="border-radius:0">{{$t('order.text4')}} {{new Date().getTime() | time('-', false)}}</div>
      </div>
    </div>
    <div class="loading" v-if="loading"></div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      activeCn: false,
      list: [],
      reward: '',
      loading: true,
      detail: {},
      activeIndex: 0,
    }
  },
  created () {
    this.getData()
    if (window.localStorage.getItem('lang') === 'CN') {
      this.activeCn = true
    } else {
      this.activeCn = false
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/user/getPrd').then(res => {
        if (res.success) {
          this.loading = false
          this.detail = res.data
          this.list = res.data.references
        } else {
          this.$toast(this.$t('order.text5'))
        }
      })

      this.$fetch.get('/user/balance').then(res => {
        const div = res.data.div
        if (div) {
          this.reward = div.dividendCoinsVBC
        } else {
          this.reward = 0
        }
      })
    },
    changeTab (index) {
      this.activeIndex = index
    }
  },
  components: {
    tab: require('@/components/tab').default
  }
}
</script>

<style lang="less" scoped>
.total {
  position: relative;
  text-align: center;
  margin: .3rem 0;
  .money {
    margin: 0 .3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    height: 2.6rem;
    background: url(~@img/bg.png) no-repeat;
    background-size: 100%;
    font-size: 0.34rem;
    border-radius: 6px;
    h3{
      font-size: 0.54rem;
      font-weight: bold;
      margin-top: 0.3rem;
    }
  }
}
.tab{
  z-index: 5 !important;
}
</style>
