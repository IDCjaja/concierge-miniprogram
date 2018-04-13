const app = getApp()

Page({
    data: {
        isFull: false,
    },
    onLoad: function (option) {
        wx.request({
            method: "GET",
            url: 'http://192.168.31.208/miniprogram/projects/'+option.id,
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
                var json = res.data.time_state;
                var keyArr = new Array;
                var keyValue = new Array;
                var n;
                console.log(json)
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
                            n = "周三";
                            break;
                        case 'Tues:':
                            n = "周四";
                            break;
                        case 'Wed:':
                            n = "周二";
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
                    bookingTime: keyValue
                })
            }
        })
    },
    openMap: function () {
        wx.navigateTo({
            url: '/pages/map/map'

        })
    },
    openOrder: function () {
        wx.navigateTo({
            url: '/pages/order/order'
        })
    }
})