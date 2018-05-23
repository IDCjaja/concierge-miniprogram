var app = getApp()

Page({
  data: {
    options: [
      {'value': 3, 'text': '3千米'},
      {'value': 5, 'text': '5千米'},
      {'value': 10, 'text': '10千米'},
      {'value': 15, 'text': '15千米'},
      {'value': '', 'text': '全部'}
    ],
    defaultText: '3千米',
    distance: 3,
    longitude: 0,
    latitude: 0,
    hiddenDropdown: true,
    loading: true,
    nomoreData: true,
    refresh: true,
    maskHidden: true,
    loader: true,
    requestAgain: false,
    pageIndex: 1,
    projects: [],
    currentPageProjects: []
  },
  refreshData(){
    this.setData({
      loader: true,
      requestAgain: false
    })
    wx.request({
      url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude,
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
  onLoad() {
    this.setData({
      mask: false
    })
    if(app.globalData.token){
      wx.getLocation({
        success: resData => {
          this.setData({
            longitude: resData.longitude,
            latitude: resData.latitude
          })
          this.refreshData();
        }
      })
    } else {
      this.wxLogin();
    }
  },
  wxLogin(){
    this.setData({
      loader: true,
      requestAgain: false
    })
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
            wx.getLocation({
              success: resData => {
                this.setData({
                  longitude: resData.longitude,
                  latitude: resData.latitude
                })
                this.refreshData();
              }
            });
          },
        })
      },
      fail: error => {
        this.setData({
          loader: false,
          requestAgain: true
        })
      }
    })
  },
  openDropdown() {
    this.setData({
      hiddenDropdown: false,
      maskHidden: false
    })
  },
  closeDropdown() {
    this.setData({
      hiddenDropdown: true,
      maskHidden: true
    })
  },
  changeDistance(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      defaultText: this.data.options[index].text,
      distance: this.data.options[index].value,
      hiddenDropdown: true,
      pageIndex: 1,
      nomoreData: true
    });
    wx.request({
      url: app.globalData.server + "/miniprogram/projects?distance=" + this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude,
      header: {
        'Authorization': app.globalData.token
      },
      success: (response)=>{
        response.data.projects.forEach(function(item) {
          item.cover = app.globalData.server + item.cover;
        });
        this.setData({
          projects: response.data.projects,
          currentPageProjects: response.data.projects
        })
      }
    })
  },
  search() {
    wx.navigateTo({
      url: '../search/search?type=projects'
    })
  },
  showProject(event) {
    wx.navigateTo({
      url: "../introduce/introduce?id=" + event.currentTarget.dataset.projectId
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
  onPullDownRefresh(){
    this.setData({
      refresh: false
    })
    this.refreshData();
  }
})
