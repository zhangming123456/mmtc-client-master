// pages/home/index.js
const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
var page = 1;
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
        ShopcardList: []
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
    onReady: function () {
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        this.getHomeIndex(1, true).finally(res => {
            wx.stopPullDownRefresh();
        });
    },
    /**
     * 上拉触底
     */
    onReachBottom() {
        let that = this, page = that.data.page;
        this.getHomeIndex(page)
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
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'shop_id') {
                    shop_id = kv[1];
                }
            }
        }
        if (shop_id) {
            this.data.shop_id = shop_id;
            that.getHomeIndex();
            that.getOrderCardShopcard();
        } else {
            that.$route.back()
        }
    },
    async getHomeIndex(p = 1, bol){
        let that = this, lat, lon,
            shop_id = that.data.shop_id;
        if (that.isLoading || that.data.noMore) {
            return;
        }
        that.isLoading = true;
        that.setData({loadingMore: true});
        await util2.getLocation().finally(res => {
            if (res.status === 1) {
                let info = res.info;
                lat = info.latitude;
                lon = info.longitude;
            }
        });
        if (!bol) {
            util2.showLoading();
        }
        await ApiService.getHomeIndex({shop_id, lat, lon, p}).finally(res => {
            that.isLoading = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let setData = {};
                let items = res.info.items;
                if (items.length > 0) {
                    if (p === 1) {
                        setData[`shopItems`] = [items]
                    } else {
                        setData[`shopItems[${p - 1}]`] = items
                    }
                    setData[`page`] = p + 1;
                    setData.noMore = items.length !== 10;
                } else if (items.length === 0) {
                    if (p > 1) {
                        setData[`page`] = p - 1;
                    }
                    setData.noMore = true;
                }
                if (p > 1) {
                    that.setData(setData)
                } else {
                    that.setHomeData(res.info, setData)
                }
            }
        });
    },
    /**
     * 卡包使用记录
     */
    getOrderCardShopcard() {
        let that = this,
            shop_id = this.data.shop_id;
        ApiService.getOrderCardShopcard({shop_id}).finally(res => {
            if (res.status === 1) {
                that.setData({ShopcardList: res.info})
            }
        })
    },
    setHomeData(info = {}, setData = {}){
        let that = this;
        let shop = info.shop;
        wx.setNavigationBarTitle({
            title: shop.shop_name
        });
        let reduce_discount, str;
        if (shop.discount_type == 1) {
            str = [
                {
                    name: 'div',
                    attrs: {
                        class: 'ib'
                    },
                    children: [{
                        name: 'span',
                        attrs: {
                            class: 'discount0'
                        },
                        children: [{
                            type: 'text',
                            text: shop.discount
                        }
                        ]
                    },
                        {
                            type: 'text',
                            text: '折'
                        }]
                }];
        } else {
            let v = shop.discount.split(':');
            reduce_discount = {
                count_money: parseInt(v[0]) || 0,
                reduce_money: parseInt(v[1]) || 0,
                max_reduce: parseInt(v[2]) || 0,
                repeated: parseInt(v[3]) || 0
            };
            str = '<span class="color-red">' + (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + ' </span>';
        }
        let noMore = false;
        that.setData(Object.assign(setData, {
            discount: str,
            noMore,
            shop,
            coupons: info.coupons,
            discountAreaWidth: 350 * (info.coupons.length + 1) + 60
        }));
    },
    showLocation(e) {
        let shop = this.data.shop;
        if (shop) {
            let data = {
                latitude: shop.lat_new,
                longitude: shop.lon_new,
                name: shop.shop_name,
                address: shop.address,
                scale: 28
            };
            wx.openLocation(data);
        }
    },
    gotoCardDetails(e) {
        let item = e.currentTarget.dataset.item
        if (item && item.card_id) {
            this.$route.push({
                path: '/page/cardBag/pages/setDetails/index',
                query: {
                    card_id: item.card_id
                }
            })
        }
    },
    showCouponDetail (e) {
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: '/pages/conpons/index', query: {id}})
        }
    },
    showShopDetail () {
        let shop_id = this.data.shop_id
        if (shop_id) {
            this.$route.push({path: '/page/shop/pages/detail/index', query: {shop_id}})
        }
    },
    gotoBuy () {
        let shop_id = this.data.shop_id
        if (shop_id) {
            this.$route.push({path: '/pages/onlineBuy/index', query: {shop_id}})
        }
    },
}

Page(new utilPage(appPage, methods));