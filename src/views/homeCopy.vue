<template>
  <div class="c-page">
    <app-header :backFn="backApp">
      <template v-slot:right>
        <span @click="jump('/billList')">账单</span>
      </template>
    </app-header>
    <div class="main">
      <div class="total">
        <div class="money" @click="$router.push('/asset')">
          <p>余额（VBC）</p>
          <h3>{{$store.state.balance.vbcBalance | f4}}</h3>
        </div>
        <div class="menu">
          <router-link
            tag="div"
            :to="item.link"
            class="links"
            v-for="(item, index) in list"
            :key="index"
          >
            <img :src="require(`@img/menu${index}.png`)" alt>
            <p>{{item.text}}</p>
          </router-link>
        </div>
      </div>
      <div class="web-list order">
        <div class="item" v-for="(item, index) in orderMenu" :key="index" @click="jump(item.link)">
          <div class="text">
            <p>{{item.text}}</p>
            <div class="link">
              <span
                class="count"
              >{{detail.bountyMapCountList && detail.bountyMapCountList[index].count}}</span>
              <span class="cubeic-arrow"></span>
            </div>
          </div>
        </div>
        <div class="item" v-if="$store.state.user.bossFlag === 1" @click="jump('/boss/orderList')">
          <div class="text">
            <p>钱老板</p>
            <div class="link">
              <span class="cubeic-arrow"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      list: [
        {
          link: "/transfer",
          text: "转账"
        },
        {
          link: "/recharge",
          text: "充值"
        },
        {
          link: "/withdraw",
          text: "提现"
        }
      ],
      orderMenu: [
        {
          text: "交易账户",
          link: "/accountManager",
          count: 0
        },
        {
          text: "充值订单",
          link: "/rechargeList",
          count: 1
        },
        {
          text: "提现订单",
          link: "/withdrawList"
        },
        {
          text: "交易订单",
          link: "/transactionList"
        },
        {
          text: "业绩统计",
          link: "/achievement"
        }
      ]
    };
  },
  mounted() {
    // this.getData()
  },
  methods: {
    getData() {
      this.$fetch.post("/bountymap/bountyMapIndex").then(res => {
        if (res.success) {
          this.detail = res.data
        }
      })
    },
    jump(link) {
      this.$store.commit("SET_LIST_RECORD", {})
      this.$store.commit("SET_TAB_INDEX", 0)
      this.$router.push(link);
    },
    backApp () {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
      // var isIOS = !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        window.android.scan()
      } else {
        window.webkit.messageHandlers.scan.postMessage(null)
      }
    },
  }
};
</script>

<style lang="less" scoped>
  .total {
    position: relative;
    text-align: center;
    margin: 0.3rem 0;
    .money {
      margin: 0 0.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      height: 2.6rem;
      background: url(~@img/bg.png) no-repeat;
      background-size: 100%;
      font-size: 0.34rem;
      border-radius: 6px;
      h3 {
        font-size: 0.54rem;
        font-weight: bold;
        margin-top: 0.3rem;
      }
    }
    .menu {
      margin-top: 0.6rem;
      display: flex;
      text-align: center;
      .links {
        position: relative;
        flex: 1;
        & + .links {
          &:before {
            content: "";
            position: absolute;
            height: 70%;
            width: 1px;
            background: #ddd;
            left: 0;
            top: 20%;
          }
        }
      }
      img {
        height: 0.5rem;
      }
      p {
        padding-top: 0.2rem;
      }
    }
  }
</style>
