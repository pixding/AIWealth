Page({
  data:{
    yzarray:[],
    total:null,
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
      url: 'https://contest.lujs.cn/h5-mission/wx/getdb?version=2&openid='+getApp().globalData.openid,
      success:function(data){
        let rs = data.data;
        let arr = rs.data;
        let count = rs.count;
        that.setData({
          yzarray:arr,
          total:count ||200
        })
      }
    })
  }
});