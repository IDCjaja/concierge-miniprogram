var app = getApp()

Page({
  data:{
    setTimr: false,
    multiIndex: [0,0],
    value: [0,0],
    selList: [],
    buttonDisabled: true,
    code: '',
    phone:'',
    selValue:[],
    multiHidden: true,
    dateShow: ""
  },
  dataInit(){
    var times = this.data.times;
    times.forEach((time) => {
      var id=0
      time.forEach((item) => {
        item.selStatus = false;
        item.id = id;
        id+=1;
      })
    })
    this.setData({
      times: times,
    })
  },
  getData(res,id,multiIndex){
    this.setData({
      id: id,
      defaultName: res.data.tmp_name,
      name: res.data.tmp_name,
      defaultPhone: res.data.tmp_tel,
      phone: res.data.tmp_tel,
      need_sms: res.data.need_sms,
      multi_time: res.data.multi_time
    })
    var multi_time = res.data.multi_time;
    var dayArr = [];
    var timeArr = [];
    var arr = [];
    var times = [];
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
      dayArr.push(time_table.date + '   ' + WEEKDAY_MAP[time_table.wday])
      time_table.table.forEach(function(item){
        if(item.remain == null){
          timeArr.push(item.time+' ( 无限制 )');
          item.remain = "无限制"
        }else{
          timeArr.push(item.time+' (剩余 '+item.remain+' )')
        }
      })
      arr.push(timeArr);
      times.push(time_table.table);
      timeArr = [];
    })
    var requestDate = dayArr[0].slice(0,11);
    var requestTime = [arr[0].toString().slice(0,11)];
    times.forEach((time) => {
      var id=0
      time.forEach((item) => {
        item.selStatus = false;
        item.id = id;
        id+=1;
      })
    })
    this.setData({
      multiArray: [dayArr,arr[0]],
      dayArr: dayArr,
      arr: arr,
      times: times,
      dates: dayArr,
      date: dayArr[0],
      timeList: times[0],
      requestDate: requestDate,
      requestTime: requestTime,
      selectValue: dayArr[multiIndex[0]]+','+arr[0][multiIndex[1]],
      displayValue: dayArr[multiIndex[0]]+','+arr[0][multiIndex[1]].slice(0,11)
    })
    if(res.data.need_sms == true){
      this.setData({
        codeBox: false
      })
    }else if(res.data.need_sms == false){
      if(multi_time == true){
        this.setData({
          codeBox: true,
          buttonDisabled: true
        })
      } else {
        this.setData({
          codeBox: true,
          buttonDisabled: false
        })
      }
    }
    if(multi_time == true){
      this.setData({
        multiPicker: true,
        radioPicker: false,
        requestDate: [],
        requestTime: []
      })
    } else {
      this.setData({
        multiPicker: false,
        radioPicker: true
      })
    }
  },
  onLoad: function(option){
    app.globalData.flag = true;
    this.setData({
      projectId: option.id
    })
    wx.getStorage({
      key: 'project',
      success: (res) => {
        this.getData(res,option.id,this.data.multiIndex)
      }
    })
  },
  getCode: function(){
    var phone = this.data.phone;
    var count = 60;
    if(!(/^1[34578]\d{9}$/.test(phone))){
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
        url: app.globalData.server + '/miniprogram/projects/'+ this.data.id +'/code',
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
            return
          }
        }
      })
    }
  },
  validate(){
    if(this.data.need_sms == false){
      if((/^1[34578]\d{9}$/.test(this.data.phone)) && this.data.requestTime != ""){
        return true;
      }
    }else if(this.data.need_sms == true){
      if(this.data.code.length === 6 && (/^1[34578]\d{9}$/.test(this.data.phone)) && this.data.requestTime != ""){
        return true;
      }
    }else{
      return false
    }
  },
  bindNameChange: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneChange: function(e){
    this.setData({
      phone:e.detail.value
    })
    if(this.data.need_sms){
      this.setData({
        buttonDisabled: !this.validate()
      })
    } else {
      if(this.data.phone === this.data.defaultPhone) {
        this.setData({
          buttonDisabled: false,
          codeBox: true
        })
      } else {
        this.setData({
          codeBox: false
        })
        this.setData({
          buttonDisabled: !this.validate()
        })
      }
    }
  },
  bindCodeChange: function(e){
    this.setData({
      code: e.detail.value
    })
    this.setData({
      buttonDisabled: !this.validate()      
    })
  },
  reservation: function(){
    var name = this.data.name;
    var code = this.data.code;
    var remain = Number(this.getRemain(this.data.selectValue));
    if(name == ''|| name == null){
      wx.showToast({
        title:'用户名不为空',
        icon: 'none'
      })
      return;
    }else if(remain === 0){
      wx.showToast({
        title:'名额不足',
        icon: 'none',
        duration: 2000
      })
      return;
    }else if(app.globalData.flag == true){
      app.globalData.flag = false
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
                setTimeout(function() {
                  wx.navigateTo({
                    url: "../projects/projects"
                  })
                }, 1000)
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
          }else if(res.statusCode == 403 ){
            wx.showToast({
              title: '名额不足',
              icon: 'none',
              duration: 2000
            })
            wx.request({
              url: app.globalData.server + '/miniprogram/projects/' + this.data.projectId,
              method: 'GET',
              header: {
                'Authorization': app.globalData.token
              },
              success: res => {
                this.getData(res,this.data.projectId,this.data.multiIndex)
              }
            })
          }
        },
        complete(){
          app.globalData.flag = true
        }
      })
    }
  },
  bindMultiPickerColumnChange: function(e){
    var multiIndex = this.data.multiIndex
    multiIndex[e.detail.column] = e.detail.value;
    this.setData({
      multiArray: [this.data.dayArr,this.data.arr[multiIndex[0]]]
    })
    var multiArray = this.data.multiArray;
    if(e.detail.column == 0){
      var multiIndex = [multiIndex[0],0];
    }else{
      var multiIndex = multiIndex;
    }
    var requestDate = multiArray[0][multiIndex[0]].slice(0,11);
    var requestTime = [multiArray[1][multiIndex[1]].slice(0,11)];
    this.setData({
      multiIndex: multiIndex,
      requestDate: requestDate,
      requestTime: requestTime
    })
  },
  bindMultiPickerChange: function (e) {
    var valueStr = this.data.multiArray[1][this.data.multiIndex[1]];
    var remain = Number(this.getRemain(valueStr));
    if(remain !=0){
      this.setData({
        multiIndex: e.detail.value,
        selectValue: this.data.multiArray[0][this.data.multiIndex[0]]+','+this.data.multiArray[1][this.data.multiIndex[1]],
        displayValue: this.data.multiArray[0][this.data.multiIndex[0]]+','+this.data.multiArray[1][this.data.multiIndex[1]].slice(0,11)
      })
    }else if(remain === 0){
      wx.showToast({
        title: '名额不足',
        icon: 'none',
        duration: 2000
      })
      return
    }
  },
  bindChange(e) {
    const val = e.detail.value;
    var timeVal = [];
    timeVal[0] = 0;
    this.dataInit();
    this.setData({
      value: [val[0],val[0]],
      selList:[],
      timeValue: timeVal,
      selValue: []
    })
    this.setData({
      date: this.data.dates[this.data.value[0]],
      timeList: this.data.times[this.data.value[1]],
    })
  },
  select(e){
    var selArr = this.data.selList;
    var dataList = this.data.times[this.data.value[1]];
    var selIndex = e.currentTarget.dataset.selectIndex;
    var index = this.data.selList.indexOf(selIndex);
    if(index < 0){
      selArr.push(e.currentTarget.dataset.selectIndex);
      dataList.forEach((item) => {
        if(item.id == selIndex){
          item.selStatus = true
        } 
      })
    } else {
      dataList.forEach((item) => {
        if(item.id == selIndex){
          item.selStatus = false
        }
        selArr.splice(index,1)
      })
    }
    var selValue = []
    selArr.forEach((index)=>{
      selValue.push(dataList[index].time)
    })
    this.setData({
      selList: selArr,
      timeList: dataList,
      selValue: selValue,
    })
  },
  cancel(){
    this.setData({
      multiHidden: true
    })
  },
  confirm(){
    if(this.data.selValue.length > 0){
      this.setData({
        dateShow: this.data.date,
        selValueShow: this.data.selValue,
        requestDate: this.data.date.slice(0,10),
        requestTime: this.data.selValue,
        buttonDisabled: false
      })
    }else if(this.data.selValue.length < 1){
      this.setData({
        dateShow: "",
        selValueShow: this.data.selValue,
        requestDate: [],
        requestTime: [],
        buttonDisabled: true
      })
    }
    this.setData({
      multiHidden: true,
      buttonDisabled: !this.validate()
    })
  },
  multiShow(){
    this.setData({
      multiHidden: false
    })
  },
  getRemain(valueStr){
    var value = valueStr.substring(valueStr.indexOf("(")+1,valueStr.indexOf(")")).trim();
    if(value !="无限制"){
      var remain = value.slice(2,6)
    } else if(value == "无限制") {
      var remain = value;
    }
    return remain
  }
})