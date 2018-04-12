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
    projects: []
  },
  onLoad: function () {
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
              projects: response.data.projects
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
      hiddenDropdown: true
    });
    wx.request({
      url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude,
      success: (response)=>{
        response.data.projects.forEach(function(item) {
          item.cover = app.globalData.server + item.cover;
        })
        this.setData({
          projects: response.data.projects
        })
      }
    })
  },
  search() {

  },
  showProject(event) {
    console.log(event.currentTarget.dataset.projectIndex)
  }
})
