const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index');
let $wxParse = require('../../../../wxParse/wxParse');

const appPage = {
    data: {
        text: "page shop home",
        cardList: [],
        shop: {},
        discount: '',
        discountAreaWidth: 0,
        items: [],
        page: 1,
        shopItems: [],
        coupons: [],
        ShopcardList: [],
        shopOpen: false
    },
    onLoad: function () {
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
    onReady: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        this.getShopNewDetail()
        wx.stopPullDownRefresh()
    },
    /**
     * 上拉触底
     */
    onReachBottom() {
        let that = this,
            page = that.data.page;

    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options) {

    }
}
const methods = {
    async loadCb() {
        let that = this,
            options = that.data.options,
            shop_id = options.shop_id;
        this.getShopNewDetail()
    },
    // 获取店铺介绍数据
    getShopNewDetail(

    ) {
        let that = this;
        var shop_id = this.data.options.shop_id;
        var lat = wx.getStorageSync('lat');
        var lon = wx.getStorageSync('lon');
        ApiService.getShopNewDetail({
            shop_id,
            lat,
            lon
        }).finally(res => {
            if (res.status === 1) {
                let info = res.info;
                that.setData({
                    shop: res.info
                });
                $wxParse.wxParse('intro', 'html', res.info.shop.intro, that)
            }
        })
    },


    open() {
        var shopOpen = this.data.shopOpen;
        this.setData({
            shopOpen: !shopOpen
        });
    },

    // 跳转到首页
    gotoHome() {
        let shop_id = this.data.shop.shop.shop_id;
        wx.setStorageSync('shop_id', shop_id)
        this.$route.tab({
            path: "/page/tabBar/home/index"

        })
    },

    // 拨打电话
    Dialing() {
        var service_phone = this.data.shop.shop.telephone;
        wx.makePhoneCall({
            phoneNumber: service_phone //仅为示例，并非真实的电话号码
        });
    },

    // 导航到店
    showLocation(e) {
        if (this.data.shop.shop) {
            let data = {
                latitude: parseFloat(this.data.shop.shop.lat),
                longitude: parseFloat(this.data.shop.shop.lon),
                name: this.data.shop.shop.name,
                address: this.data.shop.shop.address,
                scale: 28
            };
            console.log(data);
            wx.openLocation(data);
        }
    },

    // 买单
    gotoBuy() {
        let shop_id = this.data.options.shop_id
        if (shop_id) {
            this.$route.push({
                path: '/page/payment/pages/payTheBill/index',
                query: {
                    shop_id
                }
            })
        }
    },


    // 关注店铺
    follow(shop_id) {
        let that = this;
        var shop_id = this.data.options.shop_id;
        ApiService.getFollow({
            shop_id
        }).finally(res => {
            if (res.status === 1) {
                wx.showToast({
                    title: res.info,
                    icon: 'none',
                    duration: 2000,
                })
                that.setData({
                    ['shop.follow_shop']: !that.data.shop.follow_shop ? 1 : 0
                })
            }
        })
    },


    gotoAlbum() {
        let shop_id = this.data.shop.shop.shop_id;
        this.$route.push({
            path: '/page/shop/pages/shopAlbum/index',
            query: {
                shop_id
            }
        })
    }

}

Page(new utilPage(appPage, methods));
