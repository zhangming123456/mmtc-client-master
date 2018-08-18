const app = getApp(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage');
const appPage = {
    data: {
        text: "Page userInfo login",
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        if (this.data.isShow) {
            this.loadCb()
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },
    /**
     * 页面渲染完成
     */
    onReady () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {

    },
    onPageScroll(options){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
}
/**
 * 方法类
 */
const methods = {
    loadCb(){
        let that = this,
            options = that.data.options;
    },
    bindGetUserInfo(e){
        let that = this;
        if (that.data.canIUse) {
            if ('getUserInfo:fail auth deny' === e.detail.errMsg) {
                app.globalData.userInfo_start = 1;
            } else {
                app.globalData.userInfo_start = 2;
                app.globalData.userInfo = e.detail.userInfo;
                that.toLoginPage();
            }
            wx.setStorageSync('isGetUserInfoErrMsg', e.detail.errMsg);
        } else {
            that.__getUserInfo(
                res => {
                    app.globalData.userInfo_start = 2;
                    app.globalData.userInfo = res.userInfo;
                    that.toLoginPage()
                },
                rsp => {
                    app.globalData.userInfo_start = 1;
                }
            ).finally(
                () => {

                }
            )
        }
    },
    toLoginPage(){
        this.$route.replace('/page/login/index');
    }
};
Page(new utilPage(appPage, methods));