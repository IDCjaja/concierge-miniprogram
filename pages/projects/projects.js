const app = getApp();

Page({
  STATE_TEXT: {
    success: '已成功',
    wait: '待审核',
    overtime: '已过期',
    refused: '已拒绝',
    checked: '已核销',
    cancelled: '已取消'
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
    refresh: true,
    currentPageReservations: [],
    pageIndex: 1
  },
  refreshData(){
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
        wx.stopPullDownRefresh()
        this.setData({
          refresh: true
        })
      }
    })
  },
  onShow() {
    this.refreshData()
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
    var id = event.currentTarget.dataset.reservationId;
    var reservationInfo;
    this.data.reservationsList.forEach(item => {
      if(item.id == id){
        reservationInfo = item;
        wx.setStorage({
          key: 'reservationInfo',
          data: reservationInfo
        })
      }
    });
    wx.navigateTo({
      url: "../detail/detail"
    })
  },
  openMap(event) {
    wx.request({
      method: "GET",
      url: app.globalData.server + '/miniprogram/reservations/' + event.currentTarget.dataset.reservationId,
      header: {
        'Authorization': app.globalData.token
      },
      success:(res) =>{
        wx.openLocation({
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          name: res.data.project_name,
          address: res.data.address
        })
      }
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
            this.setData({
              loading: true,
              nomoreData: false,
              pageIndex: this.data.pageIndex - 1
            })
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
  },
  onPullDownRefresh(){
    this.setData({
      refresh: false
    })
    this.refreshData();
  }
})