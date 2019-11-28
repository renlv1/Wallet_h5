<template>
  <!-- dialog弹出框 -->
  <transition name="mask-bg-fade">
    <div class="mask" v-show="show">
      <div class="mask_bg"></div>
      <transition name="slide-fade">
        <div class="modelBox" v-show="show">
          <div class="tipIcon"></div>
          <div class="closeModel" v-on:click="closeModel()"></div>
          <div class="title">{{confirmModalOptions.title || ""}}</div>
          <div class="message textCenter" v-html="confirmModalOptions.message"></div>
          <div class="model_btnBox">
                        <span class="dh_button" v-on:click="confirmCancel()" v-show="isCancelShow">{{this.$t('common.dialog.text1')}}</span>
            <span class="dh_button" v-on:click="confirmSubmit()">{{this.$t('common.dialog.text2')}}</span>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "vueDialog",
  props: {
    isCancelShow: {
      type: Boolean,
      default: true
    },
    confirmModalOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false,   // 是否显示模态框
    }
  },
  methods: {
    closeModel() {
      this.show = false;
    },
    showModel() {
      this.show = true;
    },
    confirmCancel() {
      this.confirmModalOptions.confirmCancel()
    },
    confirmSubmit() {
      this.confirmModalOptions.confirmSubmit()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .mask
    .mask_bg
      height 100%
      position fixed
      z-index 1000
      top 0
      right 0
      left 0
      bottom 0
      background rgba(0, 0, 0, 0.6)
    .modelBox
      padding 0 .35rem
      width 80%
      position fixed
      left 50%
      top 50%
      transform translate(-50%, -50%)
      z-index 3000
      background-color #fff
      border-radius 5px
      .message
        font-size .3rem
        text-align center
        margin .6rem auto .62rem
        line-height 1.8
        width 80%
        color #000
        font-family "微软雅黑 Light"
      .model_btnBox
        display flex
        flex 1
        height 50px
        line-height 50px
        border-top 1px dotted #000
        width 100%
        span
          font-size .28rem
          display inline-block
          flex 1
          text-align center
        span:nth-of-type(1)
          color #000
        span:nth-of-type(2)
          color #4e7dff
</style>
