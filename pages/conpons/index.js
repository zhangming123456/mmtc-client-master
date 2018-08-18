// pages/conpons/index.js
const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    c.showLoading();
    var that = this;
    this.id = options.id || 1;
    c.get('/api/coupon/getConponById', {
      id: this.id
    }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        that.data.status = 1;
        that.data.m = res.info;
      } else {
        that.data.status = 0;
        that.data.m = res.info;
      }
      that.setData({
        status: that.data.status,
        m: that.data.m
      });
    });
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
  doPicker: function () {
    c.showLoading();
    var that = this;
    c.get('/api/coupon/doPicker', {
      id: this.id
    }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        var info = res.info;
        that.data.m.is_valid = info.is_valid;
        that.data.m.errmsg = info.errmsg;
        that.setData({
          m: that.data.m
        });
      } else {
        c.alert(res.info);
      }
    });
  }
})