// pages/home/index.js
const app = getApp(),
    util = app.util,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService'),
    c = require("../../utils/common.js");
var page = 1;
const appPage = {
    data: {
        text: "page cardBag MyCard",
        cardList: [],
        shop: {},
        discount: '',
        discountAreaWidth: 0,
        items: [],
        coupons: [],
        ShopcardList: []
    },
    onLoad: function (options, callback) {
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
        this.noMore = false;
        this.onLoad(null, function () {
            wx.stopPullDownRefresh();
        });
    },
    /**
     * 上拉触底
     */
    onReachBottom() {
        // load more
        page++;
        var that = this;
        if (that.isLoading || that.noMore) {
            return;
        }
        that.isLoading = true;
        that.setData({
            loadingMore: true
        });
        ApiService.getHomeIndex({
            p: page,
            shop_id: this.shop_id
        }).then(res => {
            that.isLoading = false;
            if (res.status == 1) {
                var setData = {};
                if (res.info.items.length < c.getPageSize()) {
                    setData.noMore = true;
                    that.noMore = true;
                }
                that.data.items = that.data.items.concat(res.info.items);
                setData.items = that.data.items;
                that.setData(setData);
            }
        });
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
            options = that.data.options;
        if (options) {
            if (options.scene) {
                var scene = decodeURIComponent(options.scene)
                if (scene) {
                    let kv = scene.split(':');
                    if (kv[0] == 'shop_id') {
                        options.shop_id = kv[1];
                    }
                }
            }
            this.shop_id = options.shop_id;
        }
        c.showLoading();
        page = 1;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var lat = res.latitude
                var lon = res.longitude
                c.get("/api/wx2/index", {
                    shop_id: that.shop_id,
                    lat: lat,
                    lon: lon
                }, function (res) {
                    c.hideLoading();
                    if (res.status == 1) {
                        var info = res.info;
                        info.shop.id = that.shop_id;
                        that.data.shop = info.shop;
                        wx.setNavigationBarTitle({
                            title: info.shop.shop_name
                        });
                        var reduce_discount, str;
                        if (info.shop.discount_type == 1) {
                            str = [{
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
                                        text: info.shop.discount
                                    }]
                                }, {
                                    type: 'text',
                                    text: '折'
                                }]
                            }];
                        } else {
                            var v = info.shop.discount.split(':');
                            reduce_discount = {
                                count_money: parseInt(v[0]) || 0,
                                reduce_money: parseInt(v[1]) || 0,
                                max_reduce: parseInt(v[2]) || 0,
                                repeated: parseInt(v[3]) || 0
                            };
                            str = '<span class="color-red">' + (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + ' </span>';
                        }
                        that.data.discount = str;
                        that.data.items = info.items;
                        var noMore = false;
                        if (info.items.length < c.getPageSize()) {
                            noMore = true;
                            that.noMore = true;
                        }
                        that.data.coupons = info.coupons;
                        that.data.discountAreaWidth = 350 * (that.data.coupons.length +
                            1) + 60;
                        that.setData({
                            discount: str,
                            noMore: noMore,
                            shop: that.data.shop,
                            coupons: that.data.coupons,
                            discountAreaWidth: that.data.discountAreaWidth,
                            items: that.data.items
                        });
                    }
                });
            }
        });
        that.getOrderCardShopcard();
    },
    loadData() {

    },
    showLocation: function (e) {
        if (this.data.shop) {
            let data = {
                latitude: parseFloat(this.data.shop.lat_new),
                longitude: parseFloat(this.data.shop.lon_new),
                name: this.data.shop.shop_name,
                address: this.data.shop.address,
                scale: 28
            };
            wx.openLocation(data);
        }
    },

    gotoCardDetails(e) {
        console.log(e, 12222222222222222);
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
    showCouponDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        if (id) {
            wx.navigateTo({
                url: '/pages/conpons/index?id=' + id,
            });
        }
    },
    showShopDetail: function () {
        wx.navigateTo({
            url: 'detail?shop_id=' + this.shop_id
        });
    },
    gotoBuy: function () {
        wx.navigateTo({
            url: '/pages/onlineBuy/index?shop_id=' + this.shop_id,
        })
    },


    getOrderCardShopcard() {
        let that = this,
            shop_id = this.shop_id;
        ApiService.getOrderCardShopcard({
            shop_id
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    ShopcardList: res.info
                })
            }
        })
    }
}

Page(new utilPage(appPage, methods));