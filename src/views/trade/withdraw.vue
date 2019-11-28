<template>
  <div>
    <div class="c-page">
      <app-header>{{$t('trade.text50')}}</app-header>
      <div class="main">
        <div class="recharge">
          <div class="input-wrap">
            <label for="">{{$t('trade.text51')}}</label>
            <div class="item">
              <input type="tel" @input="vaInput" v-model="amount" :placeholder="$t('trade.text52')">
              <span @click="selectCurrency" class="cubeic-arrow"><i>.{{randomNumber}}</i> {{currency}}</span>
            </div>
            <div class="item">
              <div class="text">{{$t('trade.text53')}}</div>
              <span class="cubeic-arrow" @click="showSelectCard = true">{{selectedCard.id ? selectedCard.bankName : $t('trade.text54')}}</span>
            </div>
          </div>
        </div>
        <div class="bank-card" v-if="selectedCard.id">
          <div class="justify">
            <div class="item-wrap" :class="{alipay: selectedCard.bankName === 'Alipay', wx: selectedCard.bankName === 'Wechat'}">
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
    <pay-dialog ref='payDialog' :amount="amount + '.' + randomNumber + currency" @submit="payConfirm"></pay-dialog>
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
      randomNumber: '',
      payId: '',
      id: ''
    };
  },
  components: {
    card: require('./selectCard').default,
    payDialog: require('@/components/payDialog').default
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
        this.$fetch.post('/draw/createDrawRecord', {
          drawCurrency: this.currency,
          drawAmount: this.amount + '.' + this.randomNumber,
          bankInfoId: this.selectedCard.id,
          loading: true
        }).then(res => {
          if (res.success) {
            this.id = res.data.id
            this.payId = res.data.userPayTransactionId
            this.$refs.payDialog.show = true
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
    },
    payConfirm () {
      this.$fetch.post('/tx/payOrder', {
        id: this.payId,
        tradePwd: this.$refs.payDialog.payPassword,
        mobileCode: this.$refs.payDialog.payCode,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$toast({
            msg: this.$t('rechargeDetail.text21'),
            onTimeout: () => {
              this.$router.push(`/withdrawDetail?id=${this.id}`)
            }
          })
        } else {
          this.$toast(res.msg)
        }
      })
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
