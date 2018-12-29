const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService/index"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page mine coupons',
        page: 1,
        noMore: false,
        coupons: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this,
            page = that.data.page;
        this.getCouponGetCouponsOfMine(page)
    },
};
const methods = {
    loadCb() {
        this.getCouponGetCouponsOfMine()
    },
    getCouponGetCouponsOfMine(p = 1, bol) {
        let that = this,
            setData = {};
        if (that.isGetCouponGetCouponsOfMine) return;
        this.isGetCouponGetCouponsOfMine = true;
        if (!bol) {
            util2.showLoading()
        }
        ApiService.getCouponGetCouponsOfMine({
            p
        }).finally(res => {
            this.isGetCouponGetCouponsOfMine = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                if (res.status === 1) {
                    let info = res.info;
                    if (info.length > 0) {
                        if (p === 1) {
                            setData[`coupons`] = [info]
                        } else {
                            setData[`coupons[${p - 1}]`] = info
                        }
                        setData[`page`] = p + 1;
                        setData.noMore = info.length !== 10;
                    } else if (info.length === 0) {
                        if (p > 1) {
                            setData[`page`] = p - 1;
                        }
                        setData.noMore = true;
                    }
                    that.setData(setData);
                } else {
                    util2.failToast(res.message || '加载失败')
                }
            }
        })
    },
    touse: function (e) {
        let item = e.currentTarget.dataset.item;
        wx.setStorageSync('shop_id', item.shop_id)
        if (item.shop_id) {

            this.$route.tab({
                path: '/page/tabBar/home/index',
            });
        }
    }
};

Page(new utilPage(appPage, methods));
