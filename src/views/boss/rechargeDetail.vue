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
          <div class="tit">{{$t('rechargeDetail.text7')}}</div>
          <div class="justify">
            <img :src="item.userImg" alt="">
            <div class="intro">
              <h3>{{item.userName}}</h3>
            </div>
            <div class="contact" @click="$openChat(item.userName)">{{$t('rechargeDetail.text8')}}</div>
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
        <div class="btn plain" v-if="item.showStatus === 2" @click="confirm(2)">{{$t('rechargeDetail.text13')}}</div>
        <div class="btn" v-if="item.showStatus === 2" @click="confirm(1)">{{$t('rechargeDetail.text14')}}</div>
        <div class="btn" v-if="item.showStatus === 4" @click="$refs.payDialog.show = true">{{$t('rechargeDetail.text15')}}</div>
        <div class="btn" v-if="item.showStatus === 5" @click="confirm(4)">{{$t('rechargeDetail.text16')}}</div>
      </div>
    </div>
    <div v-if="!item.id" class="loading"></div>
    <pay-dialog ref='payDialog' @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      item: {}
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
      this.$fetch.post('/deposit/depositDetail', {
        depositId: this.id
      }).then(res => {
        this.item = res.data
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
      if (type === 4) {
        msg = this.$t('rechargeDetail.text19')
      }
      this.$dialog({
        type: 'confirm',
        icon: 'cubeic-question',
        msg,
        okFn: () => {
          this.$fetch.post('/deposit/depositConfirmByStemp', {
            depositId: this.id,
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
    },
    payConfirm () {
      this.$fetch.post('/tx/payOrder', {
        id: this.item.payBailTransactionId,
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
