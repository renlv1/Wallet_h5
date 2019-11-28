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
          <span>{{$t('currencySet.text4')}}</span>
           <cube-switch v-model="state"/>
        </div>
        <div class="cell">
          <span>{{$t('currencySet.text5')}}</span>
          <input v-model="fee" :placeholder="$t('currencySet.text6')" type="number">%
        </div>
        <div class="card-wrap">
          <h3>{{$t('currencySet.text7')}}</h3>
          <div class="bank-card">
            <div class="justify" v-for="(item, index) in selectedCard" :key="index">
              <div class="item-wrap" :class="{alipay: item.bankName === 'Alipay', wx: item.bankName === 'WeChat'}">
                <div class="item">
                  <div class="back-icon">
                    <i></i>
                  </div>
                </div>
                <div class="item r">
                  <h3>{{item.bankName}}</h3>
                  <span>{{item.bankType === 1 ? $t('currencySet.text8') : $t('currencySet.text9')}}</span>
                  <p>{{item.bankNumber}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-btn">
        <button class="btn" @click="showSelectCard = true">{{$t('currencySet.text12')}}</button>
      </div>
    </div>
    <transition name="slide">
      <card :currency="currency" :multiple="true" v-show="showSelectCard"></card>
    </transition>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      state: true,
      currency: this.$route.query.currency,
      fee: '',
      showSelectCard: false,
      selectedCard: [],
      card: {}
    }
  },
  created () {
    let card = this.$route.query.card
    if (card) {
      card = JSON.parse(card)
      this.card = card
      this.state = card.supportDeposit === 1 ? true : false
      this.fee = card.depositRate
      this.selectedCard = card.bankInfoList
    }
  },
  components: {
    card: () => import('@/views/trade/selectCard')
  },
  methods: {
    submit () {
      if (parseInt(this.fee) < 0 || parseInt(this.fee) > 5) {
        this.$toast(this.$t('currencySet.text11'))
      } else if (!this.selectedCard.length) {
        this.$toast(this.$t('currencySet.text12'))
      } else {
        let bankInfoIds = []

        this.selectedCard.forEach(item => {
          bankInfoIds.push(item.id)
        })

        bankInfoIds = bankInfoIds.join(',')

        const depositeSet = {
          currency: this.currency,
          supportDeposit: this.state ? 1 : 0,
          depositRate: this.fee,
          bankInfoIds
        }

        this.$editBossInfo({depositeSet}, () => {
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



