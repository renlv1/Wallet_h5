import Vue from 'vue'
import store from './store'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: require('./views/login').default
    },
    {
      path: '/home',
      component: require('./views/home').default
    },
    {
      path: '/asset', // 我的资产
      component: require('./views/asset').default
    },
    {
      path: '/search', // 搜索
      component: require('./views/search').default
    },
    {
      path: '/achievement', // 业绩统计
      component: require('./views/order/achievement').default
    },
    {
      path: '/transactionList', // 交易列表
      component: require('./views/order/transactionList').default
    },
    {
      path: '/transactionDetail', // 交易列表详情
      name: 'transactionDetail',
      component: require('./views/order/transactionDetail').default
    },
    {
      path: '/accountManager', // 交易账户
      component: require('./views/trade/accountManager').default
    },
    {
      path: '/accountList', // 交易账户列表
      component: require('./views/trade/accountList').default
    },
    {
      path: '/createBank', // 创建银行账户
      component: require('./views/trade/createBank').default
    },
    {
      path: '/createOtherPay', // 创建第三方支付
      component: require('./views/trade/createOtherPay').default
    },
    {
      path: '/recharge', // 充值
      component: require('./views/trade/recharge').default
    },
    {
      path: '/withdraw', // 提现
      component: require('./views/trade/withdraw').default
    },
    {
      path: '/transfer', // 转账
      component: require('./views/trade/transfer').default
    },
    {
      path: '/allFriends', // 全部好友
      component: require('./views/trade/allFriends').default
    },
    {
      path: '/transferConfirm', // 转账下一步
      component: require('./views/trade/transferConfirm').default
    },
    {
      path: '/rechargeList', // 充值订单列表
      component: require('./views/order/rechargeList').default
    },
    {
      path: '/rechargeDetail', // 充值订单详情
      component: require('./views/order/rechargeDetail').default
    },
    {
      path: '/withdrawList', // 提现订单列表
      component: require('./views/order/withdrawList').default
    },
    {
      path: '/withdrawDetail', // 提现订单详情
      component: require('./views/order/withdrawDetail').default
    },
    {
      path: '/billList', // 账单列表
      component: require('./views/order/billList').default
    },
    {
      path: '/billDetail', // 账单详情
      name: 'billDetail',
      component: require('./views/order/billDetail').default
    },
    {
      path: '/boss', // 钱老板
      component: require('./views/boss/boss').default
    },
    {
      path: '/contactWay', // 钱老板联系方式
      component: require('./views/boss/contactWay').default
    },
    {
      path: '/addContact', // 添加联系方式
      component: () => import('./views/boss/addContact')
    },
    {
      path: '/rechargeSet', // 钱老板充值设置
      component: require('./views/boss/rechargeSet').default
    },
    {
      path: '/withdrawSet', // 钱老板提现设置
      component: require('./views/boss/withdrawSet').default
    },
    {
      path: '/rechargeCurrencySet', // 充值币种设置
      component: require('./views/boss/rechargeCurrencySet').default
    },
    {
      path: '/withdrawCurrencySet', // 提现币种设置
      component: require('./views/boss/withdrawCurrencySet').default
    },
    {
      path: '/boss/orderList', // 钱老板充提订单
      component: require('./views/boss/orderList').default
    },
    {
      path: '/bossRechargeDetail', // 钱老板充值订单详情
      component: require('./views/boss/rechargeDetail').default
    },
    {
      path: '/bossWithdrawDetail', // 钱老板提现订单详情
      component: require('./views/boss/withdrawDetail').default
    },
    ////////////////////////////////////////////
    {
      path: '/integral/index', // 积分兑换
      component: require('./views/integral/index').default
    },
    {
      path: '/integral/trans', // 积分VBC互换
      component: require('./views/integral/trans').default
    },
    {
      path: '/integral/list', // 积分兑换记录
      component: require('./views/integral/list').default
    },
    {
      path: '/exchange/index', // 交易所
      component: () => import('./views/exchange/index')
    },
    {
      path: '/exchange/transaction', // 交易所-买入卖出
      component: () => import('./views/exchange/transaction')
    },
    {
      path: '/exchange/choose', // 交易所-选择币种
      component: require('./views/exchange/choose').default
    }
  ]
})

const pathArr = []
router.beforeEach((to, from, next) => {
  const path = to.path
  const index = pathArr.indexOf(path)
  if (index > -1 || path === '/home') {
    const fromPathIndex = pathArr.indexOf(from.Path)
    pathArr.splice(index, 1)
    pathArr.splice(fromPathIndex, 1)
    store.commit('SET_SLIDE_MODE', 0)
  } else {
    pathArr.push(from.path)
    pathArr.push(path)
    store.commit('SET_SLIDE_MODE', 1)
  }
  next()
})

router.afterEach(() => {
  // 为什么要设100， 因为iOS webview电池栏有留白， 为了兼顾 ios 和 iosx
  document.scrollingElement.scrollTop = -100
})

export default router
