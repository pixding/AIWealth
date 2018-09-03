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

  },
  onLoad:function(){
    this.drawimg();
  },
  drawimg:function(){
    wx.getSystemInfo({
      success: function(res) {
        let screenW = res.windowWidth-30;
        let screenH = res.windowHeight-90;
        console.log(res.windowHeight,"xxh");
        
        //画渐变
        var ctx = wx.createCanvasContext('thumbphoto');
        const grd = ctx.createLinearGradient(0, 0, 0, 800)
        grd.addColorStop(0, '#00b0e0')
        grd.addColorStop(1, '#fff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0,screenW, 800);
        //画标题
        let titlew = 345-160;
        let titleH = 46/(224/titlew);
        ctx.drawImage("../../images/title322446.png",80, 20, titlew, titleH)

        //画头像
        let imgW = 1080; //实际宽
        let imgH = 1440; //实际高
        let canvasH = 240;
        let rate = Math.max(imgW/screenW,imgH/canvasH);
        let faceLeft = (screenW - imgW/rate)/2;
        let faceTop = 20+titleH+10;
        let faceDWidth = imgW/rate;
        let faceDHeight = imgH/rate;
        ctx.drawImage("../../images/face.jpeg",faceLeft, faceTop, faceDWidth, faceDHeight)

        ctx.font="18px Georgia";
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        let scoreY = faceTop+faceDHeight+30;
        ctx.fillText("颜值：100.00分，财运：100.00分",screenW/2, scoreY);

        //财运分析
        var retHeight = 300;
        ctx.fillRect(15, scoreY+15, screenW-30, retHeight)
        ctx.setFillStyle('#000');
        ctx.fillText("财运分析",screenW/2, scoreY+45);

        ctx.setStrokeStyle("#00b0e0")
        ctx.setLineWidth(1)
        ctx.moveTo(15,scoreY+60);
        ctx.lineTo(345-15,scoreY+60);
        ctx.stroke();

        ctx.font="13px Georgia";
        ctx.textAlign = 'left';
        let lineHeight=26;
        let i = 1;
        ctx.fillText("您财运较好，能获得意外之财，不为金钱发愁。",30, scoreY+60+lineHeight*i++);
        ctx.fillText("但却能赚能花，钱财流失的也快。",30, scoreY+60+lineHeight*i++);
        ctx.fillText("推荐您投资陆金所理财产品：",30, scoreY+60+lineHeight*i++);
        
        ctx.drawImage("../../images/er.jpg",screenW-130, scoreY+15+300-130, 344/4, 344/4)
        ctx.font="13px Georgia";
        ctx.fillText("长按此预测财运",screenW-130, scoreY+15+300-25);

        ctx.font="16px Georgia";
        ctx.fillStyle = '#f00';
        ctx.fillText("慧盈-安e+",30, scoreY+70+lineHeight*i++);
        ctx.font="13px Georgia";
        ctx.fillStyle = '#666';
        ctx.fillText("期望年化利率8.4%",30, scoreY+70+lineHeight*i++);
        ctx.fillText("项目安全等级5星",30, scoreY+70+lineHeight*i++);

        ctx.font="16px Georgia";
        ctx.fillStyle = '#f60';
        ctx.fillText("注册就送1888投资券",30, scoreY+15+300-25);
        

        ctx.draw();
        

      }
    });
    // let facew = 1080;
    // let faceh = 1440;
    // let rate = faceh/240;
    // let faceleft = (345 - facew/rate)/2

    // var ctx = wx.createCanvasContext('thumbphoto');
    // const grd = ctx.createLinearGradient(0, 0, 0, 800)
    // grd.addColorStop(0, '#00b0e0')
    // grd.addColorStop(1, '#fff')

    // // Fill with gradient
    // ctx.setFillStyle(grd)
    // ctx.fillRect(0, 0,screenW-30 , 800)

    // ctx.drawImage("../../images/mytitle.png",80, 18+20, titlew, h-20)

    // ctx.drawImage("../../images/face.jpeg",faceleft, 18+h+10, facew/rate, faceh/rate)

    // var borderWidth = 14;
    // var rLeft = 120;
    // var rTop = 90;
    // var rW = 100;
    // var rH = 70;
    // var lW = 4;
    // ctx.setStrokeStyle("#fff")
    // ctx.setLineWidth(lW)
    // ctx.moveTo(rLeft-lW+borderWidth,rTop-lW);
    // ctx.lineTo(rLeft-lW,rTop-lW);
    // ctx.lineTo(rLeft-lW,rTop-lW+borderWidth);

    // ctx.moveTo(rLeft+rW+lW-borderWidth,rTop-lW);
    // ctx.lineTo(rLeft+rW+lW,rTop-lW);
    // ctx.lineTo(rLeft+rW+lW,rTop-lW+borderWidth);

    // ctx.moveTo(rLeft-lW,rTop+rH+lW-borderWidth);
    // ctx.lineTo(rLeft-lW,rTop+rH+lW);
    // ctx.lineTo(rLeft-lW+borderWidth,rTop+rH+lW);

    // ctx.moveTo(rLeft+rW+lW-borderWidth,rTop+rH+lW);
    // ctx.lineTo(rLeft+rW+lW,rTop+rH+lW);
    // ctx.lineTo(rLeft+rW+lW,rTop+rH+lW-borderWidth);

    // ctx.stroke()

    // ctx.font="18px Georgia";
    // ctx.fillStyle = '#fff';
    // ctx.textAlign = 'center';
    
    // ctx.fillText("颜值：100.00分，财运：100.00分",345/2, 18+h+28+250);

    
    
    // ctx.fillRect(15, 18+h+28+250+15, 345-30, 300)
    // ctx.setFillStyle('#000');
    // ctx.fillText("财运分析",345/2, 18+h+28+250+15+30);

    // ctx.setStrokeStyle("#00b0e0")
    // ctx.setLineWidth(1)
    // ctx.moveTo(15,18+h+28+250+15+30+15);
    // ctx.lineTo(345-15,18+h+28+250+15+30+15);
    // ctx.stroke();

    // ctx.font="14px Georgia";
    // ctx.textAlign = 'left';
    // ctx.fillText("您财运较好，能获得意外之财，不为金钱发愁。",30, 18+h+28+250+15+30+45);
    // ctx.fillText("但却能赚能花，钱财流失的也快。",30, 18+h+28+250+15+30+45+24);
    // ctx.fillText("推荐您投资陆金所理财产品：",30, 18+h+28+250+15+30+45+24*2);


    // ctx.drawImage("../../images/er.jpg",230, 18+h+28+250+15+300-130, 344/4, 344/4)
    // ctx.font="13px Georgia";
    // ctx.fillText("长按预测财运",230, 18+h+28+250+15+300-25);

    
  },
  savaImageToPhoto:function(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      destWidth: 345*2,
      destHeight: 800*2,
      canvasId: 'thumbphoto',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              content: '图片保存成功，快去分享吧！',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#72B9C3',
              success: function (res) {
                console.log(123);
              }
            })
          }
        })
      } 
    })
  }
});

