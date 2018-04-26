const app = getApp()

Page({
  data:{
    setTimr: false,
    multiIndex: [0,0],
    buttonDis: true
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
          id: option.id,
          name: res.data.tmp_name,
          phone: res.data.tmp_tel
        })
        var dayArr = [];
        var timeArr = [];
        var arr = [];
        var multiArray= [];
        var WEEKDAY_MAP = {
          0:"周日",
          1:"周一",
          2:"周二",
          3:"周三",
          4:"周四",
          5:"周五",
          6:"周六"
        }
        multiArray = JSON.parse(res.data.time_table);
        multiArray.forEach(function(time_table){
          dayArr.push(time_table.date + ' ' + WEEKDAY_MAP[time_table.wday])
          time_table.table.forEach(function(item){
            if(item.remain == null){
              timeArr.push(item.time+' ( 无限 )')
            }else{
              timeArr.push(item.time+' (剩余 '+item.remain+' )')
            }
          })
          arr.push(timeArr);
          timeArr = [];
        })
        var requestDate = dayArr[0].slice(0,11);
        var requestTime = arr[0].toString().slice(0,11);
        this.setData({
          multiArray: [dayArr,arr[0]],
          dayArr: dayArr,
          arr: arr,
          requestDate: requestDate,
          requestTime: requestTime,
          selectValue: dayArr[0]+','+arr[0][0]
        })
      }
    })
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
        success :(res) => {
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
    if(code == ""|| code == null){
      this.setData({
        buttonDis:true
      })
    }else{
      this.setData({
        buttonDis: false
      })
    }
  },
  order: function(){
    var name = this.data.name;
    var code = this.data.code;
    var remain = this.data.selectValue.slice(30,31);
    if(name == ''|| name == null){
      wx.showToast({
        title:'用户名不为空',
        icon: 'none'
      })
      return;
    }else if(remain == 0){
      wx.showToast({
        title:'名额不足',
        icon: 'none',
        duration: 2000
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
          code: this.data.code,
          project_id: this.data.id,
          name: this.data.name,
          tel: this.data.phone,
          date: this.data.requestDate,
          time: this.data.requestTime
        },
        success: (res) =>{
          if(res.statusCode == 201){
            wx.showToast({
              title:'预约成功',
              duration: 1000,
              success: () => {
                wx.reLaunch({
                  url: "../projects/projects"
                })
              }
            })
          }else if(res.statusCode == 422){
            wx.showToast({
              title: '验证码错误',
              icon: 'none',
              duration: 2000
            })
          }else if(res.statusCode == 400 ){
            wx.showToast({
              title: '发送验证码失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    }
  },
  bindMultiPickerColumnChange: function(e){
    var that = this;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    
    this.setData({
      multiArray: [that.data.dayArr,that.data.arr[data.multiIndex[0]]]
    })
    if(e.detail.column == 0){
      var multiArray = that.data.multiArray;
      var multiIndex = [data.multiIndex[0],0];
      var requestDate = multiArray[0][multiIndex[0]].slice(0,11);
      var requestTime = multiArray[1][multiIndex[1]].slice(0,11);
      this.setData({
        multiIndex: multiIndex,
        // pickerDateValue: pickerDateValue,
        // pickerTimeValue: pickerTimeValue,
        requestDate: requestDate,
        requestTime: requestTime
      })
    }else{
      this.setData({
        multiIndex: data.multiIndex,
      })
    }
  },
  bindMultiPickerChange: function (e) {
    var remain = this.data.multiArray[1][this.data.multiIndex[1]].slice(16,17);
    if(remain !=0){
      this.setData({
        multiIndex: e.detail.value,
        selectValue: this.data.multiArray[0][this.data.multiIndex[0]]+','+this.data.multiArray[1][this.data.multiIndex[1]]
      })
    }else{
      wx.showToast({
        title: '名额不足',
        icon: 'none',
        duration: 2000
      })
      return
    }
  }
})