const app = getApp(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../../utils/ApiService'),
    config = require('../../../utils/config'),
    utilPage = require('../../../utils/utilPage'),
    c = require("../../../utils/common");
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page home',
        isShow: false,
        options: {},
        imageUrl: config.imageUrl,
        isShowLocation: true,
        page: 1,
        shops: [],
        tabListData: [],
        specialBanner: []
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
        ApiService.getBanners().then(
            res => {
                callback && callback();
                if (res.status == 1) {
                    that.setData({
                        banners: res.info
                    });
                }
            }
        );
        ApiService.getSpecialBanner().then(
            res => {
                if (res.status == 1) {
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
        ApiService.getSpecialList().then(
            res => {
                if (res.status == 1) {
                    let data = [
                        '美丽不OUT',
                        '美丽蜕变，只需一点',
                        '改变从头，愉悦在心',
                        '美丽，由新而生',
                        '指尖新时尚，秀出大不同',
                        '美于形，靓于型',
                        '装扮您的心灵的窗户',
                        '百变美丽，时尚有型',
                        '用心打造你的美',
                    ];
                    // for (let i = 0; res.info.length > i; i++) {
                    //     res.info[i].title_name = data[i];
                    //     that.getSpecialItem({id: res.info[i].id})
                    // }
                    that.setData({
                        [`tabList`]: res.info
                    });
                    // console.log(data);
                    // that.setData(data);
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
        if (value.isUpdate) {
            that.getAppSpecialItem();
            if (!this.data.isPullDownRefresh) {
                c.showLoading()
            }
            this.getSpecialItemNear({page: 1}).finally(res => {
                that.stopPullDownRefresh();
                c.hideLoading();
            });
        }
    },
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
            azmLocationData = this.data.azmLocationData;
        if (pageData.noMore) {
            that.setData({
                noMore: false
            });
        }
        return ApiService.getSpecialItemNear(
            {
                p: page,
                num,
                lon: azmLocationData.lon || 0,
                lat: azmLocationData.lat || 0
            }
        ).then(
            res => {
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
                    that.setData({
                        noMore: true
                    });
                }
                callback && callback();
            }
        )
    },
    onLoadIcon(e){
        let index = e.currentTarget.dataset.index
        let key = 'iconSize' + index
        let value = 'height:' + parseInt(e.detail.height * this.rate) + 'px;width:' + parseInt(e.detail.width * this.rate) + 'px'
        this.setData({
            [key]: value
        })
    },
    showPickUp(){
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/conpons/platform'
            })
        });
    },
    showBannerLink(e){
        let link = e.currentTarget.dataset.link;
        if (link) {
            try {
                if (link.indexOf('://') !== -1) { // if for http url
                    link = encodeURIComponent(link);
                    wx.navigateTo({
                        url: '/pages/page/index?token=' + link,
                    })
                } else {
                    wx.navigateTo({
                        url: link,
                    })
                }
            } catch (e) {

            }
        }
    },
    doSearch () {
        wx.navigateTo({
            url: '/page/home/pages/search/index',
        });
    },
    gotoTop () {
        wx.pageScrollTo({
            scrollTop: 0
        });
    }
};
Page(new utilPage(appPage, methods));