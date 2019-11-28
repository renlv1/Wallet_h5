<template>
  <div class="c-page">
    <app-header>{{$t('order.text42')}}</app-header>
    <div class="main">
      <router-link class="go-search" to="/search">
        <span class="cubeic-search"></span>
        {{$t('orderList.text3')}}
      </router-link>
      <tab :arr="[$t('orderList.text4'), $t('orderList.text6'), $t('orderList.text7')]" @click="changeTab"></tab>
      <div class="order-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <router-link tag="div" :to="`/withdrawDetail?id=${item.id}`" class="item" v-for="(item, index) in list" :key="index">
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
      source: null
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

      this.$fetch.post2('/draw/queryDrawList', {
        pageSize: 10,
        queryType: this.queryType,
        querySource: 1,
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
    },
    changeTab (index) {
      this.queryType = index + 1
      this.source && this.source.cancel()
      this.resetScroll()
      this.getData()
    }
  },
  components: {
    loadMore: require('@/components/loadMore').default,
    tab: require('@/components/tab').default
  }
}
</script>
