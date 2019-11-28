<template>
  <div class="c-page">
    <app-header>
      {{currency}}{{$t('trade.text1')}}
      <template slot="right">
        <span @click="submit">{{$t('trade.text5')}}</span>
      </template>
    </app-header>
    <div class="main">
      <div class="form">
        <div class="item">
          <i>*</i>
          <label for="">{{$t('trade.text6')}}</label>
          <input type="text" v-model="realName" :placeholder="$t('trade.text14')">
        </div>
        <div class="item">
          <i>*</i>
          <label for="">{{$t('trade.text7')}}</label>
          <input type="text" v-model="bankName" :placeholder="$t('trade.text15')">
        </div>
        <div class="item">
          <i>*</i>
          <label for="">{{$t('trade.text8')}}</label>
          <input type="tel" v-model="bankNumber" :placeholder="$t('trade.text16')">
        </div>
        <div class="item">
          <label for="">{{$t('trade.text9')}}</label>
          <input type="text" v-model="country" :placeholder="$t('trade.text17')">
        </div>
        <div class="item">
          <label for="">{{$t('trade.text10')}}</label>
          <input type="text" v-model="subBankName" :placeholder="$t('trade.text18')">
        </div>
        <div class="item">
          <label for="">{{$t('trade.text11')}}</label>
          <input type="text" v-model="bankAddress" :placeholder="$t('trade.text19')">
        </div>
        <div class="item">
          <label for="">Swift</label>
          <input type="text" v-model="swift" :placeholder="$t('trade.text20')">
        </div>
        <div class="item">
          <label for="">Iban</label>
          <input type="text" v-model="iban" :placeholder="$t('trade.text21')">
        </div>
        <div class="tips">{{$t('trade.text22')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currency: this.$route.query.currency,
      realName: '',
      bankName: '',
      bankNumber: '',
      country: '',
      subBankName: '',
      bankAddress: '',
      swift: '',
      iban: ''
    };
  },
  methods: {
    submit () {
      if (!this.realName || !this.bankName || !this.bankNumber) {
        this.$toast(this.$t('trade.text210'))
      } else {
        this.$fetch.post('/bank/addBankInfo', {
          bankType: 1,
          currency: this.currency,
          bankName: this.bankName,
          subBankName: this.subBankName,
          realName: this.realName,
          bankNumber: this.bankNumber,
          country: this.country,
          swift: this.swift,
          iban: this.iban,
          bankAddress: this.bankAddress
        }).then(res => {
          if (res.success) {
            this.$toast(this.$t('trade.text211'))
            this.$router.back()
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
  padding: .3rem;
  margin-left: 0.3rem;
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
</style>
