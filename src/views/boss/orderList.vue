<template>
  <div class="c-page">
    <app-header>
      <div class="select">
        <div class="arrow-down" @click="popShow = !popShow">
          {{type === 1 ? $t('orderList.text1') : $t('orderList.text2')}}
        </div>
        <div class="pop" :class="{active: popShow}">
          <div class="item" :class="{active: type === 1}" @click="select(1)">充值</div>
          <div class="item" :class="{active: type === 2}" @click="select(2)">提现</div>
        </div>
      </div>
      <template v-slot:right>
        <img @click="$router.push('/boss')" style="width: .34rem" src="@img/setting.png" alt="">
      </template>
    </app-header>
    <div class="main">
      <router-link class="go-search" :to="`/search?${type === 1 ? 'isRecharge=1' : ''}&isBoss=1`">
        <span class="cubeic-search"></span>
        输入订单编号
      </router-link>
      <tab :arr="[$t('orderList.text4'), `${type === 1 ? $t('orderList.text5') : $t('orderList.text6')}`, $t('orderList.text7')]" @click="changeTab"></tab>
      <div class="order-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <!--  充值订单    -->
          <router-link v-if="type === 1" tag="div" :to="`/bossRechargeDetail?id=${item.id}`" class="item" v-for="(item, index) in list" :key="index">
            <div class="item-head justify">
              <div class="tit">{{$t('orderList.text8')}}：{{item.id}}</div>
              <div class="c999">{{$status2text(item.showStatus, true)}}</div>
            </div>
            <div class="item-body">
              <div class="has-img cell">
                <img :src="item.otherUserImg" alt="">
                <div class="f1">
                  <h3>{{item.otherUserName}}</h3>
                  <p>{{item.createAt | time}}</p>
                </div>
                <div>{{item.depositAmount | f4}}{{item.depositCurrency}}</div>
              </div>
            </div>
          </router-link>

          <!--  提现订单    -->
          <router-link v-if="type === 2" tag="div" :to="`/bossWithdrawDetail?id=${item.id}`" class="item" v-for="(item, index) in list" :key="index">
            <div class="item-head justify">
              <div class="tit">{{$t('orderList.text8')}}：{{item.id}}</div>
              <div class="c999">{{$status2text(item.showStatus)}}</div>
            </div>
            <div class="item-body">
              <div class="has-img cell">
                <img :src="item.otherUserImg" alt="">
                <div class="f1">
                  <h3>{{item.otherUserName}}</h3>
                  <p>{{item.createAt | time}}</p>
                </div>
                <div>{{item.drawAmount | f4}}{{item.drawCurrency}}</div>
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
  data () {
    return {
      list: [],
      pageIndex: 1,
      noMore: false,
      queryType: 1,
      source: null,
      popShow: false
    }
  },
  computed: {
    type: function () {
      return this.$store.state.orderType
    }
  },
  created () {
    const history = this.$store.state.historyRecord
    if (history.list && history.path === this.$route.path) {
      this.list = history.list
      this.pageIndex = history.pageIndex
      this.noMore = history.noMore
    }
  },
  methods: {
    getData () {
      this.source = this.$axios.CancelToken.source()
      const url = this.type === 1 ? '/deposit/queryDepositList' : '/draw/queryDrawList'
      this.$fetch.post2(url, {
        pageSize: 10,
        queryType: this.queryType,
        querySource: 2,
        pageIndex: this.pageIndex
      }, this.source.token).then(res => {
        const list = res.data
        const len = list.length
        if (len) {
          if (this.pageIndex === 1 && len < 10) {
            this.noMore = true
          }
          this.list.push(...list)
          this.pageIndex++
        } else {
          if (this.pageIndex === 1) {
            this.list = []
          }
          this.noMore = true
        }
      }).catch(() => {

      })
    },
    resetScroll () {
      this.pageIndex = 1
      this.noMore = false
      this.list = []
      this.source && this.source.cancel()
      this.getData()
    },
    changeTab (index) {
      this.queryType = index + 1
      this.resetScroll()

    },
    select (index) {
      this.popShow = false
      this.$store.commit('SET_ORDER_TYPE', index)
      this.resetScroll()
    },
  },
  components: {
    loadMore: require('@/components/loadMore').default,
    tab: require('@/components/tab').default
  }
}
</script>

<style lang="less" scoped>
.search{
  background: #f2f4f7;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin:.3rem;
  padding: 0 .3rem;
  input{
    flex: 1;
    line-height: 1;
    font-size: 0.28rem;
    padding: 0.2rem 0;
    padding-left: 0.1rem;
  }
}
.arrow-down{
  display: inline-block;
  background: url(~@img/arrow_down.png) no-repeat right center;
  padding-right: 0.3rem;
  background-size: .2rem;
}
.pop{
  position: absolute;
  background: #fff;
  border-radius: 4px;
  padding: 0 .3rem;
  left: 50%;
  transform: translate(-50%, 20%);
  box-shadow: 0 0 8px rgba(0,0,0,.15);
  line-height: 1;
  z-index: 3;
  visibility: hidden;
  opacity: 0;
  transition: .3s;
  &.active{
    visibility: visible;
    transform: translate(-50%, 0);
    opacity: 1;
  }
  .item{
    padding: .38rem .22rem;
    white-space: nowrap;
    &.active{
      color: @blue;
    }
    & + .item{
      border-top: 1px solid #888;
    }
  }
}
</style>
