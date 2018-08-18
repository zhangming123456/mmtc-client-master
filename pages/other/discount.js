const c = require("../../utils/common.js");
let scrollLeft = 0,
  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: 0,
    lat_and_lon: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        scrollLeft = parseInt(res.windowWidth / 3);
      }
    });
    this.setData({
      lat_and_lon: app.globalData.lat_and_lon
    })
    let id = options.id || 2;
    let url = '/api/album/detail?id=' + id;
    c.showLoading();
    let that = this;
    c.get(url, function (ret) {
      c.hideLoading();
      if (ret.status == 1) {
        if (ret.info.categories && ret.info.categories.length) {
          that.data.cid = ret.info.categories[0].id;
          that.loadItems();
        }
        that.setData({
          album: ret.info,
          cid: that.data.cid
        });
      }
    });
  },
  loadItems() {
    let lat_and_lon = this.data.lat_and_lon;
    this.$vm = c.listGrid(this, {
      url: `/api/album/detailData?category_id=${this.data.cid }&lat=${lat_and_lon.lat}&lon=${lat_and_lon.lon}`
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
  toggleCategory: function (e) {
    let id = e.currentTarget.dataset.id;
    var left = e.currentTarget.offsetLeft - scrollLeft;
    if (left < 0) {
      left = 0;
    }
    this.setData({
      cid: id,
      scrollLeft: left
    });
    this.$vm.setParam('category_id', id).loadData();
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
    if (this.$vm) {
      this.$vm.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})