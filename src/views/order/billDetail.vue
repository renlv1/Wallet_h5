<template>
  <div class="c-page">
    <app-header>{{$t('rechargeDetail.text1')}}</app-header>
    <div class="main">
      <div class="total">
        <div class="money">
          <p>{{transferText(item.type)}}</p>
          <h3>
            <!-- <span v-if="item.sender === $store.state.user.address">-</span>
            <span v-else>+</span>
            <span v-if="item.type === 'offercreate' || item.type === 'offer_radaring' || item.type === 'offer_cancelled'">{{item.takeGets && item.takeGets.amount | f4}}{{item.takeGets && item.takeGets.currency}}</span>
            <span v-else>{{item.txAmount && item.txAmount.amount | f4}}{{item.txAmount && item.txAmount.currency}}</span> -->
            <!-- 创建/取消挂单 -->
            <span v-if="item.type === 'offercreate' || item.type === 'offer_cancelle' || item.type === 'offer_cancelled'">
              {{item.takerGets && item.takerGets.amount | f4}}{{item.takerGets && item.takerGets.currency}}
            </span>
            <span v-else-if="item.type === 'offer_cancelle'"></span>
            <!-- 转账 -->
            <span v-else-if="item.type === 'sent'">
              -{{item.txAmount && item.txAmount.amount | f4}}{{item.txAmount && item.txAmount.currency}}
            </span>
            <!-- 收款 -->
            <span v-else-if="item.type === 'received'">
              +{{item.txAmount && item.txAmount.amount | f4}}{{item.txAmount && item.txAmount.currency}}
            </span>
            <span v-else>
              -{{item.feeAmount && item.feeAmount.amount | f4}}{{item.feeAmount && item.feeAmount.currency}}
            </span>
          </h3>
        </div>
      </div>
      <div class="intro">
        <div class="section">
          <div class="copy-wrap">
            <i>{{$t('order.text6')}}</i>
            <span class="cblue" v-clipboard:copy="item.hash" v-clipboard:success="$copySuccess">{{$t('order.text7')}}</span>
          </div>
          <div class="row">
            <i class="break" style="max-width: 100%">{{item.hash}}</i>
          </div>
          <div class="row">
            <i>{{$t('order.text8')}}</i>
            <p>{{item.date | time}}</p>
          </div>
          <div class="row">
            <i>{{$t('order.text9')}}</i>
            <p>
              <span v-if="item.type === 'offer_cancelled' || item.type === 'offer_radaring' || item.type === 'offercreate'">{{$t('order.text10')}}</span>
              <span v-else>{{item.typeName}}</span>
            </p>
          </div>
          <div class="row" v-if="isTransfer(item.type)">
            <i>{{$t('order.text11')}}</i>
            <p class="break">{{item.recipient}}</p>
          </div>
          <div class="row" v-if="item.received">
            <i>{{$t('order.text12')}}</i>
            <p class="break">{{item.sender}}</p>
          </div>
          <!-- <div class="row" v-if="item.type === 'failed' || item.type === 'account_set' || item.type === 'connected' || item.type === 'connecting'">
            <i>网关地址</i>
            <p class="break">{{item.recipient}}</p>
          </div> -->
        </div>
        <div class="section">
          <div class="tit">{{$t('order.text13')}}</div>
          <div class="row" v-for="(item, index) in item.balanceEffects" :key="index">
            <div>
              <i>{{item.amount.gatewayName}}</i>
              <div class="color" :class="{green: item.amount.amount.toString()[0] === '+' }">{{item.amount.amount.slice(0, 1)}}{{item.amount.amount.slice(1) | f4}}</div>
            </div>
            <div class="r">
              <i>{{$t('order.text14')}}</i>
              <div>{{item.balance.amount | f4}}{{item.balance.currency}}</div>
            </div>
          </div>
        </div>
        <div class="section" v-if="item.type !== 'offer_cancelled' && item.type !== 'offer_cancelle' && item.offerEffects.length">
          <div class="tit">{{$t('order.text15')}}</div>
          <div class="row diff" style="display: block;" v-for="(it, index) in item.offerEffects" :key="index">
            <div v-if="it.type === 'offer_filled'">
              <div class="justify">
                <i>{{$t('order.text16')}}</i>
                <div>{{it.takerPays.amount}} {{it.takerPays.currency}}</div>
              </div>
              <div class="justify">
                <i>{{$t('order.text17')}}</i>
                <div v-if="item.offerType === 'buy'"><span>{{it.takerPrice | f4}} </span>{{it.takerGets.currency}}/{{it.takerPays.currency}}</div>
                <div v-else><span>{{it.takerPrice | f4}} </span>{{it.takerPays.currency}}/{{it.takerGets.currency}}</div>
              </div>
              <div class="justify">
                <i>{{$t('order.text18')}}</i>
                <div v-if="item.offerType === 'buy'"><span>{{it.takerGets.amount | f4}}</span>{{it.takerGets.currency}}</div>
                <div v-else><span>{{it.takerPays.amount | f4}}</span>{{it.takerPays.currency}}</div>
              </div>
            </div>
          </div>
          <div v-if="!item.offerEffects.length" class="empty-text">
            {{$t('order.text19')}}
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
  methods: {
    transferText (type) {
      const obj = {
        sent: this.$t('order.sent'),
        received: this.$t('order.received'),
        failed: this.$t('order.failed'),
        account_set: this.$t('order.account_set'),
        active: this.$t('order.active'),
        active_acc: this.$t('order.active_acc'),
        active_add: this.$t('order.active_add'),
        active_referee: this.$t('order.active_referee'),
        active_show: this.$t('order.active_show'),
        addreferee: this.$t('order.addreferee'),
        dividend: this.$t('order.dividend'),
        offer_cancelled: this.$t('order.offer_cancelled'),
        offer_radaring: this.$t('order.offer_radaring'),
        offercreate: this.$t('order.offercreate'),
        radaring: this.$t('order.radaring'),
        connected: this.$t('order.connected'),
        connecting: this.$t('order.connecting'),
        Oher: this.$t('order.Oher')
      }
      return obj[type]
    },
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
    },
    isTransfer (type) {
      if (type === 'sent' || type === 'addreferee' || type === 'active' || type === 'active_acc' || type === 'active_add' || type === 'active_referee' || type === 'active_show' ) {
        return true
      } else {
        return false
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
  .row.diff{
    .justify{
      margin-bottom: 0.2rem;
    }
    i + div{
      margin-top: 0;
    }
  }
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
