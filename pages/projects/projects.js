const app = getApp();

const STATE_TEXT =  {
  success: '已成功',
  wait: '待审核',
  overtime: '已过期',
  checked: '已核销',
  cancelled: '已取消'
}
Page({
  data: {
    tabList: [
      {"text": "当前预约"},
      {"text": "历史预约"}
    ],
    stateList: [
      {"text": STATE_TEXT['checked'], "state": "checked"},
      {"text": STATE_TEXT['cancelled'], "state": "cancelled"},
      {"text": STATE_TEXT['overtime'], "state": "overtime"}
    ],
    currentTabIndex: 0,
    currentState: 'checked',
    reservationsList: [],
    loading: true,
    nomoreData: true,
    refresh: true,
    currentPageReservations: [],
    pageIndex: 1
  },
  onShow() {
    this.refreshData()
  },
  refreshData(){
    this.getStateType();
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations?type=' + this.data.stateType,
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        this.setData({
          reservationsList: this.formatReservations(res.data.reservations),
          pageIndex: 1,
          currentPageReservations: this.formatReservations(res.data.reservations)
        })
        setTimeout(()=>{
          wx.stopPullDownRefresh()
          this.setData({
            refresh: true
          })
        },1000)
      }
    })
  },
  getStateType() {
    if(this.data.currentTabIndex === 0) {
      this.setData({
        stateType: 'current'
      })
    } else {
      this.setData({
        stateType: this.data.currentState
      })
    }
  },
  changeTab(event) {
    this.setData({
      currentTabIndex: event.currentTarget.dataset.tabIndex
    })
    this.refreshData()
  },
  changeState(event) {
    this.setData({
      currentState: event.currentTarget.dataset.state
    })
    this.refreshData()
  },
  formatReservations(array) {
    array.forEach(item => {
      if(STATE_TEXT[item.state]) {
        item.state = STATE_TEXT[item.state]
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
    var index = event.currentTarget.dataset.reservationIndex;
    if(this.this.data.reservationsList[index].latitude && this.data.reservationsList[index].longitude){
      wx.openLocation({
        latitude: this.data.reservationsList[index].latitude,
        longitude: this.data.reservationsList[index].longitude,
        name: this.data.reservationsList[index].project_name,
        address: this.data.reservationsList[index].address
      })
    }
  },
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.currentPageReservations.length == 10) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/reservations?type="+this.data.stateType+"&page="+this.data.pageIndex,
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