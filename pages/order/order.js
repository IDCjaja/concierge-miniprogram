const app = getApp()

Page({
  data:{
    setTimr: false,
    multiArray: [{
        "date":"2018-4-11",
        "wday" : "周三",
        "table":[
                  {"time":"09:00-12:00","remain":9},
                  {"time":"13:00-17:00","remain":15}
                ]
        },{
        "date":"2018-4-13",
        "wday" : "周五",
        "table":[
                  {"time":"12:00-13:00","remain":10},
                  {"time":"14:00-17:00","remain":0},
                  {"time":"17:00-19:00","remain":15}
                ]
        }
    ],
    multiIndex: [0,0]
  },
  onLoad: function(option){
    wx.request({
      method:'GET',
      url:app.globalData.server + '/miniprogram/projects/'+option.id,
      header: {
        'Authorization': app.globalData.token
      },
      success: (res) => {
        this.setData({
          id: option.id
        })
      }
    })
    var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
    };
    var dayArr = new Array;
    var tableArr = new Array;
    var timeArr = new Array;
    var day;
    var table;
    for(var i=0;i<data.multiArray.length;i++){
      var table = {
        timeTable: data.multiArray[i].table
      }
      tableArr.push(data.multiArray[i].table)
      for(var j=0;j<tableArr.length;j++){
        console.log(tableArr[j])
      }
      dayArr.push(data.multiArray[i].date +' '+data.multiArray[i].wday)
    }
  },
  getCode: function(){
    var that = this;
    var phone = that.data.phone;
    var count = 60;
    if(!(/^1[34578]\d{9}$/.test(phone)) || phone=="" || phone==null){
      wx.showToast({
        title:'手机号格式错误',
        icon:'none'
      })
      return
    }else{
      if(0 < count && count <= 60){
        var timr = setInterval(() => {
          if(count == 0){
            this.setData({
                count: 60,
                setTimr: false
            })
            clearInterval(timr)
            return count
            }else{
              count -=1;
              this.setData({
              count: count,
              setTimr: true
            })
          }
        },1000);
      }
      wx.request({
        url: app.globalData.server + '/miniprogram/projects/'+ that.data.id +'/code',
        method:'POST',
        header: {
          'Authorization': app.globalData.token
        },
        data: {
          tel: that.data.phone
        },
        fail :(res) => {
          if(res.statusCode == 400 || res.statusCode == 422){
            wx.showToast({
              title:'发送验证码失败',
              icon:'none',
              duration: 1000
            })
            return
          }
        }
      })
    }
  },
  bindNameChange: function(e){
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  bindPhoneChange: function(e){
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  bindCodeChange: function(e){
    var code = e.detail.value;
    this.setData({
      code: code
    })
  },
  regist: function(){
    var that = this;
    var name = that.data.name;
    var code = that.data.code
    if(name == ''|| name == null){
      wx.showToast({
        title:'用户名不为空',
        icon: 'none'
      })
      return;
    }else{
      wx.request({
        url: app.globalData.server + '/miniprogram/reservations',
        method: 'POST',
        header: {
          'Authorization': app.globalData.token
        },
        data:{
          code: that.data.code,
          project_id: that.data.id,
          name: that.data.name,
          tel: that.data.phone,
          date:'2018-04-19',
          time:'09:00-10:00'
        },
        success: (res) =>{
          if(res.statusCode == 201){
            wx.showToast({
              title:'预约成功',
              duration: 2000
            })
          }
        },
        fail: (res) =>{
            if(res.statusCode == 422){
              wx.showToast({
                title: '验证码错误',
                icon: 'none',
                duration: 2000
              })
            }else if(res.statusCode == 400){
              wx.showToast({
                title: '发送验证码失败',
                icon: 'none',
                duration: 2000
              })
            }
        }
      })
    }
  },
  bindMultiPickerChange: function (e) {
    this.setData({
        multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e){
    var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
    };
    var keyArr = new Array;
    data.multiIndex[e.detail.column] = e.detail.value;
    data.multiIndex[0] = [],
    Object.keys(data.multiArray).forEach(key => {
        keyArr.push([key + ":", json[key]])
    })
  }
})