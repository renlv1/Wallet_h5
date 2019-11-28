<template>
  <div class="c-page">
    <app-header>{{$t('boos.text2')}}</app-header>
    <div class="main">
      <div class="cell" v-for="(val, key, index) in detail" v-if="val" :key="index">
        <i>{{key}}</i>
        <div>
          <i class="cgray">{{val}}</i>
          <!-- <i class="cubeic-close delete" @click="deleteWay(key)"></i> -->
        </div>
      </div>
    </div>
    <div class="fixed-btn">
      <button class="btn" @click="$router.push('/addContact')">修改</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {}
    }
  },
  mounted () {
    this.getBossInfo()
  },
  methods: {
    getBossInfo () {
      this.$fetch.post('/boss/queryBossInfoByAddress', {
        bossAddress: this.$store.state.user.address
      }).then(res => {
        this.loading = false
        if (res.success) {
          const contactWay = res.data.contactWay
          if (contactWay) {
            this.detail = JSON.parse(contactWay)
          }
        }
      })
    },
    deleteWay (key) {
      let _cache = {...this.cache}
      delete _cache[key]
      this.cache = _cache

      let contactWay = this.cache
      if (JSON.stringify(contactWay) === '{}') {
        contactWay = null
      }
      this.$store.commit('SET_BOSS_INFO', {contactWay})
    }
  }
}
</script>

<style lang="less" scoped>
  .delete{
    padding-left: 0.3rem;
    color: red;
  }
</style>
