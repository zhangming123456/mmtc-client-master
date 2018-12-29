const app = getApp(),
    util2 = app.util2,
    {router, regeneratorRuntime, jude} = app.util2;

const Watch = require('../../utils/watch');

const ExpiredTime = '5m';
let UpdateExpired = null;

module.exports = {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        Watch.setWatcher(this);
        UpdateExpired = util2.date.getTime(ExpiredTime);
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res, '+++++++++++++++++++系统信息+++++++++++++++++++');
                that.data.systemInfo = res;
                that.setData({
                    SDKVersion: res.SDKVersion.split('.'),
                    noteZan: wx.getStorageSync('noteZan'),
                    canOnTabItemTap: util2.compareVersion(res.SDKVersion, '1.9.0')
                })
            }
        });
        try {
            if (options) {
                Object.assign(that.data.options, options);
                for (let k in that.data.options) {
                    that.data.options[k] = decodeURIComponent(that.data.options[k]);
                }
                console.warn(`初始化${that.data.text}`, options);
            } else {
                throw {message: '初始化options为空'};
            }
        } catch (e) {
            console.warn(e, options);
        }
        that.__page.onLoad && that.__page.onLoad.call(this, options);
        let _this2 = router.getCurrentPage(-1);
        if (_this2) {
            _this2.data.clockCodeCountdown && _this2.data.clockCodeCountdown.clear();
            _this2.setData({
                isShow: true
            })
        }
        if (!that.data.text) {
            that.data.text = router.getCurrentPage().route
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        let that = this;
        app.to_path = that.route;
        that.data.__router = {
            to: app.to_path,
            from: app.from_path
        }
        console.warn(`进入${this.data.text}`, options, 'onShow');
        this.__page.onShow && that.__page.onShow.call(this, options);
        if (that.data.isShow) {
            that.setData({isShow: false});
            that.azmLocation_onRefresh && that.azmLocation_onRefresh.call(this, options, 'onShow');
        }
        wx.getSetting({
            success: (res) => {
                let authSetting = res.authSetting;
                wx.setStorageSync('authSetting', authSetting);
            },
            fail () {

            },
            complete () {
                let authSetting = wx.getStorageSync('authSetting');
                if (that.route === 'page/me/pages/setting/index') {
                    that.setData({
                        isOpenSetting: jude.isEmptyValue(authSetting)
                    });
                } else {
                    that.data.isOpenSetting = jude.isEmptyValue(authSetting)
                }
            }
        });
        // if (app.isUpdate || (UpdateExpired && UpdateExpired > +new Date())) {
        //     UpdateExpired = util2.date.getTime(ExpiredTime);
        //
        //     app.isUpdate = false;
        // }
        console.log(router.getCurrentPages(), '案件是否可垃圾分类静安路附近阿里');
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide (options) {
        console.warn(`离开${this.data.text}`, options, 'onHide');
        let that = this;
        this.__page.onHide && that.__page.onHide.call(this, options);
        if (that.data.isShow) {

        }
        app.from_path = that.route
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload (options) {
        console.log(`卸载${this.data.text}`, options, 'onUnload');
        let that = this;
        this.__page.onUnload && that.__page.onUnload.call(this, options);
        // 关闭页面
        this.data.clockCodeCountdown && this.data.clockCodeCountdown.clear();
        app.from_path = that.route
    },

    /**
     * 页面渲染完成
     */
    onReady (options) {
        console.warn(`渲染完成${this.data.text}`, options, 'onReady');
        let that = this;
        this.__page.onReady && that.__page.onReady.call(this, options);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh (options) {
        console.warn(`下拉触发事件${this.data.text}`, options, 'onPullDownRefresh');
        let that = this;
        this.__page.onPullDownRefresh && this.__page.onPullDownRefresh.call(this, options);
        that.azmLocation_onRefresh && that.azmLocation_onRefresh.call(this, options, 'onPullDownRefresh');
        that.data.isPullDownRefresh = true;
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        console.warn(`上拉触底事件${this.data.text}`, options, 'onReachBottom');
        let that = this;
        this.__page.onReachBottom && this.__page.onReachBottom.call(this, options);
        this.azmGoTop_onReachBottom && this.azmGoTop_onReachBottom.call(this, options);
    },

    /**
     * 屏幕滚动事件
     * @param options
     */
    onPageScroll (options) {
        // console.warn(`屏幕滚动事件${this.data.text}`, options, 'onPageScroll');
        let that = this;
        this.__page.onPageScroll && this.__page.onPageScroll.call(this, options);
        this.azmGoTop_onPageScroll && this.azmGoTop_onPageScroll.call(this, options);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {
        console.warn(`用户点击右上角分享${this.data.text}`, options, 'onShareAppMessage');
        let that = this;
        if (this.__page.onShareAppMessage) {
            return this.__page.onShareAppMessage.call(this, options)
        } else {

        }
    },

    /**
     * 点击 tab 时触发
     */
    onTabItemTap (options) {
        console.warn(`点击 tab 时触发${this.data.text}`, options, 'onTabItemTap');
        let that = this;
        if (this.__page.onTabItemTap) {
            return this.__page.onTabItemTap.call(this, options)
        } else {

        }
    }
}
