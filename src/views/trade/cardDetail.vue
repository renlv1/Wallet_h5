<template>
  <div class="c-page has-fixed">
    <app-header>账户详情</app-header>
    <div class="main">
      <div class="section">
        <!-- <div class="line">
          <span>付款方式</span>
          <i>{{detail.bankType === 1 ? '银行卡' : '第三方'}}</i>
        </div> -->
        <div class="line">
          <span>发卡银行</span>
          <i>{{detail.bankName}}</i>
        </div>
        <div class="line">
          <span>持卡人</span>
          <i>{{detail.realName}}</i>
        </div>
        <div class="line">
          <span>银行卡号</span>
          <i>{{detail.bankNumber}}</i>
        </div>
      </div>
      <div class="tit">其他</div>
      <div class="section" v-if="detail.bankType === 1">
        <div class="line">
          <span>国家</span>
          <i v-if="detail.country">{{detail.country}}</i>
          <span v-else>未填</span>
        </div>
        <div class="line">
          <span>分行</span>
          <i v-if="detail.subBankName">{{detail.subBankName}}</i>
          <span v-else>未填</span>
        </div>
        <div class="line">
          <span>地址</span>
          <i v-if="detail.bankAddress">{{detail.bankAddress}}</i>
          <span v-else>未填</span>
        </div>
        <div class="line">
          <span>swift</span>
          <i v-if="detail.swift">{{detail.swift}}</i>
          <span v-else>未填</span>
        </div>
        <div class="line">
          <span>Iban</span>
          <i v-if="detail.iban">{{detail.iban}}</i>
          <span v-else>未填</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: JSON.parse(this.$route.query.data)
    };
  },
  mounted() {
    // this.getData()
  },
  methods: {
    getData() {
      this.$fetch.post('/bank/queryBankInfoList', {
        currency: this.currency,
        pageSize: 20,
        pageIndex: 1
      }).then(res => {
        this.list = res.data
      })
    },
    show () {
      this.$createActionSheet({
        data: [
          {
            content: `银行卡`
          },
          {
            content: '第三方'
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
    }
  }
};
</script>

<style lang="less" scoped>
.section{
  border-bottom: 1px solid #eee;
  padding: .4rem 0;
  span{
    color: #aaa;
  }
  .line{
    padding: .15rem .3rem;
    span{
      display: inline-block;
      min-width: 1.8rem;
    }
  }
}
.tit{
  line-height: 0.68rem;
  background: #f0f0f0;
  padding-left: .3rem;
}

</style>
