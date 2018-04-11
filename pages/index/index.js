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
    hiddenDropdown: true,
    projects: [
      {
        "image": "http://cdrtvu.qiniudn.com/Fl_zHyhHaoIQUfmm6CWwaopLvCsw",
        "name": "成都高新图书馆",
        "address": "一环建设北路2段4号"
      }
    ]
  },
  onLoad: function () {
    wx.getLocation({
      success:(res)=>{
        wx.request({
          url: app.globalData.server + "miniprogram/projects?distance="+this.data.distance+"&longitude="+res.longitude+"&latitude="+res.latitude,
          success: (response)=>{
            console.log(response)
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
    })
  },
  search() {

  }
})
