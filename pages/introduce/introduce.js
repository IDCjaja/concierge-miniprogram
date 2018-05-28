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
    var project_id;
    if(option.id) project_id = option.id;
    else if(decodeURIComponent(option.scene)) project_id = decodeURIComponent(option.scene);
    if(app.globalData.token) {
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
            id: project_id,
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
            mask: true,
            state: res.data.state
          })
          wx.setStorage({
            key: 'project',
            data: res.data,
          })
        }
      })
    }
    else {
      wx.login({
        success: resCode => {
          wx.request({
            url: app.globalData.server + '/miniprogram/login',
            method: 'POST',
            data: {
              'code': resCode.code 
            },
            success: response => {
              app.globalData.token = response.data.token;
              app.globalData.role = response.data.role;
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
                    id: project_id,
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
                    mask: true,
                    state: res.data.state
                  })
                  wx.setStorage({
                    key: 'project',
                    data: res.data,
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  openMap: function () {
    if(this.data.latitude && this.data.longitude){
      wx.openLocation({
        latitude : this.data.latitude,
        longitude : this.data.longitude,
        name: this.data.title,
        address: this.data.address
      })
    }
  },
  openReservation: function (event) {
    wx.navigateTo({
      url: '/pages/reservation/reservation?id=' + event.currentTarget.dataset.projectId
    })
  }
})