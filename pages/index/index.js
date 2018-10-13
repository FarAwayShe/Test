const db = wx.cloud.database()
const todos = db.collection('test1')
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
var zan = 0
Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array:[],
  },
  // 滑动开始
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      })
    }
  },
  // 头像
  showview: function () {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
    })
  },
  // 遮拦
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
    })
  },
  onLoad: function () {
    const that = this;
    if (wx.getStorageSync('openId') == ""){
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          wx.setStorageSync("openId", res.result.openId)
        }
      })
    }
      
    db.collection('test1').get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].zanid.includes(wx.getStorageSync("openId"))) {
                res.data[i].zan = true;
              } else {
                res.data[i].zan = false;
              }
        }
        that.setData({
          array:res.data,
        })
      }
    })
   
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
            })
          }
        })
      }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 点赞
  changeZan:function(event){
    var that = this;
    var array = that.data.array;
    for(var i =0;i<array.length;i++){
      if (array[i]._id == event.target.id){
        if (array[i].zan == true) {
          for(var k = 0;k<array[i].zanid.length;k++){
            if (array[i].zanid[k] == wx.getStorageSync("openId")){
              array[i].zanid.splice(k,1)
            }
          }
          array[i].zan = false;
          array[i].countzan -= 1;
          that.setData({
            array: array
          })
        } else {
          array[i].zan = true
          array[i].countzan += 1;
          array[i].zanid.splice(0,0,wx.getStorageSync("openId"))
          that.setData({
            array: array
          })
        }
        wx.cloud.callFunction({
          name: 'changezan',
          data: {
            countzan: array[i].countzan,
            zanid: array[i].zanid,
            _id: event.target.id
          },
          complete: res => {
            // console.log(res)
          }
        })
      }
    }
  },
})
