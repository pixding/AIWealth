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
      url: 'https://contest.lujs.cn/h5-list/upload', //仅为示例，非真实的接口地址
      filePath: self.data.imgObj.path,
      name: 'thumbnail',
      success: function(res){
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if(data.error_code == "0"){
          console.log(data);
        }else{
          if(data.error_code == "222202"){
            wx.showToast({title:"未找到人脸",icon:"none"});
          }else{

            wx.showToast({title:data.error_msg,icon:"none"});
          }
          
        } 
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

