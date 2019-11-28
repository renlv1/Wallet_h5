/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './api/api'
import axios from 'axios'
import { i18n } from './i18n/config'
import * as customFiter from './filter'
import globalMixin from './mixin'
// import echarts from 'echarts'
import VueClipboard from 'vue-clipboard2'
import appHeader from '@/components/appHeader'
import { Locale } from 'cube-ui'
import enUSMessages from '@/assets/js/en-US' // cube-ui 内置

Vue.use(Locale)
if (localStorage.getItem('lang') === 'EN') {
  Locale.use('en-US', enUSMessages)
}
// 按需引入cube-ui组件库
import {Style, Switch, Toast, Dialog, ActionSheet, Drawer, Scroll, IndexList} from 'cube-ui'


Vue.use(Switch)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(ActionSheet)
Vue.use(Drawer)
Vue.use(Scroll)
Vue.use(IndexList)

Vue.use(VueClipboard)
Vue.component('app-header', appHeader)
Vue.mixin(globalMixin)

Vue.prototype.$fetch = fetch
Vue.prototype.$axios = axios
Vue.config.productionTip = false

//配置全局过滤器
Object.keys(customFiter).forEach(key => {
  Vue.filter(key, customFiter[key])
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
