<template>
  <div class="c-page">
    <app-header>{{$t('order.sent')}}</app-header>
    <div class="main">
      <div class="transfer">
        <form action="#">
          <p class="text">{{$t('trade.text37')}}</p>
          <form action="#" @submit.prevent="submit">
            <div class="search">
              <input type="search" v-model="searchWord" :placeholder="this.$t('trade.text38')">
              <div class="scan" v-if="$store.state.device === -1">
                <div class="cubeic-scan" @click="scan"></div>
              </div>
            </div>
          </form>
        </form>
        <div class="lately">
          <div class="row">
            <p class="cgray">{{$t('trade.text39')}}</p>
            <router-link to="/allFriends" class="cblue cubeic-arrow">{{$t('trade.text40')}}</router-link>
          </div>
          <div class="list">
            <div class="row" @click="jump(item)" v-for="(item, index) in list" :key="index">
              <img :src="item.imgUrl" alt="">
              <p>{{item.nick}}</p>
            </div>
          </div>
          <div class="loading" v-show="loading"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeIndex: 0,
      list: [],
      loading: true,
      searchWord: ''
    };
  },
  mounted() {
    this.getData()
    window.getCode = val => {
      this.searchWord = val
      this.submit()
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/tx/recentTransUsers').then(res => {
        this.loading = false
        this.list = res.data
      })
    },
    jump (item) {
      this.$router.push(`/transferConfirm?data=${JSON.stringify(item)}`)
    },
    submit () {
      this.$fetch.post('/user/checkaccount', {
        account: this.searchWord,
        loading: true
      }).then(res => {
        if (res.success) {
          const item = {
            imgUrl: res.data.imgUrl,
            userAddress: res.data.address,
            nick: res.data.nickname
          }
          this.jump(item)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    scan () {
      window.webkit.messageHandlers.saomiao.postMessage(null)
      // window.webkit.messageHandlers.saomiao.postMessage(res => {
      //   this.$dialog({
      //     msg: `扫描结果${res}`
      //   })
      // })
    }
  }
};
</script>

<style lang="less" scoped>
.transfer{
  .scan{
    height: 1rem;
    padding: 0 .1rem;
    .vCenter;
  }
  .text{
    padding: .3rem;
  }
  .loading{
    position: static;
    height: 6rem;
  }
  .search{
    background: #f2f4f7;
    margin: 0 .3rem .3rem;
    .vCenter;
    padding-right: 0.2rem;
    input{
      flex: 1;
      padding: 0 .3rem;
      height: 1rem;
    }
  }
  .lately{
    padding: 0 .3rem;
    .row{
      padding: 0.2rem 0;
      & + .row{
        border-top: 1px solid #f0f0f0;
      }
      img{
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      p{
        flex: 1;
      }
    }
  }
}
</style>
