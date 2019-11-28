<template>
  <div class="c-page">
    <app-header :title="$t('trade.text23')">
      <template slot="right">
        <span @click="submit">{{$t('trade.text5')}}</span>
      </template>
    </app-header>
    <div class="main">
      <div class="pay-options">
        <div class="pay-item" v-for="(item, index) in list" @click="activeIndex = index" :class="{active: activeIndex === index}" :key="index">
          <img :src="item.src" alt="">
          <p>{{item.text}}</p>
        </div>
      </div>

      <div class="form">
        <div class="item">
          <label for="">{{$t('trade.text24')}}</label>
          <input type="text" v-model="realName" :placeholder="$t('trade.text25')">
        </div>
        <div class="item">
          <label for="">{{$t('trade.text26')}}</label>
          <input type="text" v-model="bankNumber" :placeholder="$t('trade.text27')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currency: this.$route.query.currency,
      activeIndex: 0,
      list: this.$t('trade.list'),
      realName: '',
      bankNumber: ''
    }
  },
  mounted() {
  },
  methods: {
    submit () {
      if (!this.realName || !this.bankNumber) {
        this.$toast(this.$t('trade.text28'))
      } else {
        this.$fetch.post('/bank/addBankInfo', {
          bankType: 2,
          currency: this.currency,
          bankName: this.list[this.activeIndex].en,
          realName: this.realName,
          bankNumber: this.bankNumber
        }).then(res => {
          if (res.success) {
            this.$toast({
              msg: this.$t('trade.text29'),
              onTimeout: () => {
                this.$router.push('/recharge')
              }
            })
          } else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.form{
  padding: 0 .3rem;
  .item{
    border-bottom: 1px solid #f0f0f0;
    padding: 0.22rem .3rem 0 0;
    font-size: 0.3rem;
    .vCenter;
    i{
      color: @warn;
      width: 0.3rem;
      margin-left: -0.3rem;
    }
    label{
      margin-right: 0.4rem;
    }
    input{
      flex: 1;
      height: 0.76rem;
    }
  }
  .tips{
    color: @warn;
    padding-top: 0.3rem;
  }
}
.pay-options{
  padding: .3rem;
  .vCenter;
  .pay-item{
    flex: 1;
    border: 1px solid transparent;
    color: #999;
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 10px;
    &.active{
      border-color: @blue;
    }
    img{
      height: 0.62rem;
      margin-bottom: 0.16rem;
    }
  }
}
</style>
