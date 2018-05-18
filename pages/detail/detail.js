const app = getApp()


Page({
  data: {
    reservation: {},
    modalHidden: true
  },
  onLoad(options) {
    this.setData({
      mask: false
    })
    wx.getStorage({
      key: 'reservationInfo',
      success: (res) => {
        if(res.data.state != "已成功" && res.data.state != "待审核"){
          this.setData({
            orderAgain: false,
            orderCancel: true
          })
          if(res.data.project_state == "open"){
            this.setData({
              canOrder: false,
              open: false
            })
          }else{
            this.setData({
              canOrder: true,
              open: true
            })
          }
        }else{
          this.setData({
            orderAgain: true,
            orderCancel: false
          })
        }
        this.setData({
          reservation: res.data,
          project_id: res.data.project_id,
          id: res.data.id,
          mask: true
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
  orderAgain(){
    wx.navigateTo({
      url: "../introduce/introduce?id=" + this.data.project_id
    })
  },
  orderCancel(){
    this.setData({
      modalHidden: false
    })
  },
  confirmCancel(){
    wx.request({
      url: app.globalData.server + '/miniprogram/reservations/'+ this.data.id +'/cancel',
      method: 'POST',
      header: {
        'Authorization': app.globalData.token
      },
      success: response => {
        if(response.statusCode == 201){
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(function(){
                wx.navigateTo({
                  url:'../projects/projects'
                })
              }, 1500)
            }
          })
        }else if(response.statusCode == 401 || response.statusCode == 403){
          wx.showToast({
            title: '没有权限',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    this.setData({
      modalHidden: true
    })
  },
  close(){
    this.setData({
      modalHidden: true
    })
  }
})