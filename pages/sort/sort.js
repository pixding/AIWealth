Page({
  data:{
    yzarray:[]
  },
  onShareAppMessage:function(){
    var that = this;
    return {
      title:"财运排名赢大奖，快来试试看",
      path:"pages/sort/sort"
    }
  },
  gotoindex:function(){
    wx.reLaunch({
      url:'/pages/index/index'
    })
  },
  onLoad:function(){
    var that = this;
    wx.request({
      url: 'https://contest.lujs.cn/h5-mission/wx/getdb?openid='+getApp().globalData.openid,
      success:function(data){
        console.log(data);
        that.setData({
          yzarray:data.data
        })
      }
    })
  }
});