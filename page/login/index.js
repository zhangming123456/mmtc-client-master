// pages/login/index.js
const app = getApp(),
    util = app.util,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../utils/ApiService'),
    utilPage = require('../../utils/utilPage'),
    c = require("../../utils/common.js");
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page loginIndex',
        isLogin: true,
        userInfo: {},
        invite_id: '',//邀请码
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        if (this.data.isShow) {
            this.loadCb()
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },
    /**
     * 页面渲染完成
     */
    onReady () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {

    },
    onPageScroll(options){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};

const methods = {
    loadCb () {
        let that = this,
            options = this.data.options,
            invite_id = 0;
        if (options.scene) {
            let scene = decodeURIComponent(options.scene)
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    invite_id = kv[1];
                }
            }
        } else if (app.globalData.invite_id) {
            invite_id = app.globalData.invite_id
        }
        that.setData({invite_id});
        if (!c.hasLoginWx()) {
            that.wxLogon();
        }
    },
    showPhoneWin () {
        let invite_id = this.data.invite_id;
        util.go(`phone?invite_id=${invite_id || 0}`)
    },
    doGetPhone(e, r){
        let that = this, invite_id = that.data.invite_id;
        if (e.detail.encryptedData) {
            c.showLoading();
            r = r || {};
            ApiService.wx2LoginByPhone({
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                encryptedData_1: r.encryptedData,
                iv_1: r.iv,
                invite_id
            }).then(
                res => {
                    c.hideLoading();
                    if (res.status === 1) {
                        if (!util.common.isEmptyObject(that.data.userInfo)) {
                            that.data.userInfo = {
                                avatarUrl: res.info.avatar,
                                nickName: res.info.nickname
                            };
                        }
                        that.setUserInfo(e)
                    } else if (res.status === 202) {
                        c.logoff();
                        that.wxLogon(e);
                    } else {
                        c.alert(res.message);
                    }
                }
            )
        }
    },
    wxLogon(e){
        let that = this,
            invite_id = that.data.invite_id;
        that.__login(true).then(
            res => {
                if (res.code) {
                    ApiService.wx2Login({code: res.code, invite_id}).then(
                        res => {
                            if (res.status === 1) {
                                if (e) {
                                    that.getPhoneNumber(e);
                                } else {
                                    c.setHasLoginWx()
                                }
                            }
                        }
                    )
                }
            }
        )
    },
    userLogin(){
        app.util.go('/page/userLogin/pages/getUserInfo/index')
    },

    getPhoneNumber (e) {
        let that = this;
        if (e.detail.errMsg !== "getPhoneNumber:fail user deny") {
            this.__getUserInfo({withCredentials: true}).then(
                res => {
                    if (res.userInfo) {
                        that.data.userInfo = res.userInfo;
                        // that.startLogin(e);
                        that.doGetPhone(e, res);
                    }
                },
                rsp => {
                    that.doGetPhone(e);
                    that.data.userInfo = {};
                }
            ).finally(() => {

            });
        }
    },


    async startLogin(e){
        let that = this, invite_id = that.data.invite_id,
            p1 = new Promise(resole => {
                this.wx2Login().then(res => {
                    let code = that.data.code;
                    ApiService.wx2Login({code}).then(
                        res => {
                            if (res.status === 1) {
                                c.setHasLoginWx();
                                resole();
                            }
                        }
                    )
                })
            });
        await p1;
        if (invite_id) {
            await this.register();
        }
        await this.wx2LoginByPhone(e);
    },
    async wx2Login(e){
        let that = this;
        let p1 = that.__login(true),
            p2 = that.__getUserInfo({withCredentials: true});
        p1.then(res => {
            that.data.code = res.code;
            console.log(res);
            console.log(1);
        });
        p2.then(res => {
            that.data.userInfo = res.userInfo;
        });
        await p1;
        await p2;
    },
    register(){
        console.log(2);
        return ApiService.setActivityRegister();
    },
    wx2LoginByPhone(e){
        console.log(3);
        let that = this, invite_id = that.data.invite_id;
        if (e.detail.encryptedData) {
            c.showLoading();
            return ApiService.wx2LoginByPhone({
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                invite_id
            }).then(
                res => {
                    c.hideLoading();
                    if (res.status === 1) {
                        that.setUserInfo(e)
                    } else if (res.status === 202) {
                        c.logoff();
                    } else {
                        c.alert(res.message);
                    }
                }
            )
        }
    },

    setUserInfo(rt){
        let that = this,
            userInfo = that.data.userInfo;
        c.post('/api/wx2/updateUserInfo', userInfo);
        c.setUserInfo(userInfo);
        c.refreshPrevPage();
        if (util.getCurrentPages().length > 1) {
            app.util.go(-1)
        } else {
            app.util.go('/pages/mine/index', {type: 'tab'})
        }
    },

    onGotUserInfo(e){
        let encryptedData = e.detail.encryptedData,
            iv = e.detail.iv,
            userInfo = e.detail.userInfo;
        this.__login(true).finally(res => {
            console.log(res, e);
            if (res.errMsg === 'login:ok') {
                ApiService.login2wxLogin({code: res.code, encryptedData, iv, userInfo})
            }
        })
    }
};

Page(new utilPage(appPage, methods))