const app = getApp()

Page({
  onLoad(){
    wx.getStorage({
      key: 'projectDetail',
      success: res => {
        this.setData({
          description: res.data
        })
      }
    })
    wx.getStorage({
      key: 'projectName',
      success: res => {
        wx.setNavigationBarTitle({
          title: res.data
        })
      }
    })
  }
})