const app = getApp()

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
    pageIndex: 1,
    projects: [],
    currentPageProjects: []
  },
  onLoad() {
    wx.getLocation({
      success:(res)=>{
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        wx.request({
          url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude,
          success: (response)=>{
            response.data.projects.forEach(function(item) {
              item.cover = app.globalData.server + item.cover;
            })
            this.setData({
              projects: response.data.projects,
              currentPageProjects: response.data.projects
            })
          }
        })
      }
    })
  },
  openDropdown() {
    this.setData({
      hiddenDropdown: false
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
      url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude,
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
      url: '../search/search'
    })
  },
  showProject(event) {
    console.log(event.currentTarget.dataset.projectIndex)
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
        url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude+"&page="+this.data.pageIndex,
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
