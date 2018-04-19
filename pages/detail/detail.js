const app = getApp()


Page({
  STATE_TEXT: {
    success: '已成功',
    wait: '待审核'
  },
  data: {
    reservation: {}
  },
  onLoad(options) {
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations/' + options.id,
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        res.data.state = this.STATE_TEXT[res.data.state];
        this.setData({
          reservation: res.data
        })
      }
    })
  }
})