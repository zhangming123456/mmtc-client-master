const app = getApp(),
  util2 = app.util2,
  config = require('../../../../utils/config'),
  utilPage = require('../../../../utils/utilPage'),
  ApiService = require('../../../../utils/ApiService'),
  qrcode = require("../../../../utils/qrcode.js");
const appPage = {
  data: {
    text: "Page mmtcTabList",
    isFixed: false,
    loadingMore: true,
    noMore: false,
    pwdList: {},
    qrcode: ''
  },
  onLoad: function (options) {
    let that = this;
    that.loadCb();
  },
  /**
   * 进入页面
   */
  onShow: function (options) {
    if (this.data.isShow) {
      this.getOrderCardCheckPwd();
    }
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
   * 页面渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.getOrderCardCheckPwd();
    wx.stopPullDownRefresh();
  },
  /**
   * 上拉触底
   */
  onReachBottom() {

  },

};
/**
 * 方法类
 */
const methods = {
  loadCb() {
    let that = this,
      options = that.data.options,
      isShow = that.data.isShow,
      id = options.id;
    that.getOrderCardCheckPwd()
  },
  loadData() {

  },

  getOrderCardCheckPwd() {
    let that = this;
    var bill_id = this.data.options.bill_id;
    var card_item_id = this.data.options.card_item_id;



    ApiService.getOrderCardCheckPwd({
      bill_id,
      card_item_id
    }).finally(res => {
      if (res.status === 1) {

        for (let v of res.info) {
          if (v.pwd) {
            v.qrcode = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + v.pwd, {
              'size': 300
            })
          }
        }

        that.setData({
          pwdList: res.info
        })
      }
    })
  }


};
Page(new utilPage(appPage, methods));