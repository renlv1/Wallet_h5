<template>
  <div class="c-page">
    <app-header>{{$t('boss.text4')}}</app-header>
    <div class="main">
      <div class="set">
        <div class="cell" @click="$router.push(`/rechargeCurrencySet?currency=CNY&card=${JSON.stringify(CNYData)}`)">
          <span>CNY</span>
          <i class="cubeic-arrow" v-if="CNYData">{{$t('boss.text3')}}</i>
          <i class="cubeic-arrow cgray" v-else>{{$t('boss.text8')}}</i>
        </div>
        <div class="cell" @click="$router.push(`/rechargeCurrencySet?currency=USD&card=${JSON.stringify(USDData)}`)">
          <span>USD</span>
          <i class="cubeic-arrow" v-if="USDData">{{$t('boss.text3')}}</i>
          <i class="cubeic-arrow cgray" v-else>{{$t('boss.text8')}}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      CNYData: '',
      USDData: ''
    }
  },
  created () {
    const depositeSet = this.$store.state.bossInfo.depositeSet
    if (depositeSet && depositeSet.length) {
      this.CNYData = depositeSet[0]
      this.USDData = depositeSet[1]
    } else {
      this.$router.back()
    }
  }
}
</script>

