<template>
  <div class="c-page">
    <app-header>{{$t('boss.text5')}}</app-header>
    <div class="main">
      <div class="set">
        <div class="cell" @click="$router.push(`/withdrawCurrencySet?currency=CNY&card=${JSON.stringify(CNYData)}`)">
          <span>CNY</span>
          <i class="cubeic-arrow" v-if="CNYData">{{$t('boss.text3')}}</i>
          <i class="cubeic-arrow cgray" v-else>{{$t('boss.text8')}}</i>
        </div>
        <div class="cell" @click="$router.push(`/withdrawCurrencySet?currency=USD&card=${JSON.stringify(USDData)}`)">
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
    const drawSet = this.$store.state.bossInfo.drawSet
    if (drawSet && drawSet.length) {
      this.CNYData = drawSet[0]
      this.USDData = drawSet[1]
    } else {
      this.$router.back()
    }
  }
}
</script>

