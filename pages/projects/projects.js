const app = getApp();

Page({
  STATE_TEXT: {
    success: '已成功',
    wait: '待审核'
  },
  data: {
    tabList: [
      {"text": "当前预约"},
      {"text": "历史预约"}
    ],
    currentTabIndex: 0,
    reservationsList: [],
    loading: true,
    nomoreData: true,
    currentPageReservations: [],
    pageIndex: 1
  },
  onShow() {
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations',
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        this.setData({
          reservationsList: this.formatReservations(res.data.reservations),
          pageIndex: 1,
          currentPageReservations: this.formatReservations(res.data.reservations)
        })
      }
    })
  },
  changeState(event) {
    this.setData({
      currentTabIndex: event.currentTarget.dataset.tabIndex
    })
  },
  formatReservations(array) {
    array.forEach(item => {
      if(this.STATE_TEXT[item.state]) {
        item.state = this.STATE_TEXT[item.state]
      }
    })
    return array;
  },
  search() {
    wx.navigateTo({
      url: '../search/search?type=reservations'
    })
  },
  showDetail(event) {
    wx.navigateTo({
      url: "../detail/detail?id=" + event.currentTarget.dataset.reservationId
    })
  },
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.currentPageReservations.length == 4) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/reservations?page="+this.data.pageIndex,
        header: {
          'Authorization': app.globalData.token
        },
        success: (res)=> {
          if(res.data.reservations.length) {
            this.setData({
              loading: true,
              currentPageReservations: this.formatReservations(res.data.reservations),
              reservationsList: this.data.reservationsList.concat(this.formatReservations(res.data.reservations))
            });
          } else {
            setTimeout(()=>{
              this.setData({
                loading: true,
                nomoreData: false,
                pageIndex: this.data.pageIndex - 1
              })
            },1000)
          }
        }
      });
    } else {
      setTimeout(()=>{
        this.setData({
          loading: true,
          nomoreData: false
        })
      },1000)
    }
  }
})