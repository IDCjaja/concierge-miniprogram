const app = getApp();

Page({
  data: {
    tabList: [
      {"text": "当前预约"},
      {"text": "历史预约"}
    ],
    currentIndex: 0
  },
  onLoad() {
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations',
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        console.log(res)
      }
    })
  },
  changeState(event) {
    this.setData({
      currentIndex: event.currentTarget.dataset.tabIndex
    })
  }
})