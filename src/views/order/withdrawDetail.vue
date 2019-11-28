<template>
  <div class="c-page">
    <app-header>{{$t('rechargeDetail.text1')}}</app-header>
    <div class="main">
      <div class="detail">

        <div class="amount-info">
          <p>{{item.receiveAmount | f4}}{{item.drawCurrency}}</p>
          <span>{{$t('order.text41')}}{{item.feeAmount | f4}} {{item.drawCurrency}}{{$t('withdrawDetail.text3')}}</span>
          <div class="order-state">{{$status2text(item.showStatus)}}</div>
        </div>
        <div class="bank-info">
          <div class="tit">{{$t('withdrawDetail.text4')}}：{{bank.bankType === 1 ? $t('rechargeDetail.text5'): $t('rechargeDetail.text6')}}</div>
          <div class="justify">
            <div class="intro">
              <h3>{{bank.realName}}（{{bank.bankName}}）</h3>
              <p>{{bank.bankNumber}}</p>
            </div>
            <div class="copy" v-clipboard:copy="bank.bankNumber" v-clipboard:success="$copySuccess">
              <img src="@img/copy.png" alt="">
            </div>
          </div>
        </div>
        <div class="other" v-if="item.bossId">
          <div class="tit">{{$t('boss.text1')}}</div>
          <div class="justify">
            <img :src="item.bossImg" alt="">
            <div class="intro">
              <h3>{{item.bossNickName}}</h3>
              <p>{{item.bossName}}</p>
            </div>
            <div class="contact" @click="$openChat(item.bossName)">{{$t('rechargeDetail.text8')}}</div>
          </div>
        </div>
        <div class="order-info">
          <div class="tit">{{$t('rechargeDetail.text9')}}</div>
          <div class="row">
            <span>{{$t('rechargeDetail.text10')}}</span>
            <span>{{item.id}}</span>
          </div>
          <div class="row">
            <span>{{$t('trade.text51')}}</span>
            <span>{{item.drawAmount | f4}}{{item.drawCurrency}}</span>
          </div>

          <div class="row">
            <span>{{$t('rechargeDetail.text12')}}</span>
            <span>{{item.createAt | time}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn">
      <div class="btn-multiple">
        <div class="btn plain" v-if="item.showStatus === 1 || item.showStatus === 2" @click="cancelOrder">{{$t('withdrawDetail.text15')}}</div>
        <div class="btn" v-if="item.showStatus === 2" @click="$refs.payDialog.show = true">{{$t('rechargeDetail.text15')}}</div>
        <div class="btn" v-if="item.showStatus === 6" @click="confirm">{{$t('rechargeDetail.text16')}}</div>
      </div>
    </div>
    <div v-if="!item.id" class="loading"></div>
    <div class="loading" v-if="!item.id"></div>
    <pay-dialog ref='payDialog' @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      item: {},
      bank: {},
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    payDialog: require('@/components/payDialog').default
  },
  methods: {
    getData () {
      this.$fetch.post('/draw/drawDetail', {
        drawId: this.id
      }).then(res => {
        this.item = res.data
        const drawBankAccount = res.data.drawBankAccount
        if (drawBankAccount) {
          this.bank = JSON.parse(drawBankAccount)
        }
      })
    },
    cancelOrder () {
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-question',
        msg: this.$t('withdrawDetail.text17'),
        okFn: () => {
          this.$fetch.post('/draw/cancleDraw', {
            drawId: this.id,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast(this.$t('withdrawDetail.text18'))
              this.getData()
              this.$store.commit('SET_LIST_RECORD', {})
            } else {
              this.$toast(res.msg)
            }
          })
        }
      })
    },
    confirm () {
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-question',
        msg: this.$t('rechargeDetail.text19'),
        okFn: () => {
          this.$fetch.post('/draw/drawConfirmByStemp', {
            drawId: this.id,
            confirmState: 4,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast(this.$t('withdrawDetail.text20'))
              this.getData()
              this.$store.commit('SET_LIST_RECORD', {})
            } else {
              this.$toast(res.msg)
            }
          })
        }
      })
    },
    payConfirm () {
      this.$fetch.post('/tx/payOrder', {
        id: this.item.userPayTransactionId,
        tradePwd: this.$refs.payDialog.payPassword,
        mobileCode: this.$refs.payDialog.payCode,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$refs.payDialog.show = false
          this.$toast(this.$t('rechargeDetail.text21'))
          this.$store.commit('SET_LIST_RECORD', {})
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
};
</script>
