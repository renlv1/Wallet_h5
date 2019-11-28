<template>
  <div class="c-page">
    <app-header>{{$t('boos.text1')}}</app-header>
    <div class="main">
      <div class="input-item">
        <input type="text" :disabled="isDisabled" :value="detail.realName">
        <input type="text" :disabled="isDisabled" :value="detail.location">
      </div>
      <div class="set">
        <div class="cell" @click="$router.push('/contactWay')">
          <span>{{$t('boos.text2')}}</span>
          <i class="cubeic-arrow cgray">{{$t('boos.text3')}}</i>
        </div>
        <div class="cell" @click="$router.push('/rechargeSet')">
          <span>{{$t('boos.text4')}}</span>
          <i class="cubeic-arrow cgray">{{$t('boos.text3')}}</i>
        </div>
        <div class="cell" @click="$router.push('/withdrawSet')">
          <span>{{$t('boos.text5')}}</span>
          <i class="cubeic-arrow cgray">{{$t('boos.text3')}}</i>
        </div>
      </div>
      <div class="loading" v-if="loading"></div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      detail: {},
      loading: true,
      isDisabled: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      const address = this.$store.state.user.address
      if (address) {
        this.getBossInfo(address)
      } else {
        this.$fetch.get('/user/balance').then(res => {
          this.getBossInfo(res.data.user.address)
        })
      }
    },
    getBossInfo (bossAddress) {
      this.$fetch.post('/boss/queryBossInfoByAddress', {
        bossAddress
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.detail = res.data
          this.$store.commit('SET_BOSS_INFO', res.data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.input-item{
  padding-left: 0.3rem;
  border-bottom: .2rem solid #f8f8f8;
  input{
    width: 100%;
    height: 1.12rem;
    font-size: 0.3rem;
    &+input{
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>


