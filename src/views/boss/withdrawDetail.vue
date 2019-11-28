<template>
  <div class="c-page">
    <app-header>{{$t('rechargeDetail.text1')}}</app-header>
    <div class="main">
      <div class="detail">

        <div class="amount-info">
          <p>{{item.receiveAmount | f4}}{{item.drawCurrency}}</p>
          <span>{{$t('withdrawDetail.text2')}}{{item.feeAmount | f4}} {{item.drawCurrency}}{{$t('withdrawDetail.text3')}}</span>
          <div class="order-state">{{$status2text(item.showStatus, true)}}</div>
        </div>
        <div class="bank-info">
          <div class="tit">{{$t('withdrawDetail.text4')}}：{{bank.bankType === 1 ? $t('rechargeDetail.text5') : $t('rechargeDetail.text6')}}</div>
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
          <div class="tit">{{$t('withdrawDetail.text7')}}</div>
          <div class="justify">
            <img :src="item.userImg" alt="">
            <div class="intro">
              <h3>{{item.userName}}</h3>
              <!-- <p>{{item.bossName}}</p> -->
            </div>
            <div class="contact" @click="$openChat(item.userName)">{{$t('withdrawDetail.text8')}}</div>
          </div>
        </div>
        <div class="order-info">
          <div class="tit">{{$t('withdrawDetail.text9')}}</div>
          <div class="row">
            <span>{{$t('withdrawDetail.text10')}}</span>
            <span>{{item.id}}</span>
          </div>
          <div class="row">
            <span>{{$t('withdrawDetail.text11')}}</span>
            <span>{{item.drawAmount | f4}}{{item.drawCurrency}}</span>
          </div>
          <div class="row">
            <span>{{$t('withdrawDetail.text12')}}</span>
            <span>{{item.createAt | time}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn">
      <div class="btn-multiple">
        <div class="btn plain" v-if="item.showStatus === 1 || item.showStatus === 2" @click="confirm(2)">{{$t('withdrawDetail.text13')}}</div>
        <div class="btn" v-if="item.showStatus === 3" @click="confirm(1)">{{$t('rechargeDetail.text14')}}</div>
        <div class="btn" v-if="item.showStatus === 5" @click="confirm(3)">{{$t('withdrawDetail.text16')}}</div>
      </div>
    </div>
    <div v-if="!item.id" class="loading"></div>
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
    confirm (type) {
      let msg
      if (type === 1) {
        msg = this.$t('rechargeDetail.text17')
      }
      if (type === 2) {
        msg = this.$t('rechargeDetail.text18')
      }
      if (type === 3) {
        msg = this.$t('withdrawDetail.text14')
      }
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-question',
        msg,
        okFn: () => {
          this.$fetch.post('/draw/drawConfirmByStemp', {
            drawId: this.id,
            confirmState: type,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast(this.$t('rechargeDetail.text20'))
              this.getData()
              this.$store.commit('SET_LIST_RECORD', {})
            } else {
              this.$toast(res.msg)
            }
          })
        }
      })
    }
  }
};
</script>
