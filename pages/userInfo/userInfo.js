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
      url: '../useGuide/useGuide'
    })
  },
  admin (){
    var role = app.globalData.role;
    if(role !== 'customer'){
      wx.navigateTo({
        url: '../admin/admin'
      })
    }else{
      wx.navigateTo({
        url: '../regist/regist'
      })
    }
  },
  category (){
    wx.navigateTo({
      url: '../groupRecord/groupRecord'
    })
  }
})