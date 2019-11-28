<template>
  <div>
    <div class="c-page">
      <app-header>{{t1}}{{$t('integral.text14')}}{{t2}}</app-header>
      <div class="main">
        <img class="bg" src="@img/trans_bg.png" alt="">
        <div class="input-wrap">
          <div class="label">{{$t('integral.text15')}} <span class="cblue">{{balance}}</span> {{t1}}</div>
          <input type="number" v-model="number" @keyup="vaInput" :placeholder="$t('integral.text16')">
        </div>
        <div class="input-wrap justify">
          <div class="l">
            <div class="label">{{$t('integral.text17')}} <span class="cblue">{{t2}}</span></div>
            <input type="tel" disabled :value="number">
          </div>
          <div class="r">{{t2}}</div>
        </div>
        <button class="btn" @click="submit">{{$t('integral.text18')}}</button>
      </div>
    </div>
    <pay-dialog ref='payDialog' @submit="payConfirm" @changeFlag="changeFlag"></pay-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: '',
      payId: '',
      id: '',
      isVBCToPoint: !!this.$route.query.type,
      t1: 'VBC',
      t2: this.$t('integral.text7'),
      balance: ''
    }
  },
  created () {
    const user = this.$store.state.allUserInfo
    if (this.isVBCToPoint) {
      this.balance = user.account.vbcBalance
    } else {
      this.t1 = this.$t('integral.text7')
      this.t2 = 'VBC'
      this.balance = user.pointAccount.balance
    }
  },
  components: {
    payDialog: require('@/components/payDialog').default
  },
  methods: {
    vaInput () {
      if (!/^\d+(\.\d{0,4})?$/.test(this.number)) {
        this.number = this.number.slice(0, -1)
      }
    },
    changeFlag() {
      this.$refs.payDialog.flag = true
    },
    submit () {
      if (!this.number) {
        this.$toast(this.$t('integral.text16'))
      } else {
        const url = this.isVBCToPoint ? '/point/vbcExchangeToPoint' : '/point/pointExchangeToVbc'
        this.$fetch.post(url, {
          exchangeAmount: this.number,
          loading: true
        }).then(res => {
          if (res.success) {
            if (this.isVBCToPoint) {
              this.id = res.data.id
              this.payId = res.data.userPayTransId
              this.$refs.payDialog.show = true
            } else {
              this.$store.dispatch('getBalance')
              this.$toast({
                msg: this.$t('integral.text20'),
                onTimeout: () => {
                  this.$router.back()
                }
              })
            }

          } else {
            this.$toast(res.msg)
          }
        })
      }
    },
    payConfirm () {
      let flag = this.$refs.payDialog.flag // 防止重复点击提交按钮
      if (flag) {
        this.$refs.payDialog.flag = false
        this.$fetch.post('/tx/payOrder', {
          id: this.payId,
          tradePwd: this.$refs.payDialog.payPassword,
          mobileCode: this.$refs.payDialog.payCode,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$store.dispatch('getBalance')
            this.$toast({
              msg: this.$t('integral.text20'),
              onTimeout: () => {
                this.$router.back()
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
.main{
  padding: .3rem;
  .bg{
    border-radius: 6px;
    margin-bottom: 0.3rem;
  }
  .input-wrap{
    border: 1px solid #cdcdcd;
    padding: 0.26rem;
    border-radius: 4px;
    margin-bottom: 0.22rem;
    input{
      height: 0.4rem;
      width: 100%;
    }
  }
  .label{
    margin-bottom: 0.2rem;
    font-size: 0.3rem;
  }
  .btn{
    margin-top: 0.8rem;
  }
}

</style>
