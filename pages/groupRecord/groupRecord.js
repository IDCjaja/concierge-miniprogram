const app = getApp();

Page({
  onLoad(){
    wx.getStorage({
      key: 'groupRecord',
      success: res => {
        this.setData({
          groupRecord: res.data
        })
      }
    })
  },
  showGroup(event){
    var id = event.currentTarget.dataset.groupId;
    wx.navigateTo({
      url: "../group/group?id=" + id
    })
  }
})