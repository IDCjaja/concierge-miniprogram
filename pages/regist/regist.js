const app = getApp();
Page({
  data:{
    setTimr: false,
    phone: '',
    code: '',
    name: ''
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
    var phone = this.data.phone;
    var name = this.data.name;
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
      wx.request({
        url: app.globalData.server + '/miniprogram/admin/code',
        method:'POST',
        header: {
          'Authorization': app.globalData.token
        },
        data: {
          tel: this.data.phone
        },
        success :(res) => {
          if(res.statusCode == 400 || res.statusCode == 422){
            wx.showToast({
              title:'发送验证码失败',
              icon:'none',
              duration: 1000
            })
          }else if(res.statusCode == 403){
            wx.showToast({
              title:'手机号已注册',
              icon:'none',
              duration: 1000
            })
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
          }
        }
      })
    }
  },
  regist: function(){
    wx.request({
      url:app.globalData.server + '/miniprogram/admin/login',
      method: 'POST',
      header: {
        'Authorization': app.globalData.token
      },
      data: {
        tel: this.data.phone,
        code: this.data.code,
        name: this.data.name
      },
      success: (res) => {
        if(res.statusCode == 200){
          wx.showToast({
            title:'注册成功',
            duration: 2000
          })
          app.globalData.role = res.data.role
          wx.navigateTo({
            url:'../admin/admin'
          })
        }else if(res.statusCode == 400){
          wx.showToast({
            title:'发送失败',
            icon:'none',
            duration: 2000
          })
        }else if(res.statusCode == 403){
          wx.showToast({
            title:'手机号已注册',
            icon:'none',
            duration: 2000
          })
        }else if(res.statusCode == 422){
          wx.showToast({
            title:'验证码错误',
            icon:'none',
            duration: 2000
          })
        }
      }
    })
  }
})