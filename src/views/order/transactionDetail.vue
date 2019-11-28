<template>
  <div class="c-page">
    <app-header>{{$t('rechargeDetail.text1')}}</app-header>
    <div class="main">
      <div class="order-list">
        <div class="item">
          <div class="item-head justify">
            <div class="c999 time">{{item.date | time}}</div>
            <div class="tit"></div>
          </div>
          <div class="item-body">
            <div class="row justify">
              <template v-if="item.offerType === 'buy'">
                <div><span>{{$t('exchange.text19')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
                <div><span>{{$t('exchange.text23')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
              </template>
              <template v-else>
                <div><span>{{$t('exchange.text20')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
                <div><span>{{$t('order.text27')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
              </template>
            </div>
            <div class="row justify">
              <div v-if="item.offerType === 'buy'"><span>{{$t('order.text17')}}：{{item.offerPrice | f4}} </span>{{item.takerGets.currency}}/{{item.takerPays.currency}}</div>
              <div v-else><span>{{$t('order.text17')}}：{{item.offerPrice | f4}} </span>{{item.takerPays.currency}}/{{item.takerGets.currency}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="intro">
        <div class="section">
          <div class="tit">{{$t('order.text13')}}</div>
          <div class="row" v-for="(item, index) in item.balanceEffects" :key="index">
            <div>
              <i>{{item.amount.gatewayName}}</i>
              <div class="color" :class="{green: item.amount.amount.toString()[0] === '+' }">{{item.amount.amount.slice(0, 1)}}{{item.amount.amount.slice(1) | f4}}</div>
            </div>
            <div class="r">
              <i>{{$t('order.text29')}}</i>
              <div>{{item.balance.amount | f4}}{{item.balance.currency}}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="tit">{{$t('order.text30')}}：<span class="cblue">{{item.offerStatusName}}</span></div>
          <div class="row" style="display: block;" v-for="(it, index) in item.offerEffects" :key="index">
            <div v-if="it.type === 'offer_filled'">
              <div class="justify">
                <i>{{$t('order.text31')}}</i>
                <p>{{it.takerGets.amount}}{{it.takerGets.currency}}</p>
              </div>
              <div class="justify">
                <i>{{$t('order.text32')}}</i>
                <div v-if="item.offerType === 'buy'"><span>{{it.baseAmount / it.customAmount | f4}}</span>{{it.takerGets.currency}}/{{it.takerPays.currency}}</div>
                <div v-else><span>{{it.customAmount / it.baseAmount | f4}}</span>{{it.takerPays.currency}}/{{it.takerGets.currency}}</div>
              </div>
            </div>
            <div v-if="it.type === 'offer_remained'" class="l16">
              {{$t('order.text33')}} <span class="cblue">{{it.takerPays.amount}}{{it.takerPays.currency}}</span> {{$t('order.text34')}}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item: JSON.parse(decodeURIComponent(this.$route.query.data))
    }
  },
  mounted() {
    // this.getData()
    console.log(this.item)
  },
  methods: {
    // getData () {
    //   this.$fetch.post('', {
    //     id
    //   }).then(res => {
    //     this.detail = res.data
    //   })
    // }
    transferNumber (num) {
      if (num.includes('.')) {
        let arr = num.split('.')[1]
        if (arr.length > 5) {
          return num
        } else {
          return parseFloat(num).toFixed(5).toString().slice(0, -1)
        }
      } else {
        return parseFloat(num).toFixed(5).toString().slice(0, -1)
      }
    }
  }
};
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
.color{
  color: #f74344;
  &.green{
    color: #57c555;
  }
}
.intro{
  i{
    color: #999;
    & + div{
      margin-top: 0.2rem;
    }
  }
  .r{
    text-align: right;
  }
  .row{
    & + .row{
      border-top: 1px solid #f0f0f0;
    }
    padding: .36rem .3rem;
  }
  .tit{
    font-size: 0.3rem;
    padding: 0 .3rem;
    line-height: 0.8rem;
    background: #f8f8f8;
  }
  .copy-wrap{
    padding: .2rem .3rem 0;
    margin-bottom: -0.15rem;
    .hCenter;
  }
}


</style>
