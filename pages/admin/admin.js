const app =getApp();

Page({
  data: {
    loading: true,
    nomoreData: true,
    refresh: true,
    pageIndex: 1,
    projects: [],
    currentPageProjects: []
  },
  STATE_TEXT: {
    open: '开启',
    close: '暂停'
  },
  refreshData(){
    wx.request({
      url: app.globalData.server + "/miniprogram/admin/projects",
      header: {
        'Authorization': app.globalData.token
      },
      success: res => {
        res.data.projects.forEach(item => {
          item.image = app.globalData.server + item.image;
          item.state = this.STATE_TEXT[item.state]
        });
        this.setData({
          projects: res.data.projects,
          pageIndex: 1,
          currentPageProjects: res.data.projects,
        })
        setTimeout(()=>{
          wx.stopPullDownRefresh()
          this.setData({
            refresh: true
          })
        },1000)
      }
    })
  },
  onLoad(){
    this.refreshData();
  },
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.currentPageProjects.length == 4) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/admin/projects?page=" + this.data.pageIndex,
        header: {
          'Authorization': app.globalData.token
        },
        success: (res)=> {
          if(res.data.projects.length) {
            res.data.projects.forEach(item => {
              item.image = app.globalData.server + item.image;
              item.state = this.STATE_TEXT[item.state]
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
  },
  onPullDownRefresh(){
    this.setData({
      refresh: false
    })
    this.refreshData();
  }
})