// pages/mine/index.js
const app = getApp(),
    c = require("../../utils/common.js"),
    config = require("../../utils/config"),
    ApiService = require("../../utils/ApiService"),
    authorize = require("../../utils/azm/authorize"),
    utilPage = require('../../utils/utilPage');

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page indexNear',
        isLogin: true,
        userInfo_start: app.globalData.userInfo_start,
        userInfo: c.getUserInfo()
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
};
const methods = {
    loadCb(){
        let that = this,
            options = that.data.options,
            setData = {isLogin: false};
        app.globalData.pages.minePage = this;
        ApiService.wx2CheckSession().finally(res => {
            if (res.status === 1) {
                setData.userInfo = c.getUserInfo();
                setData.isLogin = true;
            } else {
                c.setUserInfo({});
                setData.userInfo = {};
                setData.isLogin = false
            }
            that.setData(setData);
        })
    },
    showAdvise() {
        this.$route.push('/pages/advise/index');
    },
    showCard(){
        this.$route.push('/page/cardBag/pages/myCard/index')
    },
    showCar (e) {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/car/index'
            });
        });
    },
    showAllBill (e) {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/order/all',
            });
        });
    },
    bindGetUserInfo (e) {
        let that = this;
        if (that.data.canIUse) {
            if ('getUserInfo:fail auth deny' === e.detail.errMsg) {
                app.globalData.userInfo_start = 1;
            } else {
                app.globalData.userInfo_start = 2;
                c.setUserInfo(e.detail.userInfo);
                that.toLoginPage();
            }

        } else {
            this.__getUserInfo(
                res => {
                    app.globalData.userInfo_start = 2;
                    c.setUserInfo(res.userInfo);
                    that.toLoginPage();
                },
                rsp => {
                    app.globalData.userInfo_start = 1;
                }
            ).finally(
                function () {

                }
            )
        }
    },
    toLoginPage(){
        if (!this.data.isLogin) {
            app.util.go('/page/login/index');
        }
    },
    showCollection () {
        c.hasLogin(function () {
            app.util.go('/pages/mine/collection');
        });
    },
    showFooter () {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/mine/footer'
            });
        });
    },
    logoff (e) {
        var that = this;
        c.confirm('确定退出当前账号吗?', function () {
            c.logoff();
            app.globalData.userInfo = {};
            that.setData({
                userInfo: {},
                isLogin: false
            });
        });
    },
    showTypeBill (e) {
        c.hasLogin(function () {
            var id = e.currentTarget.dataset.type;
            wx.navigateTo({
                url: '/pages/msg/index?type=' + id,
            });
        });
    },
    showCoupons() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/conpons/mine',
            })
        });
    },
    showGroupList() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/group/mine',
            });
        });
    },
    showAboutUs() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/mine/aboutus',
            });
        });
    },
    showNotes() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/mine/mynotes'
            });
        });
    }
};
Page(new utilPage(appPage, methods))