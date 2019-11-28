<template>
  <div class="c-page">
    <app-header>{{$t('order.text35')}}</app-header>
    <div class="main">
      <tab :arr="[$t('order.text36'), $t('order.text37')]" @click="changeTab"></tab>
      <div class="order-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div @click="jump(item)" class="item" v-for="(item, index) in list" :key="index">
            <template v-if="activeIndex === 0">
              <div class="item-head justify">
                <div class="tit">{{$t('order.text26')}}：{{item.seq}}</div>
                <!-- <div class="c999 time">{{item.createAt | time}}</div> -->
              </div>
              <div class="item-body">
                <div class="row justify">
                  <template v-if="item.type === 'buy'">
                    <div><span>{{$t('exchange.text19')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
                    <div><span>{{$t('order.text27')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
                  </template>
                  <template v-else>
                    <div><span>{{$t('exchange.text20')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
                    <div><span>{{$t('order.text27')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
                  </template>
                </div>
                <div class="row justify">
                  <div><span>{{$t('exchange.text25')}}：{{item.takerPrice | f4}} </span>{{item.customCurrency}}/{{item.baseCurrency}}</div>
                  <div class="cblue" @click="cancel(item.seq)">{{$t('order.text38')}}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="item-head justify">
                <div class="c999 time">{{item.date | time}}</div>
                <div class="tit"></div>
              </div>
              <div class="item-body">
                <div class="row justify">
                  <template v-if="item.offerType === 'buy'">
                    <div><span>{{$t('exchange.text19')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
                    <div><span>{{$t('order.text27')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
                  </template>
                  <template v-else>
                    <div><span>{{$t('exchange.text20')}}：{{item.takerGets.amount | f4}}</span> {{item.takerGets.currency}}</div>
                    <div><span>{{$t('order.text27')}}：{{item.takerPays.amount | f4}}</span> {{item.takerPays.currency}}</div>
                  </template>
                </div>
                <div class="row justify">
                  <div><span>{{$t('exchange.text25')}}：{{item.offerPrice | f4}} </span>{{item.takerPays.currency}}/{{item.takerGets.currency}}</div>
                </div>
              </div>
            </template>
          </div>
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
      source: null,
      activeIndex: this.$store.state.tabIndex,
      noMore: false,
      pageIndex: 1
    }
  },
  created () {
    const history = this.$store.state.historyRecord
    if (history.list && history.path === this.$route.path) {
      this.list = history.list
    }
  },
  methods: {
    getData () {
      this.source = this.$axios.CancelToken.source()

      const url = this.activeIndex === 0 ? '/entrust/entrustListPending' : '/entrust/entrustListFinish'
      this.$fetch.post2(url, {
        pageSize: 10,
        queryType: this.queryType,
        querySource: 1,
        pageIndex: this.pageIndex
      }, this.source.token).then(res => {
        const list = (this.activeIndex === 0 ? res.data.offers : res.data) || []
        const len = list.length
        if (len) {
          this.list.push(...list)
          this.pageIndex++
        } else {
          this.list = []
        }
        this.noMore = true
      }).catch(() => {

      })
    },
    resetScroll () {
      this.noMore = false
      this.list = []
    },
    changeTab (index) {
      this.activeIndex = index
      this.pageIndex = 1
      this.source && this.source.cancel()
      this.resetScroll()
      this.getData()
    },
    cancel (seq) {
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-warn',
        msg: this.$t('order.text39'),
        okFn: () => {
          this.$fetch.post('/entrust/entrustCancel', {
            seq,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast(this.$t('order.text40'))
              this.resetScroll()
              this.getData()
            } else {
              this.$toast(res.msg)
            }
          })
        }
      })
    },
    jump (item) {
      if (this.activeIndex === 1) {
        this.$router.push({path: 'transactionDetail', query: {data: encodeURIComponent(JSON.stringify(item))}})
      }
    }
  },
  components: {
    loadMore: require('@/components/loadMore').default,
    tab: require('@/components/tab').default
  }
}
</script>
