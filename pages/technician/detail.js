// pages/technician/detail.js
const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    m: {},
    notes: [],
    items: [],
    tag: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id || 12;
    if (id) { // id 
      c.showLoading();
      var that = this;
      c.get('/app/technician/technicianDetail', {
        id: id
      }, function (ret) {
        c.hideLoading();
        if (ret.status == 1) {
          that.data.m = ret.info.m;
          that.data.tag = ret.info.tag;
          that.data.notes = ret.info.notes;
          that.data.items = ret.info.items;
          that.setData({
            m: that.data.m,
            tag: that.data.tag,
            notes: c.wrapZan(that.data.notes),
            items: that.data.items
          });
        }
      });
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showItemDetail: function (e) {
    wx.navigateTo({
      url: '/page/shop/pages/goods/index?id=' + e.currentTarget.dataset.id,
    })
  },

  gotoItemsDetail(){

  },
  zan: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    c.zan(id, function () {
      that.data.notes.every(function (el) {
        if (el.id == id) {
          el.zaned = true;
          el.zan_count++;
          that.setData({
            notes: that.data.notes
          });
          return false;
        }
        return true;
      });
    });
  }
});