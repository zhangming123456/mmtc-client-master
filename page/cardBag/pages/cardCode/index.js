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
    qrcode:''
  },
  onLoad: function (options) {
    let that = this;
    that.loadCb();
  },
  /**
   * 进入页面
   */
  onShow: function (options) {

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
    var pwd = this.data.options.pwd;
    ApiService.getOrderCardCheckPwd({
      pwd
    }).finally(res => {
      if (res.status === 1) {
        that.setData({
          pwdList: res.info,
          qrcode: qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + res.info.pwd, {
            'size': 300
          })
        })
      }
    })
  }


};
Page(new utilPage(appPage, methods));