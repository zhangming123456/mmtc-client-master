const c = require("../../utils/common.js");
let urls = ['/api/msg/zan', '/api/msg/comment', '/api/msg/notice'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0
  },
  toggleType: function (e) {
    var id = parseInt(e.currentTarget.dataset.id);
    this.setData({
      type: id
    });
    this.$vm.setUrl(urls[id]).loadData();
  },
  showNote:function(e){
    var id = e.currentTarget.dataset.id;
    if(id){
       wx.navigateTo({
         url: '/pages/cases/detail?id='+id,
       });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let type = parseInt(options.type || 2);
     this.setData({
       type:type
     });    
     this.$vm = c.listGrid(this, {
       url: urls[type]
     }).loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.$vm.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})