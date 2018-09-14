//app.js
const config = require('./utils/config'),
    util = require('./utils/azm/util');

const util2 = require('./utils/util');
let isUpdate = true;
let isLogin = true;
let JudgeLogin = null;
App({
    globalData: {
        userInfo: null,
        shop: {},
        pages: {},
        city: {},
        isLocation: false,
        lat_and_lon: {}
    },
    util2,
    util,
    /**
     * 生命周期函数--监听小程序初始化
     * @param options
     */
    onLaunch: function (options) {
        console.warn('版本号：' + config.version);
        console.log('App Launch', options)
    },
    /**
     * 生命周期函数--监听小程序显示
     * @param options
     */
    onShow: function (options) {
        console.warn('App Show', options, isUpdate, isLogin);
        if (isUpdate) {
            new util2.updateManager().onALL();
            isUpdate = false;
        }
        this.judgeLogin();
    },
    /**
     * 判断登入状态
     * @return {Promise}
     */
    judgeLogin(bol){
        let that = this,
            city = this.globalData.city,
            isLoginStatus = wx.getStorageSync('_loginStatus_') || 0;
        if (!JudgeLogin || isLogin || bol) {
            JudgeLogin = new Promise(resolve => {
                if (city && city.id) {

                } else {
                    city = util2.getCity();
                }
                let cookie = util.getSessionId();
                wx.showNavigationBarLoading();
                console.log('/wx2/checkSession', "请求前");
                wx.request({
                    url: `${config.defaultApi}/wx2/checkSession`, //仅为示例，并非真实的接口地址,
                    header: {
                        'content-type': 'application/json',// 默认值
                        "Cookie": cookie,
                        "X-Requested-With": 'XMLHttpRequest'
                    },
                    data: {_f: 1, _c: city.id},
                    success: function (res) {
                        try {
                            if (res.statusCode !== 200)return;
                            if (+res.data.status === 1) {
                                wx.setStorageSync("_loginStatus_", 1);
                            } else if (+res.data.status === 202) {
                                wx.setStorageSync("_loginStatus_", 0);
                                wx.removeStorageSync('_userInfo_');
                                wx.removeStorageSync('sid');
                                wx.removeStorageSync('_login_time');
                                that.globalData.userInfo = {};
                            } else {
                                wx.setStorageSync("_loginStatus_", 0);
                            }
                            isLogin = false;
                        } catch (err) {
                            wx.setStorageSync("_loginStatus_", 0);
                        }
                        resolve({status: wx.getStorageSync('_loginStatus_')})
                    },
                    fail(){
                        resolve({status: isLoginStatus})
                    },
                    complete(res){
                        console.log('/wx2/checkSession', "请求后", res.data);
                        wx.hideNavigationBarLoading();
                    }
                })
            });
        }
        return JudgeLogin;
    },
    /**
     * 生命周期函数--监听小程序隐藏
     * @param options
     */
    onHide: function (options) {
        console.warn('App Hide', options, isUpdate, isLogin);
        isUpdate = true;
        isLogin = true;
        if ('userInfo' === wx.getStorageSync('authorizeUserInfo')) {
            wx.setStorageSync('authorizeUserInfo', '');
        }
    },
    /**
     * 错误监听函数
     * @param msg
     */
    onError: function (msg) {
        console.warn('错误监听函数', msg);
    },
    /**
     * 不存在页面监听
     * @param options
     */
    onPageNotFound (options) {
        console.warn('不存在页面监听', options);
    }
})