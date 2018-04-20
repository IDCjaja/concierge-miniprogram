const app = getApp()

Page({
  STATE_TEXT: {
    success: '已成功',
    wait: '待审核'
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
    isSearchProjects: ''
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
      url: encodeURI(app.globalData.server + "/miniprogram/projects?search=" + value),
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
      url: encodeURI(app.globalData.server + "/miniprogram/reservations?type='current'&search=" + value),
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
  searchProjects(event) {
    var value = event.detail.value;
    this.setData({
      searchContent: value
    })
    if(this.data.isSearchProjects) {
      this.requestProjects(value);
    } else {
      this.requestReservations(value);
    }
  },
  getProjectsPagination() {
    if(this.data.currentPageProjects.length === 4) {
      this.setData({
        pageIndex: this.data.pageIndex+1
      });
      wx.request({
        url: encodeURI(app.globalData.server + "/miniprogram/projects?search="+this.data.searchContent+"&page="+this.data.pageIndex),
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
    if(this.data.currentPageReservations.length === 4) {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      });
      wx.request({
        url: encodeURI(app.globalData.server + "/miniprogram/reservations?type='current'&search="+this.data.searchContent+"&page="+this.data.pageIndex),
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
    wx.navigateTo({
      url: "../detail/detail?id=" + event.currentTarget.dataset.reservationId
    })
  }
})