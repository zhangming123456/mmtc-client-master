"use strict";
const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    Fly = require('./fly.min'),
    ContentType = "Content-Type";
import { jude, router, queryString } from '../util'
let retryNum = 0
function failCallback (res) {
    retryNum++;
    let text = '网络连接失败，或服务器错误' + '{' + res.errMsg + '}';
    if (res.statusCode === 404) {
        text = '网络连接失败'
    } else if (res.statusCode === 500) {
        text = '服务器错误'
    }
    let confirmText = '知道了';
    // debugger
    // if (retryNum >= 3) {
    //     text += '（已重试' + retryNum + '次,超过重试次数，请检查网络状态并重新打开小程序）';
    // } else {
    //     text += '（已重试' + retryNum + '次）';
    // }
    wx.showModal({
        title: '温馨提示',
        content: text,
        showCancel: false,
        confirmText: confirmText,
        success: function (rsp) {
            if (rsp.confirm) {
                if (retryNum < 3) {
                    // setRequest();
                } else {
                    // failCallback(res);
                }
            } else if (rsp.cancel) {

            }
        }
    });
}


function getFly (params = {}) {
    let fly = new Fly();
    let sid = util.getSessionId(),
        config = {};
    config.timeout = 15000;
    config.headers = {
        'Content-Type': params.contentType || 'application/json', // 默认值
        'X-Requested-With': 'XMLHttpRequest'// 默认值
    };
    config.dataType = 'json';
    config.parseJson = params.contentType ? false : true;

    if (sid) {
        config.headers['cookie'] = sid;
    }
    if (params.baseURL) {
        config.baseURL = params.baseURL;
    }
    Object.assign(fly.config, config);
    //添加拦截器
    fly.interceptors.request.use((config, promise) => {
        //给所有请求添加自定义header
        app.interceptors && app.interceptors.request && app.interceptors.request(config, promise);
        return config;
    });

    //添加响应拦截器，响应拦截器会在then/catch处理之前执行
    fly.interceptors.response.use(
        (res) => {
            wx.hideNavigationBarLoading(); //停止标题loading
            // wx.hideLoading();
            let url, str = '';
            app.interceptors && app.interceptors.response && app.interceptors.response('success', res);
            //只将请求结果的data字段返回
            try {
                url = res.request.url;
                if (url) {
                    let a = url.split('/');
                    str = a[a.length - 1];
                    if (str) {
                        let b = str.split('?');
                        str = b[0];
                    }
                }
                if (typeof res.data !== 'object') {
                    throw 'systemError:Unknown error occurred in the system'
                }
                res.data.status = +res.data.status;
                console.log(`__log__请求接口${str}`);
                util.LogManager.log(`____请求接口：${JSON.stringify(url)},响应数据：}_____`, res.data);
                let setCookie = res.headers['Set-Cookie'] || res.headers['set-cookie'];
                if (setCookie && setCookie.indexOf('PHPSESSID=') !== -1) {
                    let lpos = setCookie.split(';');
                    if (lpos.length > 0) {
                        for (let v of lpos) {
                            if (/^(PHPSESSID=)/.test(v)) {
                                setCookie = v
                                break;
                            }
                        }
                    }
                    wx.setStorageSync('sid', setCookie);
                }
                let page = router.getCurrentPages(),
                    path = page[page.length - 1].route;
                // path !== 'page/tabBar/me/index'
                if (res.data.status === 202 && (path !== 'pages/login/getUserInfo/index' || path !== 'pages/login/index')) {
                    router.push('/page/userLogin/pages/getUserInfo/index');
                    return {
                        info: null,
                        message: '未登入',
                        status: res.data.status
                    }
                } else {
                    let info = res.data.info,
                        status = res.data.status;
                    if (status === 0) {
                        res.data.message = info;
                        res.data.info = null;
                    }
                    return res.data
                }
            } catch (err) {
                console.log(`__________请求失败{${str}:false,msg:${err}____________`);
                util.LogManager.debug(`_____请求接口：${JSON.stringify(url)},报错：${JSON.stringify(err)}响应数据:`, res.data);
                wx.showModal({
                    title: '温馨提示',
                    content: `请求失败{${str}:false,msg:${err}}`,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                });
                return {
                    info: null,
                    message: `请求失败{${str}:false,msg:${err}}`,
                    status: 0
                }
            }
        },
        (err) => {
            app.interceptors && app.interceptors.response && app.interceptors.response('err', err);
            //发生网络错误后会走到这里
            //return Promise.resolve("ssss")
            wx.showModal({
                title: '温馨提示',
                content: `网络连接失败`,
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        }
    );
    return fly;
}

class HttpRequest {
    constructor () {
        this.requestTask = []
    }

    request ({url = '', data = {}, contentType = 'application/json', method = 'GET'}, resolve) {
        let params = {url, data, contentType, method},
            retryNum = 0,
            promise = null,
            reject = null,
            isLoading = false,
            isReturnStatus = false; //是否显示加载信息
        for (let i = 2; i < arguments.length; i++) {
            if (jude.isBoolean(arguments[i])) {
                isReturnStatus = arguments[i];
            }
            if (jude.isFunction(arguments[i])) {
                reject = arguments[i];
            }
        }
        let _url = url.split('/')
        console.log(`_____请求数据${_url[_url.length - 1]}______`, params.data);
        if (params.data.config && params.data.config.isLoading) {
            isLoading = params.data.config.isLoading;
            delete params.data.config;
        }
        delete params.url;

        if (params.data.options && jude.isEmptyObject(params.data.options)) {
            url += '?' + queryString.stringify(params.data.options);
            delete params.data.options;
        }

        for (let k in params.data) {
            if (params.data[k] === undefined || params.data[k] === null) {
                delete params.data[k];
            } else if (util.trim(params.data[k]) === '') {
                params.data[k] = ''
            }
        }

        if (isLoading) {
            util.showLoading('加载中');
            return setPromise();
        } else {
            return setPromise();
        }

        function setPromise () {
            let p = new Promise((_resolve, _reject) => {
                let flag = false;
                promise = null;
                wx.showNavigationBarLoading();
                if (!params.data) {
                    params.data = {};
                }
                params.data['_f'] = 1;
                let _contentType = 'application/x-www-form-urlencoded',
                    _data = queryString.stringify(params.data);
                if (params.method && params.method.toLocaleLowerCase() === 'post') {
                    params.header = {
                        "Content-Type": params.contentType
                    };
                    console.log(jude.type(params.data));
                    if (util.trim((params.header[ContentType] || "").toLowerCase()) === _contentType) {

                    } else if (params.data && ["object", "array"].indexOf(jude.type(params.data)) !== -1) {
                        _data = params.data;
                    }
                }
                let fly = getFly(params);
                if (params.method === 'GET') {
                    promise = fly.get(url, _data)
                } else if (params.method === 'POST') {
                    promise = fly.post(url, _data)
                }
                promise.then(res => {
                    console.log(`_____响应数据${_url[_url.length - 1]}______`, res);
                    _resolve && _resolve(res)
                }).catch(_reject)
            });
            return p
        }
    };

    post (url, options, resolve, reject) {
        let data = options || {};
        let params = {
            url,
            data,
            contentType: 'application/x-www-form-urlencoded',
            method: 'POST'
        };
        return this.request(params, resolve, reject);
    };

    post2 (url, options, resolve, reject) {
        let data = options || {};
        let params = {
            url,
            data,
            method: 'POST'
        };
        return this.request(params, resolve, reject);
    };

    get (url, options, resolve, reject) {
        let data = options || {};
        let params = {
            url,
            data,
            method: 'GET'
        };
        return this.request(params, resolve, reject);
    };

    postParm (url, options, resolve, reject) {
        let data = options || {};
        let params = {
            url,
            data,
            flag: true,
            method: 'POST'
        };
        return this.request(params, resolve, reject);
    };

    downImage (url, data) {
        let qrCodePath = `${url}?${queryString.stringify(data)}`;
        let cookie = util.getSessionId();
        console.log(qrCodePath);
        
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: qrCodePath,
                header: {cookie},
                success: function (res) {
                    console.log(res, '_qrCodeImage', 1);
                    if (res.header && /text\/html/.test(res.header[`Content-Type`])) {
                        reject({info: null, message: '下载失败', status: 0})
                    } else if (res.statusCode === 200) {
                        let path = res.tempFilePath;
                        if (/(htm|html)$/.test(path)) {
                            reject({info: null, message: '下载失败', status: 0})
                        } else {
                            wx.getImageInfo({
                                src: path,
                                success: function (res) {
                                    console.log(res, '_qrCodeImage');
                                    resolve({info: res, status: 1, message: ''});
                                },
                                fail (err) {
                                    console.log(err, '_qrCodeImage');
                                    reject({info: null, message: err, status: 0});
                                }
                            });
                        }
                    } else {
                        reject({info: null, message: '下载失败', status: 0})
                    }
                },
                fail: () => {
                    util.showToast('网络连接失败');
                    reject({info: null, message: '网络连接失败', status: 0});
                }
            });
        })
    }
}

module.exports = {
    HttpRequest
};