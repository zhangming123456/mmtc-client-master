const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../../utils/ApiService'),
    config = require('../../../utils/config'),
    utilPage = require('../../../utils/utilPage');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page home',
        isShow: false,
        options: {},
        cityName: "",
        imageUrl: config.imageUrl,
        isShowLocation: true,
        page: 1,
        shops: [],
        tabListData: [],
        specialBanner: [],
        gridList: []
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
        let that = this;
        if (that.data.isShow) {
            that.loadCb();
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        let that = this;
    },
    /**
     * 页面渲染完成
     */
    onReady () {
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
        let that = this;
        this.setData({
            noMore: false
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        let page = this.data.page;
        page++;
        this.getSpecialItemNear({page});
    },
    onPageScroll(options){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb(callback){
        let that = this;
        app.globalData.pages.indexPage = this;
        ApiService.getBanners().finally(res => {
                callback && callback();
                if (res.status === 1) {
                    that.setData({
                        banners: res.info
                    });
                }
            }
        );
        ApiService.getSpecialBanner().finally(res => {
                if (res.status === 1) {
                    let data = {};
                    that.setData({
                        [`specialBanner`]: res.info
                    });
                }
            }
        );
    },
    /**
     * 获取所有专题商品列表分类名
     */
    getSpecialList(){
        let that = this;
        ApiService.getSpecialList().finally(res => {
                if (res.status === 1) {
                    that.setData({[`tabList`]: res.info});
                }
            }
        );
    },
    /**
     * 地理定位组件的回调
     * @param e
     */
    getLocationCallback(e){
        let that = this,
            value = e.detail;
        let city = app.globalData.city;
        that.setData({cityName: city.title});
        if (value.isUpdate) {
            that.getAppSpecialItem();
            if (!this.data.isPullDownRefresh) {
                util2.showLoading()
            }
            this.getSpecialItemNear({page: 1}).finally(res => {
                that.stopPullDownRefresh();
                util2.hideLoading(true);
            });
        }
    },
    /**
     * 获取专题list
     * @return {*}
     */
    getAppSpecialItem(){
        let that = this,
            azmLocationData = this.data.azmLocationData,
            lon = azmLocationData.lon || 0,
            lat = azmLocationData.lat || 0;
        return ApiService.getAppSpecialItem({lon, lat}).finally(res => {
                if (res.status === 1) {
                    that.setData({
                        [`tabListData`]: res.info
                    });
                }
            }
        )
    },
    getSpecialItemNear({page = 1, num = 10} = {}, callback){
        let that = this,
            pageData = that.data,
            {lon, lat} = this.data.azmLocationData;
        if (pageData.noMore) {
            that.setData({noMore: false});
        }
        return ApiService.getSpecialItemNear({
            p: page,
            num,
            lon: lon || 0,
            lat: lat || 0
        }).finally(res => {
                if (res.status === 1 && res.info && res.info.length > 0) {
                    if (page === 1) {
                        that.setData({
                            [`shops`]: [],
                            [`shops[${page - 1}]`]: res.info
                        });
                    } else {
                        that.setData({
                            [`shops[${page - 1}]`]: res.info
                        });
                    }
                    that.data.page = page;
                } else {
                    that.setData({noMore: true});
                }
                callback && callback();
            }
        )
    },
    showBannerLink(e){
        let link = e.currentTarget.dataset.link;
        if (link) {
            try {
                if (util2.regExpUtil.isUrlPath(link)) {
                    this.$route.push({path: "/pages/page/index", query: {token: link}});
                } else if (/^\/pages?/.test(link)) {
                    this.$route.push(link);
                }
            } catch (e) {

            }
        }
    },
    doSearch () {
        this.$route.push("/page/home/pages/search/index");
    },
    doCitySelect () {
        this.$route.push("/page/public/pages/city/index");
    },
    gotoTop () {
        wx.pageScrollTo({
            scrollTop: 0
        });
    }
};
Page(new utilPage(appPage, methods));