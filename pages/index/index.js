const  app = getApp();

Page({
  data: {
    text: "首页",
    data: null
  },
  onLoad:function(options){
    this.setData({
      location:app.globalData.location,
      age:app.globalData.age,
      xxx:"123456"
    })
  },
  choseMyface: function(event) {
    var self = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
            title: '照片正在上传',
            mask: true
        });
        wx.uploadFile({
          url: 'http://192.168.2.21:3000/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'thumbnail',
          success: function(res){
            wx.hideLoading();
            var data = res.data;
            console.log(data);
            self.setData({
              data:data
            })
          }
        })
      }
    })
  }
});

