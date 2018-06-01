const app = getApp()

const STATE_TEXT =  {
  success: '已成功',
  wait: '待审核',
  overtime: '已过期',
  checked: '已核销',
  cancelled: '已取消'
}

Page({
  data: {
    reservation: {}
  },
  onLoad(options) {
    this.setData({
      mask: false
    })
    wx.getStorage({
      key: 'reservationInfo',
      success: (res) => {
        res.data.state = STATE_TEXT[res.data.state]
        this.setData({
          reservation: res.data,
          project_id: res.data.project_id,
          id: res.data.id,
          mask: true,
          latitude: res.data.latitude,
          longitude: res.data.longitude
        })
      }
    })
  },
  openMap() {
    if(this.data.latitude && this.data.longitude){
      wx.openLocation({
        latitude: this.data.reservation.latitude,
        longitude: this.data.reservation.longitude,
        name: this.data.reservation.project_name,
        address: this.data.reservation.address
      })
    }
  },
  backToHome(){
    wx.switchTab({
      url: "../userInfo/userInfo"
    })
  }
})