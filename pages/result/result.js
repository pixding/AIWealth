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

Page({
  data: {
    imgObj:null,
    faceRes:null,
    mask:null,
  },
  imageLoad:function(e){
    var that = this;
    var w = e.detail.width;
    var h = e.detail.height;
    wx.getSystemInfo({
      success: function(res) {
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


        let faceRes = getApp().globalData.faceRes;
        var yzScore = faceRes.beauty/100*40+60;
        let baseScore = miletype[faceRes.expression.type].s+facetype[faceRes.face_shape.type].s+glasses[faceRes.glasses.type].s;
        var cyScore = baseScore+yzScore+(10-Math.abs(faceRes.age-35)/3);


        var context = wx.createCanvasContext('facecanvas')
        var borderWidth = 16;
        var lW = 4;
        context.setStrokeStyle("#fff")
        context.setLineWidth(lW)
        context.moveTo(rLeft-lW+borderWidth,rTop-4);
        context.lineTo(rLeft-lW,rTop-lW);
        context.lineTo(rLeft-lW,rTop-lW+borderWidth);

        context.moveTo(rLeft+rW+lW-borderWidth,rTop-4);
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
        context.fillText("颜值："+yzScore.toFixed(2)+"分，财运："+cyScore.toFixed(2)+"分",realW/2,263);

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
    this.setData({
      imgObj:getApp().globalData.imgObj,
      faceRes:faceObj,
    })
  }
});

