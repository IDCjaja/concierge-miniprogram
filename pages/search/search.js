const app = getApp()

Page({
  STATE_TEXT: {
    success: '已成功',
    wait: '待审核',
    overtime: '已过期',
    checked: '已核销',
    cancelled: '已取消'
  },
  data: {
    projects:[],
    reservationsList: [],
    noResult: true,
    loading: true,
    nomoreData: true,
    pageIndex: 1,
    currentPageProjects: [],
    currentPageReservations: [],
    searchContent: '',
    isSearchProjects: '',
    timer: null
  },
  onLoad(param) {
    if(param.type === 'projects') {
      this.setData({
        isSearchProjects: true
      })
    } else if(param.type === 'reservations') {
      this.setData({
        isSearchProjects: false
      })
    }
  },
  requestProjects(value) {
    wx.request({
      url: app.globalData.server + "/miniprogram/projects?search=" + encodeURI(value),
      header: {
        'Authorization': app.globalData.token
      },
      success:(res)=> {
        if(res.data.projects.length) {
          res.data.projects.forEach((item)=> {
            item.cover = app.globalData.server + item.cover;
          })
          this.setData({
            projects: res.data.projects,
            currentPageProjects: res.data.projects,
            noResult: true
          })
        } else {
          this.setData({
            projects: res.data.projects,
            noResult: false
          })
        }
      }
    })
  },
  requestReservations(value) {
    wx.request({
      url: app.globalData.server + "/miniprogram/reservations?&search=" + encodeURI(value),
      header: {
        'Authorization': app.globalData.token
      },
      success:(res)=> {
        if(res.data.reservations.length) {
          this.setData({
            reservationsList: this.formatReservations(res.data.reservations),
            currentPageReservations: this.formatReservations(res.data.reservations),
            noResult: true
          })
        } else {
          this.setData({
            reservationsList: this.formatReservations(res.data.reservations),
            noResult: false
          })
        }
      }
    })
  },
  formatReservations(array) {
    array.forEach(item => {
      if(this.STATE_TEXT[item.state]) {
        item.state = this.STATE_TEXT[item.state]
      }
    })
    return array;
  },
  handleInput(event) {
    var value = event.detail.value;
    this.setData({
      searchContent: value
    })
    if(this.data.timer){
      clearTimeout(this.data.timer)
    }
    this.setData({
      timer: setTimeout(this.searchProjects, 1000)
    })
  },
  searchProjects(event) {
    if(this.data.isSearchProjects) {
      this.requestProjects(this.data.searchContent);
    } else {
      this.requestReservations(this.data.searchContent);
    }
  },
  getProjectsPagination() {
    if(this.data.currentPageProjects.length === 4) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/projects?search="+encodeURI(this.data.searchContent)+"&page="+this.data.pageIndex,
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
            setTimeout(()=>{
              this.setData({
                loading: true,
                nomoreData: false,
                pageIndex: this.data.pageIndex - 1
              })
            },1000)
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
  getReservationsPagination() {
    if(this.data.currentPageReservations.length === 10) {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      });
      wx.request({
        url: app.globalData.server + "/miniprogram/reservations?&search="+encodeURI(this.data.searchContent)+"&page="+this.data.pageIndex,
        header: {
          'Authorization': app.globalData.token
        },
        success: (res)=> {
          if(res.data.reservations.length) {
            this.setData({
              loading: true,
              currentPageReservations: this.formatReservations(res.data.reservations),
              reservationsList: this.data.reservationsList.concat(this.formatReservations(res.data.reservations))
            });
          } else {
            setTimeout(()=>{
              this.setData({
                loading: true,
                nomoreData: false,
                pageIndex: this.data.pageIndex - 1
              })
            },1000)
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
  onReachBottom() {
    this.setData({
      loading: false,
      nomoreData: true
    })
    if(this.data.isSearchProjects) {
      this.getProjectsPagination();
    } else {
      this.getReservationsPagination();
    }
  },
  showProject(event){
    wx.navigateTo({
      url: "../introduce/introduce?id=" + event.currentTarget.dataset.projectId
    })
  },
  showDetail(event) {
    var id = event.currentTarget.dataset.reservationId;
    var currentProjectList;
    this.data.reservationsList.forEach(item => {
      if(item.id == id){
        currentProjectList = item;
        wx.setStorage({
          key: 'reservationInfo',
          data: currentProjectList
        })
      }
    });
    wx.navigateTo({
      url: "../detail/detail"
    })
  },
  openMap(event) {
    wx.request({
      method: "GET",
      url: app.globalData.server + '/miniprogram/reservations/' + event.currentTarget.dataset.reservationId,
      header: {
        'Authorization': app.globalData.token
      },
      success:(res) =>{
        wx.openLocation({
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          name: res.data.project_name,
          address: res.data.address
        })
      }
    })
  }
})