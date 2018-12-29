const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../utils/utilPage"),
    qrcode = require("../../../utils/qrcode.js"),
    config = require('../../../utils/config'),
    ApiService = require('../../../utils/ApiService/index');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page orderAll',
        items: [],
        qrcode: {
            img: '',
            hidden: true
        },
        is_login: true,
        rows: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        let that = this;
        var login = wx.getStorageSync('_loginStatus_');
        var is_login = this.data.is_login
        if (login === 1) {
            that.setData({
                is_login: true
            });

        } else {
            that.setData({
                is_login: false
            });
        }
        this.loadCb();
        console.log(is_login, 11111111111111);

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
    onPullDownRefresh() {
        let that = this;
        that.getOrderDataList().finally(() => {
            wx.stopPullDownRefresh();
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {

    },
    /**
     * 页面滚动
     * @param options
     */
    onPageScroll(options) {

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
    loadCb() {
        let that = this;
        that.getOrderDataList();
        that.getOrderList()
    },


    getOrderDataList() {
        let that = this;
        var is_login = this.data.is_login;
        return ApiService.getOrderDataList({}).finally(res => {
            if (res.status === 1) {
                that.setData({
                    items: res.info
                });
            } else {
                that.setData({
                    items: null
                });
            }
        })
    },
    payBill: function (e) {
        let that = this,
            id = e.currentTarget.dataset.id;
        if (that.isPayBill) return;
        util2.showLoading();
        that.isPayBill = true;
        ApiService.Payment.oldItemBuyNow({
            billId: id
        }).finally(res => {
            that.isPayBill = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                info.complete = function (res) {
                    if (res.errMsg === 'requestPayment:ok') {
                        this.$route.push('/pages/car/paySuccess');
                        that.refreshData();
                    } else if (res.errMsg === 'requestPayment:fail cancel') {
                        util2.failToast('取消支付');
                    } else {
                        util2.failToast(res.message || '支付失败');
                    }
                };
                wx.requestPayment(info);
            } else {
                util2.failToast(res.message || '支付失败')
            }
        })
    },
    // gotoOrderDetail(e) {
    //     console.log(e, 1411111111111);
    //     var id = e.currentTarget.dataset.item.id;
    //     this.$route.push({
    //         path: "/page/order/pages/orderDetail/index",
    //         query: {
    //             id: id
    //         }
    //     });
    // },
    gotoOrderDetail(e) {
        let item = e.currentTarget.dataset.item;
        // console.log(e, 1111111111111);
        this.$route.push({
            path: '/page/order/pages/orderDetail/index',
            query: {
                id: item.ids
            }
        });

        // if (item.is_refund == 1) {
        //     this.$route.push({
        //         path: '/pages/order/orderDetails/index',
        //         query: {
        //             id: item.order_info_id
        //         }
        //     });
        // } else {
        //     this.$route.push({
        //         path: '/page/order/pages/orderDetail/index',
        //         query: {
        //             id: item.ids
        //         }
        //     });
        // }
    },
    bindToLogin() {
        this.$route.push('/page/login/index');
    },
    gotoBillDetail(e) {
        console.log(e, 1411111111111);
        var bill_id = e.currentTarget.dataset.item.bill_id;
        this.$route.push({
            path: "/page/cardBag/pages/setDetails/index",
            query: {
                bill_id: bill_id
            }
        });
    },

    gotoPayDetail(e) {
        var id = e.currentTarget.dataset.item.id;
        this.$route.push({
            path: "/page/order/pages/buyDetail/index",
            query: {
                id: id
            }
        });
    },


    gotoShop(e) {
        var shop_id = e.currentTarget.dataset.item.shop_id;
        this.$route.push({
            path: "/page/payment/pages/payTheBill/index",
            query: {
                shop_id: shop_id
            }
        });
    },


    gotoShopItem(e) {
        var id = e.currentTarget.dataset.item.id;
        this.$route.push({
            path: "/page/shop/pages/goods/index",
            query: {
                id: id
            }
        });
    },


    NewitemButton(e) {
        var item_id = e.currentTarget.dataset.id;
        this.$route.push({
            path: '/page/payment/pages/itemPay/index',
            query: {
                item_id: item_id
            }
        });
    },
    gotoRemark(e) {
        let item = e.currentTarget.dataset.item;
        if (!item) return;
        this.$route.push({
            path: '/page/order/pages/diary/index',
            query: {
                order_info_id: item.order_info_id
            }
        });
    },

    gotoOrder(e) {
        var bill_id = e.currentTarget.dataset.item.bill_id;
        this.$route.push({
            path: "/page/cardBag/pages/myOrder/index",
            query: {
                bill_id: bill_id
            }
        });
    },

    touse(e) {
        console.log(e, 111111111111111111);
        var item = e.currentTarget.dataset.item;
        if (item.is_used == 0) {
            this.data.qrcode.hidden = false;
            var num = item.pwd || 'error';
            this.data.qrcode.order_no = e.currentTarget.dataset.order_no;
            this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, {
                'size': 300
            });
            this.data.qrcode.num = num.match(/.{4}/g).join(' ');
            this.setData({
                qrcode: this.data.qrcode
            });
        }
    },

    closeQrcode() {
        this.data.qrcode.hidden = true;
        this.setData({
            qrcode: this.data.qrcode
        });
    },
    getOrderList() {
        let that = this;
        ApiService.getOrderList({}).finally(res => {
            if (res.status === 1) {
                that.setData({
                    rows: res.info
                });

            }
        })
    }

};

Page(new utilPage(appPage, methods));
