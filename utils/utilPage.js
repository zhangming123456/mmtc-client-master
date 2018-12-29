/**
 * Created by Aaronzm on 2018/5/10.
 */
"use strict";
const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ROUTER = app.util2.ROUTER,
    jude = app.util2.jude,
    onfire = require('./onfire.min'),
    config = require('./config');

const {$Toast, $Message} = require('../lib/iview/base/index');

// 公共方法
import Mixins from './common/mixins'
import Cycles from './common/cycles'

const events = {
    ...Mixins,
    ...Cycles,
    $route: new ROUTER(),
    $Toast,
    $Message,
    $Onfire: onfire
};

module.exports = class {
    constructor (appPage = {}, methods = {}) {
        /**
         * 页面的初始数据
         */
        let defaultData = {
            text: null,
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
        this.data = {...defaultData, ...appPage.data};
        this.__page = appPage;
        for (let k in events) {
            this[k] = events[k]
        }
        if (appPage.watch) {
            this.watch = jude.isFunction(appPage.watch) ? appPage.watch() : appPage.watch
        }
        for (let k in methods) {
            this[k] = methods[k]
        }
    }
}
