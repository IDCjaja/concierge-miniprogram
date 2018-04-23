const app = getApp()

Page({
  data: {
    isFull: false,
  },
  WEEKDAY_MAP : {
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
    wx.request({
      method: "GET",
      url: app.globalData.server + '/miniprogram/projects/' + option.id,
      header: {
        'Authorization': app.globalData.token
      },
      success: (res) => {
        var json = res.data.time_state;
        var keyArr = new Array;
        var keyValue = new Array;
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
          address: res.data.address,
          description: res.data.description,
          bookingTime: keyArr,
          longitude:res.data.longitude,
          latitude: res.data.latitude,
          address: res.data.address,
          markers:[{
            id:1,
            width: 25,
            height: 25,
            longitude:res.data.longitude,
            latitude: res.data.latitude,
          }]
        })
      }
    })
  },
  openMap: function () {
    var that = this;
    wx.getLocation({
      success: function(res){
      wx.openLocation({
        latitude : that.data.latitude,
        longitude : that.data.longitude,
        name: that.data.title,
        address: that.data.address
      })
      }
    })
  },
  openOrder: function (event) {
    wx.navigateTo({
      url: '/pages/order/order?id=' + event.currentTarget.dataset.projectId
    })
  }
})