"use strict";

const app = getApp(),
    util2 = app.util2,
    {router, ROUTER, regeneratorRuntime, jude} = app.util2,
    onfire = require('../onfire.min'),
    config = require('../config'),
    ApiService = require('../ApiService/index'),
    {$Toast, $Message} = require('../../lib/iview/base/index');

// 公共方法
import Mixins from './mixins'
import Cycles from './cycles'


/**
 * 获取初始化Data
 * @returns {{text: null, isShow: boolean, isOpenSetting: boolean, systemInfo: {}, SDKVersion: number[], isPullDownRefresh: boolean, options: {}, canIUse: *, canFeedback: *, canOpenSetting: *, canOnTabItemTap: boolean, imageUrl: string, $azmToast: {show: boolean, text: string, icon: string, src: string, icon_color: string, duration: number, success: string}}}
 */
function getDefaultData () {
    let text = ''
    try {
        let path = router.getCurrentPage();
        text = path.route.replace(/\//ig, '')
    } catch (err) {

    }
    return {
        text: text,
        isShow: false,
        isOpenSetting: false,
        systemInfo: {},
        SDKVersion: [1, 6, 6],
        isPullDownRefresh: false,
        options: {},
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canFeedback: wx.canIUse('button.open-type.feedback'),
        canOpenSetting: wx.canIUse('button.open-type.openSetting'),
        canOnTabItemTap: false,
        imageUrl: config.imageUrl,
        $azmToast: {
            show: false,
            text: '',
            icon: '',
            src: '',//
            icon_color: '#fff',
            duration: 2000,
            success: 'bindAzmToastSuccess'
        }
    };
}

/**
 *
 * @param source //资源
 * @param target //目标
 * @param map
 */
function mapKeys (source, target, map) {
    Object.keys(map).forEach(function (key) {
        if (source[key]) {
            target[jude.isString(map[key]) ? map[key] : key] = source[key];
            delete source[key];
        }
    });
}

function AzmPage (azmOptions) {
    if (azmOptions === void 0) {
        azmOptions = {};
    }
    let __page = {};
    mapKeys(azmOptions, __page, {
        onLoad: 'onLoad',//生命周期函数--监听页面加载
        onShow: 'onShow',//生命周期函数--监听页面显示
        onHide: 'onHide',//生命周期函数--监听页面隐藏
        onUnload: 'onUnload',//生命周期函数--监听页面卸载
        onReady: 'onReady',//生命周期函数--页面渲染完成
        onPullDownRefresh: 'onPullDownRefresh',//监听下拉刷新事件
        onReachBottom: 'onReachBottom',//监听上拉触底事件
        onPageScroll: 'onPageScroll',//屏幕滚动事件
        onShareAppMessage: 'onShareAppMessage',//点击右上角分享事件
        onTabItemTap: 'onTabItemTap',//点击 tab 时触发
    });
    let ops = {};
    mapKeys(azmOptions, ops, {
        data: 'data',
        methods: 'methods',
        watch: 'watch',
        mixins: 'mixins',
    });
    let _azmOptions = azmOptions;
    let mixins = {...ops.mixins, ...Mixins, ...ops.methods};
    let options = {...mixins, ...Cycles, __page};
    const DefaultData = getDefaultData();
    if (jude.isEmptyObject(ops.data)) {
        options.data = {...DefaultData, ...ops.data}
    } else if (jude.isFunction(ops.data)) {
        let data = ops.data();
        options.data = jude.isEmptyObject(data) ? {...DefaultData, ...data} : DefaultData;
    } else {
        options.data = DefaultData
    }
    if (ops.watch) {
        const watch = jude.isFunction(ops.watch) ? ops.watch() : ops.watch;
        if (jude.isEmptyObject(watch)) {
            options.watch = watch
        }
    }
    return Page({
        ...options,
        $route: new ROUTER(),
        $Toast: $Toast,
        $Message: $Message,
        $Onfire: onfire,
        $ajax: ApiService
    });
}

export { AzmPage }
