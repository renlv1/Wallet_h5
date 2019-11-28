<template>
  <div class="c-page">
    <app-header>{{$t('trade.text4')}}</app-header>
    <div class="main friend">
      <div class="lately">
        <cube-index-list :data="list">
          <cube-index-list-group
            v-for="(group, index) in list"
            :key="index"
            :group="group">
            <cube-index-list-item
              v-for="(item, index) in group.items"
              :key="index"
              @select="jump(item)"
              :item="item">
              <div class="custom-item row">
                <img :src="item.imgUrl" alt="">
                <p>{{item.nick}}</p>
              </div>
            </cube-index-list-item>
          </cube-index-list-group>
        </cube-index-list>
        <div class="loading" v-show="loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/message/queryUserFriendList').then(res => {
        this.loading = false
        const list = res.data
        let group = []
        let otherGroup = []

        for (let i = 65; i <= 90; i++) {
          let word = String.fromCharCode(i) // 按 A-Z 顺序生成的字母
          list.forEach((item, index) => {
            const nick = item.nick && item.nick.substring(0, 1).toUpperCase() // 昵称首字母
            const isOtherWord = !/^[A-Z]+$/.test(nick) // 昵称是否为非英文
            if (word === nick) {
              const index = group.findIndex(val => nick === val.name) // 判断是否已保存过相同的字母
              if (index > -1) {
                group[index].items.push(item)
              } else {
                group.push({
                  name: word,
                  items: [item]
                })
              }
            } else if (isOtherWord) {
              list.splice(index, 1)
              otherGroup.push(item)
            }
          })
        }
        if (otherGroup.length) {
          group.push({
            name: '#',
            items: otherGroup
          })
        }

        this.list = group
      })
    },
    jump (item) {
      this.$router.push(`/transferConfirm?data=${JSON.stringify(item)}`)
    }
  }
};
</script>

<style lang="less" scoped>
.lately{
  height: calc(100vh - 100px);
}
.friend{
  .text{
    padding: .3rem;
  }
  .lately{
    .row{
      padding: 0.2rem 16px;
      & + .row{
        border-top: 1px solid #f0f0f0;
      }
      img{
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        margin-right: 0.2rem;
      }
      p{
        flex: 1;
      }
    }
  }
}
</style>
<style>
.cube-index-list-item + .cube-index-list-item{
  border-top: 1px solid #f4f4f4;
}
</style>

