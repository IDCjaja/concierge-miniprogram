const app = getApp()

Page({
  data: {
    isFull: false,
  },
  onLoad: function (option) {
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
            app.globalData.role = result.data.role
            wx.request({
              method: "GET",
              url: 'http://192.168.31.208/miniprogram/projects/'+option.id,
              header: {
                'Authorization': app.globalData.token
              },
              success: (res) => {
                console.log(res)
                var json = res.data.time_state;
                var keyArr = new Array;
                var keyValue = new Array;
                var n;
                Object.keys(json).forEach(key => {
                  keyArr.push([key + ":", json[key]])
                })
                for (var i = 0; i < keyArr.length; i++) {
                    switch (keyArr[i][0]) {
                        case 'Fri:':
                            n = "周五";
                            break;
                        case 'Holiday:':
                            n = "节假日";
                            break;
                        case 'Sat:':
                            n = "周六";
                            break;
                        case 'Sun:':
                            n = "周天";
                            break;
                        case 'Thur:':
                            n = "周四";
                            break;
                        case 'Tues:':
                            n = "周二";
                            break;
                        case 'Wed:':
                            n = "周三";
                            break;
                        case 'Mon:':
                            n = "周一";
                            break;
                        case 'Special:':
                            n = "特殊";
                            break;
                    }
                    keyArr[i][0] = n;
                    if (keyArr[i][1].length > 0) {
                        keyValue.push(keyArr[i])
                    }
                }
                this.setData({
                  imageUrl: "http://192.168.31.208" + res.data.cover,
                  title: res.data.name,
                  address: res.data.address,
                  description: res.data.description,
                  bookingTime: keyValue,
                  longitude:res.data.longitude,
                  latitude: res.data.latitude,
                  address: res.data.address,
                  id: option.id,
                  markers:[{
                    id:1,
                    width: 25,
                    height: 25,
                    longitude:res.data.longitude,
                    latitude: res.data.latitude,
                  }]
                })
              }
            });
          }
        })
      }
    })
  },
  openMap: function () {
    wx.getLocation({
      success: function(res){
        wx.openLocation({
          latitude : res.latitude,
          longitude : res.longitude,
          address:res.address
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