<template>
  <div class="c-page">
    <app-header>{{$t('integral.text5')}}</app-header>
    <div class="main">
      <div class="order-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="item-head justify">
              <div class="tit">{{$t('integral.text6')}}：{{item.id}}</div>
              <div class="c999">{{item.createAt | time}}</div>
            </div>
            <div class="item-body">
              <div class="justify c000">
                <div>{{status2text(item.paymentType)}}</div>
                <div>{{$store.state.user.address === item.receiveAddress ? '+' : '-'}}{{item.amount}}{{$t('integral.text7')}}</div>
              </div>
            </div>
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
      pageIndex: 1,
      noMore: false
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/tx/pointTransferList', {
        pageSize: 20,
        page: this.pageIndex
      }).then(res => {
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
    status2text (type) {
      const contrast = {
        31: this.$t('integral.text8'),
        32: this.$t('integral.text9'),
        40: this.$t('integral.text10'),
        41: this.$t('integral.text10'),
        20: this.$t('integral.text11'),
        21: this.$t('integral.text12'),
        22: this.$t('integral.text13'),
        50: this.$t('integral.text21'),
        51: this.$t('integral.text22'),
      }
      return contrast[type]
    }
  },
  components: {
    loadMore: require('@/components/loadMore').default
  }
}
</script>
