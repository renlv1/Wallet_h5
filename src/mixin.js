export default {
  methods: {
    $toast (params) {
      if (typeof params === 'string') {
        params = {
          msg: params
        }
      }
      this.$createToast({
        type: 'txt',
        txt: params.msg,
        time: params.onTimeout ? 1000 : 2000,
        onTimeout: () => {
          params.onTimeout && params.onTimeout()
        }
      }).show()
    },
    $dialog (params) {
      const {type, icon, title, msg = params} = params
      this.$createDialog({
        type,
        icon,
        title,
        content: msg,
        onConfirm: (e, promptValue) => {
          params.okFn && params.okFn(e, promptValue)
        },
        onCancel: () => {
          params.cancelFn && params.cancelFn()
        }
      }).show()
    },
    $copySuccess () {
      this.$toast(this.$t('account.text15'))

    },
    $status2text (status, isRecharge) {
      let statusText = ''
      if (isRecharge) {
        switch (status) {
          case 1:
            statusText = this.$t('common.switch.text1')
            break
          case 2:
            statusText = this.$t('common.switch.text2')
            break
          case 3:
            statusText = this.$t('common.switch.text3')
            break
          case 4:
            statusText = this.$t('common.switch.text4')
            break
          case 5:
            statusText = this.$t('common.switch.text5')
            break
          case 6:
            statusText = this.$t('common.switch.text6')
            break
          case 7:
            statusText = this.$t('common.switch.text7')
            break
          case 8:
            statusText = this.$t('common.switch.text8')
            break
          case 9:
            statusText = this.$t('common.switch.text9')
            break
          case 10:
            statusText = this.$t('common.switch.text10')
            break
        }
      } else {
        switch (status) {
          case 1:
            statusText = this.$t('common.switch.text1')
            break
          case 2:
            statusText = this.$t('home.text6')
            break
          case 3:
            statusText = this.$t('common.switch.text2')
            break
          case 4:
            statusText = this.$t('common.switch.text3')
            break
          case 5:
            statusText = this.$t('common.switch.text11')
            break
          case 6:
            statusText = this.$t('common.switch.text12')
            break
          case 7:
            statusText = this.$t('common.switch.text7')
            break
          case 8:
            statusText = this.$t('common.switch.text8')
            break
          case 9:
            statusText = this.$t('common.switch.text9')
            break
          case 10:
            statusText = this.$t('common.switch.text13')
            break
          case 11:
            statusText = this.$t('common.switch.text14')
            break
        }
      }
      return statusText
    },
    $editBossInfo (params, cb) {
      const boss = this.$store.state.bossInfo
      const depositeSet = boss.depositeSet
      const drawSet = boss.drawSet
      let _depositeSet
      let _drawSet
      // debugger
      if (params.depositeSet) {
        if (params.depositeSet.currency === 'CNY') {
          _depositeSet = [
            params.depositeSet,
            depositeSet[1]
          ]
        } else {
          _depositeSet = [
            depositeSet[0],
            params.depositeSet
          ]
        }
      }
      if (params.drawSet) {
        if (params.drawSet.currency === 'CNY') {
          _drawSet = [
            params.drawSet,
            drawSet[1]
          ]
        } else {
          _drawSet = [
            drawSet[0],
            params.drawSet
          ]
        }
      }
      let bossInfo = {
        bossInfoId: boss.id,
        location: boss.location,
        contactWay: boss.contactWay,
        depositeSet: JSON.stringify(_depositeSet || depositeSet),
        drawSet: JSON.stringify(_drawSet || drawSet),
        loading: true
      }

      if (params.contactWay) {
        bossInfo = Object.assign(bossInfo, params)
      }

      this.$fetch.post('/boss/editBossInfo', bossInfo).then(res => {
        if (res.success) {
          cb && cb()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    $openChat (name) {
      window.webkit.messageHandlers.contact.postMessage(name)
    }
  }
}