<template>
  <div class="c-page has-fixed">
    <app-header>{{currency}}{{$t('trade.text1')}}</app-header>
    <div class="main">
      <div class="bank-card">
        <div class="justify" :class="{alipay: item.bankName === 'Alipay', wx: item.bankName === 'WeChat'}" v-for="(item, index) in list" :key="index">
          <div class="item">
            <div class="back-icon">
              <i></i>
            </div>
          </div>
          <div class="item r">
            <h3>{{item.bankName}}</h3>
            <span>{{item.bankType === 1 ? $t('currencySet.text8'): $t('currencySet.text9')}}</span>
            <p>{{item.bankNumber}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn">
      <button class="btn" @click="show">{{$t('trade.text2')}}</button>
    </div>
    <div class="loading" v-if="loading"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currency: this.$route.query.currency,
      list: [],
      loading: true
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$fetch.post('/bank/queryBankInfoList', {
        currency: this.currency,
        pageSize: 100,
        pageIndex: 1
      }).then(res => {
        this.loading = false
        this.list = res.data
      })
    },
    show () {
      this.$createActionSheet({
        data: [
          {
            content: this.$t('rechargeDetail.text5')
          },
          {
            content: this.$t('rechargeDetail.text6')
          }
        ],
        onSelect: (item, index) => {
          if (index === 0) {
            this.$router.push(`/createBank?currency=${this.currency}`)
          } else {
            this.$router.push(`/createOtherPay?currency=${this.currency}`)
          }
        }
      }).show()
    }
  }
};
</script>

<style lang="less" scoped>
.bank-card{
  margin: .3rem;
  .justify{
    background: @blue;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 0.3rem;
    padding: 0 .3rem;
    height: 2rem;
    font-size: 0.32rem;
    .back-icon{
      border-radius: 50%;
      overflow: hidden;
      margin-right: .3rem;
      border: 3px solid rgba(255,255,255,.5);
      background: #fff;
      padding: 2px;
      i{
        display: block;
        width: .52rem;
        height: .52rem;
        background: url(~@img/card_default.png) center no-repeat;
        background-size: 100%;
      }
    }
    &.alipay{
      background: #00a0e9;
      .back-icon i{background-image: url(~@img/alipay.png)}
    }
    &.wx{
      background: #56c556;
      .back-icon i{background-image: url(~@img/wx.png)}
    }
    h3{
      font-size: 0.36rem;
      margin-bottom: 0.14rem;
    }
    p{
      margin-top: 0.3rem;
      font-size: 0.34rem;
    }
    .r{
      flex:1;
      font-size: 0.24rem;
    }
  }
}

</style>
