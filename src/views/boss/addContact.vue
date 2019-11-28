<template>
  <div class="c-page">
    <app-header>
      {{$t('addContact.text1')}}
      <template v-slot:right>
        <span @click="submit"> {{$t('addContact.text2')}}</span>
      </template>
    </app-header>
    <div class="main">
      <div class="input-wrap">
        <label>{{$t('boss.text2')}}</label>
        <div class="row">
          <input type="text" v-model="input" :placeholder="$t('addContact.text3')">
          <div v-show="showSelectCode" @click="$refs.drawer.show()">+{{selectedCode}} <span class="cubeic-select" ></span></div>
        </div>
      </div>
      <div class="options">
        <div class="item" v-for="(item, index) in list" :class="{active: activeIndex === index}" @click="selectType(item, index)" :key="index">
          {{item}}
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <cube-drawer
      ref="drawer"
      :data="telCode">
      <span slot="title">{{$t('addContact.text4')}}</span>
      <cube-drawer-panel
        v-for="(panel, index) in telCode"
        :key="index"
        :index="index"
      >
        <cube-drawer-item @click.native="selectedCode = item.code" v-for="(item, i) in panel" :item="item" :key="i" :index="i">
          <span class="tel-item"><i>+{{item.code}}</i> ({{item.ch}})</span>
        </cube-drawer-item>
      </cube-drawer-panel>
    </cube-drawer>
  </div>
</template>

<script>
import telCodeData from '@/assets/js/telcode.json'
export default {
  data () {
    return {
      list: this.$t('addContact.list'),
      telCode: [telCodeData],
      showDrawer: false,
      selectedCode: '86',
      showSelectCode: false,
      contactJSON: {},
      contactType: '',
      activeIndex: -1,
      input: ''
    }
  },
  mounted() {
  },
  methods: {
    selectType (type, index) {
      this.contactType = type
      this.activeIndex = index
      if (index === 2) {
        this.showSelectCode = true
      } else {
        this.showSelectCode = false
      }
    },
    submit () {
      if (!this.input) {
        this.$toast(this.$t('addContact.text5'))
      } else if (!this.contactType) {
        this.$toast(this.$t('addContact.text6'))
      } else {
        if (this.activeIndex === 2) {
          this.input = this.selectedCode + ' ' + this.input
        }
        const way = this.$store.state.cacheBossInfo.contactWay
        let contactWay = (way && JSON.parse(way)) || {}
        contactWay[this.contactType] = this.input
        contactWay = JSON.stringify(contactWay)
        this.$editBossInfo({contactWay}, () => {
          this.$toast({
            msg: this.$t('addContact.text7'),
            onTimeout: () => {
              this.$router.back()
            }
          })
        })

      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-wrap{
  padding: 0.3rem;
  padding-top: 0.6rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: .7rem;
  font-size: 0.32rem;
  label{
    display: block;
    padding-bottom: 0.3rem;
  }
  input{
    flex: 1;
    padding: 0 .1rem;
  }
}
.options{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 .3rem;
  .item{
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: .3rem;
    line-height: 0.68rem;
    text-align: center;
    color: #999;
    width: 23%;
    &.active{
      border-color: @blue;
      color: @blue;
    }
  }
}
.c-page{
  /deep/ .cube-drawer-main{
    padding-top: 44px;
    .ios & {
      padding-top: 64px;
    }
    .iosx &{
      padding-top: 88px;
    }
    .tel-item{
      font-size: .24rem;
      i{
        font-size: .28rem;
        display: inline-block;
        width: 1rem;
      }
    }
  }
}
</style>
<style>
.cube-drawer-panel{
  width: 70vw !important;
}
</style>
