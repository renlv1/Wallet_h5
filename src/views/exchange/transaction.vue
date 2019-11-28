<template>
  <div class="c-page">
    <app-header>
      <span @click="$router.push('/exchange/choose')" style="display: inherit">
        {{pair.c1}} / {{pair.c2}}<span class="cubeic-pulldown" style="font-size: 30px"></span>
      </span>
      <template v-slot:right>
        <span @click="$router.push('/transactionList')"  style="color: #000">{{$t('exchange.text1')}}</span>
      </template>
    </app-header>
    <div class="main gap">
      <div class="chart-wrap l">
        <div class="tab">
          <div class="item" @click="activeIndex = 1" :class="{active: activeIndex === 1}">{{$t('exchange.text19')}}</div>
          <div class="item" @click="activeIndex = 2" :class="{active: activeIndex === 2}">{{$t('exchange.text20')}}</div>
        </div>

        <div class="jy-wrap">
          <div class="input-wrap">
            <div class="label">{{$t('exchange.text25')}}</div>
            <div class="input">
              <div class="sub i-btn" @click="sub('price', 1)"></div>
              <input type="number" @keyup="vaInput('price')" v-model="price">
              <div class="add i-btn" @click="add('price', 1)"></div>
            </div>
          </div>
          <div class="input-wrap">
            <div class="label">{{$t('exchange.text26')}}</div>
            <div class="input">
              <div class="sub i-btn" @click="sub('amount')"></div>
              <input type="number" @keyup="vaInput('amount')" v-model="amount">
              <div class="add i-btn" @click="add('amount')"></div>
            </div>
          </div>
          <div class="input-wrap">
            <div class="label">{{$t('exchange.text27')}}</div>
            <div class="input one">
              <div v-show="amount && price">{{(amount * price).toFixed(4)}}</div>
            </div>
            <div class="balance">{{$t('exchange.text28')}}：
              <span v-if="(activeIndex === 1 && item.currency === pair.c2) || (activeIndex === 2 && item.currency === pair.c1)" v-for="(item, index) in assetsList" :key="index">{{item.balance | f4}}{{item.currency}}</span>

              <!-- <div>{{account.balance | f4}}{{account.currency}}</div> -->
            </div>
            <div class="btn buy-btn" v-show="activeIndex === 1" @click="submit">{{$t('exchange.text19')}}</div>
            <div class="btn sell-btn" v-show="activeIndex !== 1" @click="submit">{{$t('exchange.text20')}}</div>
          </div>
        </div>

        <div class="deep-wrap">
          <div class="color-wrap">
            <div class="item buy"><i></i> {{$t('exchange.text10')}}</div>
            <div class="item sell"><i></i> {{$t('exchange.text11')}}</div>
          </div>
          <div id="deepChart2" class="chart"></div>
        </div>
      </div>
      <div class="order r">
        <div class="intro">
          <p>{{$t('exchange.text29')}}</p>
          <div class="money">{{orderList.newPrice | f4}}</div>
          <div class="row">
            <span>{{$t('exchange.text23')}}</span>
            <span>{{$t('exchange.text26')}}</span>
          </div>
        </div>
        <div class="sell">
          <div class="list">
            <div class="item" @click="setMoney(item.showPrice, 1)" v-for="(item, index) in orderList.asks" :key="index" v-if="type === 0 && (index > 4 || orderList.asks.length <= 4) || type === 2">
              <div class="bg" :style="`width: ${(item.showTakerGets / orderList.asks[0].showSum) * 100}%`"></div>
              <div class="row">
                <span class="cred">{{item.showPrice | f4}}</span>
                <span>{{item.showTakerGets | f4}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="buy">
          <div class="list">
            <div class="item" @click="setMoney(item.showPrice, 2)" v-for="(item, index) in orderList.bids" :key="index"  v-if="(type === 0 && index < 5) || type === 1">
              <div class="bg" :style="`width: ${(item.showTakerPays / orderList.bids[orderList.bids.length - 1].showSum) * 100}%`"></div>
              <div class="row">
                <span class="cgreen">{{item.showPrice | f4}}</span>
                <span>{{item.showTakerPays | f4}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="filter vCenter" @click="showSelect">
          {{text}}<span class="cubeic-pulldown" style="font-size: 30px"></span>
        </div>
      </div>
    </div>
    <div class="loading" v-show="!deepChart"></div>
    <pay-dialog ref='payDialog' :unlock="true" @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入相关模块
require('echarts/lib/chart/bar')
require("echarts/lib/chart/candlestick")
require("echarts/lib/component/grid")
require("echarts/lib/component/tooltip")
require("echarts/lib/component/dataZoom")
require("echarts/lib/component/visualMap")
export default {
  data() {
    return {
      priceList: [],
      newBuyList: [],
      newSellList: [],
      orderList: [],
      activeIndex: parseInt(this.$route.query.index) || 1,
      amount: '',
      price: '',
      type: 0,
      text: this.$t('exchange.text30'),
      deepChart: null,
      timer: null,
      assetsList: []
    }
  },
  computed: {
    pair () {
      const d = this.$store.state.gateway
      let c1 = d.baseGateway.currency
      let c2 = d.customGateway.currency
      let pairName = d.pairName
      return {c1, c2, pairName}
    },
    account () {
      let obj = {}
      let account
      let currency
      let storeAccount = this.$store.state.balance
      if (this.activeIndex === 1) {
        currency = this.pair.c2
        account = storeAccount.bankLimitAmountList ? storeAccount.bankLimitAmountList : []
      } else {
        currency = this.pair.c1
        account = storeAccount.limitAmountList ? storeAccount.limitAmountList : []
      }
      account.forEach(item => {
        if (item.currency === currency) {
          obj = item
        }
      })
      return obj
    }
  },
  mounted() {
    this.getAeests()
    if (!this.pair.c1) {
      this.getGatewaylist()
    } else {
      this.init()
    }
    this.timer = setInterval (() => {
      this.init()
    }, 5000)
  },
  components: {
    payDialog: require('@/components/payDialog').default
  },
  methods: {
    init () {
      this.getDeepData()
      this.getOrderList()
    },
    getAeests () {
      this.$fetch.post('/user/queryUserGatewayInfo', {
        userAddress: this.$store.state.user.address
      }).then(res => {
        this.assetsList = res.data.limitAmountList
      })
    },
    getGatewaylist () {
      this.$fetch.get('/entrust/getewayList').then(res => {
        if (res.success) {
          this.gatewayList = res.data.currencyPairList
          this.$store.commit('SET_GATEWAY', this.gatewayList[1])
          this.init()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getOrderList () {
      this.$fetch.post('/entrust/bookOffer', {
        pairName: this.pair.pairName,
        type: 1
      }).then((res) => {
        if (res.success) {
          this.orderList = res.data
        }
      })
    },
    getDeepData() {
      this.$fetch.get('/charts/getShenDuInfo', {
        pairName: this.pair.pairName
      }).then((res) => {
        if (res.success) {
          this.newSellList = []
          this.newBuyList = []
          this.priceList = []
          res.data.bids.forEach(item => {
            this.newSellList.push('')
            this.newBuyList.push(item.showSum)
            this.priceList.push(item.showPrice)
          })

          res.data.asks.forEach(item => {
            this.newSellList.push(item.showSum)
            this.newBuyList.push('')
            this.priceList.push(item.showPrice)
          })
          this.drawDeep()
        }
      })
    },
    drawDeep () {
      this.deepChart = echarts.init(document.getElementById('deepChart2'))
      this.deepChart.setOption({
        grid: {
          left: 0,
          right: 0,
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            //let str = `${params.seriesName}<br>价格：${params.name}<br>总量：${params.value}`
            //备注,EN修改
            let strCn = `${params.seriesName}<br> 价格：${params.name}<br>总量：${params.value}`
            let strEn = `${params.seriesName}<br> Price：${params.name}<br>Total volume：${params.value}`
            if (window.localStorage.getItem('lang') === 'CN') {
              return strCn
            } else {
              return strEn
            }
          }
        },
        xAxis: {
          data: this.priceList,
          silent: false,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: val => {
              return parseFloat(val).toFixed(4)
            },
            fontSize: '11px',
            align: 'left'
          },
          boundaryGap: ['50%', '50%']
        },
        yAxis: [{
          axisTick: {
            // inside: true
          },
          axisLabel: {
            margin: 8,
            fontSize: '11px'
          }
        }],
        series: [
          {
            name: this.$t('exchange.text19'),
            type: 'bar',
            data: this.newBuyList,
            barWidth: '100%',
            barGap: '-100%',
            itemStyle: {
              color: '#cdf2e7',
              opacity: 1
            },
            emphasis: {
              itemStyle: {
                color: '#666',
              }
            }
          },
          {
            name: this.$t('exchange.text20'),
            type: 'bar',
            data: this.newSellList,
            barWidth: '100%',
            barGap: '-100%',
            itemStyle: {
              color: '#fde0d7',
              opacity: 1
            },
            emphasis: {
              itemStyle: {
                color: '#666',
              }
            }
          }
        ]
      })
    },
    vaInput (field) {
      if (!/^\d+(\.\d{0,4})?$/.test(this[field])) {
        this[field] = this[field].slice(0, -1)
      }
    },
    add (field, min = 0.0001) {
      this[field] = (parseFloat(this[field] || 0) + min).toFixed(4)
    },
    sub (field, min = 0.0001) {
      let val = (parseFloat(this[field] || 0) - min).toFixed(4)
      if (val < 0) {
        this[field] = '0.0000'
      } else {
        this[field] = val
      }
    },
    submit () {
      if (!this.price) {
        this.$toast(this.$t('exchange.text31'))
      } else if (!this.amount) {
        this.$toast(this.$t('exchange.text32'))
      } else {
        this.$fetch.post('/entrust/entrust', {
          amount: this.amount, // 数量
          eType: this.activeIndex, // 委托类型 1: 买入 2:卖出
          price: this.price,
          pairName: this.pair.pairName,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$toast(this.$t('exchange.text33'))
            this.amount = ''
            this.price = ''
          } else {
            if (res.resultCode === 'ACCOUNT_LOCK') {
              this.$refs.payDialog.show = true
            } else {
              this.$toast(res.msg)
            }
          }
          this.getAeests()
          this.$fetch.get('/user/balance').then(res => {
            if (res.success) {
              this.$store.commit('SET_ACCOUNT', res.data)
            }
          })
        })
      }
    },
    payConfirm () {
      this.$fetch.post('/entrust/unlock', {
        tradePwd: this.$refs.payDialog.payPassword,
        mobileCode: this.$refs.payDialog.payCode,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$toast({
            msg: this.$t('exchange.text34')
          })
          this.$refs.payDialog.show = false
        } else {
          this.$toast(res.msg)
        }
      })
    },
    showSelect () {
      this.$createActionSheet({
        data: this.$t('exchange.data2'),
        onSelect: (item, index) => {
          this.text = item.content
          this.type = index
        }
      }).show()
    },
    setMoney (price, index) {
      this.price = parseFloat(price).toFixed(4)
      this.activeIndex = index
    }
  },
  beforeDestroy () {
    this.deepChart.dispose()
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@red: #f76335;
@green: #03c086;

.main{
  .hCenter;
  .l, .r{
    width: 46%;
  }
}
.chart{
  height: 200px;
}
.chart-wrap{
  .tab{
    display: flex;
    padding: 0.2rem 0 .4rem;
    .item{
      font-size: 0.34rem;
      line-height: 38px;
      border-bottom: 2px solid transparent;
      margin-right: 0.6rem;
      padding: 0 .05rem;
      &:first-child{
        color: @green;
        &.active{
          border-color: @green;
        }
      }
      &:last-child{
        color: @red;
        &.active{
          border-color: @red;
        }
      }
    }
  }
  .deep-wrap{
    position: relative;
    padding-top: 0.6rem;
    .color-wrap{
      justify-content: center;
      display: flex;
      margin-bottom: -0.3rem;
      .item{
        .vCenter;
        margin: 0 .3rem;
      }
      i{
        width: 10px;
        height: 10px;
        margin-right: 0.1rem;
      }
      .buy i{
        background: @green;
      }
      .sell i{
        background: @red;
      }
    }

  }
  .btn{
    border-radius: 0;
    &.buy-btn{
      background: @green;
    }
    &.sell-btn{
      background: @red;
    }
  }
  .one{
    padding: 0 0.2rem;
    overflow: hidden;
  }
  .input-wrap{
    margin-bottom: 0.24rem;
    .label{
      padding-bottom: 0.2rem;
    }
    .input{
      border: 1px solid #c8c8c8;
      height: 0.8rem;
      display: flex;
      .vCenter;
      .i-btn{
        flex: .5;
        width: 0.8rem;
        height: 0.8rem;
        background-size: .36rem !important;
      }
      .add{
        background: url(~@img/add.png) no-repeat center;
        border-left: 1px solid #c8c8c8;
      }
      .sub{
        background: url(~@img/sub.png) no-repeat center;
        border-right: 1px solid #c8c8c8;
      }
      input{
        // flex: 1;
        width: 1.5rem;
        padding: 0 .1rem;
        text-align: center;
        font-size: 0.3rem;
      }
    }
  }
  .balance{
    margin: .2rem 0 -.3rem;
  }
}
.cred{
  color: @red;
}
.cgreen{
  color: @green;
}
.order{
  color: #555;
  .intro{
    padding-top: 0.44rem;
    .money{
      color: @green;
      font-size: .5rem;
      padding: 0.2rem 0 .4rem;
    }
  }
  .filter{
    padding-top: 0.3rem;
    justify-content: flex-end;
    margin-right: -0.1rem;
  }
  .item{
    position: relative;
    .bg{
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      background: #ffe1d7;

    }
    &:active .bg{
      width: 100% !important;
      background: #ccc;
    }
  }
  .buy .bg{
    background: #cbf4e6;
  }
  .row{
    position: relative;
    height: 0.5rem;
    align-items: center;
  }
}
.fixed-btn{
  background: #f0f1f5;
}
.btn-multiple{
  justify-content: space-between;
  border-radius: 0;
  .btn{
    background: @green;
    width: 48%;
    flex: none;
    &+.btn{
      background: @red;
    }
  }
}
</style>
