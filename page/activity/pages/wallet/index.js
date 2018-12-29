const app = getApp(),
    util2 = app.util2,
    ApiService = require("../../../../utils/ApiService/index"),
    utilPage = require("../../../../utils/utilPage");

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page activityWallet',
        bg2img: '/little/bg2.png',
        tipimg: '/little/tipimgs.png',
        userInfo: {},
        isReceive: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onLoad () {
        this.loadCb();
    },
    onShow () {
        if (this.data.isShow) {
            this.loadCb();
        }
    }
};
const methods = {
    loadCb () {
        ApiService.getActivityNotice().then(
            res => {
                if (res.status === 1) {
                    this.setData({
                        records: res.info
                    })
                }
            }
        );
    },
    /**
     * 定位回调
     * @param e
     */
    getLocationCallback (e) {
        let that = this,
            options = that.data.options,
            invite_id = null,
            city = util2.getCity();
        if (options.scene) {
            let scene = options.scene;
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    invite_id = kv[1];
                }
            }
        } else if (options.invite_id) {
            invite_id = options.invite_id
        }
        app.globalData.invite_id = invite_id;
        let userInfo = wx.getStorageSync('_userInfo_');
        return;
        util2.getLocation().finally(res => {

        });
        if (lat_and_lon.city === "深圳市" && e.detail.res.errMsg !== "getLocation:fail auth deny") {
            ApiService.wx2CheckSession().then(
                res => {
                    if (res.status === 1) {
                        that.setData({
                            userInfo,
                            invite_id,
                            isReceive: true
                        });
                        that.loadUser()
                    } else {
                        that.setData({
                            isReceive: false
                        })
                    }
                });
        } else {
            let text = '很抱歉，此活动仅限深圳地区参与。',
                btn = '回到首页';
            if (e.detail.res.errMsg === "getLocation:fail auth deny") {
                text += '请开启用户定位权限。';
                btn = '去开启';
            }
            wx.showModal({
                title: '温馨提示',
                content: text,
                showCancel: false,
                confirmText: btn,
                success: function (rsp) {
                    if (btn === '去开启') {
                        that.data.isShow = true;
                        wx.openSetting({
                            success: (res) => {
                                /*
                                 * res.authSetting = {
                                 *   "scope.userInfo": true,
                                 *   "scope.userLocation": true
                                 * }
                                 */
                                console.log('_______________');
                                that.data.isShow = false;
                            }
                        })
                    } else {
                        that.$route.tab('/page/tabBar/home/index');
                    }
                }
            });
        }
    },
    imageError () {
        this.setData({avatar: ''});
    },
    loadUser () {
        let city = util2.getCity(),
            is_from_sz = city.id;
        ApiService.setActivityRegister({is_from_sz}).then(
            res => {
                if (res.status === 1) {
                    this.setData({money: res.info});
                }
            }
        );
    },
    bindShowPopup () {
        this.selectComponent("#azmPopup").toggle(true);
    },
    noop () {

    },
    bindGetUserInfo () {
        this.$route.push("/page/login/index");
    }
};
Page(new utilPage(appPage, methods));
