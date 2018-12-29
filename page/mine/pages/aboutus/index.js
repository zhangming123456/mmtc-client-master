const c = require("../../../../utils/common.js");
const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    config = require('../../../../utils/config'),
    ApiService = require('../../../../utils/ApiService/index');

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page mine aboutus',
        qrcode: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadCb();
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
    onPullDownRefresh () {
        let that = this;
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        let that = this
    },
    /**
     * 页面滚动
     * @param options
     */
    onPageScroll(options){
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};
const methods = {
    loadCb(){
        let that = this, setData = {};
        ApiService.wx_shopShowQrcode().finally(res => {
            if (res.status === 1 && res.info.path) {
                setData.qrcode = res.info.path;
            } else {
                util2.failToast(res.message)
            }
            that.setData(setData);
        })
    },
    downImg: function () {
        let qrcode = this.data.qrcode;
        if (!qrcode) return;
        util2.showLoading();
        util2.saveImageToPhotosAlbum({filePath: qrcode}).finally(res => {
            util2.hideLoading(true);
            if (res.status === 1) {
                util2.showToast(res.message)
            } else {
                util2.failToast(res.message)
            }
        })
    },
};
Page(new utilPage(appPage, methods));
