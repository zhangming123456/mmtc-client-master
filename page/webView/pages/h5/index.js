const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = util2.regeneratorRuntime, //使用async，await
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage');

const appPage = {
    data: {
        text: "Page webView h5",
        src: '',
        title: '',
        regLoad: [
            // 'h5/index/activity'
        ]
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 页面渲染完成
     */
    onReady: function () {
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
    },
    /**
     * 上拉触底
     */
    onReachBottom () {
        let that = this
    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll (options) {

    },
    onShareAppMessage (options) {
        let that = this;
        let return_url = options.webViewUrl
        let path = 'page/webView/pages/h5/index?pathname=' + encodeURIComponent(that.data.pathname) //需要转发的当前页面的路径
        return {
            title: that.data.title || '',
            path: path,
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: "转发成功",
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let options = this.data.options;
        let path = options.path;
        let pathname = options.pathname;
        let url = options.url;
        if (!util2.trim(path) && !util2.trim(pathname) && !util2.trim(url) && (url || '').indexOf(config.host) === -1 && !options.q && !options.scene) {
            this.$router.back();
            return;
        }
        if (path && !/^\//ig.test(path)) {
            path = `/${path}`
        } else if (pathname && !/^\//ig.test(pathname)) {
            pathname = `/${pathname}`
        } else if (options.q && /https:\/\/app.mmtcapp.com/ig.test(options.q)) {
            url = options.q
            // https://app.mmtcapp.com/h5/index/activity?activity_id=365&shop_id=8710
        }
        this.data.path = path;
        this.data.pathname = pathname;
        this.data.url = url;
        this.setWebViewUrl();
    },

    isLoadUs () {
        const path = this.data.path;
        const pathname = this.data.pathname;
        const url = this.data.url;
        let fIndex = this.data.regLoad.findIndex(function (reg) {
            return (url && url.indexOf(reg)) > -1 || (pathname && pathname.indexOf(reg) > -1) || (path && path.indexOf(reg) > -1)
        });
        return fIndex > -1;
    },

    bindMessage (e) {
        let data = e.detail.data;
        console.log(data, 'bindMessage');
        if (data && data.length > 0 && data[0].status === 202 && data[0].hash) {
            let hash = data[0].hash.replace(/^#/, '');
            this.$router.push({
                path: '/page/login/index',
                query: {
                    redirectUrl: `/page/webView/pages/merchanth5/index?path=${encodeURIComponent(hash)}`,
                }
            })
        } else if (data && data.length > 0 && data[0].share === true && data[0].title) {
            this.setData({
                title: data[0].title
            })
        }
    },
    setWebViewUrl (bol) {
        let url = this.data.url;
        let path = this.data.path;
        let pathname = this.data.pathname;
        let sessionId = util2.getSessionId() || '';
        let sid = ''
        if (sessionId) {
            sid = `&${sessionId}`
        }
        let src = '';

        console.log(this.isLoadUs(), 'jlkjlkds');

        if (pathname && !/(merchanth5|mmtch5)/ig.test(pathname)) {
            let location = util2.queryString.parse(pathname);
            let query = {
                ...location.query,
                _t: app._t,
                __wxjs_environment: 'miniprogram',
                __t: +new Date()
            };
            if (sessionId) {
                let sid = sessionId.split('=');
                query[sid[0]] = sid[1]
            }
            src = `${config.host}${location.pathname}?${util2.queryString.stringify(query)}#wechat_redirect`
        } else if (url) {
            let location = util2.queryString.parse(url);
            let query = {
                ...location.query,
                _t: app._t,
                __wxjs_environment: 'miniprogram',
                __t: +new Date()
            };
            if (sessionId) {
                let sid = sessionId.split('=');
                query[sid[0]] = sid[1]
            }
            src = `${config.host}${location.pathname}?${util2.queryString.stringify(query)}#wechat_redirect`
        } else {
            src = `${util2.getWebViewPath()}_t=${app._t}${sid}#${path}#wechat_redirect`
        }
        this.setData({src})
    },
    bindLoad (e) {
        console.log(e);
    },
    bindError (e) {
        console.log(e);
    }
};
Page(new utilPage(appPage, methods));
