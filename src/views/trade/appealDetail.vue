<template>
  <div class="c-page">
    <app-header>申诉详情</app-header>
    <div class="main">
      <div class="section">
        <div class="state">
          <img src="@img/appeal_ing.png" alt="">
          <span>申诉中</span>
        </div>
        <div class="tit row">
          <i>原因：对方不确认收款</i>
          <i class="cgray">2018/5/23</i>
        </div>
        <div class="intro">55000</div>
        <div class="img-list">
          <span class="img-item">
            <img src="@img/bg.png" @click="showImage('', j)" alt="">
          </span>
        </div>
      </div>
      <div class="section">
        <div class="tit row">
          <span>你家二狗子 <i class="cgray">的回复</i></span>
          <i class="cgray">2018/5/23</i>
        </div>
        <div class="intro">55000</div>
        <div class="img-list">
          <span class="img-item">
            <img src="@img/bg.png" @click="showImage('', j)" alt="">
          </span>
        </div>
      </div>
      <div class="section">
        <div class="tit row">
          <span class="cblue">平台 <i class="cgray">的回复</i></span>
          <i class="cgray">2018/5/23</i>
        </div>
        <div class="intro">55000</div>
        <div class="img-list">
          <span class="img-item">
            <img src="@img/bg.png" @click="showImage('', j)" alt="">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.$fetch.post('/promotion/queryMerchantPromotionOfUserList', {
      pageIndex: 1,
      pageSize: 10,
      recordType: 1,
      merchantUserAddress: 50
    }).then(res => {
      let list = res.data.merchantPromotionList
      list.forEach(el => {
        if (el.imageList) {
          el.imageList = el.imageList.split(',')
        }
      })
      this.list = list
    })
  },
  methods: {
    showImage (imgs, j) {
      this.$createImagePreview({
        imgs,
        initialIndex: j
      }).show()
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  .section{
    padding: .3rem;
    font-size: 0.26rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.3rem;
    .tit{
      margin-bottom: 0.2rem;
    }
    .state{
      padding-bottom: 0.3rem;
      .vCenter;
      color: @blue;
      img{
        width: 0.32rem;
        margin-right: 0.2rem;
      }
    }
    .intro{
      line-height: 1.5;
      font-size: 0.26rem;
      color: #999;
    }
    .img-list{
      padding-top: 0.3rem;
      img{
        width: 1.4rem;
        height: 1.4rem;
        margin-right: 10px;
        border-radius: 4px;
      }
    }

  }
}
</style>
