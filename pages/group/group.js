var app = getApp();

Page({
  data: {
    loading: true,
    nomoreData: true,
    pageIndex: 1,
    projects: [],
    currentPageProjects: [],
    projectShow: true
  },
  onLoad(options){
    var id = options.scene || options.id;
    var name = options.name;
    if(app.globalData.token){
      this.getProjectsInGroup(id);
      this.getGroupName(id);
    } else {
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
              app.globalData.role = result.data.role;
              this.getProjectsInGroup(id);
              this.getGroupName(id);
            },
          });
        },
      })
    }
  },
  getProjectsInGroup(id){
    wx.request({
      url: app.globalData.server + "/miniprogram/projects?group="+id,
      header: {
        'Authorization': app.globalData.token
      },
      success: response => {
        if(response.statusCode == 404){
          this.setData({
            projectShow: false
          })
          wx.getStorage({
            key: "groupRecord",
            success: res => {
              res.data.forEach((item,index) => {
                if(item.id === id){
                  res.data.splice(index,1)
                }
              })
              wx.setStorage({
                key: "groupRecord",
                data: res.data
              })
            }
          })
        }else{
          response.data.projects.forEach(function(item) {
            item.cover = app.globalData.server + item.cover;
          })
          this.setData({
            projects: response.data.projects,
            pageIndex: 1,
            currentPageProjects: response.data.projects,
            mask: true,
            projectShow: true
          })
          setTimeout(()=>{
            wx.stopPullDownRefresh()
            this.setData({
              refresh: true
            })
          },1000)
        }
      }
    })
  },
  getGroupName(id){
    wx.request({
      url: app.globalData.server + '/miniprogram/groups/'+id,
      method: 'GET',
      header: {
        'Authorization': app.globalData.token
      },
      success: resName => {
        var groupName = resName.data.name;
        var data = {};
        data.name = groupName;
        data.id = id;
        wx.getStorage({
          key: "groupRecord",
          success: res => {
            var flag = true;
            if(resName.statusCode !== 404){
              res.data.forEach(item => {
                if(item.id === id){
                  flag = false;
                }
              })
              if(flag){
                res.data.push(data);
                wx.setStorage({
                  key: "groupRecord",
                  data: res.data
                })
              }
            }
          },
          fail: res => {
            var groupRecord = [];
            groupRecord.push(data);
            wx.setStorage({
              key: "groupRecord",
              data: groupRecord
            })
          }
        })
        this.setData({
          groupName: groupName
        })
      }
    })
  },
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.currentPageProjects.length == 4) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/projects?distance="+this.data.distance+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude+"&page="+this.data.pageIndex,
        header: {
          'Authorization': app.globalData.token
        },
        success: (res)=> {
          if(res.data.projects.length) {
            res.data.projects.forEach(function(item) {
              item.cover = app.globalData.server + item.cover;
            });
            this.setData({
              loading: true,
              currentPageProjects: res.data.projects,
              projects: this.data.projects.concat(res.data.projects)
            });
          } else {
            this.setData({
              loading: true,
              nomoreData: false,
              pageIndex: this.data.pageIndex - 1
            })
          }
        }
      });
    } else {
      setTimeout(()=>{
        this.setData({
          loading: true,
          nomoreData: false
        })
      },1000)
    }
  },
  showProject(event) {
    wx.navigateTo({
      url: "../introduce/introduce?id=" + event.currentTarget.dataset.projectId
    })
  },
  backToHome(){
    wx.reLaunch({
      url: '../index/index'
    })
  }
})