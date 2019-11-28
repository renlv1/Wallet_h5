<template>
  <div>
    <div class="c-page">
      <app-header>{{$t('orderList.text1')}}</app-header>
      <div class="main">
        <div class="recharge">
          <div class="input-wrap">
            <label for="">{{$t('rechargeDetail.text11')}}</label>
            <div class="item">
              <input type="tel" @input="vaInput" v-model="amount" :placeholder="$t('trade.text30')">
              <span @click="selectCurrency" class="cubeic-arrow"><i>.{{randomNumber}}</i> {{currency}}</span>
            </div>
            <div class="item">
              <div class="text">{{$t('trade.text31')}}</div>
              <span class="cubeic-arrow" @click="showSelectCard = true">{{selectedCard.id ? selectedCard.bankName : $t('trade.text32')}}</span>
            </div>
          </div>
        </div>
        <div class="bank-card" v-if="selectedCard.id">
          <div class="justify">
            <div class="item-wrap" :class="{alipay: selectedCard.bankName === 'Alipay', wx: selectedCard.bankName === 'WeChat'}">
              <div class="card-item">
                <div class="back-icon">
                  <i></i>
                </div>
              </div>
              <div class="card-item r">
                <h3>{{selectedCard.bankName}}</h3>
                <span>{{selectedCard.bankType === 1 ? $t('currencySet.text8'): $t('currencySet.text9')}}</span>
                <p>{{selectedCard.bankNumber}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="gap" style="margin-top: 2rem">
          <button class="btn" @click="submit">{{$t('trade.text33')}}</button>
        </div>
      </div>
    </div>
    <transition name="slide">
      <card :currency="currency" v-show="showSelectCard"></card>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currency: 'CNY',
      amount: '',
      selectedCard: {},
      showSelectCard: false,
      randomNumber: ''
    };
  },
  components: {
    card: require('./selectCard').default
  },
  created() {
    this.createRandomNumber()
  },
  methods: {
    vaInput () {
      if (!/^([1-9][0-9]*)$/.test(this.amount)) {
        this.amount = this.amount.slice(0, -1)
      }
    },
    submit () {
      if (!this.amount) {
        this.$toast(this.$t('activity.text22'))
      } else if (!this.selectedCard.id) {
        this.$toast(this.$t('trade.text34'))
      } else {
        this.$fetch.post('/deposit/createDepositRecord', {
          depositCurrency: this.currency,
          depositAmount: this.amount + '.' + this.randomNumber,
          bankInfoId: this.selectedCard.id,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$toast({
              msg: this.$t('trade.text35'),
              onTimeout: () => {
                this.$router.push(`/rechargeDetail?id=${res.data.id}`)
              }
            })
          } else {
            this.$toast(res.msg)
          }
        })
      }
    },
    selectCurrency () {
      this.$createActionSheet({
        data: [
          {content: 'CNY'},
          {content: 'USD'}
        ],
        onSelect: (item) => {
          this.selectedCard = {}
          this.currency = item.content
        }
      }).show()
    },
    createRandomNumber () {
      let num = ''
      for (let i = 0; i < 2; i++) {
        num += Math.floor(Math.random() * 10)
      }
      this.randomNumber = num
    }
  }
};
</script>

<style lang="less" scoped>
.recharge{
  padding: .3rem;
  padding-bottom: 0;
  .item{
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.3rem;
    min-height: 1.08rem;
    .vCenter;
    label{
      margin-bottom: 0.2rem;
    }
    input{
      flex: 1;
      height: 0.76rem;
    }
    .text{
      flex: 1;
    }
    span{
      color: #999;
      i{color: #1e1e1e;}
    }
  }
}
.card-content{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
