const  app = getApp();
Page({
  data: {
    imgObj:null,
  },
  uploadMyface:function(){
    var self = this;
    wx.showLoading({
        title: '正在计算...',
        mask: true
    });
    wx.uploadFile({
      url: 'http://192.168.1.101:3000/upload', //仅为示例，非真实的接口地址
      filePath: self.data.imgObj.path,
      name: 'thumbnail',
      success: function(res){
        wx.hideLoading();
        var data = res.data;
        console.log(data);
        
      }
    })
  },
  resetMyface:function(){
    this.setData({
      imgObj:null
    })
  },
  choseMyface: function(event) {
    var self = this;
    wx.chooseImage({
      success: function(res) {
        let imgPath = res.tempFilePaths[0];
        wx.getImageInfo({
          src:imgPath,
          success:function(res){
            var imgObj = {
              path:imgPath,
              width:res.width,
              height:res.height
            }
            self.setData({
              imgObj:imgObj
            })
          }
        })
        self.setData({
          imgPath:res.tempFilePaths[0]
        })
        
      }
    })
  },
  uploadPhoto:function(event){
    var self = this;

  }
});

