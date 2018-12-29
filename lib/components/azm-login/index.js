const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require("../../../utils/ApiService/index"),
    config = require("../../../utils/config"),
    authorize = require('../../../utils/azm/authorize');
const watch = require('../../../utils/watch');
const authSetting = wx.getStorageSync('authSetting') || {};

const validate = require('../../../utils/validate');

import { debounce, throttle } from '../../../utils/lodash/throttle';

let timer = null;

import { basic } from "../mixins/basic";


Component({
    behaviors: [basic, 'wx://form-field'],
    externalClasses: ['azm-login-components-name'],
    data: {
        name: 'azm-login',
        imageUrl: config.imageUrl,
        Animation: null,
        show1: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isAuthUse: authSetting['scope.userInfo'],
        code: '',
        userInfo: null,
        encryptedData: null,
        iv: null,
        token: null,
        isUserSubmit: false,
        isBindTelephone: false,
        isShowMobile: false,
        isLogin: false,
        mobileNumber: '',
        mobileTip: true,
        msmNumber: '',
        msmTip: true,
        isValidate: false,
        targetTime: 0,
        targetStatus: false,
        clearTimer: false,
        myFormat: ['s'],
        validate: {
            mobileNumber: {
                format: {
                    pattern: "^1(3|4|5|7|8)\\d{9}$",
                    message: "^不是有效的手机号码"
                }
            },
            msmNumber: {
                format: {
                    pattern: "^\\d{4}$",
                    message: "^验证码必须4位有效数字"
                }
            }
        },
        ddd: null
    },
    properties: {
        isAnimation: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数
            }
        },
        isShow: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (newVal) {
                    if (newVal) {

                    } else {
                        this.setData({isShowMobile: false})
                    }
                }
            }
        },
        scene: {
            type: Object,
            value: {},
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created () {
        console.log(`组件生命周期函数created`);
        watch.setWatcher(this, this.watch());
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached () {
        let that = this;
        console.log(`组件生命周期函数attached`, that);
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready () {
        console.log(`组件生命周期函数ready`);
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved () {
        console.log(`组件生命周期函数moved`);
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached () {
        console.log(`组件生命周期函数detached`);
    },
    methods: {
        onUnload () {
            this.setData({isShow: false, isShowMobile: false})
        },
        watch () {
            return {
                isShowMobile: function (n, o) {
                    console.log(n, o, 'watch');
                    if (n) {
                        wx.setNavigationBarTitle({
                            title: '绑定手机号'
                        })
                        this.setData({clearTimer: false})
                    } else {
                        wx.setNavigationBarTitle({
                            title: '登录'
                        })
                        this.setData({clearTimer: true})
                    }
                },
                msmNumber (n, o) {
                    let that = this;
                    that.validate().finally(function (res) {
                        that.setData({
                            msmTip: !(res.data && res.data.msmNumber && res.data.msmNumber.length > 0),
                            isValidate: res.status
                        })
                    }).catch(err => {
                        // console.log(err);
                    });
                },
                mobileNumber (n, o) {
                    let that = this;
                    that.validate().finally(function (res) {
                        that.setData({
                            mobileTip: !(res.data && res.data.mobileNumber && res.data.mobileNumber.length > 0),
                            isValidate: res.status
                        })
                    }).catch(err => {
                        // console.log(err);
                    });
                },
                targetTime: function (n, o) {
                    console.log(n, '45646546');
                }
            }
        },
        show () {
            this.setData({isShow: true});
        },
        hide () {
            this.setData({isShow: false})
        },
        async wx2Login () {
            let that = this;
            that.data.code = '';
            await authorize.getSetting();
            const authSetting = wx.getStorageSync('authSetting') || {};
            that.setData({isAuthUse: authSetting['scope.userInfo']});
            if (authSetting['scope.userInfo']) {
                util2.getUserInfo({withCredentials: true, isCode: true}).then(res => {
                    that.data.code = res.code;
                    that.data.userInfo = res.userInfo;
                    that.data.encryptedData = res.encryptedData;
                    that.data.iv = res.iv;
                    that.wx2LoginApi();
                });
            } else if (this.data.encryptedData) {
                util2.login(true).then(function (res) {
                    if (res && res.code) {
                        that.data.code = res.code;
                        that.wx2LoginApi();
                    }
                });
            }
            // else if (false) {
            //     util2.login(true).then(function (res) {
            //         if (res && res.code) {
            //             that.data.code = res.code;
            //         }
            //     });
            // }
            // if (that.data.isBindTelephone && that.data.isUserSubmit) {
            //     wx.setStorageSync('_loginStatus_', 1);
            //     that.$emit('success', {...that.data});
            // } else if (that.data.isBindTelephone && !that.data.isUserSubmit) {
            //     that.setData({isShowMobile: true});
            // } else {
            //
            // }
        },
        wx2LoginApi () {
            let that = this;
            util2.showLoading('登录中...');
            let code = this.data.code;
            let encryptedData = this.data.encryptedData;
            let iv = this.data.iv;
            let userInfo = this.data.userInfo;
            that.data.isBindTelephone = false;
            that.data.isUserSubmit = false;
            ApiService.LoginRegister.wx2Login({code, encryptedData, iv, userInfo}).finally(res => {
                that.data.code = null;
                that.data.encryptedData = null;
                that.data.iv = null;
                util2.hideLoading(true);
                if (res.status === 1 && util2.jude.isEmptyObject(res.info)) {
                    if (!res.info.binding) {
                        that.data.isBindTelephone = true;
                        if (util2.jude.isEmptyObject(res.info.userInfo)) {
                            that.data.isUserSubmit = true;
                            that.data.userInfo = {...res.info.userInfo};
                            wx.setStorageSync('_userInfo_', util2.ObjToLowerCase(res.info.userInfo));
                        } else {
                            ApiService.LoginRegister.updateUserInfo({userInfo})
                        }
                        wx.setStorageSync('_loginStatus_', 1);
                        that.$emit('success', {...that.data});
                    } else {
                        that.data.token = res.info.token;
                        that.setData({isShowMobile: true});
                    }
                } else {
                    util2.failToast(res.message);
                    that.$emit('fail', {...that.data});
                }
            })
        },
        async onGotUserInfo (e) {
            let encryptedData = e.detail.encryptedData,
                iv = e.detail.iv,
                userInfo = e.detail.userInfo;
            this.data.userInfo = userInfo;
            this.data.encryptedData = encryptedData;
            this.data.iv = iv;
            if (e.detail.errMsg === "getUserInfo:ok") {
                this.wx2Login();
            }
        },
        bindInput (e) {
            let type = e.target.dataset.type;
            let number = e.detail.value;
            this.data[type + 'Number'] = number;
        },
        bindBlur (e) {

        },
        clearInput (e) {
            let type = e.currentTarget.dataset.type;
            this.setData({[type + 'Number']: "", [type + 'Tip']: false});
        },
        validate (self) {
            let that = this;
            let data = that.data;
            return new Promise(debounce((resolve, reject) => {
                let constraints = data.validate;
                let attributes = {};
                for (let k in constraints) {
                    attributes[k] = data[k]
                }
                validate.async(attributes, constraints).then(function (data) {
                    resolve({status: true, data});
                }).catch(err => {
                    reject({status: false, data: err})
                })
            }, 150));
        },
        bindGetMsm () {
            let that = this;
            let mobileTip = this.data.mobileTip;
            let clearTimer = this.data.clearTimer;
            let mobileNumber = this.data.mobileNumber;
            if (mobileTip && mobileNumber && !clearTimer) {
                util2.showLoading();
                ApiService.LoginRegister.getCheckCode(mobileNumber).finally(res => {
                    util2.hideLoading(true);
                    if (res.status === 1) {
                        that.setData({targetTime: util2.date.getTime('59s'), targetStatus: true});
                    } else {
                        util2.failToast(res.message || '服务器繁忙')
                    }
                })
            }
        },
        countDownFun () {
            this.setData({targetStatus: false});
        },
        bindBindingPhone () {
            let that = this;
            let telephone = that.data.mobileNumber;
            let code = that.data.msmNumber;
            let token = this.data.token;
            let userInfo = that.data.userInfo;
            let scene = that.data.scene;
            if (!code) {
                that.$Toast({content: '验证码不能为空'});
                return;
            }
            that.validate().finally(function (res) {
                if (res.status) {
                    util2.showLoading('登录中...');
                    ApiService.LoginRegister.bindingMember({telephone, code, userInfo, token}, scene).finally(res => {
                        util2.hideLoading(true);
                        if (res.status === 1) {
                            wx.setStorageSync('_loginStatus_', 1);
                            if (res.info.userInfo) {
                                wx.setStorageSync('_userInfo_', util2.ObjToLowerCase(res.info.userInfo));
                            }
                            wx.setStorageSync('_loginStatus_', 1);
                            that.$emit('success', {...that.data});
                        } else {
                            util2.failToast(res.message || '登录超时...');
                        }
                    })
                } else {
                    let arr = Object.keys(res.data).map(key => res.data[key]);
                    util2.failToast(arr[0][0])
                }
            });
        }
    }
});
