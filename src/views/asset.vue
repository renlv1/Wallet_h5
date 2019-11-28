<template>
  <div class="c-page">
    <app-header>
      {{$t('trade.text55')}}
      <template slot="right">
        <span @click="logout">{{$t('home.text20')}}</span>
      </template>
    </app-header>
    <div class="main">
      <div class="money">
        <div class="justify" v-for="(item, index) in assetsList" :key="index">
          <div class="item">
            <div class="gate break">
              {{item.gatewayName}}
            </div>
            <h3>{{item.balance}}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      assetsList: []
    }
  },
  mounted () {
    this.getAeests()
  },
  methods: {
    logout() {
      this.$fetch.post(`user/logout`).then(() => {
        this.$store.commit('SET_LOCK', false)
        this.$router.push('/login')
      })
    },
    getAeests () {
      this.$fetch.post('/user/queryUserGatewayInfo', {
        userAddress: this.$store.state.user.address,
        loading: true
      }).then(res => {
        this.assetsList = res.data.limitAmountList
      })
    }
  }
};
</script>

<style lang="less" scoped>
.money{
  margin: .3rem;
  img{
    vertical-align: middle;
    width: .88rem;
    margin-right: .2rem;
  }
  .justify{
    background: @blue;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 0.3rem;
    padding: .4rem .3rem;
    font-size: 0.32rem;
    h3{
      font-size: 0.42rem;
    }
    .r{
      text-align: right;
      p{
        opacity: .5;
      }
    }
  }
}
.gate{
  border-left: 2px solid #fff;
  padding-left: 0.2rem;
  max-width: 100% !important;
  line-height: 1.1;
  margin-bottom: 0.3rem;
  font-size: 0.26rem;
}

</style>
