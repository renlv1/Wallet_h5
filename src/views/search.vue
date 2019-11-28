<template>
  <div class="c-page">
    <div class="app-header">
      <div class="search-wrap row">
        <form action="#" class="search" @submit.prevent="getData">
          <div class="select">
            <i class="cblue">{{type === 1 ? $t('orderList.text1'): $t('orderList.text2')}}</i>
            <i class="cubeic-select" @click="popShow = !popShow"></i>
            <span class="sep">|</span>
            <div class="pop" :class="{active: popShow}">
              <div class="item" :class="{active: type === 1}" @click="select(1)">{{$t('orderList.text1')}}</div>
              <div class="item" :class="{active: type === 2}" @click="select(2)">{{$t('orderList.text2')}}</div>
            </div>
          </div>
          <input type="search" v-model="id" ref="input" :placeholder="$t('orderList.text3')">
        </form>
        <span @click="$router.back()">{{$t('merchantDetails.text13')}}</span>
      </div>
    </div>
    <div class="main">
      <div class="order-list">
        <div @click="jump(id)" class="item" v-for="(item, index) in list" :key="index">
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
        </div>
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
      popShow: false,
      type: this.$route.query.isRecharge ? 1 : 2,
      isBoss: this.$route.query.isBoss,
      id: ''
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    getData () {
      if (!/^[0-9]*$/.test(this.id)) {
        this.$toast(this.$t('search.text1'))
        return
      }
      this.$refs.input.blur()
      const url = this.type === 1 ? '/deposit/queryDepositList' : '/draw/queryDrawList'
      this.$fetch.post(url, {
        queryType: 0,
        id: this.id,
        querySource: this.isBoss ? 2 : 1,
        loading: true
      }).then(res => {
        this.list = res.data
        if (res.data.length) {
          this.list = res.data
        } else {
          this.$toast(this.$t('search.text2'))
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
    },
    select (index) {
      this.type = index
      this.popShow = false
    },
    jump (id) {
      let url
      if (this.isBoss) {
        if (this.type === 1) {
          url = '/bossRechargeDetail'
        } else {
          url = '/bossWithdrawDetail'
        }
      } else {
        if (this.type === 1) {
          url = '/rechargeDetail'
        } else {
          url = '/withdrawDetail'
        }
      }

      this.$router.replace(`${url}?id=${id}`)
    }
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.app-header{
  border: none;
  padding-top: 20px;
  .ios &{
    padding-top: 40px;
  }
  .iosx &{
    padding-top: 60px;
  }
}
.main-container{
  padding-top: 84px;
  .ios &{
    padding-top: 104px;
  }
  .iosx &{
    padding-top: 124px;
  }
}
.order-list{
  .item{
    box-shadow: 0 4px 6px rgba(0,0,0,.05);
  }
}
.search-wrap{
  font-size: 0.3rem;
  margin: 0 .3rem;
  width: 100%;
  .search{
    display: flex;
    flex: 1;
    background: #f2f4f7;
    border-radius: 2px;
    padding: 0 .2rem;
    margin-right: 0.1rem;
  }
  .select{
    color: #999;
    position: relative;
  }
  .sep{
    margin: .2rem;
    color: #ccc;
  }
  input{
    flex: 1;
    line-height: 1;
    font-size: 0.28rem;
    padding: 0.2rem 0;
    padding-left: 0.1rem;
  }
  .pop{
    position: absolute;
    background: #fff;
    border-radius: 4px;
    padding: 0 .3rem;
    left: -.2rem;
    top: 50px;
    box-shadow: 0 0 8px rgba(0,0,0,.15);
    line-height: 1;
    z-index: 3;
    visibility: hidden;
    transform: translateY(20%);
    opacity: 0;
    transition: .3s;
    &.active{
      visibility: visible;
      transform: translateY(0);
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
}
</style>