<template>
  <div class="c-page">
    <app-header>{{$t('currencySet.text13')}}</app-header>
    <div class="main">
      <div class="cell" v-for="(item, index) in list" :key="index" @click="select(item)">
        <span>{{item.baseGateway.currency}} / {{item.customGateway.currency}}</span>
        <span class="cubeic-arrow"></span>
      </div>
      <div class="loading" v-if="!list.length"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.get('/entrust/getewayList').then(res => {
        if (res.success) {
          this.list = res.data.currencyPairList
        } else {
          this.$toast(res.msg)
        }
      })
    },
    select (item) {
      this.$store.commit('SET_GATEWAY', item)
      this.$router.back()
    }
  }
};
</script>

<style lang="less" scoped>

</style>
