//app.js
const c = require("./utils/common.js"),
    config = require('./utils/config'),
    util = require('./utils/azm/util');

const util2 = require('./utils/util');
let isUpdate = true;
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
        console.log('App Show', options);
        if (isUpdate) {
            new util2.updateManager().onALL();
            isUpdate = false;
        }
    },
    /**
     * 生命周期函数--监听小程序隐藏
     * @param options
     */
    onHide: function (options) {
        isUpdate = true;
        console.log('App Hide', options);
        if ('userInfo' === wx.getStorageSync('authorizeUserInfo')) {
            wx.setStorageSync('authorizeUserInfo', '');
        }
    },
    /**
     * 错误监听函数
     * @param msg
     */
    onError: function (msg) {
        // console.warn('错误监听函数', msg);
    },
    /**
     * 不存在页面监听
     * @param options
     */
    onPageNotFound (options) {
        console.warn('不存在页面监听', options);
    }
})