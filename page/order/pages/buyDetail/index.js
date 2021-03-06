const app = getApp(),
  util2 = app.util2,
  regeneratorRuntime = app.util2.regeneratorRuntime,
  ApiService = require('../../../../utils/ApiService/index'),
  config = require('../../../../utils/config'),
  utilPage = require('../../../../utils/utilPage'),
  c = require("../../../../utils/common.js");
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
    c.get('/api/wx2/getOrderDetail', {
      id: options.id || '247'
    }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        that.setData({
          item: res.info
        });
      }
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

  tel() {
    var phone = this.data.item.shop.service_phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  gotoShopPay() {
    var shop_id = this.data.item.shop_id;
    wx.navigateTo({
      url: '/page/payment/pages/payTheBill/index?shop_id=' + shop_id
    })
  },

  gotoShop() {
    wx.setStorageSync('shop_id', this.data.item.shop_id)
    wx.switchTab({
      url: '/page/tabBar/home/index'
    })
  },
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.item.order_no,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  gobuyNow: function () {
    var url, postData;
    url = '/api/wx2/getPayInfoOfBuy';
    postData = {
      order_no: this.data.order_no
    };
    c.showLoading();
    c.post(url, postData, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        var info = res.info.payInfo;
        info.success = function () {
          wx.redirectTo({
            url: '/pages/car/paySuccess',
          });
        };
        info.fail = function () {

        };
        wx.requestPayment(info);
      } else {
        c.alert(res.info);
      }
    });
  }
})
