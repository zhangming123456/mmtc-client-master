// pages/login/index.js
const app = getApp(),
    util = app.util,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../utils/ApiService/index'),
    utilPage = require('../../utils/utilPage');

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page loginIndex',
        isShow2: true,
        isLogin: true,
        userInfo: {},
        invite_id: '',//邀请码
        telephone: '',
        isBindTelephone: true
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
    onPageScroll (options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {

    }
};

const methods = {
    loadCb () {
        let that = this,
            options = this.data.options,
            invite_id = 0;
        if (options.scene) {
            let scene = decodeURIComponent(options.scene)
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    invite_id = kv[1];
                }
            }
        } else if (app.globalData.invite_id) {
            invite_id = app.globalData.invite_id
        }
        that.setData({scene: {invite_id}});
    },
    loginCallback (res) {
        this.$route.back();
    }
};

Page(new utilPage(appPage, methods));
