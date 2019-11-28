<template>
  <div class="c-page has-fixed">
    <app-header>
      <span @click="$router.push('/exchange/choose')" style="display: inherit">
        {{pair.c1}} / {{pair.c2}}<span class="cubeic-pulldown" style="font-size: 30px"></span>
      </span>
      <template v-slot:right>
        <span @click="$router.push('/transactionList')" style="color: #000">{{$t('exchange.text1')}}</span>
      </template>
    </app-header>
    <div class="main gap">
      <div class="intro">
        <p class="cgray">{{$t('exchange.text2')}}</p>
        <div class="money">{{detail.closePrice | f4}}</div>
        <div class="row">
          <p>
            <span class="cgray">{{$t('exchange.text3')}}</span>
            <span class="num">{{detail.openPrice | f4}}</span>
          </p>
          <p>
            <span class="cgray">{{$t('exchange.text4')}}</span>
            <span class="num cred">{{detail.highPrice | f4}}</span>
          </p>
        </div>
        <div class="row">
          <p>
            <span class="cgray">{{$t('exchange.text5')}}</span>
            <span class="num">{{detail.closePrice | f4}}</span>
          </p>
          <p>
            <span class="cgray">{{$t('exchange.text6')}}</span>
            <span class="num cgreen">{{detail.lowPrice | f4}}</span>
          </p>
        </div>
        <div>
          <span class="cgray">{{$t('exchange.text7')}}</span>
          <span class="num">{{detail.total | f4}}</span>
        </div>
      </div>
      <div class="chart-wrap">
        <div class="tab">
          <div class="item" @click="showDeepChart = true" :class="{active: showDeepChart}">{{$t('exchange.text8')}}</div>
          <div class="item" @click="showDeepChart = false" :class="{active: !showDeepChart}">{{$t('exchange.text9')}}</div>
        </div>

        <div class="deep-wrap" v-show="showDeepChart">
          <div class="color-wrap">
            <div class="item buy"><i></i> {{$t('exchange.text10')}}</div>
            <div class="item sell"><i></i> {{$t('exchange.text11')}}</div>
          </div>
          <div id="deepChart" class="chart"></div>
        </div>
        <div v-show="!showDeepChart">
          <div class="row">
            <div class="k-info">
              <div>
                <span><i class="cgray">{{$t('exchange.text12')}}= </i>{{kInfo[0] | f4}}</span>
                <span><i class="cgray">{{$t('exchange.text13')}}= </i>{{kInfo[1] | f4}}</span>
                <span><i class="cgray">{{$t('exchange.text14')}}= </i>{{kInfo[2] | f4}}</span>
              </div>
              <div>
                <span><i class="cgray">{{$t('exchange.text15')}}= </i>{{kInfo[3] | f4}}</span>
                <span><i class="cgray">{{$t('exchange.text16')}}= </i>{{kInfo[4] | f4}}</span>
              </div>
            </div>
            <div class="select vCenter" @click="showSelect">{{this.timeContent}}<img width="10px" style="margin-left: 5px" src="@img/select.png" alt=""></div>
          </div>
          <div id="kChart" class="chart"></div>
          <div class="option">
            <span v-for="(item, index) in options" :key="index" :class="{active: dateRangeType === index}" @click="dateRangeType = index">{{item}}</span>
          </div>
        </div>
      </div>
      <div class="order row">
        <div class="buy">
          <h3>{{$t('exchange.text17')}}</h3>
          <div class="list">
            <div class="item" v-for="(item, index) in orderList.bids" :key="index">
              <div class="bg" :style="`width: ${(item.showTakerPays / orderList.bids[orderList.bids.length - 1].showSum) * 100}%`"></div>
              <div class="row">
                <span class="cgreen">{{item.showPrice | f4}}</span>
                <span>{{item.showTakerPays | f4}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sell">
          <h3>{{$t('exchange.text18')}}</h3>
          <div class="list">
            <div class="item" v-for="(item, index) in orderList.asks" :key="index">
              <div class="bg" :style="`width: ${(item.showTakerGets / orderList.asks[0].showSum) * 100}%`"></div>
              <div class="row">
                <span class="cred">{{item.showPrice | f4}}</span>
                <span>{{item.showTakerGets | f4}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-btn" :class="{active: deepChart}">
      <div class="btn-multiple">
        <div class="btn" @click="$router.push('/exchange/transaction?index=1')">{{$t('exchange.text19')}}</div>
        <div class="btn" @click="$router.push('/exchange/transaction?index=2')">{{$t('exchange.text20')}}</div>
      </div>
    </div>
    <div class="loading" v-show="!deepChart"></div>
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
      kLineData: [],
      detail: {},
      priceList: [],
      newBuyList: [],
      newSellList: [],
      showDeepChart: true,
      options: this.$t('exchange.options'),
      dateRangeType: 1,
      timeRangeType: 1,
      timeContent: this.$t('exchange.text21'),
      orderList: [],
      kInfo: {},
      timer: null,
      kChart: null,
      deepChart: null
    }
  },
  computed: {
    pair () {
      const d = this.$store.state.gateway
      let c1 = d.baseGateway.currency
      let c2 = d.customGateway.currency
      let pairName = d.pairName
      return {c1, c2, pairName}
    }
  },
  watch: {
    dateRangeType () {
      this.getData()
    },
    timeRangeType () {
      this.getData()
    }
  },
  mounted () {
    if (!this.pair.c1) {
      this.getGatewaylist()
    } else {
      this.init()
    }
    this.timer = setInterval (() => {
      this.init()
    }, 5000)
  },
  methods: {
    init () {
      this.getData()
      this.getDeepData()
      this.getOrderList()
    },
    double (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
    splitData(rawData) {
      let categoryData = []
      let values = []
      let volumes = []
      for (let i = 0; i < rawData.length; i++) {

        let time = rawData[i].splice(0, 1)[0]
        let date = new Date(time * 1000)
        let hour = this.double(date.getHours())
        let min = this.double(date.getMinutes())

        categoryData.push(`${hour}:${min}`)
        values.push(rawData[i])
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1])
      }
      return {
        categoryData,
        values,
        volumes
      }
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
    getData() {
      this.$fetch.get('/charts/getKline', {
        pairName: this.pair.pairName,
        dateRangeType: this.dateRangeType + 1, // 日期范围 1:2小时,2:一天,3:1周,4:1月,5:3月,6:1年
        timeRangeType: this.timeRangeType + 1 // 时间刻度 1:1分钟,2:15分钟,3:2小时,4:4小时,5:1天,6:3天
      }).then((res) => {
        if (res.success) {
          let kData = res.data.kData
          this.detail = res.data.tradeVolume
          this.detail.total = res.data.total
          this.kInfo = kData[kData.length - 1]
          let lineArr = []
          kData.forEach((item) => {
            // 数据push的顺序不能错
            let obj = []
            obj.push(item[5]) // 时间
            obj.push(item[0]) // 开盘价
            obj.push(item[3]) // 收盘价
            obj.push(item[2]) // 最低价
            obj.push(item[1]) // 最高价
            obj.push(item[4]) // 总成交数量
            lineArr.push(obj)
          })

          this.kLineData = this.splitData(lineArr)
          this.drawK()
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
    drawK () {
      this.kChart = echarts.init(document.getElementById('kChart'))
      var upColor = '#48be64'
      var upBorderColor = '#48be64'
      var downColor = '#f3544f'
      var downBorderColor = '#f3544f'
      this.kChart.setOption({
        grid: [
          {
            top: '5%',
            left: '14%',
            right: '0',
            bottom: '15%',
            height: '60%',
          },
          {
            top: '80%',
            left: '14%',
            right: '0',
            height: '12%'
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
                show: false
            }
          },
          formatter: params => {
            let d
            if (params[0].seriesType === 'candlestick') {
              d = params[0].data
            } else {
              d = params[1].data
            }
            this.kInfo = [
              d[1],
              d[4],
              d[3],
              d[2],
              d[5]
            ]
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        xAxis: [
          {
            type: 'category',
            data: this.kLineData.categoryData,
            axisLine: {
              lineStyle: {
                color: '#373C52',
                width: 1
              }
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.kLineData.categoryData,
            scale: true,
            boundaryGap: ['50%', '50%'],
            axisLine: {onZero: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          }
        ],
        yAxis: [
          {
            scale: true, // Y轴起始值为数据的最小值
            splitLine: {
              lineStyle: {
                color: '#292d3d',
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                color: '#373C52',
                width: 1,
              }
            },
            axisLabel: {
              formatter: val => {
                return parseFloat(val).toFixed(4)
              },
              fontSize: '11px',
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            // axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }
        ],
        visualMap: {
          show: false,
          seriesIndex: 1,
          dimension: 2,
          pieces: [{
              value: 1,
              color: downColor
          }, {
              value: -1,
              color: upColor
          }]
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 80,
            end: 100
          },
        ],
        series: [
          {
            type: 'candlestick',
            data: this.kLineData.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            }
          },
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.kLineData.volumes,
            barWidth: '40%',
            barGap: '0',
          }
        ]
      })
    },
    drawDeep () {
      this.deepChart = echarts.init(document.getElementById('deepChart'))
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
    showSelect () {
      this.$createActionSheet({
      data: this.$t('exchange.data24'),
      onSelect: (item, index) => {
        this.timeContent = item.content
        this.timeRangeType = index
      }
    }).show()
    }
  },
  beforeDestroy () {
    this.kChart.dispose()
    this.deepChart.dispose()
    clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
@red: #f76335;
@green: #03c086;

.chart{
  height: 300px;
  width: calc(100vw - .6rem);
}
.chart-wrap{
  .tab{
    display: flex;
    .item{
      color: #808080;
      line-height: 34px;
      border-bottom: 2px solid transparent;
      margin-right: 0.6rem;
      padding: 0 .05rem;
      &.active{
        color: #000;
        border-color: @green;
      }
    }
  }
  .k-info{
    margin: 0.4rem 0 .1rem;
    font-size: 0.25rem;
    div{
      margin-bottom: 0.2rem;
    }
    span{
      margin-right: 0.3rem;
    }
  }
  .option{
    background: #f5f4fa;
    line-height: 0.6rem;
    margin: 0 -4% .6rem;
    .hCenter;
    span{
      flex: 1;
      text-align: center;
      color: #999;
      &.active{
        color: #333;
      }
    }
  }
  .deep-wrap{
    position: relative;
    .color-wrap{
      position: absolute;
      top: .3rem;
      right: 0;
      display: flex;
      .item{
        .vCenter;
        margin-left: 0.2rem;
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
}
.cred{
  color: @red;
}
.cgreen{
  color: @green;
}
.intro{
  padding: 0.4rem 0 .6rem;
  .row{
    margin-bottom: 0.18rem;
  }
  .cgray{
    margin-right: 0.2rem;
  }
  .money{
    font-size: 0.5rem;
    padding: 0.4rem 0 .3rem;
  }
}
.order{
  &.row{
    align-items: flex-start;
  }
  h3{
    color: #808080;
    font-size: 0.3rem;
    margin-bottom: 0.3rem;
  }
  .sell,.buy{
    width: 46%;
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
  }
  .buy .bg{
    background: #cbf4e6;
  }
  .row{
    position: relative;
    height: 0.6rem;
    align-items: center;
  }
}
.fixed-btn{
  background: rgba(255,255,255, .85);
  padding: .2rem;
  transform: translateY(100%);
  transition: .3s .2s;
  &.active{
    box-shadow: 0 -2px 15px rgba(0,0,0,.2);
    transform: translateY(0);
  }
}
.btn-multiple{
  justify-content: space-between;
  border-radius: 0;
  .btn{
    background: @green;
    width: 48%;
    flex: none;
    height: .8rem;
    line-height: .8rem;
    &+.btn{
      background: @red;
    }
  }
}
</style>
