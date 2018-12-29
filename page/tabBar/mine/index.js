const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../utils/utilPage"),
    config = require('../../../utils/config'),
    ApiService = require('../../../utils/ApiService/index');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page mine',
        isLogin: false,
        userInfo: {}
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
        this.wx2CheckSession()
        if (this.data.isShow) {
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
    onPullDownRefresh () {
        let that = this;
        this.wx2CheckSession({}, true).finally(res => {
            wx.stopPullDownRefresh();
        });
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
    onPageScroll (options) {
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {

    },
    onTabItemTap (options) {
        if (this.data.canOnTabItemTap > -1) {
            this.wx2CheckSession();
        }
    }
};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        this.setData({userInfo: wx.getStorageSync('_userInfo_')});
    },
    wx2CheckSession (setData = {}, bol) {
        let that = this;
        if (that.isLogin) return;
        that.isLogin = true;
        if (!bol) {
            util2.showLoading();
        }
        return app.judgeLogin(true).finally(res => {
            console.warn("登入状态", res);
            that.isLogin = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                setData.userInfo = wx.getStorageSync('_userInfo_');
                setData.isLogin = true;
            } else {
                wx.setStorageSync("_userInfo_", {});
                setData.userInfo = {};
                setData.isLogin = false
            }
            that.setData(setData);
        })
    },
    onLogin (e) {
        this.$route.push('/page/login/index');
    },
    toMsg (e) {
        let dataset = e.currentTarget.dataset;
        if (dataset && dataset.type) {
            this.$route.push({path: '/pages/msg/index', query: {type: dataset.type}})
        }
    },
    bindToLogin () {
        var login = util2.hasLogin(true)
        if (login === 1) return;
        this.$route.push('/page/login/index');
    },
    outLogin () {

    }
};

Page(new utilPage(appPage, methods));
