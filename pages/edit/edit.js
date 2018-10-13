Page({
  data: {
    value: '',
    index:0,
    array: ['公开', '好友圈', '仅自己'],
    tempFilePaths:""
  },
  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  chooseImage: function(e){
    const that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  del_image:function(event){
    const that = this;
    const tempFilePaths = that.data.tempFilePaths;
    tempFilePaths.splice(event.target.id, 1);
    // console.log(tempFilePaths);
    that.setData({
      tempFilePaths: tempFilePaths
    })
  },
  getlocal:function(evevt){
    wx.getLocation({ //没有特别说明的都是固定写法
      type: 'wgs84',
      success: function (res) {
        console.log('location', res);
        var locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "TXYBZ-V2NR2-DGNUC-C4NOS-JHBEH-UBFUO",
            "location": locationString
          },
          method: 'GET',
          success: function (r) {
            //输出一下位置信息
            console.log('用户位置信息', r.data.result.address);
            //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
            getApp().globalData.locationInfo = r.data.result.address;
            //这步是将位置信息保存到本地缓存中，key = value的形式
            try {
              // wx.setStorageSync('locationInfo', r.data.result.address)
            } catch (e) {
              console.log(e)
            }
          }
        });
      }
    });
  }
});