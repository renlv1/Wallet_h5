<template>
  <div class="c-page">
    <app-header>申诉</app-header>
    <div class="taskDetail">
      <div class="input-item" :class="{isIosx: iosx}">

        <div class="input-box">
          <div class="label">申诉原因</div>
          <div class="input">
            <span>对方不确认收款</span>
            <span class="cubeic-arrow"></span>
          </div>
        </div>

        <div class="label">申诉说明</div>
        <div class="textarea-box">
          <textarea class="textarea" :disabled="onlyLook" v-model="taskContent" @input="textareaVal" :placeholder="$t('activity.text25')"></textarea>
          <div class="warm-num" v-if="!onlyLook"><span class="text-count">{{addNum}}</span>/<span>100</span></div>
        </div>
      </div>
      <div class="picture-box">
        <ul class="uls-item">
          <li v-for="(item, index) in imgDataObj" :key="index">
            <img :src="item" alt="">
            <div class="delete-box" v-if="!onlyLook"  @click.stop.prevent="deleteIndex(index, 1)">
              <!-- <div class="delete-icon"><img class="delete" src="@img/activity/delete.png"></div> -->
            </div>
          </li>
        </ul>
        <div  class="img-loading-box" v-show="isLoading">
          <!-- <img  src="@img/activity/loading.gif" alt="" class="img-loading"> -->
        </div>
        <div class="add-box" v-show="isMaxLoading && !onlyLook">
          <input @change="fileChange()" ref="uploadFile" accept="image/*" placeholder="" type="file" class="upload_file"  id="upload_file"/>
          <!-- <div  class="text"><img class="upload_add" src="@img/activity/uoload_add.png" alt=""></div> -->
        </div>
      </div>
      <div class="fixed-btn">
        <button class="btn">提交申诉</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        iosx: false,
        editFlag: this.$route.query.editFlag, // 1:修改2:任务设置使用中3:删除
        defaultTask: this.$route.query.defaultTask,
        taskName: '',
        taskContent: '',
        addNum: '0', // 字数,
        noneImg: '',
        myfile1: '',
        imagesArr: [],
        imgDataObj: [],
        fileName: [], //保存传这个
        fileImg: '', // 数组转字符串传给后台
        isMaxLoading: true,
        isLoading: false,
        money: '',
        state: false,
        time: '',
        onlyLook: !!this.$route.query.onlyLook,
        detail: {},
        id: ''
      }
    },
    methods: {
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 输入文字控制
      textareaVal () {
        this.addNum = this.taskContent.length
        if (this.taskContent.length > 100) {
          this.addNum = 100
          this.taskContent = this.taskContent.substring(0, 100)
        }
      },
      async fileChange () {
        this.noneImg = ''
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD(this.$t('shop.text5'))
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        if (this.imgDataObj.length > 2) {
          this.toastD(this.$t('shop.text6'))
          // this.noneImg = '最多上传3张'
          imgVal.value = ''
          return
        }
        this.isLoading = true
        this.myfile1 = imgObj
        this.imgReader1()
        if (this.imgDataObj.length > 1) {
          this.isMaxLoading = false
        } else {
          this.isMaxLoading = true
        }
      },
      imgReader1() {
        let self = this
        let imgVal = this.$refs.uploadFile
        let formData = new FormData()
        formData.append('file', this.myfile1)
        formData.append('sourceType', '2')
        // let config = {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // }
        self.$fetch.postFormdata(`/blobfile/uploadBlobFile`, formData).then((res) => {
          if (res.success === true) {
            self.isLoading = false
            // this.fileName.push(res.data[0].fileName)  // 保存传这个
            this.imgDataObj.push(res.data[0].fileUrl)
          }
          // let rets = res.data
          // self.isLoading = false
          // if (rets.success === true && rets.status === 'success') {
          //   self.noneImg = ''
          //   let srcData = JSON.parse(rets.data)
          //   let src = 'http://ofydu65mj.bkt.clouddn.com/' + srcData.key
          //   self.imgDataObj.push(src)
          //   self.imagesArr.push(src)
          // } else {
          //   self.noneImg = rets.msg
          // }
          //  可上传重复的图片
          imgVal.value = ''
        }).catch((err) => {
          console.log(err)
          self.isLoading = false
          imgVal.value = ''
          self.toastD(this.$t('shop.text7'))
          // self.noneImg = '上传失败'
        })
      },
      deleteIndex (index) {
        this.imgDataObj.splice(index, 1)
        this.imagesArr.splice(index, 1)
        // this.fileName.splice(index, 1)
        if (this.imgDataObj.length > 2) {
          this.isMaxLoading = false
        } else {
          this.isMaxLoading = true
        }
        // this.fileImg = this.fileName.join(',')
      },
      // 保存
      saveBtn() {
        this.$fetch.post('/promotion/merchantPromotionSave', {
          promotionSwitch: this.state ? 1 : 2,
          finishDate: this.time,
          conditionAmount: this.money,
          content: this.taskContent,
          imageList: this.imgDataObj.length ? this.imgDataObj.join(',') : '',
          recordType: 1,
        }).then(res => {
          if (res.success === true) {

            this.toastD(this.$t('activity.text35'))
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          } else {
            this.toastD(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 编辑
      edit (type = 1) {
        this.$fetch.post('/promotion/merchantPromotionEdit', {
          merchantPromotionId: this.id,
          promotionSwitch: this.state ? 1 : 2,
          finishDate: this.time,
          conditionAmount: this.money,
          content: this.taskContent,
          imageList: this.imgDataObj.length ? this.imgDataObj.join(',') : '',
          recordType: 1,
          editFlag: type // 1:修改2:删除
        }).then(res => {
          if (res.success === true) {
            if (type === 1) {
              this.onlyLook = true
              this.toastD(this.$t('activity.text36'))
            } else {
              setTimeout(() => {
                this.$router.back()
              }, 1000)
              this.toastD(this.$t('activity.text37'))
            }
          } else {
            this.toastD(res.msg)
          }
        })
      },
      confirim () {
        this.$createDialog({
          type: 'confirm',
          content: this.$t('activity.text38'),
          onConfirm: () => {
            this.edit(2)
          }
        }).show()
      },
      // 对象转字符串
      concatObj (data) {
        let str = ''
        let arr = Object.keys(data)
        arr.forEach((key, index) => {
          if (index < arr.length - 1) {
            str += `${key}=${data[key]}&`
          } else {
            str += `${key}=${data[key]}`
          }
        })
        return str
      },
      vaInput () {
        if (!/^\d+(\.\d{0,2})?$/.test(this.money)) {
          this.money = this.money.substring(0, this.money.length - 1)
        }
      },
      selectTime () {
        const date = new Date()
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            title: this.$t('activity.text27'),
            min: new Date(),
            max: new Date(2020, 11, 31),
            value: new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), 14, 0),
            columnCount: 5,
            cancelTxt: this.$t('activity.text28'),
            confirmTxt: this.$t('activity.text29'),
            maskClosable: false,
            format: {
              year: 'YYYY' + this.$t('activity.text30'),
              month: 'MM' + this.$t('activity.text31'),
              date: 'DD' + this.$t('activity.text32'),
              hour: 'HH' + this.$t('activity.text33'),
              minute: 'mm' + this.$t('activity.text34')
            },
            onSelect: (date, selectedVal) => {
              const char = ['-', '-', ' ', ':', '']
              let str = ''
              selectedVal.forEach((item, index) => {
                str += this.toDouble(item) + char[index]
              })
              this.time = str
            },
            onCancel: () => {
              // 清除时间
              this.time = ''
            }
          })
        }
        this.datePicker.show()
        this.$nextTick(() => {
          document.querySelector('.cube-popup-mask').addEventListener('click', this.handle)
        })
      },
      handle () {
        this.datePicker.hide()
      },
      toDouble (num) {
        if (num < 10) {
          return '0' + num
        } else {
          return num
        }
      }
    },
    beforeDestroy () {
      if (document.querySelector('.cube-popup-mask')) {
        document.querySelector('.cube-popup-mask').removeEventListener('click', this.handle)
      }
    }
  }
</script>

<style lang="less" scoped>
  .taskDetail{
    font-size: 0.3rem;
    .label{
      padding: 0.4rem 0 .2rem;
    }
    .input{
      background: #f2f4f7;
      height: 1rem;
      padding: 0 .3rem;
      border-radius: 4px;
      .allCenter;
    }
    padding: .3rem;
    .textarea-box {
      outline: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .textarea{
        line-height: 1.5;
        width: 100%;
        border: none;
        border-radius: .1rem;
        background-color: #f2f4f7;
        height: 2rem;
        font-size: 0.3rem;
        padding: .3rem 0 0 .3rem;
      }
      .warm-num{
        text-align: right;
        width: 100%;
        font-size: .28rem;
        color: #999;
        position: absolute;
        z-index: 30;
        right: .2rem;
        bottom: .2rem;
      }
      .go-icon {
        margin-left: .2rem;
        width: 0.15rem;
        height: 0.28rem;
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .picture-box{
      margin: .26rem 0 1.5rem;
      position: relative;
      display: flex;
      width: 100%;
      .uls-item{
        display: flex;
        li{
          position: relative;
          width: 1.68rem;
          height: 1.68rem;
          /*border: .04rem;*/
          /*border-radius: .1rem;*/
          /*background-color: #accff3;*/
          margin-right: .2rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
          .delete-box{
            border-radius: 0 0 .1rem .1rem;
            background-color: rgba(0,0,0,.5);
            z-index: 9;
            position: absolute;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: .5rem;
            .delete-icon{
              width: .32rem;
              height: .32rem;
              .delete{
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .img-loading-box{
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        margin-right: 18px;
        .img-loading{
          display: block;
          width: 50px;
          height: 50px;
        }
      }
      .add-box{
        width: 1.68rem;
        height: 1.68rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        background-color: #fcfcfc;
        border-radius: .08rem;
        .upload_file{
          position: absolute;
          top: 0;
          left: 0;
          width: 1.68rem;
          height: 1.68rem;
          display: block;
          cursor: pointer;
          opacity: 0;
        }
        .text{
          width: 1.68rem;
          height: 1.68rem;
          .upload_add{
            display: block;
            width:100%;
            height:100%;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .cube-switch .cube-switch-input:checked+.cube-switch-ui{
    background-color: #3496f1;
    border-color: #3496f1;
  }
</style>
