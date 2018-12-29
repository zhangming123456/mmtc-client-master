const app = getApp(),
  util = app.util,
  config = require('../../../../utils/config'),
  utilPage = require('../../../../utils/utilPage'),
  ApiService = require('../../../../utils/ApiService/index'),
  c = require("../../../../utils/common.js");

const appPage = {
  /**
   * 页面的初始数据
   */
  data: {
    onteList: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    that.loadCb();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.reLaunch({
      url: '/page/order/pages/orderAll/index'
    })
  },
  /**
   * 页面渲染完成
   */
  onReady() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(options) {
    let that = this;

  },
  onPageScroll(options) {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {

  }
};


/**
 * 方法类
 */
const methods = {
  loadCb() {
    let that = this;
    that.getNoteLists()
  },

  getNoteLists() {
    let that = this;
    var order_info_id = that.data.options.order_info_id;
    ApiService.getNoteLists({
      order_info_id
    }).finally(res => {
      if (res.status === 1) {
        that.setData({
          onteList: res.info
        });

      }
    })
  },
  gotoNote(e) {
    var item = e.currentTarget.dataset.item;
    if (item.order_info_id) {
      this.$route.push({
        path: '/page/order/pages/diary/index',
        query: {
          order_info_id: item.order_info_id
        }
      });
    }
  },

  gotoShopDetails(e) {
    var item = e.currentTarget.dataset.item;
    if (item.id) {
      this.$route.push({
        path: '/page/shop/pages/goods/index',
        query: {
          id: item.id
        }
      });
    }
  }
};

Page(new utilPage(appPage, methods));
