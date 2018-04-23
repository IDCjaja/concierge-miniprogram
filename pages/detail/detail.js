const app = getApp()


Page({
  data: {
    reservation: {}
  },
  onLoad(options) {
    wx.getStorage({
      key: 'reservationInfo',
      success: (res) => {
        this.setData({
          reservation: res.data
        })
      }
    })
  },
  openMap() {
    wx.openLocation({
      latitude: this.data.reservation.latitude,
      longitude: this.data.reservation.longitude,
      name: this.data.reservation.project_name,
      address: this.data.reservation.address
    })
  }
})