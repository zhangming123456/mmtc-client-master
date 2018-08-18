"use strict";
const dateFormate = require('./formateDate'),
    date_formate = require('../date/format'),
    date_range = require('../date/range'),
    config = require('../config');

import { queryString, regExpUtil, jude, router } from '../util'
import { Amap, Qmap } from '../map/index';

module.exports.date_formate = date_formate;
module.exports.date_range = date_range;
module.exports.dateFormate = dateFormate;
module.exports.regExpUtil = regExpUtil;
module.exports.queryString = queryString;
module.exports.common = jude;

function type (ob) {
    return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
}

module.exports.type = type;

function getDate (date) {
    let _date = new Date();
    if (regExpUtil.isDateTime(date)) {
        _date = new Date(date.replace(/-/g, '/'))
        if (isNaN(_date)) {
            date = trim(date).replace(/\s/g, 'T');
            _date = new Date(date);
        }
    } else if (jude.isNumberOfNaN(date)) {
        _date = new Date(+date)
    } else if (date instanceof Date) {
        _date = date
    }
    return _date
}

module.exports.getDate = getDate;

function next3Days (input) {
    var startDay = new Date();
    try {
        if (input) {
            if (regExpUtil.isDateTime(input)) {
                input = input.split(' ')[0]
            } else if (jude.isNumberOfNaN(input)) {
                input = date_formate(input, 'YYYY-MM-DD')
            } else {
                input = date_formate(getDate(input), 'YYYY-MM-DD')
            }
            startDay = getDate(input)
        }
    } catch (e) {

    }

    var startDay1 = getDate(formatTime(startDay, {D: 1, spacer: '-'})),
        startDay2 = getDate(formatTime(startDay, {D: 2, spacer: '-'})),
        arr = [
            {
                text: getWeeks(startDay),
                time: date_formate(startDay, 'MM-DD'),
                dateTime: date_formate(startDay, 'YYYY-MM-DD'),
            },
            {
                text: getWeeks(startDay1),
                time: date_formate(startDay1, 'MM-DD'),
                dateTime: date_formate(startDay1, 'YYYY-MM-DD'),
            },
            {
                text: getWeeks(startDay2),
                time: date_formate(startDay2, 'MM-DD'),
                dateTime: date_formate(startDay2, 'YYYY-MM-DD'),
            },
        ];
    return arr
}

var WEEKS = ['日', '一', '二', '三', '四', '五', '六'];

function getWeeks (date) {
    if (date instanceof Date) {
        var toDay = date_formate(new Date(), 'YYYY-MM-DD');
        var weeks = "周" + WEEKS[date.getDay()];
        // console.log(date_range(toDay, date).length);
        switch (date_range(getDate(toDay), date).length) {
            case 1:
                weeks = '今天';
                break;
            case 2:
                weeks = '明天';
                break;
            case 3:
                weeks = '后天';
                break;
        }
        return weeks
    }
}

module.exports.next3Days = next3Days;

function getToken () {
    const app = getApp();
    if (app && app.globalData && app.globalData.token) {
        return app.globalData.token;
    } else {
        return wx.getStorageSync('token');
    }
}

module.exports.getToken = getToken;

let one_year = 31536000000,
    one_month = 2678400000,
    one_day = 86400000,
    one_hour = 3600000,
    one_minute = 60000,
    one_second = 1000;
// dateTime = +new Date('2017-09-25 09:01:01'),
// one_year = dateTime - +new Date('2016-09-25 09:01:01'),
// one_month = dateTime - +new Date('2017-08-25 09:01:01'),
// one_day = dateTime - +new Date('2017-09-24 09:01:01'),
// one_hour = dateTime - +new Date('2017-09-25 08:01:01'),
// one_minute = dateTime - +new Date('2017-09-25 09:00:01'),
// one_second = dateTime - +new Date('2017-09-25 09:01:00');
// 31536000000 2678400000 86400000 90000000 86460000 1000
// console.log(one_year, one_month, one_day, one_hour, one_minute, one_second);

function formatTime (time, config, fmt) {
    var time = getDate(time),
        spacer = config && config.spacer,
        timer = 0;
    if (config && config.Y) {
        timer += Number(config.y) * one_year;
    }
    if (config && config.M) {
        timer += Number(config.M) * one_month;
    }
    if (config && config.D) {
        timer += Number(config.D) * one_day;
    }

    if (config && config.h) {
        timer += Number(config.h) * one_hour;
    }
    if (config && config.m) {
        timer += Number(config.m) * one_minute;
    }
    if (config && config.s) {
        timer += Number(config.s) * one_second;
    }
    var date = getDate(+time + timer);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (spacer) {
        return [year, month, day].map(formatNumber).join(spacer) + ' ' + [hour, minute, second].map(formatNumber).join(':')
    } else {
        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
}

module.exports.formatTime = formatTime;

function formatTimeEnd (time, config) {
    var timer = 0;
    if (config && config.Y) {
        timer += Number(config.y) * one_year;
    }
    if (config && config.M) {
        timer += Number(config.M) * one_month;
    }
    if (config && config.M) {
        timer += Number(config.D) * one_day;
    }

    if (config && config.h) {
        timer += Number(config.h) * one_hour;
    }
    if (config && config.m) {
        timer += Number(config.m) * one_minute;
    }
    if (config && config.s) {
        timer += Number(config.s) * one_second;
    }
    return timer;
}

function formateDate (strTime, format, needMap) {
    strTime = Number(strTime);
    format = format || 'Y-M-D H:I:S';
    var date = getDate(strTime);
    var dateMap = {
        y: (date.getFullYear() + '').slice(2), Y: date.getFullYear(), M: date.getMonth() + 1, D: date.getDate(),
        h: date.getHours() % 12,
        H: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        I: date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()),
        S: date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()),
        A: date.getHours() >= 12 ? 'pm' : 'am',
        w: date.getDay(),
        W: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    };
    for (var k in dateMap) {
        format = format.replace(new RegExp(k, 'g'), dateMap[k]);
    }
    return format;
}

function formatTimeDifference (start, end, config) {
    var defaultTime = new Date(), time;

    if (jude.isObject(start)) {
        start = start;
    } else {
        let _start = end.trim().replace(/-/g, '/');
        start = new Date(_start);
        if (isNaN(end)) {
            _start = _start.replace(/\s/g, 'T');
            start = new Date(_start);
        }
    }
    if (jude.isObject(end)) {
        end = end;
    } else {
        let _end = end.trim().replace(/-/g, '/');
        end = new Date(_end);
        if (isNaN(end)) {
            _end = _end.replace(/\s/g, 'T');
            end = new Date(_end);
        }
    }
    time = end.getTime() - start.getTime();
    // console.log(time);
    if (config) {
        var type = '';
        if (jude.isString(config)) {
            type = config;
        } else {
            type = config.type;
        }
        if (type === 'mm:ss') {
            // var curTime = dateFormate.format(new Date(), 'YYYY-MM-DD');
            // var curTimestr = new Date(curTime + ' 16:00:00');
            // var timer = new Date(+curTimestr + time);
            // console.log(timer);
            // return timer(time);
            return dateFormate.format(time, 'mmm:sss');
        } else if (type === 'YYYY-MM-DD') {
            return dateFormate.format(time, 'YYYY-MM-DD');
        } else {
            return dateFormate.format(time);
        }
    } else {
        return time;
    }
}

module.exports.formatTimeDifference = formatTimeDifference;

function timer (intDiff, bol) {
    var date = new Date();
    var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值
    if (intDiff instanceof Date) {
        if (intDiff > 0) {
            //计算相关的天，小时，还有分钟，以及秒
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
    } else {
        date = getDate(intDiff);
        var dateMap = {
            y: (date.getFullYear() + '').slice(2),
            Y: date.getFullYear(),
            M: date.getMonth() + 1,
            D: date.getDate(),
            h: date.getHours() % 12,
            H: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            I: date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()),
            S: date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()),
            A: date.getHours() >= 12 ? 'pm' : 'am',
            w: date.getDay(),
            W: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
        };
        day = dateMap.D;
        hour = dateMap.H;
        minute = dateMap.I;
        second = dateMap.S;

    }

    if (bol) {
        return day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
    } else {
        return hour + ':' + minute + ':' + second;
    }
}

module.exports.timer = timer;

function formatTime1 (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

module.exports.formatTime1 = formatTime1;

function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports.formatNumber = formatNumber;

var AND = "&";
var EQUAL = "=";
var QUESTION = "?";

function mergeKeyValue (sb, key, value, format) {
    //if (!key || !value) return "";
    sb += key;
    sb += EQUAL;
    if (format) {
        sb += encodeURI(value);
    } else {
        sb += value;
    }
    return sb;
}

module.exports.mergeKeyValue = mergeKeyValue;

function requestUrlMerge (url, params) {
    if (!params) return url;
    try {
        var sb = url;
        var position = 0;
        for (var key in params) {
            var value = params[key];
            if (value) {
                sb += position == 0 ? QUESTION : AND;
                sb = mergeKeyValue(sb, key, value);
                position++;
            }
        }
        return sb;
    } catch (e) {
    }
    return null;
}

module.exports.requestUrlMerge = requestUrlMerge;

function requestParametersMerge (params) {
    if (!params) return null;
    try {
        var sb = "";
        var position = 0;
        for (var key in params) {
            var value = params[key];
            var flag = true;
            if (!value && value !== 0) {
                value = '';
            }
            if (parseInt(value) == 0) {
                flag = true;
            }
            if (flag) {
                if (position > 0) {
                    sb += AND;
                }
                sb = mergeKeyValue(sb, key, value);
                position++;
            }
        }
        return sb;
    } catch (e) {
    }
    return null;
}

module.exports.requestParametersMerge = requestParametersMerge;

function money (num, len = 2) {
    num = parseFloat(num) || 0;
    return Number(num.toFixed(len));
}

module.exports.money = money;


function moneyToFloat (num) {
    num = money(num);
    return parseFloat(num);
}

module.exports.moneyToFloat = moneyToFloat;

function moneyFloor (num) {
    num = parseFloat(num) || 0;
    return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
}

module.exports.moneyFloor = moneyFloor;

let timer_toast = null;

/**
 * 提示框（微信内置）
 * @param text
 */
function showToast (option) {
    clearTimeout(timer_toast);
    let data = {
        title: option,
        icon: 'success',
        mask: true,
        duration: 2000
    };
    if (jude.isObject(option)) {
        data.title = option.title;
        data.icon = option.icon || 'success';
        data.image = option.image || data.image;
        data.mask = option.mask || true;
        data.duration = option.duration || 1500;
        data.success = option.success ? () => {
            timer_toast = setTimeout(() => {
                option.success();
            }, data.duration)
        } : null;
        data.fail = option.fail;
        data.complete = option.complete;
    } else {
        if (arguments[1] && jude.isFunction(arguments[1])) {
            data.complete = () => {
                timer_toast = setTimeout(() => {
                    arguments[1]();
                }, data.duration)
            };
        }
    }
    wx.showToast(data);
}

module.exports.showToast = showToast;


function failToast (option) {
    clearTimeout(timer_toast);
    let data = {
        title: option,
        icon: 'fail',
        image: '/imgs/icon/fail.png',
        mask: true,
        duration: 2000
    };
    if (jude.isObject(option)) {
        data.title = option.title;
        data.icon = option.icon || 'success';
        data.image = option.image || data.image;
        data.mask = option.mask || true;
        data.duration = option.duration || 1500;
        data.success = option.success ? () => {
            timer_toast = setTimeout(() => {
                option.success();
            }, data.duration)
        } : null;
        data.fail = option.fail;
        data.complete = option.complete;
    } else {
        if (arguments[1] && jude.isFunction(arguments[1])) {
            data.complete = () => {
                timer_toast = setTimeout(() => {
                    arguments[1]();
                }, data.duration)
            };
        }
    }
    wx.showToast(data);
}

module.exports.failToast = failToast;
module.exports.hideToast = wx.hideToast;

function hideLoading (bol) {
    clearTimeout(timer_toast);
    if (bol) {
        wx.hideLoading();
    } else {
        timer_toast = setTimeout(res => {
            wx.hideLoading()
        }, 200)
    }
};
module.exports.hideLoading = hideLoading;

/**
 * Loading
 * @param option
 */
function showLoading (option) {
    clearTimeout(timer_toast);
    let data = {
        title: option || '加载中...',
        mask: true,
        duration: 2000
    };
    if (jude.isObject(option)) {
        data.title = option.title;
        data.mask = option.mask || true;
        data.duration = option.duration || 1500;
        data.success = option.success ? () => {
            timer_toast = setTimeout(() => {
                option.success();
            }, data.duration)
        } : null;
        data.fail = option.fail;
        data.complete = option.complete;
    } else {
        if (arguments[1] && jude.isFunction(arguments[1])) {
            data.complete = () => {
                timer_toast = setTimeout(() => {
                    arguments[1]();
                }, data.duration)
            };
        }
    }
    wx.showLoading(data);
}

module.exports.showLoading = showLoading;

/**
 * 判断是否为非空对象
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject (obj) {
    try {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
        console.log('非对象');
    }
}

module.exports.isEmptyObject = isEmptyObject;

/**
 * 对象与数组的复制 第一个值为Boolean并为true时为深度复制
 * @returns {*|{}}
 */
function extend () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    //如果第一个值为bool值，那么就将第二个参数作为目标参数，同时目标参数从2开始计数
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }
    // 当目标参数不是object 或者不是函数的时候，设置成object类型的
    if (typeof target !== "object" && !jude.isFunction(target)) {
        target = {};
    }
    // //如果extend只有一个函数的时候，那么将跳出后面的操作
    // if (length === i) {
    //     target = this;
    //     --i;
    // }
    for (; i < length; i++) {
        // 仅处理不是 null/undefined values
        if ((options = arguments[i]) != null) {
            // 扩展options对象
            for (name in options) {
                src = target[name];
                copy = options[name];
                // 如果目标对象和要拷贝的对象是恒相等的话，那就执行下一个循环。
                if (target === copy) {
                    continue;
                }
                // 如果我们拷贝的对象是一个对象或者数组的话
                if (deep && copy && (jude.isPlainObject(copy) || (copyIsArray = jude.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jude.isArray(src) ? src : [];
                    } else {
                        clone = src && jude.isPlainObject(src) ? src : {};
                    }
                    //不删除目标对象，将目标对象和原对象重新拷贝一份出来。
                    target[name] = extend(deep, clone, copy);
                    // 如果options[name]的不为空，那么将拷贝到目标对象上去。
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // 返回修改的目标对象
    return target;
}

module.exports.extend = extend;

/**
 * 对象与数组的复制 第一个值为Boolean并为true时为深度复制
 * @returns {*|{}}
 */
function clone (arr, obj) {
    var target = {};
    if (jude.isString(arr)) {
        target[arr] = obj[arr]
    } else if (jude.isArray(arr)) {
        let length = arr.length;
        for (let i = 0; i < length; i++) {
            target[arr[i]] = obj[arr[i]]
        }
    }
    // 返回修改的目标对象
    return target;
}

module.exports.clone = clone;

/**
 * 当前页面路径
 * @returns {*}
 */
function CurrentPages () {
    let urlArr = getCurrentPages();
    return urlArr[urlArr.length - 1].route;
}

module.exports.CurrentPages = CurrentPages;

let isGoRouter = false;

/**
 * 跳转路径
 * @param a{String|Number} 页面路径地址
 * @param options{Object} type{String}:跳转类型 （blank：关闭当前页面跳转；tab:关闭其他tabBar页面，跳转到tabBar页面；blankAll：关闭所有页面跳转）；data{Object}：跳转携带参数对象
 */
function _go (a, options = {}) {
    debugger
    let stringify = '';
    if (isGoRouter) return;
    if (options.data) {
        stringify = queryString.stringify(options.data);
    }
    if (jude.isNumberOfNaN(a)) {
        let pageNum = getCurrentPages().length;
        if (a < 0 && pageNum > 1) {
            wx.navigateBack({
                delta: -a
            })
        } else {
            go('/pages/index/index', {type: 'tab'})
        }
    } else if (jude.isString(a) && regExpUtil.isPath(a)) {
        if (/\?/.test(a)) {
            a = a + '&';
        } else {
            a = a + '?';
        }
        let url = a + stringify;
        if (options.type === 'blank') {
            isGoRouter = true;
            wx.redirectTo({
                url: url,
                success () {
                    options.success && options.success()
                },
                fail (res) {
                    options.fail && options.fail()
                },
                complete () {
                    isGoRouter = false;
                    options.complete && options.complete()
                }
            })
        } else if (options.type === 'tab') {
            isGoRouter = true;
            wx.switchTab({
                url: url,
                success () {
                    options.success && options.success()
                },
                fail (res) {
                    options.fail && options.fail()
                },
                complete () {
                    isGoRouter = false;
                    options.complete && options.complete()
                }
            })
        } else if (options.type === 'goInit') {
            isGoRouter = false;
            go('/pages/init/init',
                {
                    type: 'tab',
                    success () {
                        setTimeout(() => {
                            go(a, {
                                data: options.data
                            });
                        }, 200)
                    }
                }
            )
        } else if (options.type === 'goOrder') {
            isGoRouter = false;
            go('/pages/order/index/index',
                {
                    type: 'tab',
                    success () {
                        setTimeout(() => {
                            go(a, {
                                data: options.data
                            });
                        }, 200)
                    }
                }
            )
        } else if (options.type === 'blankAll') {
            isGoRouter = true;
            wx.reLaunch({
                url: url,
                success () {
                    options.success && options.success()
                },
                fail (res) {
                    options.fail && options.fail()
                },
                complete () {
                    isGoRouter = false;
                    options.complete && options.complete()
                }
            })
        } else {
            isGoRouter = true;
            if (getCurrentPages().length === 10) {
                wx.redirectTo({
                    url: url,
                    success () {
                        options.success && options.success()
                    },
                    fail (res) {
                        options.fail && options.fail()
                    },
                    complete () {
                        isGoRouter = false;
                        options.complete && options.complete()
                    }
                })
            } else
                wx.navigateTo({
                    url: url,
                    success () {
                        options.success && options.success()
                    },
                    fail (res) {
                        options.fail && options.fail()
                    },
                    complete () {
                        isGoRouter = false;
                        options.complete && options.complete()
                    }
                })
        }
    }
}

module.exports.go = function (...arg) {
    return router.go(...arg)
};

function chooseLocation () {
    return new Promise(function (resolve, reject) {
        wx.chooseLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                resolve(res);
            },
            cancel (res) {
                reject(res);
            }
        })
    })
}

module.exports.chooseLocation = chooseLocation;

// 时间格式化输出，如3:25:19 86。每10ms都会调用一次
function dateformat (micro_second, type) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60);
    // 秒位
    var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = Math.floor((micro_second % 1000) / 10);
    // return hr + ":" + min + ":" + sec + " " + micro_sec;

    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    if (type === 'ss') {
        return sec;
    } else if (type === 'mm:ss') {
        return min + ":" + sec;
    } else {
        return hr + ":" + min + ":" + sec + " " + micro_sec;
    }
}


class Countdown {
    constructor (that, options) {
        let time;
        if (options.time && options.time > 0) {
            time = options.time;
        } else {
            time = 0;
        }
        switch (options.timeType) {
            case 6:
                options.timeType = 1000 / 100;
                break;
            case 5:
                options.timeType = 1000 / 20;
                break;
            case 4:
                options.timeType = 1000 / 10;
                break;
            case 3:
                options.timeType = 1000 / 5;
                break;
            case 2:
                options.timeType = 1000 / 4;
                break;
            case 1:
                options.timeType = 1000 / 2;
                break;
            default:
                options.timeType = 1000 / 4;
        }
        this.module = options.module;
        this.timeType = options.timeType;
        this.type = options.type;
        this.clearTimeout = null;
        this.onEnd = options.onEnd || null;
        if (options) {
            if (options.createTime) {
                let endTime,
                    _time = options.minTime || 15,
                    spacer = options.spacer || '-',
                    startTime = options.startTime || new Date();
                endTime = formatTime(options.createTime, {m: _time, spacer: spacer});
                time = formatTimeDifference(startTime, endTime);
            }
        }
        this.time = time > 0 ? time : 0;
        this.text = options.text || 'countdown';
        this.startUp(that);
        if (this.module) {
            that.setData({
                [`${this.module}Data.azm_${this.text}`]: this
            })
        } else {
            that.setData({
                [`azm_${this.text}`]: this
            })
        }
    }

    clear () {
        this.clearTimeout && clearTimeout(this.clearTimeout);
    }

    /* 毫秒级倒计时 */
    startUp (that) {
        // 渲染倒计时时钟
        var _this = this,
            countdownTime = dateformat(_this.time, _this.type);
        _this.clear();
        if (this.module) {
            that.setData({
                [`${this.module}Data.azm_${this.text}`]: this,
                [`${this.module}Data.azm_${this.text}.countdownTime`]: countdownTime,
                [`${this.module}Data.azm_${this.text}.time`]: _this.time,
            })
        } else {
            that.setData({
                [`azm_${_this.text}.countdownTime`]: countdownTime,
                [`azm_${_this.text}.time`]: _this.time,
            });
        }
        if (_this.time <= 0) {
            _this.onEnd && _this.onEnd();
            // timeout则跳出递归
            return;
        }
        _this.clearTimeout = setTimeout(function () {
            // 放在最后--
            _this.time -= _this.timeType;
            _this.startUp(that, _this.text);
        }, _this.timeType)
    }
}

module.exports.Countdown = Countdown;

function trim (x) {
    try {
        return x.replace(/^\s+|\s+$/gm, '');
    } catch (e) {
        return x
    }
}

module.exports.trim = trim;

function getSessionId () {
    try {
        return wx.getStorageSync('sid');
    } catch (e) {
        return null;
    }
}

module.exports.getSessionId = getSessionId;

module.exports.getCurrentPages = getCurrentPages;

module.exports.getCurrentPage = function (num = 1) {
    let pages = getCurrentPages();
    return pages[pages.length - num];
};

function goToTop () {
    try {
        return wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
    } catch (e) {
        return null;
    }
}

module.exports.goToTop = goToTop;

function getMap (location, resolve, reject) {
    let location2 = `${location.lon},${location.lat}`;
    try {
        if (config.isMap === 1) {
            Amap.getRegeo({
                location: location2,
                success: function (data) {
                    //成功回调
                    console.log(data, '高德地图');
                    let res = data[0];
                    console.log(res, '高德地图');
                    let location = {
                        address: res.desc,
                        lat: res.latitude,
                        lon: res.longitude,
                        name: res.name,
                        city: res.regeocodeData.addressComponent.city
                    };
                    console.log(location, '高德地图');
                    resolve && resolve(location);
                },
                fail: function (info) {
                    //失败回调
                    reject && reject()
                }
            });
        } else {
            Qmap.reverseGeocoder({
                location: {
                    latitude: location.lat,
                    longitude: location.lon
                },
                get_poi: 1,
                poi_options: 'address_format=short',
                success: function (res) {
                    console.log(res, '腾讯地图');
                    let result = res.result,
                        location = {
                            address: result.formatted_addresses.recommend,
                            lat: result.location.lat,
                            lon: result.location.lng,
                            name: result.address,
                            city: result.address_component.city
                        };
                    resolve && resolve(location);
                },
                fail: function (info) {
                    //失败回调
                    reject && reject();
                }
            });
        }
    } catch (err) {

    }
}

module.exports.getMap = getMap;


function getCity ({title = '深圳', id = 1} = {}) {
    let cities = wx.getStorageSync('cities');
    for (let v of cities) {
        if (v.title === title || v.id === id) {
            return v
        }
    }
    return {title: '深圳', id: 1};
}

module.exports.getCity = getCity;

function getLatAndLon () {
    let app = getApp();
    return extend(true, {}, app.globalData.lat_and_lon);
}

module.exports.getLatAndLon = getLatAndLon;

function getUserInfo () {
    let app = getApp();
    if (jude.isEmptyObject(app.globalData.userInfo)) {
        return app.globalData.userInfo;
    } else {
        return wx.getStorageSync('_userInfo_') || null;
    }
}

module.exports.getUserInfo = getUserInfo;

class LogManager {
    constructor () {
        this.console = wx.getLogManager ? wx.getLogManager() : {};
    }

    log (...arg) {
        this.console.log && this.console.log(...arg);
    }

    info (...arg) {
        this.console.info && this.console.info(...arg);
    }

    debug (...arg) {
        this.console.debug && this.console.debug(...arg);
    }

    warn (...arg) {
        this.console.warn && this.console.warn(...arg);
    }
}

module.exports.LogManager = new LogManager();

function filterNullData (data = {}) {
    try {
        for (let k in data) {
            data[k] = jude.isFalse(data[k]);
            if (trim(data[k]) === '' || !data[k] && !jude.isNumberOfNaN(data[k])) {
                delete data[k]
            }
        }
        return data;
    } catch (err) {
        return {};
    }
}
module.exports.filterNullData = filterNullData;
