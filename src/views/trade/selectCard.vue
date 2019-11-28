<template>
  <div class="c-page full">
    <app-header :backFn="back">
      <span>{{$t('trade.text340')}}</span>
      <template v-slot:right v-if="multiple">
        <span @click="confirm">{{$t('activity.text29')}}</span>
      </template>
    </app-header>
    <div class="main-container">
      <div class="bank-card">
        <div class="justify" @click="select(index, item)" v-for="(item, index) in list" :key="index">
          <div class="radio-wrap">
            <div class="radio" :class="{active: selectIndex === index || item.checked}"><span class="cubeic-ok"></span></div>
          </div>
          <div class="item-wrap" :class="{alipay: item.bankName === 'Alipay', wx: item.bankName === 'WeChat'}">
            <div class="item">
              <div class="back-icon">
                <i></i>
              </div>
            </div>
            <div class="item r">
              <h3>{{item.bankName}}</h3>
              <span>{{item.bankType === 1 ? $t('currencySet.text8'): $t('currencySet.text9')}}</span>
              <p>{{item.bankNumber}}</p>
            </div>
          </div>
        </div>
      </div>
      <button class="btn gap" @click="show">{{$t('trade.text2')}}</button>
    </div>
    <div class="loading" v-if="loading"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      selectIndex: -1
    }
  },
  props: {
    currency: {
      type: String,
      default: 'CNY'
    },
    multiple: Boolean
  },
  watch: {
    currency: function () {
      this.loading = true
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$fetch.post('/bank/queryBankInfoList', {
        currency: this.currency,
        pageSize: 100,
        pageIndex: 1
      }).then(res => {
        this.loading = false
        res.data.forEach(item => {
          item.checked = false
        })
        this.list = res.data
      })
    },
    show () {
      this.$createActionSheet({
        data: [
          {
            content: this.$t('rechargeDetail.text5')
          },
          {
            content: this.$t('rechargeDetail.text6')
          }
        ],
        onSelect: (item, index) => {
          if (index === 0) {
            this.$router.push(`/createBank?currency=${this.currency}`)
          } else {
            this.$router.push(`/createOtherPay?currency=${this.currency}`)
          }
        }
      }).show()
    },
    select (index, item) {
      if (this.multiple) {
        item.checked = !item.checked
      }
      else {
        this.selectIndex = index
        this.$parent.selectedCard = this.list[index]
        this.back()
      }
    },
    confirm () {
      let arr = []
      this.list.forEach(item => {
        if (item.checked) {
          arr.push(item)
        }
      })
      this.$parent.selectedCard = arr
      this.back()
    },
    back () {
      this.$parent.showSelectCard = false
    }
  }
}
</script>
<style scoped>
  .app-header,.fixed-btn{
    position: absolute;
  }
  .btn{
    margin-top: 40px !important;
  }
  .full{
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  .main-container{
    flex: 1;
    overflow-y: scroll;
    padding-bottom: .6rem;
  }
</style>
