var app = getApp()

Page({
  WEEKDAY_MAP: {
    "Sun":"周日",
    "Mon":"周一",
    "Tues":"周二",
    "Wed":"周三",
    "Thur":"周四",
    "Fri":"周五",
    "Sat":"周六",
    "Special":"特殊",
    "Holiday":"节假日"
  },
  onLoad: function (option) {
    this.setData({
      mask: false
    })
    var project_id = '';
    if(option.id) project_id = option.id;
    else if(decodeURIComponent(option.scene).id) project_id = decodeURIComponent(option.scene).id;
    wx.request({
      method: "GET",
      url: app.globalData.server + '/miniprogram/projects/' + project_id,
      header: {
        'Authorization': app.globalData.token
      },
      success: (res) => {
        var json = res.data.time_state;
        var keyArr = [];
        var keyValue = [];
        var n;
        Object.keys(json).forEach(key => {
          if(json[key].length > 0 ){
            keyArr.push([key, json[key]])
          }
        })
        keyArr.forEach(item => {
          item[0] = this.WEEKDAY_MAP[item[0]]
        })
        this.setData({
          imageUrl: app.globalData.server + res.data.cover,
          title: res.data.name,
          id: option.id,
          isFull: res.data.full,
          address: res.data.address,
          description: res.data.description,
          bookingTime: keyArr,
          aheadTime: res.data.ahead_time,
          perCount: res.data.reservation_per_user,
          reservable: res.data.reservable,
          longitude:res.data.longitude,
          latitude: res.data.latitude,
          address: res.data.address,
          mask: true
        })
        wx.setStorage({
          key: 'project',
          data: res.data,
        })
      }
    })
  },
  openMap: function () {
    wx.openLocation({
      latitude : this.data.latitude,
      longitude : this.data.longitude,
      name: this.data.title,
      address: this.data.address
    })
  },
  openReservation: function (event) {
    wx.navigateTo({
      url: '/pages/reservation/reservation?id=' + event.currentTarget.dataset.projectId
    })
  }
})