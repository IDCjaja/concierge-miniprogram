const app = getApp()

Page({
    data:{
        setTimr: false,
    },
    onLoad: function(option){
        wx.request({
            method:'GET',
            url:'http://192.168.31.208/miniprogram/projects/'+option.id,
            success: (res) => {
                console.log(res.data.time_table)
            }
        })
    },
    getCode: function(){
        var count = 60;
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
    },
    verifyName: function(e){
        var name = e.detail.value;
        if( !name=="" && name==null){
            this.setData({
                nameAjx: false
            })
        }else{
            this.setData({
                nameAjx: true
            })
        }
    },
    verifyPhone: function(e){
        var phone = e.detail.value;
        if(!(/^1[34578]\d{9}$/.test(phone)) && phone=="" && phone==null){
            this.setData({
                phoneAjx: false
            })
        }else if (phone.length >= 11) {
            wx.showToast({
            title: '手机号有误',
            icon: 'success',
            duration: 2000
            })
        }else{
            this.setData({
                phoneAjx: true
            })
        }
    }
})