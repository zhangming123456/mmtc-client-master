// pages/index/index.js
const app = getApp(),
    c = require("../../utils/common.js"),
    qrcode = require("../../utils/qrcode.js"),
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page index',
        info: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
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

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    onPageScroll(e){

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb(){
        let options = this.data.options;
        this.getRefundInfo(options.id)
    },
    getRefundInfo(id, callback) {
        let that = this;
        if (id) {
            ApiService.getRefundInfo({id}).then(
                res => {
                    callback && callback();
                    if (res.status == 1) {
                        that.setData({
                            info: res.info
                        });
                    }
                }
            )
        }
    },
}
Page(new utilPage(appPage, methods));