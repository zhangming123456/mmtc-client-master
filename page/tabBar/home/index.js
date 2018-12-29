const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../../utils/ApiService/index'),
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
        gridList: [],
        shopInfo: [],
        current: 0
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
        this.getShopNewIndex();
        that.setData({current: 0});
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        let that = this;
        that.data.options = {};
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
        this.getShopNewIndex()


    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {

    },
    onPageScroll (options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {
        var shop_id = this.data.shopInfo.shop_id;
        var title = this.data.shopInfo.shop.shop_name;
        return {
            title: title,
            path: '/page/tabBar/home/index?shop_id=' + shop_id
        }

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let that = this,
            options = that.data.options;
    },


    // 获取店铺数据
    getShopNewIndex () {
        let that = this;
        let is_qrcode = 0;
        var shop_id = wx.getStorageSync('shop_id');
        let options = that.data.options;
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'shop_id') {
                    shop_id = kv[1];
                    is_qrcode = 1
                }
            }
        } else if (options.q) {
            let q = decodeURIComponent(options.q);
            if (q) {
                let _query = util2.queryString.parse(q).query;
                shop_id = _query.id
                is_qrcode = 1
            }
        } else if (options.shop_id) {
            shop_id = options.shop_id
        }
        ApiService.getShopNewIndex({
            shop_id,
            is_qrcode
        }).finally(res => {
            wx.stopPullDownRefresh()
            if (res.status === 1) {
                that.setData({
                    shopInfo: res.info
                });
                wx.setNavigationBarTitle({
                    title: res.info.shop.shop_name //页面标题为路由参数
                })
                wx.setStorageSync('shop_id', res.info.shop_id)
            }
        })
    },


    // 跳转到丽人商家
    gotoBusiness () {
        var lon = this.data.shopInfo.shop.lon;
        var lat = this.data.shopInfo.shop.lat;
        this.$route.push({
            path: "/page/home/pages/searchResult/index",
            query: {
                lon: lon,
                lat: lat
            }
        });
    },

    // 跳转到店铺介绍
    gotoShop () {
        var shop_id = this.data.shopInfo.shop_id;
        this.$route.push({
            path: "/page/shop/pages/home/index",
            query: {
                shop_id: shop_id
            }
        });
    },

    // 跳转到套卡详情
    gotoCardDetails (e) {
        var item = e.currentTarget.dataset.item;
        if (item && item.card_id) {
            this.$route.push({
                path: "/page/cardBag/pages/setDetails/index",
                query: {
                    card_id: item.card_id
                }
            });
        }
    },

    // 跳转到项目详情
    gotoShopDetails (e) {
        var item = e.currentTarget.dataset.item
        if (item && item.id) {
            this.$route.push({
                path: '/page/shop/pages/goods/index',
                query: {
                    id: item.id
                }
            })
        }
    },


    // 拨打电话
    Dialing () {
        debugger
        var service_phone = this.data.shopInfo.shop.telephone;
        wx.makePhoneCall({
            phoneNumber: service_phone //仅为示例，并非真实的电话号码
        });
    },

    // 导航到店
    showLocation (e) {
        if (this.data.shopInfo.shop) {
            let data = {
                latitude: parseFloat(this.data.shopInfo.shop.lat),
                longitude: parseFloat(this.data.shopInfo.shop.lon),
                name: this.data.shopInfo.shop.name,
                address: this.data.shopInfo.shop.address,
                scale: 28
            };
            wx.openLocation(data);
        }
    },

    // inco 跳转页面
    gotoUrl (e) {
        var url = e.currentTarget.dataset.item.mini_link;
        var shop_id = this.data.shopInfo.shop_id;
        if (url === '/pages/onlineBuy/index') {
            url = '/page/payment/pages/payTheBill/index'
        }
        this.$route.push({
            path: url,
            query: {
                shop_id: shop_id
            }
        })
    },

    // icon跳转项目
    gotoProjects (e) {
        var shop_id = this.data.shopInfo.shop_id;
        var category_id = e.currentTarget.dataset.item.mini_link;
        this.$route.push({
            path: '/page/shop/pages/projects/index',
            query: {
                shop_id: shop_id,
                category_id: category_id
            }
        })
    },

    doSearch () {
        var shop_id = this.data.shopInfo.shop_id;
        this.$route.push({
            path: '/page/home/pages/search/index',
            query: {
                shop_id: shop_id,
            }

        })
    },


    showBannerLink (e) {
        var link = e.currentTarget.dataset.link;
        if (link) {
            this.$route.push({
                path: '/page/webView/pages/h5/index',
                query: {
                    pathname: link,
                }

            })
        }
    },

    gotoActivity (e) {
        var link = e.currentTarget.dataset.link;
        if (link) {
            this.$route.push({
                path: '/page/webView/pages/h5/index',
                query: {
                    pathname: link,
                }

            })
        }
    }

};
Page(new utilPage(appPage, methods));
