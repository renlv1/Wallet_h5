<template>
  <div class="c-page">
    <app-header>{{$t('rechargeDetail.text1')}}</app-header>
    <div class="main">
      <div class="detail">

        <div class="amount-info">
          <p>{{item.receiveAmount | f4}}{{item.depositCurrency}}</p>
          <span>{{$t('rechargeDetail.text2')}} {{item.feeAmount | f4}} {{item.depositCurrency}}{{$t('rechargeDetail.text3')}}</span>
          <div class="order-state">{{$status2text(item.showStatus, true)}}</div>
        </div>
        <div class="bank-info">
          <div class="tit">{{$t('rechargeDetail.text4')}}{{item.giveBankType === 1 ? $t('rechargeDetail.text5') : $t('rechargeDetail.text6')}}</div>
          <div class="justify">
            <div class="intro">
              <h3>{{item.giveRealName}}（{{item.giveBankName}}）</h3>
              <p>{{item.giveAccount}}</p>
              <!-- <router-link to="/" class="cblue">查看详情</router-link> -->
            </div>
            <div class="copy" v-clipboard:copy="item.giveAccount" v-clipboard:success="$copySuccess">
              <img src="@img/copy.png" alt="">
            </div>
          </div>
        </div>
        <!-- <div class="my-account justify" v-if="item.bossBankAccount">
          我的账户
          <span class="cubeic-arrow" @click="$router.push(`/cardDetail?data=${item.bossBankAccount}`)">农业银行</span>
        </div> -->
        <div class="other" v-if="item.bossId">
          <div class="tit">{{$t('boss.text1')}}</div>
          <div class="justify">
            <img :src="item.bossImg" alt="">
            <div class="intro">
              <h3>{{item.bossNickName}}</h3>
              <p>{{item.bossName}}</p>
            </div>
            <div class="contact" @click="$openChat(item.bossName)" v-if="$store.state.device === -1">{{$t('rechargeDetail.text8')}}</div>
          </div>
        </div>
        <div class="bank-info" v-if="bossBank.id">
          <div class="tit">{{$t('withdrawDetail.text4')}}{{bossBank.bankType === 1 ? $t('rechargeDetail.text5') : $t('rechargeDetail.text6')}}</div>
          <div class="justify">
            <div class="intro">
              <h3>{{bossBank.realName}} ({{bossBank.bankName}})</h3>
              <p>{{bossBank.subBankName}}</p>
              <p>{{bossBank.bankNumber}}</p>
              <p v-if="bossBank.iban">IBAN: {{bossBank.iban}}</p>
              <p v-if="bossBank.swift">SWIFT: {{bossBank.swift}}</p>
              <!-- <router-link to="/" class="cblue">查看详情</router-link> -->
            </div>
            <!-- <div class="copy" v-clipboard:copy="item.giveAccount" v-clipboard:success="$copySuccess">
              <img src="@img/copy.png" alt="">
            </div> -->
          </div>
        </div>
        <div class="order-info">
          <div class="tit">{{$t('rechargeDetail.text9')}}</div>
          <div class="row">
            <span>{{$t('rechargeDetail.text10')}}</span>
            <span>{{item.id}}</span>
          </div>
          <div class="row">
            <span>{{$t('rechargeDetail.text11')}}</span>
            <span>{{item.depositAmount | f4}}{{item.depositCurrency}}</span>
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
        <div class="btn plain" v-if="item.showStatus === 1" @click="cancelOrder">{{$t('withdrawDetail.text15')}}</div>
        <div class="btn" v-if="item.showStatus === 5" @click="confirm">{{$t('withdrawDetail.text16')}}</div>
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
      bossBank: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/deposit/depositDetail', {
        depositId: this.id
      }).then(res => {
        this.item = res.data
        let bossBank = res.data.bossBankAccount
        if (bossBank) {
          this.bossBank = JSON.parse(bossBank)
        }
      })
    },
    cancelOrder () {
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-warn',
        msg: this.$t('withdrawDetail.text17'),
        okFn: () => {
          this.$fetch.post('/deposit/cancleDeposit', {
            depositId: this.id,
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
        icon: 'cubeic-warn',
        msg: this.$t('withdrawDetail.text19'),
        okFn: () => {
          this.$fetch.post('/deposit/depositConfirmByStemp', {
            depositId: this.id,
            confirmState: 3,
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
    }
  }
};
</script>
