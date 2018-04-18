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
    var phone = e.detail.value
    var res= /^1[34578]\d{9}$/;
    if(!(/^1[34578]\d{9}$/.test(phone)) || phone=="" || phone==null){
      wx.showToast({
        title:'号码格式错误'
      })
      return
    }else{
      this.setData({
        phone: phone
      })
    }
  },
  nameBindChange: function(e){
    var name = e.detail.value
    if(name=="" || name==null){
      wx.showToast({
        title:'用户名不能为空'
      })
      return;
    }else{
      this.setData({
        name: name
      })
    }
  },
  codeBindChange: function(e){
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function(){
    var count = 60;
    var that = this;
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
      success: (res) => {
        console.log("success")
      }
    })
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
        console.log("success")
      }
    })
  }
})