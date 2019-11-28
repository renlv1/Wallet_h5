<template>
  <div class="c-page has-fixed">
    <app-header>
      {{$t('currencySet.text1')}}
      <template v-slot:right>
        <span @click="submit">{{$t('currencySet.text2')}}</span>
      </template>
    </app-header>
    <div class="main">
      <div class="set">
        <div class="cblue">{{currency}}{{$t('currencySet.text3')}}</div>
        <div class="cell">
          <span>{{$t('currencySet.text14')}}</span>
           <cube-switch v-model="state"/>
        </div>
        <div class="cell">
          <span>{{$t('currencySet.text5')}}</span>
          <input v-model="fee" :placeholder="$t('currencySet.text6')" type="number">%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      state: true,
      currency: this.$route.query.currency,
      fee: '',
      card: {}
    }
  },
  created () {
    let card = this.$route.query.card
    if (card) {
      card = JSON.parse(card)
      this.card = card
      this.state = card.supportDraw === 1 ? true : false
      this.fee = card.drawRate
    }
  },
  methods: {
    submit () {
      if (parseInt(this.fee) < 0 || parseInt(this.fee) > 5) {
        this.$toast(this.$t('currencySet.text11'))
      } else {
        const drawSet = {
          currency: this.currency,
          supportDeposit: this.state ? 1 : 0,
          depositRate: this.fee
        }
        this.$editBossInfo({drawSet}, () => {
          this.$toast({
            msg: this.$t('addContact.text7'),
            onTimeout: () => {
              this.$router.back()
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cblue{
  font-weight: bold;
  font-size: 0.32rem;
  padding: .5rem 0.3rem 0;
}
.card-wrap{
  padding: .3rem;
  font-size: 0.3rem;
}
.cell{
  input{
    flex: 1;
    text-align: right;
    padding: 0 0.1rem;
  }
}
</style>



