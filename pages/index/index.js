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
      url: 'https://contest.lujs.cn/h5-mission/wx/upload', 
      filePath: self.data.imgObj.path,
      name: 'thumbnail',
      success: function(res){
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if(data.error_code == "0"){
          app.globalData.faceRes = data.result.face_list[0];
          wx.navigateTo({
            url: '/pages/result/result'
          })
        }else{
          if(data.code=="ESOCKETTIMEDOUT"){
            wx.showToast({title:"您的网络异常",icon:"none"});
          }else{
            if(data.error_code == "222202"){
              wx.showToast({title:"未找到人脸",icon:"none"});
            }else{
  
              wx.showToast({title:data.error_msg,icon:"none"});
            }

          }
          
          
        } 
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  onShareAppMessage:function(){
    return {
      title:"刷脸测财运，快来试试吧！"
    }
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
            app.globalData.imgObj = imgObj;
            self.setData({
              imgObj:imgObj
            })
          }
        })
      }
    })
  },
  uploadPhoto:function(event){
    var self = this;

  }
});

