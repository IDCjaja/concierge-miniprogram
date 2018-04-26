const app = getApp()


Page({
  data: {
    reservation: {}
  },
  onLoad(options) {
    wx.getStorage({
      key: 'reservationInfo',
      success: (res) => {
        if(res.data.state != "已成功" && res.data.state != "待审核"){
          this.setData({
            orderAgain: false,
            orderCancel: true
          })
        }else{
          this.setData({
            orderAgain: true,
            orderCancel: false
          })
        }
        this.setData({
          reservation: res.data,
          project_id: res.data.project_id,
          id: res.data.id
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
  },
  orderAgain(){
    wx.navigateTo({
      url: "../introduce/introduce?id=" + this.data.project_id
    })
  },
  orderCancel(){
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations/'+ this.data.id +'/cancel',
      method: 'POST',
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        if(res.statusCode == 201){
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 2000
          })
        }else if(res.statusCode == 401 || res.statusCode == 403){
          wx.showToast({
            title: '没有权限',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})