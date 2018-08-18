// pages/dongtai/index.js
const c = require("../../utils/common.js");
var page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    loadingMore: false,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0;
    this.shop_id = options.shop_id;
    this.loadData();
  },
  loadData: function (callback, isAppend) {
    if (!this.data.hasMore) {
      return;
    }
    if (!this.loadingMore) {
      page++;
      var that = this;
      this.data.loadingMore = 1;
      this.setData({
        loadingMore: 1
      });
      let shop_id = this.shop_id;
      c.get("/api/note/shopNotes", { shop_id: shop_id, p: page }, function (res) {
        that.data.loadingMore = 0;
        let setData = {
          loadingMore: 0
        };
        if (res.status == 1) {
          if (res.info.length < c.getPageSize()) {
            that.data.hasMore = 0;
            if (res.info.length == 0) {
              setData.isEmpty = true;              
            } else {
              setData.hasMore = 0;
            }
          }
          if (isAppend) {
            that.data.data = that.data.data.concat(c.wrapZan(res.info));
          } else {
            that.data.data = c.wrapZan(res.info);
          }
          setData.data = that.data.data;
        }
        that.setData(setData);
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
    this.loadData(null, 1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , zan: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    c.zan(id, function () {
      that.data.data.every(function (el) {
        if (el.id == id) {
          el.zaned = true;
          el.zan_count++;
          that.setData({
            data: that.data.data
          });
          return false;
        }
        return true;
      });
    });
  }

})