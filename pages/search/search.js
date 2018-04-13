const app = getApp()

Page({
  data: {
    projects:[],
    noResult: true,
    loading: true,
    nomoreData: true,
    pageIndex: 1,
    currentPageProjects: [],
    searchContent: ''
  },
  searchProjects(event) {
    var value = event.detail.value;
    this.setData({
      searchContent: value
    })
    wx.request({
      url: encodeURI(app.globalData.server + "/miniprogram/projects?search=" + value),
      success:(res)=> {
        if(res.data.projects.length) {
          res.data.projects.forEach((item)=> {
            item.cover = app.globalData.server + item.cover;
          })
          this.setData({
            projects: res.data.projects,
            currentPageProjects: res.data.projects,
            noResult: true
          })
        } else {
          this.setData({
            projects: res.data.projects,
            noResult: false
          })
        }
      }
    })
  },
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.currentPageProjects.length == 3) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: encodeURI(app.globalData.server + "/miniprogram/projects?search="+this.data.searchContent+"&page="+this.data.pageIndex),
        success: (res)=> {
          if(res.data.projects.length) {
            res.data.projects.forEach(function(item) {
              item.cover = app.globalData.server + item.cover;
            });
            this.setData({
              loading: true,
              currentPageProjects: res.data.projects,
              projects: this.data.projects.concat(res.data.projects)
            });
          } else {
            setTimeout(()=>{
              this.setData({
                loading: true,
                nomoreData: false,
                pageIndex: this.data.pageIndex - 1
              })
            },1000)
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
  }
})