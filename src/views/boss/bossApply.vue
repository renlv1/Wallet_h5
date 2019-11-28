<template>
  <div class="c-page">
    <app-header>钱老板</app-header>
    <div class="main">
      <div class="input-item">
        <input type="text" v-model="realName" placeholder="请输入姓名">
        <input type="text" v-model="location" placeholder="请输入地址">
      </div>
      <div class="set">
        <div class="cell" @click="$router.push('/contactWay')">
          <span>联系方式</span>
          <i class="cubeic-arrow" v-if="cache.contactWay">已设置</i>
          <i class="cubeic-arrow cgray" v-else>未设置</i>
        </div>
        <div class="cell" @click="$router.push('/rechargeSet')">
          <span>充值设置</span>
          <i class="cubeic-arrow" v-if="cache.depositeSetCNY || cache.depositeSetUSD ">已设置</i>
          <i class="cubeic-arrow cgray" v-else>未设置</i>
        </div>
        <div class="cell" @click="$router.push('/withdrawSet')">
          <span>提现设置</span>
          <i class="cubeic-arrow" v-if="cache.drawSetCNY || cache.drawSetUSD ">已设置</i>
          <i class="cubeic-arrow cgray" v-else>未设置</i>
        </div>
        <div class="cell">
          <span>钱老板保证金</span>
          <i class="cgray">{{detail.bailAmount}}{{detail.bailCurrency}}</i>
        </div>
      </div>
      <div class="fixed-btn">
        <button class="btn" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      detail: {},
      pageIndex: 1,
      noMore: false,
      realName: '',
      location: ''
    }
  },
  computed: {
    cache: function () {
      return this.$store.state.cacheBossInfo
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/boss/getBossApplyBailAndCurrency').then(res => {
        this.detail = res.data
      })
    },
    submit () {
      let contactWay = this.cache.contactWay
      let depositeCNY = this.cache.depositeSetCNY
      let depositeUSD = this.cache.depositeSetUSD
      let drawCNY = this.cache.drawSetCNY
      let drawUSD = this.cache.drawSetUSD
      if (!this.realName) {
        this.$toast('请填写姓名')
      } else if (!this.location) {
        this.$toast('请填写地址')
      } else if (!this.location) {
        this.$toast('请填写地址')
      } else if (!contactWay) {
        this.$toast('请设置联系方式')
      } else if (!depositeCNY && !depositeUSD) {
        this.$toast('请设置充值信息')
      } else if (!drawCNY && !drawUSD) {
        this.$toast('请设置提现信息')
      } else {
        let depositeSet = []
        let drawSet = []
        if (depositeCNY) {
          depositeSet.push(depositeCNY)
        }
        if (depositeUSD) {
          depositeSet.push(depositeUSD)
        }
        if (drawCNY) {
          drawSet.push(drawCNY)
        }
        if (drawUSD) {
          drawSet.push(drawUSD)
        }
        this.$fetch.post('/boss/applyBoss', {
          realName: this.realName,
          location: this.location,
          contactWay: JSON.stringify(contactWay),
          depositeSet: JSON.stringify(depositeSet),
          drawSet: JSON.stringify(drawSet),
          loading: true
        }).then(res => {
          if (res.success) {
            this.$toast('申请成功')
          }
          // this.detail = res.data
        })
      }

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


