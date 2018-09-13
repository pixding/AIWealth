let miletype = {
  "none":{title:"一脸严肃"},
  "smile":{title:"微微一笑"},
  "laugh":{title:"满面笑容"}
}
let facetype = {
  "square":{title:"国子脸"},
  "triangle":{title:"瓜子脸"},
  "oval":{title:"椭圆脸"},
  "heart":{title:"心型脸"},
  "round":{title:"圆脸"}
}
let glasses = {
  "none":{title:"未配带眼镜"},
  "common":{title:"配带普通眼镜"},
  "sun":{title:"配带墨镜"},
}


Page({
  data: {
    width:null,
    height:null,
  },
  getScore:function(){
    let faceRes = getApp().globalData.faceRes;
    let cyFea = faceRes.cyFea;
    console.log(cyFea,'......');
    return{
      yz:cyFea.yz.toFixed(2),
      cy:cyFea.cy.toFixed(2),
      yword:cyFea.yword,
      pword:cyFea.pword
    }
  },
  onShareAppMessage:function(){
    var that = this;
    return {
      title:"预测我"+getApp().globalData.faceRes.age+"岁，颜值"+that.getScore().yz+"分，财运"+that.getScore().cy+"分，你来试试？",
      path:"pages/index/index"
    }
  },
  onLoad:function(){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let screenW = res.windowWidth;
        let screenH = res.windowHeight;
        let canvasHeight = 46+30+240+370;
        that.setData({
          width:screenW,
          height:canvasHeight
        },function(){
          that.drawimg();
        })

      }
    });
  },
  gotosort:function(){
    wx.navigateTo({
      url: '/pages/sort/sort'
    })
  },
  save:function(){
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//这里是用户同意授权后的回调
              that.savaImageToPhoto();
            },
            fail() {//这里是用户拒绝授权后的回调
            }
          })
        }else{//用户已经授权过了
          that.savaImageToPhoto();
        }
      }
    })

  },

  savaImageToPhoto:function(){
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      destWidth: that.data.width*2,
      destHeight: that.data.height*2,
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
              }
            })
          }
        })
      } 
    })
  },
  drawimg:function(){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let screenW = res.windowWidth;
        let scroeObj = that.getScore();
        let yword = scroeObj.yword.word;
        let pword = scroeObj.pword;
        let canvasHeight = that.data.height;
        //画渐变
        var ctx = wx.createCanvasContext('thumbphoto');
        const grd = ctx.createLinearGradient(0, 0, 0, canvasHeight)
        grd.addColorStop(0, '#00b0e0')
        grd.addColorStop(1, '#fff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0,screenW, canvasHeight);
        //画标题
        let titlew = screenW-160;
        let titleH = 46/(224/titlew);
        ctx.drawImage("../../images/title322446.png",80, 20, titlew, titleH)

        //画头像
        var imgObj = getApp().globalData.imgObj;
        let imgW = imgObj.width; //实际宽
        let imgH = imgObj.height; //实际高
        let canvasH = 240;
        let rate = Math.max(imgW/(screenW-30),imgH/canvasH);
        let faceLeft = (screenW -30 - imgW/rate)/2+15;
        let faceTop = 20+titleH+10;
        let faceDWidth = imgW/rate;
        let faceDHeight = imgH/rate;
        ctx.drawImage(imgObj.path,faceLeft, faceTop, faceDWidth, faceDHeight)

        //画框
        let location = getApp().globalData.faceRes.location;
        
        let rTop = (0+location.top)/rate+faceTop;
        let rLeft = (((screenW -30)*rate-imgW)/2+location.left)/rate+15;
        let rW = location.width/rate;
        let rH= location.height/rate;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';//填充样式演示

        ctx.fillRect(rLeft, rTop, rW, rH);//绘制矩形


        
        var borderWidth = 14;
        var lW = 3;
        ctx.setStrokeStyle("#fff")
        ctx.setLineWidth(lW)
        ctx.moveTo(rLeft-lW+borderWidth,rTop-lW);
        ctx.lineTo(rLeft-lW,rTop-lW);
        ctx.lineTo(rLeft-lW,rTop-lW+borderWidth);

        ctx.moveTo(rLeft+rW+lW-borderWidth,rTop-lW);
        ctx.lineTo(rLeft+rW+lW,rTop-lW);
        ctx.lineTo(rLeft+rW+lW,rTop-lW+borderWidth);

        ctx.moveTo(rLeft-lW,rTop+rH+lW-borderWidth);
        ctx.lineTo(rLeft-lW,rTop+rH+lW);
        ctx.lineTo(rLeft-lW+borderWidth,rTop+rH+lW);

        ctx.moveTo(rLeft+rW+lW-borderWidth,rTop+rH+lW);
        ctx.lineTo(rLeft+rW+lW,rTop+rH+lW);
        ctx.lineTo(rLeft+rW+lW,rTop+rH+lW-borderWidth);

        ctx.stroke()

        ctx.font="18px Georgia";
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        let scoreY = faceTop+faceDHeight+30;
        ctx.fillText("颜值："+scroeObj.yz+"分，财运："+scroeObj.cy+"分",screenW/2, scoreY);

        
        let faceRes = getApp().globalData.faceRes;
        let faceObj = {
          age:faceRes.age,
          sex:faceRes.gender.type==="female"?"女":"男",
          mile:miletype[faceRes.expression.type].title,
          facetype:facetype[faceRes.face_shape.type].title,
          glasses:glasses[faceRes.glasses.type].title,
        }
        let fec = `脸型特征：${faceObj.sex}，${faceObj.age}岁，${faceObj.facetype}，${faceObj.glasses}，${faceObj.mile}。`
        ctx.font="12px Georgia";
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(fec,screenW/2,scoreY+25);
        scoreY = scoreY + 25;


        ctx.fillStyle = '#fff';
        //财运分析
        var retHeight = 300;
        ctx.fillRect(15, scoreY+15, screenW-30, retHeight)
        ctx.setFillStyle('#000');
        ctx.textAlign = 'center';
        ctx.font="18px Georgia";
        ctx.fillText("财运分析",screenW/2, scoreY+45);

        ctx.setStrokeStyle("#00b0e0")
        ctx.setLineWidth(1);
        ctx.beginPath();
        ctx.moveTo(15,scoreY+60);
        ctx.lineTo(screenW-15,scoreY+60);
        ctx.stroke();

        ctx.font="16px Georgia";
        ctx.textAlign = 'left';
        let lineHeight=26;
        let i = 1;
        ctx.fillText(yword[0],30, scoreY+60+lineHeight*i++);
        ctx.font="16px Georgia";
        ctx.fillText(yword[1],30, scoreY+60+lineHeight*i++);
        ctx.fillText("推荐您投资陆金所理财产品：",30, scoreY+60+lineHeight*i++);
        
        ctx.drawImage("../../images/er.jpg",screenW-130, scoreY+15+300-130, 344/4, 344/4)
        ctx.font="13px Georgia";
        ctx.fillText("长按此预测财运",screenW-130, scoreY+15+300-25);

        ctx.font="16px Georgia";
        ctx.fillStyle = '#f00';
        ctx.fillText(pword.name,30, scoreY+70+lineHeight*i++);
        ctx.font="13px Georgia";
        ctx.fillStyle = '#666';
        ctx.fillText(pword.desc[0],30, scoreY+70+lineHeight*i++);
        ctx.fillText(pword.desc[1],30, scoreY+70+lineHeight*i++);

        ctx.font="16px Georgia";
        ctx.fillStyle = '#f60';
        ctx.fillText(faceRes.cyFea.registerword,30, scoreY+15+300-25);
        ctx.draw();
      }
    });
  }
  

});

