const app = getApp();
Page({
  data:{
    setTimr: false,
    phone: '',
    code: '',
    name: ''
  },
  onLoad: function(){
    var role = app.globalData.role;
    if(role == 'manager'){
      wx.navigateTo({
        url: '../admin/admin'
      })
    }
  },
  phoneBindChange: function(e){
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  nameBindChange: function(e){
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  codeBindChange: function(e){
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function(){
    var count = 60;
    var that = this;
    var phone = that.data.phone;
    var name = that.data.name;
    if(name=="" || name==null){
      wx.showToast({
        title:'用户名不能为空',
        icon:'none'
      })
      return
    }
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
        url: app.globalData.server + '/miniprogram/admin/code',
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
          }else if(res.statusCode == 403){
            wx.showToast({
              title:'手机号已注册',
              icon:'none',
              duration: 1000
            })
            return
          }
        }
      })
    }
  },
  regist: function(){
    var that = this;
    wx.request({
      url:app.globalData.server + '/miniprogram/admin/login',
      method: 'POST',
      header: {
        'Authorization': app.globalData.token
      },
      data: {
        tel: that.data.phone,
        code: that.data.code,
        name: that.data.name
      },
      success: (res) => {
        if(res.statusCode == 200){
          wx.showToast({
            title:'注册成功',
            icon:'none',
            duration: 2000
          })
        }
      }
    })
  }
})