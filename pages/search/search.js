const app = getApp()

Page({
  data: {
    projects:[],
    noResult: true
  },
  searchProjects(event) {
    var value = event.detail.value;
    wx.request({
      url: encodeURI(app.globalData.server + "/miniprogram/projects?search=" + value),
      success:(res)=> {
        if(res.data.projects.length) {
          res.data.projects.forEach((item)=> {
            item.cover = app.globalData.server + item.cover;
          })
          this.setData({
            projects: res.data.projects,
            noResult: true
          })
        } else {
          this.setData({
            noResult: false
          })
        }
      }
    })
  }
})