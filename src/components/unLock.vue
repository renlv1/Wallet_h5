<template>
  <transition name="dialog">
    <div class="pay-popup c-page" v-if="show">
      <div class="pay-popup-wrap border-bg">
        <i class="cubeic-close close" @click="cancel"></i>
        <div class="pay-popup-tit" v-if="!unlock">解锁验证 <span class="cblue">{{amount}}</span></div>
        <div class="pay-popup-tit" v-else>您的账户被锁定， 请解锁</div>
        <div class="form">
          <div class="input-wrap" v-if="$store.state.openTradePassword === 2">
            <input class="input" type="password" v-model="tradePwd" placeholder="请输入交易密码" @input="changeFlag">
          </div>
          <div class="input-wrap" v-if="$store.state.openTradePassword !== 2">
            <input class="input" type="password" v-model="tradePwd" placeholder="请输入登录密码" @input="changeFlag">
          </div>
          <div class="input-wrap" v-if="$store.state.openGoogleCode !== 2 && $store.state.openMobileCode === 2">
            <input class="input" type="tel" v-model="mobileCode" placeholder="请输入手机验证码" @input="changeFlag">
          </div>
          <div class="input-wrap" v-if="$store.state.openGoogleCode === 2">
            <input class="input" type="tel" v-model="mobileCode" placeholder="请输入谷歌验证码" @input="changeFlag">
          </div>
        </div>
        <button @click="submit" class="btn">提交</button>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    amount: String,
    unlock: Boolean
  },
  data () {
    return {
      show: false,
      tradePwd: '',
      mobileCode: '',
      flag: true
    }
  },
  methods: {
    changeFlag() {
      this.$emit('changeFlag')
    },
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.show = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
  @yellow: #e7ac50;
  @red: #e93a3a;
  @mob: ~'screen and (max-width:1200px)';
  @smallMob: ~'screen and (max-width:320px)';
  @bgColor: #f5f6fa;
  .gap{
    padding-left: 4%;
    padding-right: 4%;
  }
  .justify{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input-wrap{
    margin-bottom: 14px;
    .input{
      width: 100%;
      height: 36px;
      padding: 0 15px;
      color: @blue;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color .3s;
      border-radius: 30px;
      &:focus{
        border-color: @blue;
      }
    }
  }

  .pay-popup{
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    .pay-popup-wrap{
      position: absolute;
      min-height: auto;
      left: 50%;
      top:50%;
      border-radius: 6px;
      transform: translate(-50%,-50%);
      background: #fff;
      width: 82% !important;
      padding: 30px;
    }
    &-tit{
      font-weight: bold;
      font-size: 18px;
      text-align: center;
      @media @mob{
        padding-bottom: 30px;
      }
    }
    .btn{
      display: block;
      margin: 26px auto 0 !important;
      border-radius: 30px;
      height: 40px;
      line-height: 40px;
    }
    .close{
      position: absolute;
      cursor: pointer;
      &:hover{
        color: red;
      }
      @media @mob{
        right: 16px;
        top: 19px;
        font-size: 20px;
      }
    }
  }
  .dialog-enter,.dialog-leave-to{
    opacity: 0;
    .pay-popup-wrap{
      transform: translate(-50%, -55%)
    }
  }
  .dialog-enter-active{
    transition: .3s;
    .pay-popup-wrap{
      transition: .3s
    }
  }
  .dialog-leave-active{
    transition: .1s;
    .pay-popup-wrap{
      transition: .1s
    }
  }

</style>
