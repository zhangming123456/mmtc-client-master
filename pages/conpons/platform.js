// pages/conpons/mine.js
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
    c.getLocation(function(ret){
      this.$vm = c.listGrid(this, {
        url: '/api/coupon/getCouponList'
      }).setParams({
        lat: ret.latitude,
        lon: ret.longitude
      }).loadData();
    }.bind(this));    
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

  },
  touse: function (e) {
    let item = e.currentTarget.dataset.item;
    if (item.shop_id > 0) {
      wx.navigateTo({
        url: '/pages/home/index?shop_id=' + item.shop_id
      });
    } else {
      wx.navigateTo({
        url: '/pages/index/items'
      });
    }
  },
  topick: function (e) {
    let item = e.currentTarget.dataset.item;
    let id = item.id;
    let that = this;
    c.showLoading();
    c.get('/api/coupon/doPicker', {
      id: id
    }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        var info = res.info;
        if (info.errmsg) {
          c.alert(info.errmsg);
        } else {
          that.data.items.every(function (el) {
            if (el.id == id) {
              el.errmsg = '已领取';
              return false;
            }
            return true;
          });
          that.setData({
            items: that.data.items
          });
        }
      } else {
        c.alert(res.info);
      }
    });
  }
})