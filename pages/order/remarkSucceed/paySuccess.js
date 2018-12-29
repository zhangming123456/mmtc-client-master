const app = getApp(),
  util = app.util,
  config = require('../../../utils/config'),
  utilPage = require('../../../utils/utilPage'),
  ApiService = require('../../../utils/ApiService/index'),
  c = require("../../../utils/common.js");

const appPage = {
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;

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
  onUnload() {},
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
  async loadCb() {
    let that = this,
      options = that.data.options,
      id = options.id;


  },


  backHome() {
    console.log(111111111);

    this.$route.tab("/page/tabBar/home/index")
  },

  backOrder() {
    console.log(111111111);

    this.$route.push("/page/mine/pages/mynotes/index")

  }
};

Page(new utilPage(appPage, methods));
