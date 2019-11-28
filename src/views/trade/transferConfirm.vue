<template>
  <div class="c-page has-fixed">
    <app-header>{{$t('trade.text41')}}</app-header>
    <div class="main">
      <div class="transfer">
        <div class="person">
          <img :src="person.imgUrl" alt>
          <h3>{{person.nick}}</h3>
          <p>{{person.address || person.userAddress}}</p>
        </div>
        <div class="input-wrap">
          <label for>{{$t('trade.text42')}}</label>
          <div class="item">
            <input type="number" v-model="amount" :placeholder="this.$t('trade.text43')">
            <span class="cubeic-arrow" @click="showCurrentList = true">{{currency}}</span>
          </div>
          <div class="item">
            <div class="text">{{$t('trade.text44')}}</div>
            <div class="flex" @click="selectGateway(account.gatewayName)">
              <span class="break">{{account.gatewayName}}</span>
              <span class="cubeic-arrow"></span>
            </div>
          </div>
          <div class="balance">
            {{$t('trade.text45')}}：
            <span class="cblue">{{account.balance}}{{currency}}</span>
          </div>
          <div class="fixed-btn">
            <button class="btn" @click="submit">{{$t('trade.text33')}}</button>
          </div>
        </div>
      </div>
      <pay-dialog ref='payDialog' :amount="amount + currency" @submit="confirm"></pay-dialog>
      <div class="loading" v-show="loading"></div>

      <div class="currency-wrap" v-if="showCurrentList" @click="showCurrentList = false">
        <div class="currency-list">
          <div class="scroll-wrap">
            <div class="item" v-for="(item, index) in accountList" @click.stop="currency = item.currency; showCurrentList = false" :key="index">{{item.currency}}</div>
          </div>
          <div class="item cancel">{{$t('common.dialog.text1')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person: JSON.parse(this.$route.query.data),
      currency: '',
      accountList: [],
      showCurrentList: false,
      amount: '',
      userId: '',
      loading: true
    };
  },
  components: {
    payDialog: require('@/components/payDialog').default
  },
  computed: {
    account: function () {
      let obj = {}
      this.accountList.forEach(item => {
        if (item.currency === this.currency) {
          obj.gatewayName = item.gatewayName
          obj.balance = item.balance
        }
      })
      return obj
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const storeUser = this.$store.state.user
      const userAddress = storeUser.address
      if (userAddress) {
        this.userId = storeUser.id
        this.getAuthGetaway(userAddress)
      } else {
        this.$fetch.get("/user/balance").then(r => {
          this.userId = r.data.user.id
          this.getAuthGetaway(r.data.user.id.address)
        })
      }
    },
    getAuthGetaway (userAddress) {
      let selfAccount = []
      let otherAccount = []
      // 获取自己信任的网关列表
      this.$fetch.post("/user/queryUserGatewayInfo", {
        userAddress: userAddress
      }).then(r2 => {
        selfAccount = r2.data.limitAmountList;
        // 获取对方信任的网关列表
        this.$fetch.post("/user/queryUserGatewayInfo", {
          userAddress: this.person.userAddress || this.person.address
        }).then(r3 => {
          this.loading = false
          otherAccount = r3.data.limitAmountList;
          // 取两个列表之间相同的元素
          this.accountList = this.getArrEqual(selfAccount, otherAccount)
          this.currency = this.accountList[0].currency
        })
      })
    },
    getArrEqual(arr1, arr2) {
      let newArr = []
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j].currency === arr2[i].currency) {
            newArr.push(arr1[j])
          }
        }
      }
      return newArr
    },
    selectCurrency() {
      // let arr = JSON.parse(JSON.stringify(this.accountList).replace(/currency/g, 'content'))
      // this.$createActionSheet({
      //   data: arr,
      //   onSelect: item => {
      //     this.selectedCard = {};
      //     this.currency = item.content;
      //   }
      // }).show();
      // this.currency = item.content;
    },
    selectGateway(gateway) {
      this.$createActionSheet({
        data: [{content: gateway}]
      }).show()

    },
    submit () {
      if (!this.amount || this.amount <= 0) {
        this.$toast(this.$t('trade.text46'))
      } else if (!this.currency) {
        this.$toast(this.$t('trade.text47'))
      } else if (parseFloat(this.amount) > parseFloat(this.account.balance)) {
        this.$toast(this.$t('trade.text48'))
      } else {
        this.$refs.payDialog.show = true
      }
    },
    confirm () {
      this.$fetch.post('/tx/payment', {
        gatewayName: this.account.gatewayName,
        amount: this.amount,
        desAccount: this.person.userAddress || this.person.address,
        paymentType: 1,
        tradePwd: this.$refs.payDialog.payPassword,
        mobileCode: this.$refs.payDialog.payCode,
        orderId: this.userId + '_' + new Date().getTime(),
        loading: true
      }).then(res =>  {
        if (res.success) {
          this.$toast(this.$t('trade.text49'))
          this.$refs.payDialog.show = false
          this.amount = ''
          this.getAuthGetaway(this.$store.state.user.address)
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.currency-wrap{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.4);
  z-index: 999;
  .currency-list{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    text-align: center;
    .scroll-wrap{
      max-height: 70vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .item{
      font-size: 16px;
      color: #666;
      padding: 17px 0;
      &+.item{
        border-top: 1px solid #eee;
      }
      &.cancel{
        border-top: 6px solid rgba(37,38,45,0.4);
      }
    }
  }
}
.transfer {
  padding: 0 0.3rem;
  .person {
    padding: 0.4rem 0 0.9rem;
    text-align: center;
    img {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
    }
    h3 {
      font-size: 0.34rem;
      font-weight: bold;
      padding: 0.26rem 0;
    }
    p {
      color: #999;
    }
  }
  .input-wrap {
    font-size: 0.3rem;
    label {
      margin-bottom: 0.2rem;
      display: block;
    }
  }
  .item {
    border-bottom: 1px solid #f0f0f0;
    min-height: 1.08rem;
    .vCenter;
    input {
      flex: 1;
      height: 0.76rem;
    }
    .text {
      // flex: 1;
    }
    span {
      color: #999;
      i {
        color: #1e1e1e;
      }
    }
  }
  .flex{
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;

  }
  .balance {
    color: #999;
    padding-top: 0.3rem;
  }
}
</style>
