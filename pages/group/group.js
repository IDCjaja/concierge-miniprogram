const app = getApp();

Page({
  data: {
    loading: true,
    nomoreData: true,
    pageIndex: 1,
    projects: [],
    currentPageProjects: []
  },
  onLoad(options){
    var scene = options.scene
    wx.login({
      success: resCode => {
        wx.request({
          url: app.globalData.server + '/miniprogram/login',
          method: 'POST',
          data: {
            'code': resCode.code 
          },
          success: result => {
            app.globalData.token = result.data.token;
            app.globalData.role = result.data.role;
            wx.request({
              url: app.globalData.server + "/miniprogram/projects?group="+scene,
              header: {
                'Authorization': app.globalData.token
              },
              success: response => {
                response.data.projects.forEach(function(item) {
                  item.cover = app.globalData.server + item.cover;
                })
                this.setData({
                  projects: response.data.projects,
                  pageIndex: 1,
                  currentPageProjects: response.data.projects,
                  mask: true
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
        })
      },
    })
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
        url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude+"&page="+this.data.pageIndex,
        header: {
          'Authorization': app.globalData.token
        },
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
            this.setData({
              loading: true,
              nomoreData: false,
              pageIndex: this.data.pageIndex - 1
            })
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
  showProject(event) {
    wx.navigateTo({
      url: "../introduce/introduce?id=" + event.currentTarget.dataset.projectId
    })
  }
})