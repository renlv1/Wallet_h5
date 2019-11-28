<template>
  <div class="c-page">
    <app-header>{{$t('order.text20')}}</app-header>
    <div class="main">
      <div class="order-list">
        <load-more :list="list" :noMore="noMore" @pulling-up="getData">
          <router-link
            tag="div"
            :to="{name: 'billDetail', query: {data: encodeURIComponent(JSON.stringify(item))}}"
            class="item"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="cell">
              <!-- <img class="icon" :src="require(`../../assets/img/wallet/bill_icon/${item.type}.png`)" alt=""> -->
              <div class="icon" :class="`${item.type}`"></div>
              <div class="f1">
                <h3>{{transferText(item.type)}}</h3>
                <p>{{item.date | time}}</p>
              </div>
              <div>
                <!-- <span v-if="item.sender === $store.state.user.address">-</span>
                <span v-else>+</span>
                <span
                  v-if="item.type === 'offercreate' || item.type === 'offer_radaring' || item.type === 'offer_cancelled'"
                >{{item.takerGets && item.takerGets.amount | f4}}{{item.takerGets && item.takerGets.currency}}</span>
                <span v-else>{{item.txAmount && item.txAmount.amount | f4}}{{item.txAmount && item.txAmount.currency}}</span> -->
                <!-- 创建/取消挂单 -->
                <span v-if="item.type === 'offercreate' || item.type === 'offer_cancelle'">
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
              </div>
            </div>
          </router-link>
        </load-more>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      noMore: false,
      marker: ""
    }
  },
  created() {
    this.getData()
    const history = this.$store.state.historyRecord;
    if (history.list && history.path === this.$route.path) {
      this.list = history.list;
      this.marker = history.pageIndex;
      this.noMore = history.noMore;
    }
  },
  methods: {
    getData() {
      this.$fetch
        .post("/tx/transactionlist", {
          marker: this.marker
        })
        .then(res => {
          if (res.success) {
            const list = res.data.transactions;
            const len = list.length;
            const marker = res.data.marker;
            if (marker) {
              this.pageIndex = this.marker = JSON.stringify(marker);
            }
            if (len) {
              if (len < 20) {
                this.noMore = true;
              }
              this.list.push(...list);
            } else {
              this.noMore = true;
            }
          } else {
            this.$toast(res.msg);
            this.noMore = true;
          }
        });
    },
    transferText(type) {
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
      };
      return obj[type];
    }
  },
  components: {
    loadMore: require("@/components/loadMore").default
  }
};
</script>

<style lang="less" scoped>
.icon {
  background: #f4f4f4 url(~@img/bill_icon.png);
  background-size: 45px;
  width: 45px;
  height: 45px;
  margin-right: 0.2rem;
  overflow: hidden;
  border-radius: 50%;
  &.Oher {background-position: 0 0;}
  &.account_set {background-position: 0 -90px / 2;}
  &.active {background-position: 0 -180px / 2;}
  &.active_acc {background-position: 0 -270px / 2;}
  &.active_add {background-position: 0 -360px / 2;}
  &.active_referee {background-position: 0 -450px / 2;}
  &.active_show {background-position: 0 -540px / 2;}
  &.addreferee {background-position: 0 -630px / 2;}
  &.connected {background-position: 0 -720px / 2;}
  &.dividend {background-position: 0 -810px / 2;}
  &.failed {background-position: 0 -900px / 2;}
  &.offer_cancelled {background-position: 0 -990px / 2;}
  &.offer_radaring {background-position: 0 -1080px / 2;}
  &.offercreate {background-position: 0 -1170px / 2;}
  &.radaring {background-position: 0 -1260px / 2;}
  &.received {background-position: 0 -1350px / 2;}
  &.sent {background-position: 0 -1440px / 2;}}
</style>
