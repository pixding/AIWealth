let miletype = {
  "none":{title:"一脸严肃",s:4},
  "smile":{title:"微微一笑",s:8},
  "laugh":{title:"满面笑容",s:4}
}
let facetype = {
  "square":{title:"国子脸",s:4},
  "triangle":{title:"瓜子脸",s:10},
  "oval":{title:"椭圆脸",s:8},
  "heart":{title:"心型脸",s:10},
  "round":{title:"圆脸",s:2}
}
let glasses = {
  "none":{title:"未配带眼镜",s:4},
  "common":{title:"配带普通眼镜",s:8},
  "sun":{title:"配带墨镜",s:12},
}

let yunsi = [
  {
    word:[
      "您顺水顺风","财运渐入佳境，财富稳稳上扬。"
    ]
  },
  {
    word:[
      "您时来运转","财力有进有退，转型改造财运改善。"
    ]
  },
  {
    word:[
      "您财运亨通","全年事业带财，身价水涨船高。"
    ]
  },
  {
    word:[
      "您鸿运当头","眼观四方、耳听八面，看旺全年。"
    ]
  }
];
let rcmdProd = [
  {
    name:"慧盈-安e+",
    desc:["期望年化利率8.4%","项目安全等级5星"]
  },
  {
    name:"安增益4号T+31",
    desc:["七日年化收益率4.53%","每隔31天免费赎回"]
  },
  {
    name:"金色人生",
    desc:["七日年化收益率3.87%","灵活赎回，1元起投"]
  }
]

Page({
  data: {
    imgObj:null,
    faceRes:null,
    mask:null,
    scroeObj:null,
  },
  getScore:function(){
    let faceRes = getApp().globalData.faceRes;
    var yzScore = faceRes.beauty/100*40+60;
    let baseScore = miletype[faceRes.expression.type].s+facetype[faceRes.face_shape.type].s+glasses[faceRes.glasses.type].s;
    var cyScore = baseScore+yzScore+(10-Math.abs(faceRes.age-35)/3);
    let index = 0;
    if(cyScore>80){
      index = 1;
    }
    if(cyScore>90){
      index=2;
    }
    if(cyScore>105){
      index = 3;
    }
    let pindex = Math.ceil(cyScore)%3;

    return{
      yz:yzScore,
      cy:cyScore,
      yword:yunsi[index],
      pword:rcmdProd[pindex]
    }
  },
  imageLoad:function(e){
    var that = this;
    var imgObj = that.data.imgObj;
    var w = e.detail.width;
    var h = e.detail.height;
    wx.getSystemInfo({
      success: function(res) {
        let scroeObj = that.getScore();
        let realW = res.windowWidth-30;
        let realH = 240;
        let location = getApp().globalData.faceRes.location;
        let rate = Math.max(w/realW,h/realH); //缩放比例，取大的
        
        let rTop = ((realH*rate-h)/2+location.top)/rate;
        let rLeft = ((realW*rate-w)/2+location.left)/rate;
        let rW = location.width/rate;
        let rH= location.height/rate;
        let mask = {
          rTop,
          rLeft,
          rW,
          rH
        }
        that.setData({
          mask
        })

        var context = wx.createCanvasContext('facecanvas')
        var borderWidth = 14;
        var lW = 3;
        context.setStrokeStyle("#fff")
        context.setLineWidth(lW)
        context.moveTo(rLeft-lW+borderWidth,rTop-lW);
        context.lineTo(rLeft-lW,rTop-lW);
        context.lineTo(rLeft-lW,rTop-lW+borderWidth);

        context.moveTo(rLeft+rW+lW-borderWidth,rTop-lW);
        context.lineTo(rLeft+rW+lW,rTop-lW);
        context.lineTo(rLeft+rW+lW,rTop-lW+borderWidth);

        context.moveTo(rLeft-lW,rTop+rH+lW-borderWidth);
        context.lineTo(rLeft-lW,rTop+rH+lW);
        context.lineTo(rLeft-lW+borderWidth,rTop+rH+lW);

        context.moveTo(rLeft+rW+lW-borderWidth,rTop+rH+lW);
        context.lineTo(rLeft+rW+lW,rTop+rH+lW);
        context.lineTo(rLeft+rW+lW,rTop+rH+lW-borderWidth);

        context.stroke()

        context.font="18px Georgia";
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.shadowColor = '#000';
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 2;
        context.fillText("颜值："+scroeObj.yz.toFixed(2)+"分，财运："+scroeObj.cy.toFixed(2)+"分",realW/2,263);

        context.draw();
      }
    });


  },
  computeImg:function(){

  },
  onLoad:function(){
    
    let faceRes = getApp().globalData.faceRes;
    let faceObj = {
      age:faceRes.age,
      sex:faceRes.gender.type==="female"?"女":"男",
      mile:miletype[faceRes.expression.type].title,
      facetype:facetype[faceRes.face_shape.type].title,
      glasses:glasses[faceRes.glasses.type].title,
    }
    let scroeObj = this.getScore();
    this.setData({
      imgObj:getApp().globalData.imgObj,
      faceRes:faceObj,
      scroeObj:scroeObj,
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
              console.log("fail");
            }
          })
        }else{//用户已经授权过了
          that.savaImageToPhoto();
        }
      }
    })

  },

  savaImageToPhoto:function(){
    this.drawimg();

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      destWidth: 690,
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
  },
  drawimg:function(){
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let screenW = res.windowWidth-30;
        let scroeObj = that.getScore();
        let yword = scroeObj.yword.word;
        let pword = scroeObj.pword;
        //画渐变
        var ctx = wx.createCanvasContext('thumbphoto');
        const grd = ctx.createLinearGradient(0, 0, 0, 800)
        grd.addColorStop(0, '#00b0e0')
        grd.addColorStop(1, '#fff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0,screenW, 800);
        //画标题
        let titlew = screenW-160;
        let titleH = 46/(224/titlew);
        ctx.drawImage("../../images/title322446.png",80, 20, titlew, titleH)

        //画头像
        var imgObj = that.data.imgObj;
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
        ctx.fillText("颜值："+scroeObj.yz.toFixed(2)+"分，财运："+scroeObj.cy.toFixed(2)+"分",screenW/2, scoreY);

        //财运分析
        var retHeight = 300;
        ctx.fillRect(15, scoreY+15, screenW-30, retHeight)
        ctx.setFillStyle('#000');
        ctx.fillText("财运分析",screenW/2, scoreY+45);

        ctx.setStrokeStyle("#00b0e0")
        ctx.setLineWidth(1);
        ctx.beginPath();
        ctx.moveTo(15,scoreY+60);
        ctx.lineTo(345-15,scoreY+60);
        ctx.stroke();

        ctx.font="13px Georgia";
        ctx.textAlign = 'left';
        let lineHeight=26;
        let i = 1;
        ctx.fillText(yword[0],30, scoreY+60+lineHeight*i++);
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
        ctx.fillText("注册就送1888投资券",30, scoreY+15+300-25);
        ctx.draw();
      }
    });
  }
  

});

