import Vue from 'vue'
import Vuex from 'vuex'
import router from 'vue-router'
import api from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    balance: {},
    allUserInfo: {},
    tabIndex: 0,
    historyRecord: {},
    showLoading: false,
    bossInfo: {},
    orderType: 1,
    slideMode: 1,
    device: Number,
    deviceId: '',
    gateway: {
      baseGateway: {},
      customGateway: {}
    },
    isWebLogin: false,
    userName: '',
    bossFlag: '',
    isLock: false,
    openGoogleCode: 1, // 是否开通谷歌
    openMobileCode: 1, // 是否开通短信
    openTradePassword: 1, // 是否开通交易
    cacheBossInfo: '',
    lang: 'CN'
  },
  mutations: {
    SET_GOOGLE(state, data) {
      state.user = data.openGoogleCode
    },
    SET_MOBILE(state, data) {
      state.user = data.openMobileCode
    },
    SET_TRADE(state, data) {
      state.user = data.openTradePassword
    },
    SET_LANG (state, data) {
      state.lang = data
    },
    SET_ACCOUNT (state, data) {
      state.user = data.user
      state.balance = data.account
      state.allUserInfo = data
    },
    SET_BOSS_FLAG (state, data) {
      state.bossFlag = data
    },
    SET_TAB_INDEX (state, data) {
      state.tabIndex = data
    },
    SET_LIST_RECORD (state, data) {
      state.historyRecord = data
    },
    SET_LOADING (state, data) {
      state.showLoading = data
    },
    SET_BOSS_INFO (state, data) {
      state.bossInfo = data
    },
    SET_ORDER_TYPE (state, data) {
      state.orderType = data
    },
    SET_SLIDE_MODE (state, data) {
      state.slideMode = data
    },
    SET_DEVICE(state, data) {
      state.device = data
    },
    SET_DEVICE_ID(state, data) {
      state.deviceId = data
    },
    SET_GATEWAY (state, data) {
      state.gateway = data
    },
    SET_LOGIN_TERMINAL(state, data) {
      state.isWebLogin = data
    },
    USER_NAME(state, data) {
      state.userName = data
    },
    SET_LOCK(state, data){
      state.isLock = data
    }
  },
  actions: {
    getBalance ({commit}) {
      api.get('/user/balance').then(res => {
        if (res.success) {
          commit('SET_ACCOUNT', res.data)
          commit('SET_BOSS_FLAG', res.data.user.bossFlag)
          commit('SET_LOGIN_TERMINAL', true)
          commit('USER_NAME', this.username)
          router.push('/home')
        } else if(res.resultCode === 'COOKIE_NOT_UNLOCK') {
          commit('SET_LOCK', true)
        } else if(res.resultCode === 'NOT_LOGGEDIN') {
          router.push('/login')
        }
      })
    }
  }
})
