// pages/order/all.js
const app = getApp(),
    c = require("../../utils/common.js"),
    utilPage = require("../../utils/utilPage"),
    qrcode = require("../../utils/qrcode.js"),
    config = require('../../utils/config'),
    ApiService = require('../../utils/ApiService');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page orderAll',
        isShow: false,
        isEmpty: false,
        noMore: false,
        type: 0,
        page: [1, 1, 1, 1],
        items: [],
        loaded: 0,
        reData: [], 
        qrcode: {
            img: '',
            hidden: true
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        if (this.data.isShow) {
            let that = this,
                type = that.data.type,
                page = that.data.page[type];
            this.loadData({type, p: page});
        }
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
    onPullDownRefresh () {
        let type = this.data.type;
        this.loadData({type});
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        let that = this,
            type = that.data.type,
            page = that.data.page[type];
        page++;
        this.loadData({type, p: page})
    },
    /**
     * 页面滚动
     * @param options
     */
    onPageScroll(options){
        if (options.scrollTop > 300) {
            if (!this.data.showGotoTop) {
                this.setData({
                    showGotoTop: true
                });
            }
        } else {
            if (this.data.showGotoTop) {
                this.setData({
                    showGotoTop: false
                });
            }
        }
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
    loadCb(){
        let type = this.data.options.type || 0;
        let hasLogined = c.hasLoginSync();
        if (!hasLogined) {
            wx.switchTab({
                url: '/pages/index/index'
            });
            return;
        } else {
            this.loadData({type});
        }
    },
    loadData({type = 0, p = 1}){
        let that = this,
            loaded = this.data.loaded;
        if (loaded) return;
        that.setData({noMore: false});
        app.globalData.pages.billpage = this;

        that.getOrderDataList({type, p}).finally(() => {
            that.data.loaded = false;
            wx.stopPullDownRefresh()
        });
    },

    /**
     * 获取全部与其他订单列表
     * @param type
     * @param p
     * @returns {Promise.<TResult>}
     */
    getOrderDataList({type = 0, p = 1} = {}){
        let that = this;
        if (p == 1) {
            that.setData({
                [`items[${type}]`]: []
            })
        }
        return ApiService.getOrderDataList({type, p}).then(
            res => {
                let data = {};
                if (res.status === 1 && res.info.length > 0) {
                    data = {
                        [`page[${type}]`]: p,
                        [`items[${type}][${p - 1}]`]: res.info
                    };
                    data.noMore = false;
                } else {
                    data.noMore = true;
                }
                that.setData(data)
            }
        )
    },

    /**
     * 获取退款订单列表
     * @param p
     * @returns {Promise.<TResult>}
     */
    getRefundData({p}) {
        let that = this;
        if (p === 1) {
            that.setData({
                [`items[4]`]: []
            })
        }
        return ApiService.getRefundData({p}).then(
            res => {
                if (res.status === 1 && res.info.length > 0) {
                    that.setData({
                        [`page[4]`]: p,
                        items: res.info
                    });
                }
            }
        )
    },

    rmItemById: function (id) {
        var that = this;
        var founded = false;
        for (var i = 0; i < that.data.items.length; i++) {
            if (that.data.items[i].id == id) {
                that.data.items.splice(i, 1);
                founded = true;
                break;
            }
        }
        founded &&
        that.setData({
            items: that.data.items
        });
    },

    touse: function (e) {
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

    closeQrcode: function () {
        this.data.qrcode.hidden = true;
        this.setData({
            qrcode: this.data.qrcode
        });
    },

    setType: function (e) {
        let type = e.target.dataset.type,
            page = this.data.page;
        this.setData({type});
        this.loadData({type, p: page[type - 1]});
    },


    cancelBill: function (e) {
        var id = e.target.dataset.id;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定取消该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    c.showLoading();
                    c.get('/api/order/cancelOrder', {
                        id: id
                    }, function (res) {
                        c.hideLoading();
                        if (res.status == 1) {
                            for (var i = 0; i < that.data.items.length; i++) {
                                if (that.data.items[i].id == id) {
                                    that.data.items[i].is_cancelled = 1;
                                    break;
                                }
                            }
                            that.setData({
                                items: that.data.items
                            });
                            c.toast('取消订单成功');
                        }
                    });
                }
            }
        });
    },

    rmBill: function (e) {
        var id = e.target.dataset.id;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    c.showLoading();
                    c.get('/api/order/rmOrder', {
                        id: id
                    }, function (res) {
                        c.hideLoading();
                        if (res.status == 1) {
                            for (var i = 0; i < that.data.items.length; i++) {
                                if (that.data.items[i].id == id) {
                                    that.data.items.splice(i, 1);
                                    break;
                                }
                            }
                            that.setData({
                                items: that.data.items
                            });
                            c.toast('删除订单成功');
                        }
                    });
                }
            }
        });
    },

    tonote: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/order/note?oid=' + item.id + '&order_info_id=' + item.order_info_id
        });
    },

    showBuyOrderDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/order/buyDetail?id=' + id,
        })
    },
    goOrderDetail(e){
        let item = e.currentTarget.dataset.item;
        // /pages/order/orderDetails/index?id={{bill.id}}
        if (item.is_refund == 1) {
            app.util.go('/pages/order/orderDetails/index', {
                data: {
                    id: item.order_info_id,
                    success(){

                    }
                }
            })
        } else {
            app.util.go('/pages/order/detail', {data: {id: item.id}})
        }
    },

    buyagain: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/item/detail?id=' + item.id,
        });
    },

    payBill: function (e) {
        var id = e.currentTarget.dataset.id;
        c.showLoading();
        var that = this;
        c.get('/api/wx2/getPayInfoOfOrder', {
            billId: id
        }, function (res) {
            c.hideLoading();
            if (res.status == 1) {
                var info = res.info;
                info.success = function (res) {
                    for (var i = 0; i < that.data.items.length; i++) {
                        that.data.items[i].payed = 1;
                    }
                    that.setData({
                        items: that.data.items
                    });
                    wx.redirectTo({
                        url: '/pages/car/paySuccess',
                    });
                };
                info.fail = function (res) {

                };
                wx.requestPayment(info);
            } else {
                c.toast(res.info);
            }
        });
    },
    gotoTop: function () {
        wx.pageScrollTo({
            scrollTop: 0
        });
    }
};

Page(new utilPage(appPage, methods));