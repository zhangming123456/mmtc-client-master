const app = getApp(),
    util = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService/index"),
    config = require("../../../../utils/config");
var interval = null //倒计时函数
const {
    $Toast
} = require('../../../../lib/iview/toast/index');
const appPage = {
    data: {
        text: 'Page mine collection',
        date: '请选择日期',
        fun_id: 2,
        time: '获取验证码', //倒计时
        currentTime: 61,
        telephone: '',
        code: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;

    },
};
const methods = {
    loadCb() {

    },


    // 手机号码
    userNameInput(e) {
        this.setData({
            telephone: e.detail.value
        })
    },
    // 验证码
    userCodeInput(e) {
        this.setData({
            code: e.detail.value
        })
    },


    getCode(options) {
        var that = this;
        var currentTime = that.data.currentTime
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: '重新获取',
                    currentTime: 61,
                    disabled: false
                })
            }
        }, 100)
    },
    getVerificationCode() {
        var that = this
        let telephone = that.data.telephone;
        if (!util.regExpUtil.isPhone(telephone)) {
            console.log('11111111');
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        this.getCode();
        that.setData({
            disabled: true
        })
    },
};

Page(new utilPage(appPage, methods));
