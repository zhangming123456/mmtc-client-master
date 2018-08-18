"use strict";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/******************************************************旧的***************************************************************/

/**
 * 设置 Promise.finally  方法
 * @param callback
 * @return {*}
 */
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)).then(() => value),
        reason => P.resolve(callback(reason)).then(() => {
            throw reason
        })
    );
};

import dateCalendar from './date/calendar'
import regeneratorRuntime from './runtime';//使用async，await
import config from './config'
import { Amap, Qmap } from './map/index'

class RegExpUtil {
    constructor () {
        this.pathReg = /^\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/;
        this.PhoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        this.dateReg = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]/;
        this.telephone = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        //强：字母+数字+特殊字符
        this.highPwd = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
        //中：字母+数字，字母+特殊字符，数字+特殊字符
        this.inPwd = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
        //弱：纯数字，纯字母，纯特殊字符
        this.lowPwd = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
        //验证身份证
        this.IDcard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        this.code = /(^\d{4}$|^\d{6}$)/
    }

    isPath (text) {
        return this.pathReg.test(text);
    }

    isTelephone (text) {
        return text.length > 4 && this.telephone.test(text);
    }

    isPhone (text) {
        return text.length === 11 && this.PhoneReg.test(text);
    }

    isCode (text) {
        return this.code.test(text);
    }

    isDate (str) {
        return typeof str === 'string' && this.dateReg.test(str);
    }

    isDateTime (str) {
        if (typeof str === 'string') {
            str = str.split(' ')[0]
        }
        return this.isDate(str)
    }

    /**
     * 验证密码 {含强度验证} 0：不符合 1：低 2：中 3：高
     * @param str
     * @return {*}
     */
    isPwd (str) {
        try {
            if (str.length === 0) {
                return false;
            }
            if (this.highPwd.test(str)) {
                return 3
            } else if (this.inPwd.test(str)) {
                return 2
            } else if (this.lowPwd.test(str)) {
                return 1
            } else {
                return 0;
            }
        } catch (e) {
            return 0;
        }
    }

    isIDcard (text) {
        return this.IDcard.test(text);
    }
}

const regExpUtil = new RegExpUtil();

/*********************判断Type类***************************/
/**
 * 判断Type类
 */
class JUDE {
    constructor () {
        this.arr = [];
        this.isArray = Array.isArray;
        this.getProto = Object.getPrototypeOf;
        this.getProto = Object.getPrototypeOf;
        this.slice = this.arr.slice;
        this.concat = this.arr.concat;
        this.push = this.arr.push;
        this.indexOf = this.arr.indexOf;
        this.class2type = {};
        this.toString = this.class2type.toString;
        this.hasOwn = this.class2type.hasOwnProperty;
        this.fnToString = this.hasOwn.toString;
        this.ObjectFunctionString = this.fnToString.call(Object);
        this.support = {};
    }

    type (ob) {
        let type = Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
        if (["number"].indexOf(type) !== -1 && isNaN(ob)) {
            return 'NaN';
        } else {
            return type;
        }
    }


    isBoolean (arg) {
        return this.type(arg) === 'boolean';
    }

    isNumber (arg) {
        return this.type(arg) === 'number';
    }

    isNull (arg) {
        return this.type(arg) === 'null';
    }

    isString (arg) {
        return this.type(arg) === 'string';
    }

    isNullOrUndefined (arg) {
        return arg === null || arg === undefined;
    }

    isDate (obj) {
        return obj instanceof Date
    }

    isObject (arg) {
        return arg !== null && typeof arg === 'object';
    }

    isSymbol (arg) {
        return typeof arg === 'symbol';
    }

    isUndefined (arg) {
        return arg === undefined;
    }

    isRegExp (re) {
        return binding.isRegExp(re);
    }

    isFunction (arg) {
        return typeof arg === 'function';
    }

    /**
     * 判断数字（含字符串数字）
     * @param arg
     * @return {boolean}
     */
    isNumberOfNaN (arg) {
        if (this.type(arg) === 'string') {
            arg = +arg
        }
        return this.type(arg) === 'number'
    }

    /**
     * 判断是否为非空对象
     * @param obj
     * @returns {boolean} true：是非空对象
     */
    isEmptyObject (obj) {
        try {
            var name;
            for (name in obj) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
            console.log('非对象');
        }
    }

    /**
     * 判断是否为非空值
     * @param value
     * @returns {boolean}
     */
    isEmptyValue (value) {
        try {
            if (!value) {
                return false;
            } else if (this.isString(value)) {
                return !!value;
            } else if (this.isArray(value)) {
                return value && value.length > 0;
            } else if (this.type(value) === 'object') {
                return this.isEmptyObject(value);
            }
        } catch (e) {
            return false;
            console.log('判断是否为非空值出差', value);
        }
    }


    /**
     * 判断是否为JSON对象字符串
     * @param arg
     * @return {boolean}
     */
    isJsonObject (arg) {
        try {
            let json = trim(arg);
            if (!this.isString(json) && !json.length) {
                return false
            } else if (!!json && this.isString(json)) {
                let data = JSON.parse(json);
                if (this.isEmptyObject(data) || this.isArray(data)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    isFalse (arg) {
        if (this.isString(arg) && arg.trim() === '') {
            return arg.trim();
        }
        if (arg === 'false' || arg === false || arg === null) {
            return false;
        } else if (arg === 'undefined') {
            return undefined;
        } else if (arg === 'true') {
            return true;
        } else if (arg === 'null') {
            return null;
        } else if (arg === 'NaN') {
            return NaN;
        } else {
            return arg
        }
    }

    isPlainObject (obj) {
        var proto, Ctor;

        // Detect obvious negatives
        // Use toString instead of jQuery.type to catch host objects
        if (!obj || this.toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = this.getProto(obj);

        // Objects with no prototype (e.g., `Object.create( null )`) are plain
        if (!proto) {
            return true;
        }

        // Objects with prototype are plain iff they were constructed by a global Object function
        Ctor = this.hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && this.fnToString.call(Ctor) === this.ObjectFunctionString;
    }
}

const jude = new JUDE();
/*********************判断Type类***************************/

/*********************路由router类***************************/
/**
 * 路由router类
 * @type {boolean}
 */
let isGoRouter = false;

class ROUTER {
    constructor (...arg) {
        this.tabbar = [
            "page/tabBar/home/index",
            "page/tabBar/me/index",
        ];
        this.isGoRouter = false
    }

    getCurrentPages () {
        return getCurrentPages()
    }


    getCurrentPage (num = 0) {
        if (!jude.isNumberOfNaN(num)) {
            num = 0;
        }
        num = Math.abs(num);
        num += 1;
        let pages = this.getCurrentPages();
        return pages[pages.length - num];
    }


    back () {
        this.go(1)
    }

    go (num) {
        let that = this;
        if (that.isGoRouter) return;
        console.log(jude.isString(num));
        if (jude.isNumberOfNaN(num)) {
            num = Math.abs(+num);
            let len = getCurrentPages().length;
            if (len > 0) {
                console.log(-num);
                wx.navigateBack({delta: num})
            } else {
                that.push('/page/tabBar/me/index')
            }
        } else if (jude.isString(num)) {
            let arg2 = arguments[1], query = {}, type;
            if (jude.isObject(arg2)) {
                query = arg2.query;
                type = arg2.type;
            }
            if (type === 'blank') {
                that.replace({path: num, query})
            } else if (type === 'tab') {
                that.tab({path: num, query})
            } else if (type === 'blankAll') {
                that.reLaunch({path: num, query})
            } else {
                that.push({path: num, query})
            }
        }
    }

    /**
     *
     * @param path
     * @param query
     * @return {Promise}
     */
    push ({path = '', query = {}}) {
        let _arg = arguments[0];
        let that = this, stringify = '';
        if (typeof _arg !== 'string') {
            stringify = queryString.stringify(query)
        } else {
            path = _arg
        }
        if (!path) return;
        const P = new Promise((resolve, reject) => {
            if (that.isGoRouter) {
                reject({msg: `不可重复跳转`, status: 0});
                return;
            }
            // let flagIndex = that.tabbar.findIndex((value, index, arr) => {
            //     if (path === value) {
            //         return true
            //     }
            // });
            that.isGoRouter = true;
            wx.navigateTo({
                url: `${path}?${stringify}`,
                success () {
                    resolve({msg: `跳转成功`, status: 1})
                },
                fail (err) {
                    reject({msg: `失败${err.errMsg}`, status: 0})
                    if (err.errMsg === 'navigateTo:fail can not navigateTo a tabbar page') {
                        that.isGoRouter = false;
                        that.tab({path, query})
                    }
                },
                complete () {
                    that.isGoRouter = false;
                }
            })
            // if (flagIndex === -1) {
            //
            // } else {
            //     reject({msg: '路径不匹配', status: 0})
            // }
        });
        return P;
    }

    replace ({path = '', query = {}}) {
        let _arg = arguments[0];
        let that = this, stringify = '';
        if (typeof _arg !== 'string') {
            stringify = queryString.stringify(query)
        } else {
            path = _arg
        }
        if (!path) return;
        const P = new Promise((resolve, reject) => {
            if (that.isGoRouter) {
                reject({msg: `不可重复跳转`, status: 0});
                return;
            }
            // let flagIndex = that.tabbar.findIndex((value, index, arr) => {
            //     if (path === value) {
            //         return true
            //     }
            // });
            // if (flagIndex === -1) {
            //
            // } else {
            //     reject({msg: '路径不匹配', status: 0})
            // }
            that.isGoRouter = true;
            wx.redirectTo({
                url: `${path}?${stringify}`,
                success () {
                    resolve({msg: `跳转成功`, status: 1})
                },
                fail (err) {
                    reject({msg: `失败${err.errMsg}`, status: 0})
                },
                complete () {
                    that.isGoRouter = false;
                }
            })
        });
        return P;
    }

    /**
     * 关闭所有页面，打开到应用内的某个页面
     * @param {*} path
     * @param {*} query
     */
    reLaunch ({path = '', query = {}}) {
        let _arg = arguments[0];
        let that = this, stringify = '';
        if (typeof _arg !== 'string') {
            stringify = queryString.stringify(query)
        } else {
            path = _arg
        }
        if (!path) return;
        const P = new Promise((resolve, reject) => {
            if (that.isGoRouter) {
                reject({msg: `不可重复跳转`, status: 0});
                return;
            }
            // let flagIndex = that.tabbar.findIndex((value, index, arr) => {
            //     if (path === value) {
            //         return true
            //     }
            // });
            // if (flagIndex === -1) {
            //
            // } else {
            //     reject({msg: '路径不匹配', status: 0})
            // }
            that.isGoRouter = true;
            wx.reLaunch({
                url: `${path}`,
                success () {
                    resolve({msg: `跳转成功`, status: 1})
                },
                fail (err) {
                    reject({msg: `失败${err.errMsg}`, status: 0})
                },
                complete () {
                    that.isGoRouter = false;
                }
            })
        });
        return P;
    }

    tab ({path = '', query = {}, redirectedFrom = undefined}) {
        let _arg = arguments[0];
        let that = this, stringify = '';
        if (typeof _arg !== 'string') {
            stringify = queryString.stringify(query)
        } else {
            path = _arg
        }
        if (!path) return;
        const P = new Promise((resolve, reject) => {
            if (that.isGoRouter) {
                reject({msg: `不可重复跳转`, status: 0});
                return;
            }
            // let flagIndex = that.tabbar.findIndex((value, index, arr) => {
            //     let reg = new RegExp(path);
            //     if (reg.test(value) && /tabBar/.test(value)) {
            //         return true
            //     }
            // });
            // if (flagIndex >= 0) {
            //
            // } else {
            //     reject({msg: '路径不匹配', status: 0})
            // }
            that.isGoRouter = true;
            wx.switchTab({
                url: path,
                success () {
                    resolve({msg: `跳转成功`, status: 1, redirectedFrom});
                    if (redirectedFrom && trim(redirectedFrom)) {
                        setTimeout(function () {
                            that.push({path: redirectedFrom, query})
                        }, 300)
                    }
                },
                fail (err) {
                    reject({msg: `失败${err.errMsg}`, status: 0})
                },
                complete () {
                    that.isGoRouter = false;
                }
            })
        });
        return P;
    }
}

const router = new ROUTER();
/*********************路由router类***************************/

/*********************url参数解析与反解析***************************/
const noEscape = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
    0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, // 32 - 47
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0  // 112 - 127
];

class QueryString {
    constructor () {
        this.location = {};
    }

    stringify (obj, sep, eq, options) {
        sep = sep || '&';
        eq = eq || '=';

        var that = this
        var encode = encodeURIComponent;
        if (options && typeof options.encodeURIComponent === 'function') {
            encode = options.encodeURIComponent;
        }

        if (obj !== null && typeof obj === 'object') {
            var keys = Object.keys(obj);
            var len = keys.length;
            var flast = len - 1;
            var fields = '';
            for (var i = 0; i < len; ++i) {
                var k = keys[i];
                var v = obj[k];
                var ks = encode(that.stringifyPrimitive(k)) + eq;

                if (Array.isArray(v)) {
                    var vlen = v.length;
                    var vlast = vlen - 1;
                    for (var j = 0; j < vlen; ++j) {
                        fields += ks + encode(that.stringifyPrimitive(v[j]));
                        if (j < vlast)
                            fields += sep;
                    }
                    if (vlen && i < flast)
                        fields += sep;
                } else {
                    fields += ks + encode(that.stringifyPrimitive(v));
                    if (i < flast)
                        fields += sep;
                }
            }
            return fields;
        }
        return '';
    }

    parse (url) {
        if (!this.queryString(url))
            return;
        const reg = /([^\?\=\&]+)\=([^\?\=\&]*)/g;
        let obj = {};
        while (reg.exec(this.location.search)) {
            obj[RegExp.$1] = RegExp.$2;
        }
        this.location.query = obj;
        return obj;
    }

    stringifyPrimitive (v) {
        if (typeof v === 'string')
            return v;
        if (typeof v === 'number' && isFinite(v))
            return '' + v;
        if (typeof v === 'boolean')
            return v ? 'true' : 'false';
        return '';
    }

    escape (str) {
        if (typeof str !== 'string') {
            if (typeof str === 'object')
                str = String(str);
            else
                str += '';
        }
        var out = '';
        var lastPos = 0;

        for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);

            // ASCII
            if (c < 0x80) {
                if (noEscape[c] === 1)
                    continue;
                if (lastPos < i)
                    out += str.slice(lastPos, i);
                lastPos = i + 1;
                out += hexTable[c];
                continue;
            }

            if (lastPos < i)
                out += str.slice(lastPos, i);

            // Multi-byte characters ...
            if (c < 0x800) {
                lastPos = i + 1;
                out += hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)];
                continue;
            }
            if (c < 0xD800 || c >= 0xE000) {
                lastPos = i + 1;
                out += hexTable[0xE0 | (c >> 12)] +
                    hexTable[0x80 | ((c >> 6) & 0x3F)] +
                    hexTable[0x80 | (c & 0x3F)];
                continue;
            }
            // Surrogate pair
            ++i;
            var c2;
            if (i < str.length)
                c2 = str.charCodeAt(i) & 0x3FF;
            else
                throw new URIError('URI malformed');
            lastPos = i + 1;
            c = 0x10000 + (((c & 0x3FF) << 10) | c2);
            out += hexTable[0xF0 | (c >> 18)] +
                hexTable[0x80 | ((c >> 12) & 0x3F)] +
                hexTable[0x80 | ((c >> 6) & 0x3F)] +
                hexTable[0x80 | (c & 0x3F)];
        }
        if (lastPos === 0)
            return str;
        if (lastPos < str.length)
            return out + str.slice(lastPos);
        return out;
    }

    queryString (href) {
        href = decodeURIComponent(href);
        if (!href || href.length === 0) {
            if (!location)
                return;
            href = location.href;
        }
        const url = href.split('#'),
            href_search = url[0].split('?'),
            protocol_host_pathname = href_search[0].split('://'),
            host_pathname = protocol_host_pathname[1].split('/'),
            hostname_post = host_pathname[0].split(':');
        this.location = {
            href: href,
            hash: url[1] ? '#' + url[1] : '',
            host: host_pathname[0] || '',
            hostname: hostname_post[0] || '',
            origin: host_pathname[0] ? (protocol_host_pathname[0] + '://' + host_pathname[0]) : '',
            pathname: host_pathname[1] ? ('/' + host_pathname.slice(1).join('/')) : '',
            port: hostname_post[1] || '',
            protocol: protocol_host_pathname[0] || '',
            search: href_search[1] ? ('?' + href_search[1]) : ''
        };
        return this.location;
    }
}

const queryString = new QueryString();
/*********************url参数解析与反解析***************************/

/*********************utils ***************************/
var AND = "&";
var EQUAL = "=";
var QUESTION = "?";

/**
 * 获取本地保存的SessionId
 * @return {*}
 */
function getSessionId () {
    try {
        return wx.getStorageSync('sid');
    } catch (e) {
        return null;
    }
}

function removeSessionId () {
    try {
        return wx.removeStorageSync('sid');
    } catch (e) {
        return null;
    }
}

function trim (x) {
    try {
        return x.replace(/^\s+|\s+$/gm, '');
    } catch (e) {
        return x
    }
}

/**
 * ES6数组去重
 * @param array
 * @return {Array}
 */
function unique (array) {
    return Array.from(new Set(array));
}


/**
 * 提示框（微信内置）
 * @param text
 */
let timer_toast = null;

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

/**
 * 错误提示框（微信内置）
 * @param text
 */
function failToast (option) {
    clearTimeout(timer_toast);
    let data = {
        title: option,
        icon: 'fail',
        image: '/image/icon/fail.png',
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

/**
 * Loading提示框
 * @param option
 */
let timer_loading = null;
function showLoading (option) {
    clearTimeout(timer_loading);
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
            timer_loading = setTimeout(() => {
                option.success();
            }, data.duration)
        } : null;
        data.fail = option.fail;
        data.complete = option.complete;
    } else {
        if (arguments[1] && jude.isFunction(arguments[1])) {
            data.complete = () => {
                timer_loading = setTimeout(() => {
                    arguments[1]();
                }, data.duration)
            };
        }
    }
    wx.showLoading(data);
}

/**
 * 隐藏loading
 * @param bol
 */
function hideLoading (bol) {
    clearTimeout(timer_loading);
    if (bol) {
        wx.hideLoading();
    } else {
        timer_loading = setTimeout(res => {
            wx.hideLoading()
        }, 200)
    }
};

const hideToast = wx.hideToast;

/**
 * 获取经纬度 （微信再封装）
 * @param type
 * @param success
 * @param fail
 * @param complete
 * @return {Promise}
 */
function chooseLocation ({type = 'gcj02', success, fail, complete}) {
    let that = router.getCurrentPage();
    return new Promise(function (resolve, reject) {
        wx.chooseLocation({
            type, //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                resolve({info: res, status: 1, message: '成功'});
                success && success(res)
            },
            fail(res){
                console.log(res);
                if (res.errMsg === 'chooseLocation:fail cancel') {
                    resolve({info: res, status: 0, message: '取消'});
                } else {
                    reject({info: res, status: 0, message: '未获取权限'});
                    wx.showModal({
                        title: '',
                        content: `"美美天成商家端"要获取你的地理位置，请前往我的 》设置 》权限 》使用我的地理位置开启权限`,
                        cancelText: '取消',
                        cancelColor: '#000000',
                        confirmText: '去开启',
                        confirmColor: '#3CC51F',
                        success: function (res) {
                            if (res.confirm) {
                                that.$route.push('/page/me/pages/setting/index')
                            }
                        }
                    })
                }
                fail && fail(res);
            },
            complete: res => {
                complete && complete(res);
            }
        })
    }).catch(res => {
    })
}

/**
 * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum(二次封装)
 * @param filePath
 * @param success
 * @param fail
 * @param complete
 */
function saveImageToPhotosAlbum ({filePath, success, fail, complete}) {
    let that = router.getCurrentPage();
    return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
            filePath,
            success: res => {
                resolve({info: res, status: 1, message: '保存成功'});
                success && success(res);
            },
            fail: res => {
                console.log(res);
                if (res.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
                    resolve({info: res, status: 0, message: '取消保存'});
                } else {
                    reject({info: res, status: 0, message: '未获取权限'});
                    wx.showModal({
                        title: '',
                        content: `"美美天成商家端"要保存图片或视频到你的相册，请前往我的 》设置 》权限 》保存到相册开启权限`,
                        cancelText: '取消',
                        cancelColor: '#000000',
                        confirmText: '去开启',
                        confirmColor: '#3CC51F',
                        success: function (res) {
                            if (res.confirm) {
                                that.$route.push('/page/me/pages/setting/index')
                            }
                        }
                    })
                }
                fail && fail(res);
            },
            complete: res => {
                complete && complete(res);
            }
        });
    }).catch(res => {

    })
}

/**
 * 跳转路径
 * @param a{String|Number} 页面路径地址
 * @param options{Object} type{String}:跳转类型 （blank：关闭当前页面跳转；tab:关闭其他tabBar页面，跳转到tabBar页面；blankAll：关闭所有页面跳转）；data{Object}：跳转携带参数对象
 */
function go (a, options = {}) {
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

function money (num, len = 2) {
    num = parseFloat(num) || 0;
    return Number(num.toFixed(len));
}

function moneyToFloat (num) {
    num = money(num);
    return parseFloat(num);
}

function moneyFloor (num) {
    num = parseFloat(num) || 0;
    return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
}

/**
 * 滚动页面制定位置（微信在封装）
 * @return {*}
 */
function pageScrollTo (num = 0) {
    try {
        return wx.pageScrollTo({
            scrollTop: num,
            duration: 300
        });
    } catch (e) {
        return null;
    }
}

/**
 * 美美天成获取城市
 * @param title
 * @param id
 * @return {*}
 */
function getCity ({title = '深圳市', id = 1} = {}) {
    let cities = wx.getStorageSync('cities');
    if (jude.isArray(cities)) {
        let fIndex = cities.findIndex(v => {
            if (title) {
                title = title.replace(/市$/, '');
                let reg = new RegExp(title);
                if (reg.test(v.title))return true;
            } else if (id && +v.id === id) {
                return true;
            }
        });
        if (fIndex > -1) {
            return cities[fIndex];
        } else {
            return {title: '深圳市', id: 1};
        }
    } else {
        return {title: '深圳市', id: 1};
    }
}

/**
 * 过滤空数据
 * @param data
 * @return {{}}
 */
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

function querySelector (el) {
    if (!el) return;
    let node = null;
    return wx.createSelectorQuery().select(el);
}

/*********************utils***************************/

/*********************倒计时***************************/
/**
 * 倒计时class
 */
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
            countdownTime = dateCalendar.format(_this.time, _this.type);
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

/*********************倒计时***************************/

/*********************地图***************************/
class MAP {
    constructor () {

    }

    getMap (location, resolve, reject) {
        let location2 = `${location.lon},${location.lat}`;
        try {
            if (config.isMap === 1) {
                Amap.getRegeo({
                    location: location2,
                    success: function (data) {
                        //成功回调
                        let res = data[0];
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
}

/*********************高德地图***************************/

/*********************微信日志2.0版本以上***************************/
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

/*********************微信日志2.0版本以上***************************/

/**
 * 更新
 */
class updateManager {
    constructor () {
        this.flag = wx.getUpdateManager ? true : false;
        if (this.flag) {
            this.updateManager = wx.getUpdateManager()
        }
        console.log(this.flag, "updateManager监听更新");
    }

    onALL () {
        this.onCheckForUpdate();
        this.onUpdateFailed();
        this.onUpdateFailed();
    }

    /**
     * 请求完新版本信息的回调
     */
    onCheckForUpdate () {
        if (this.flag) {
            this.updateManager.onCheckForUpdate(function (res) {
                console.log(res.hasUpdate, 'onCheckForUpdate监听更新')
            })
        }
    }

    onUpdateFailed () {
        let that = this;
        if (this.flag) {
            this.updateManager.onUpdateFailed(function (res) {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            that.updateManager.applyUpdate()
                        }
                    }
                })
            })
        }
    }

    onUpdateFailed (challback) {
        let that = this;
        if (this.flag) {
            this.updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                wx.showModal({
                    title: '更新提示',
                    content: '版本下载失败，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            that.updateManager.applyUpdate()
                        }
                    }
                })
            })
        }

    }
}

module.exports = {
    formatTime: formatTime,
    regeneratorRuntime,
    getSessionId,
    removeSessionId,
    router,
    jude,
    queryString,
    querySelector,
    trim,
    unique,
    hideToast,
    hideLoading,
    failToast,
    showToast,
    showLoading,
    saveImageToPhotosAlbum,
    extend,
    requestParametersMerge,
    mergeKeyValue,
    requestUrlMerge,
    money,
    moneyToFloat,
    moneyFloor,
    chooseLocation,
    Countdown,
    pageScrollTo,
    getCity,
    filterNullData,
    regExpUtil,
    MAP,
    LogManager: new LogManager(),
    dateCalendar,
    updateManager
};
