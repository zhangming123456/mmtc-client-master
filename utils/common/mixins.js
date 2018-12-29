const app = getApp(),
    util2 = app.util2,
    {router, ROUTER, regeneratorRuntime, jude, queryString} = app.util2,
    authorize = require('../azm/authorize'),
    config = require('../config'),
    ApiService = require('../ApiService/index');


let __imageUploadKey = 'cover';
let ImageUploadCount = 0;
let wxc_toastHideToast = function () {

};
module.exports = {
    stopPullDownRefresh (options) {
        console.warn(`下拉触发事件${this.data.text}结束`, options, 'onPullDownRefresh');
        let that = this;
        that.data.isPullDownRefresh = false;
        wx.stopPullDownRefresh();
    },
    __login (bol) {
        return new Promise((resolve, reject) => {
            function login () {
                wx.login({
                    success (res) {
                        resolve(res)
                    },
                    fail () {
                        reject()
                    }
                })
            }

            if (bol) {
                login();
            } else {
                wx.checkSession({
                    success: function () {
                        //session_key 未过期，并且在本生命周期一直有效
                        resolve();
                    },
                    fail: function () {
                        // session_key 已经失效，需要重新执行登录流程
                        login()
                    }
                });
            }
        })
    },

    /**
     * 获取用户信息接口 第一次需要button（open-type）接口开启权限
     * @param lang 语言
     * @param withCredentials  是否携带用户加密数据
     * @param timeout
     * @param isCode 是否携带code
     * @returns {Promise}
     * @private
     */
    __getUserInfo ({lang = 'en', withCredentials = false, timeout = null, isCode = false} = {}) {
        let that = this;
        return new Promise((resolve, reject) => {
            let code = null,
                options = {
                    lang,
                    withCredentials,
                    success (res) {
                        if (code) {
                            res.code = code
                        }
                        resolve(res)
                    },
                    fail (res) {
                        reject(res)
                    }
                };
            if (timeout) {
                options.timeout = timeout
            }
            authorize.userInfo(true)
                .then(
                    () => {
                        if (withCredentials) {
                            that.__login(isCode).then(
                                res => {
                                    if (jude.isEmptyObject(res)) {
                                        code = res.code;
                                    }
                                    wx.getUserInfo(options);
                                }
                            );
                        } else {
                            wx.getUserInfo(options);
                        }
                    },
                    () => {
                        reject();
                    }
                );
        });
    },
    __imageError () {

    },
    // 保存formId
    saveFormIds (e) {
        let formId = e.detail.formId;
        if (formId !== 'the formId is a mock one') {
            ApiService.saveFormIds({form_id: formId});
        }
    },
    azmRoute (e) {
        let dataset = e.currentTarget.dataset || e.target.dataset,
            path = dataset.path,
            data = {},
            token = dataset.token,
            type = dataset.type || '';
        if (path === '/pages/page/index') {
            data.token = token;
        }
        router.go(path, {data, type});
    },
    bindPageToast (e) {
        let dataset = e.currentTarget.dataset,
            message = dataset.message;
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: message,
            success: function (res) {
                if (res.confirm) {

                }
            }
        });
    },
    /**
     *  toast方法
     * @param text 提示文字
     * @param icon 提示图标（minuiicon）
     * @param src 提示图片
     * @param icon_color 提示icon颜色
     * @param duration 提示时间
     */
    azmShowToast ({text = '', icon = null, src = null, icon_color = null, duration = 1500} = {}) {
        let that = this,
            str = null,
            options = arguments[0],
            callBack = arguments[1],
            $azmToast = this.data.$azmToast;
        wxc_toastHideToast = new Function();
        try {
            if (jude.isString(options)) {
                $azmToast.text = options;
                if (callBack && jude.isFunction(callBack)) {
                    wxc_toastHideToast = function () {
                        callBack.call(that);
                    };
                }
            } else {
                $azmToast = {
                    text: options.text,
                    icon: options.icon,
                    src: options.src,
                    icon_color: options.icon_color,
                    duration: options.duration
                };
                wxc_toastHideToast = function () {
                    options.success && options.success.call(that);
                };
            }
            this.setData({$azmToast});
            this.selectComponent("#azm_wxc_toast").show($azmToast.text);
        } catch (e) {
            console.log("调用azmShowToast失败", e);
        }
    },
    bindWxcToastSuccess () {
        console.log('toast结束');
        wxc_toastHideToast && wxc_toastHideToast();
    },
    /**
     * dom选择器
     * @param el
     */
    querySelector (el) {
        if (!el) return;
        let node = null;
        return wx.createSelectorQuery().select(el);
    },
    getEleScrollOffset (el) {
        if (!el) return;
        let node = null;

        let p = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select(el).boundingClientRect(function (res) {
                node = res;
                resolve(res);
            }).exec();
        });
        p.catch(res => {

        });
        return p;
    },
    bindSetClipboardData (e) {
        let dataset = e.currentTarget.dataset || e.target.dataset;
        wx.setClipboardData({
            data: dataset.value,
            success: function (res) {
                util2.showToast('复制成功');
            },
            fail () {
                util2.failToast('复制失败');
            }
        })
    },
    /**
     * 函数描述：作为上传文件时递归上传的函数体体；
     * 参数描述：
     * @param filePaths 是文件路径数组
     * @param successUp 是成功上传的个数
     * @param failUp 是上传失败的个数
     * @param i 是文件路径数组的指标
     * @param length 是文件路径数组的长度
     * @param callback
     * @param count
     */
    uploadDIY (filePaths, successUp, failUp, i, length, callback, count) {
        let that = this;
        wx.uploadFile({
            url: config.uploadFileUrl,
            filePath: filePaths[i],
            name: "_file_",
            success: (res) => {
                ImageUploadCount++;
                let data = res.data, setData = {};
                if (typeof data === "string") {
                    try {
                        data = JSON.parse(data);
                        let images = that.data[__imageUploadKey];
                        if (+data.status !== 1) throw {message: data.info};
                        if (count > 1) {
                            if (jude.isArray(images) && images.length) {
                                setData[__imageUploadKey] = images
                            } else {
                                setData[__imageUploadKey] = []
                            }
                            setData[__imageUploadKey].push(data.info);
                        } else {
                            setData[__imageUploadKey] = data.info;
                        }
                        successUp++;
                        that.setData(setData);
                    } catch (e) {
                        util2.failToast('上传失败');
                    }
                }
            },
            fail: (res) => {
                failUp++;
            },
            complete: () => {
                i++;
                if (i === length) {
                    util2.hideLoading(true);
                    __imageUploadKey = 'cover';
                    ImageUploadCount = 0;
                    if (successUp > 0) {
                        callback && callback({message: `成功上传${successUp}张`, status: 1});
                        util2.showToast(`成功上传${successUp}张`);
                    }
                } else {//递归调用uploadDIY函数
                    that.uploadDIY(filePaths, successUp, failUp, i, length, callback, count);
                }
            },
        });
    },
    /**
     * 图片上传
     * @param count
     * @param key
     **/
    ImageUpload (count = 1, key = 'cover') {
        let that = this;
        __imageUploadKey = key;
        let p = new Promise((resolve, reject) => {
            wx.chooseImage({
                count: count, // 默认9
                sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
                success: res => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    let tempFilePaths = res.tempFilePaths;
                    util2.showLoading("正在上传...");
                    let successUp = 0,//成功个数
                        failUp = 0, //失败个数
                        length = tempFilePaths.length, //总共个数
                        i = 0; //第几个
                    that.uploadDIY(
                        tempFilePaths,
                        successUp,
                        failUp,
                        i,
                        length,
                        res => {
                            resolve(res)
                        },
                        count
                    );
                },
                fail (res) {
                    reject(res);
                },
                complete () {
                }
            });
        });
        p.catch(res => {

        });
        return p;
    },
    /**
     * 使用剪贴板
     **/
    __Clipboard (e) {
        console.log(e);
        let that = this;
        let key = e.target.dataset.key;
        let type = e.target.dataset.type;
        if (key && type) {
            wx.getClipboardData({
                success: function (res) {
                    if (res.data.length === 0) return;
                    wx.setClipboardData({data: ''});
                    res.data = res.data.replace(/\s*/gm, '');
                    console.log('getClipboardData', type, key, res.data, /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(res.data));
                    if (type === "is-code" && /(^\d{4}|^\d{6})$/.test(res.data)) {
                        console.log(type, key, res.data);
                        that.setData({
                            [key]: res.data
                        })
                    } else if (type === "is-telephone" && /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(res.data)) {
                        console.log(type, key, res.data);
                        that.setData({
                            [key]: res.data
                        })
                    }
                }
            })
        }
    },
    // 空操作
    noop () {
    },
    /**
     * 扫描二维码验证（消费码）
     */
    scanCodeVerify () {
        wx.scanCode({
            scanType: ['qrCode', 'barCode'],
            success: res => {
                let result = res.result;
                this.__scanVerifyCode(result)
            }
        });
    },
    __scanVerifyCode (value) {
        if (value && /^(https:\/\/app.mmtcapp.com\/mmtc\/)/.test(value)) {
            let query = queryString.parse(value).query;
            console.log(value);
            if (query.pwd && /^\d{12}$/.test(query.pwd)) {
                this.__verificationSee(query.pwd)
            } else {
                this.$Toast({content: `消费码不正确{${query || query.pwd}`});
            }
        } else {
            this.$Toast({content: '扫描二维码格式不正确'});
        }
    },
    __verificationSee (pwd) {
        let that = this;
        if (!pwd || pwd.length < 12 || this.data.isVerificationSee) return;
        this.data.isVerificationSee = true;
        util2.showLoading();
        ApiService.verificationSee({pwd}).finally(res => {
            this.data.isVerificationSee = false;
            util2.hideLoading(true);
            if (res.status === 1 && res.info) {
                if (res.info.is_used == 1) {
                    that.$route.push({path: '/page/home/pages/verifyHas/index', query: {order_id: +res.info.id}})
                } else {
                    that.$route.push({path: '/page/order/pages/info/index', query: {order_id: +res.info.id}})
                }
            } else {
                that.$Toast({content: res.message});
            }
        })
    },
    /**
     * 开发中提示框
     */
    urgentDev () {
        wx.showModal({
            title: '提示',
            content: '美美正正在加急开发中，敬请期待~',
            showCancel: false
        })
    },
    /**
     * 去订单详情页面
     * @param e
     */
    toOrderDetail (e) {
        console.log(e);
        // pages/detail/index
        let item = e.currentTarget.dataset.item;
        if (item && !!item.bill_id) {
            this.$route.push({path: '/page/order/pages/detail/index', query: {id: item.bill_id}})
        } else if (item && !!item.group_open_id) {
            this.$route.push({path: '/page/order/pages/groupDetail/index', query: {id: item.group_open_id}})
        }
    },
    /**
     * 去产品详情页面
     * @param e
     */
    toItemDetail (e) {
        console.log(e);
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: '/page/products/pages/detail/index', query: {id}})
        }
    },
    /**
     * 去会员订单详情页面
     * @param e
     */
    toMemberDetail (e) {
        console.log(e);
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: '/page/me/pages/memberDetail/index', query: {id}})
        }
    },
    /**
     * 预览图片
     * @param e
     */
    previewImage (e) {
        try {
            let cur = e.target.dataset.src,
                images = e.target.dataset.images,
                urls = [];
            if (images) {
                for (let v of images) {
                    urls.push(`${config.imageUrl}${v}`)
                }
            } else {
                urls = [cur]
            }
            if (cur) {
                wx.previewImage({
                    current: cur,
                    urls// 需要预览的图片http链接列表
                })
            }
        } catch (err) {
            console.log('预览图片失败' + err);
        }
    },
    /**
     * 拨打电话
     * @param currentTarget
     */
    makePhoneCall ({currentTarget}) {
        let phoneNumber = currentTarget.dataset.tel;
        if (phoneNumber && util2.trim(phoneNumber)) {
            wx.makePhoneCall({phoneNumber})
        } else {
            util2.failToast('没有服务电话')
        }
    },
    /**
     * 去店铺首页
     * @param shop_id
     */
    toShopHome (shop_id) {
        if (!shop_id) return;
        let page = this.$route.getCurrentPage(1);
        if (page && page.route === "page/shop/pages/home/index") {
            this.$route.back();
        } else {
            this.$route.push({path: "/page/shop/pages/home/index", query: {shop_id}});
        }
    },
    getUserInfo (e) {
        console.log('打开获取用户信息按钮', e);
        let that = this;
        if (!this.data.canIUse) {
            util2.getUserInfo({withCredentials: true}).finally(err => {
                that.getUserInfoCallback(err)
            })
        }
    },
    getUserInfoCallback (e) {
        console.log('打开获取用户信息按钮回调', e);
        let that = this;
        let detail = e.detail || e,
            errMsg = e.errMsg || e.detail.errMsg;
        if ('getUserInfo:fail auth deny' === errMsg) {
            e.errMsg && that.$route.push('/page/public/pages/authorization/index');
            app.globalData.userInfo_start = 1;
        } else if ('getUserInfo:ok' === errMsg) {
            app.globalData.userInfo_start = 2;
            that.onLogin && that.onLogin(detail)
        }
    },
    openSetting (e) {
        console.log('打开授权按钮', e);
        let that = this;
        if (!this.data.canOpenSetting) {
            wx.openSetting({
                success: (res) => {
                    that.bindopensetting(res)
                }
            })
        }
    },
    bindopensetting (e) {
        console.log('打开授权按钮回调', e);
        let authSetting = e.authSetting || e.detail.authSetting;
        wx.setStorageSync('authSetting', authSetting);
        if (this.data.redirect_url) {
            this.$route.replace(this.data.redirect_url)
        } else {
            this.$route.back();
        }
        this.onOpensettingCall && this.onOpensettingCall(e)
    },
    /**
     * 返回
     */
    bindBack () {
        this.$route.back();
    },
    /**
     * 退出登入
     * @param e
     */
    logoff (e) {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确定退出当前账号吗?',
            success: function (res) {
                if (res.confirm) {
                    ApiService.wx2logoff();
                    wx.removeStorageSync('_userInfo_');
                    wx.removeStorageSync('_loginStatus_');
                    wx.removeStorageSync('sid');
                    wx.removeStorageSync('_login_time');
                    app.globalData.userInfo = {};
                    that.setData({userInfo: {}, isLogin: false});
                } else if (res.cancel) {

                }
            }
        });
    },
    /**
     * 点赞
     * @param e
     * @param key
     * @param countStr
     */
    $giveALike (e, key = 'noteList', countStr = 'zan_count') {
        let item = e.currentTarget.dataset.item;
        let page = e.currentTarget.dataset.page;
        let index = e.currentTarget.dataset.index;
        let that = this;
        let noteZan = wx.getStorageSync('noteZan');
        if (!util2.jude.isArray(noteZan)) {
            noteZan = []
        }
        let fIndex = noteZan.findIndex(v => {
            return +v === +item.id
        });
        if (that.isZan) return;
        if (item && item.id && fIndex === -1) {
            that.isZan = true;
            util2.showLoading();
            ApiService.noteIncZan({nid: item.id}).finally(res => {
                util2.hideLoading(true);
                that.isZan = false;
                let setData = {}
                if (res.status === 1) {
                    util2.showToast('点赞成功');
                    if (!util2.jude.isArray(noteZan)) {
                        noteZan = []
                    }
                    noteZan.push(item.id);
                    setData.noteZan = noteZan;
                    if (index !== undefined) {
                        setData[`${key}[${page}][${index}].${countStr}`] = parseInt(item[countStr]) + 1;
                    } else {
                        setData[`${key}[${page}].${countStr}`] = parseInt(item[countStr]) + 1;
                    }
                    that.setData(setData);
                    wx.setStorageSync('noteZan', noteZan);
                } else {
                    util2.showToast('点赞失败')
                }
            });
        }
    },
    $setFromValue (e) {
        console.log(e);
    },
    $router ({currentTarget}) {
        let that = this;
        let dataset = currentTarget.dataset;
        let path = dataset.url;
        let query = dataset.query;
        let isVerify = dataset.isVerify;
        if (!path) return;
        if (isVerify) {
            util2.hasLogin(function () {
                that.$route.push({path, query})
            })
        } else {
            that.$route.push({path, query})
        }
    }
};
