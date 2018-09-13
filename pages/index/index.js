const  app = getApp();
Page({
  data: {
    imgObj:null,
    userInfo:null,
    openid:null,
    isReady:false,
  },
  

  uploadMyface:function(){
    var self = this;
    wx.showLoading({
        title: '正在计算...',
        mask: true
    });
    wx.uploadFile({
      url: 'https://contest.lujs.cn/h5-mission/wx/upload?a=3', 
      filePath: self.data.imgObj.path,
      formData:{
        openid:self.data.openid,
        nickname:self.data.userInfo.nickName,
        url:self.data.userInfo.avatarUrl
      },
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
      fail:function(){
        wx.showToast({title:"计算失败，请检查网络",icon:"none"});
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
  gotosort:function(){
    wx.navigateTo({
      url: '/pages/sort/sort'
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

  bindGetUserInfo:function(e){
    var that = this;
    if (e.detail.userInfo) {
      that.setData({
        userInfo:e.detail.userInfo
      },function(){
        that.doLogin();
      })
    }
  },
  onLoad:function(){
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo:res.userInfo,
                isReady:true
              },function(){
                that.doLogin();
              })
            }
          })
        }else{
          that.setData({
            isReady:true
          })
        }
      }
    })
  },
  doLogin:function(){
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://contest.lujs.cn/h5-mission/wx/getopenid?code='+res.code,
            success:function(data){
              app.globalData.openid = data.data.openid;
              that.setData({
                openid:data.data.openid
              })
            }
          })
        } else {
        }
      }
    });
  }
});

