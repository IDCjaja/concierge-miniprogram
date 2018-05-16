const app = getApp()

Page({
  data:{
    userInfo: {}
  },
  myReservation (){
    wx.navigateTo({
      url: '../projects/projects'
    })
  },
  userGuide (){
    wx.navigateTo({
      url: ''
    })
  },
  admin (){
    wx.navigateTo({
      url: '../admin/admin'
    })
  }
})