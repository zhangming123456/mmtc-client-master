const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../utils/utilPage"),
    qrcode = require("../../../utils/qrcode.js"),
    config = require('../../../utils/config'),
    ApiService = require('../../../utils/ApiService');
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
        this.getOrderDataList({type}, true).finally(res => {
            wx.stopPullDownRefresh();
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        let that = this,
            type = that.data.type,
            page = that.data.page[type];
        this.getOrderDataList({type, p: page})
    },
    /**
     * 页面滚动
     * @param options
     */
    onPageScroll(options){
        if (options.scrollTop > 300) {
            if (!this.data.showGotoTop) {
                this.setData({showGotoTop: true});
            }
        } else {
            if (this.data.showGotoTop) {
                this.setData({showGotoTop: false});
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
        this.getOrderDataList({type});
    },
    loadData(){

    },
    refreshData(){
        wx.startPullDownRefresh();
    },

    /**
     * 获取全部与其他订单列表
     * @param type
     * @param p
     * @param bol
     * @returns {Promise.<TResult>}
     */
    getOrderDataList({type = 0, p = 1} = {}, bol){
        let that = this,
            setData = {};
        if (that.isGetOrderDataList)return;
        that.isGetOrderDataList = true;
        if (!bol) {
            util2.showLoading();
        }
        return ApiService.getOrderDataList({type, p}).finally(res => {
                that.isGetOrderDataList = false;
                util2.hideLoading(true);
                if (res.status === 1) {
                    let info = res.info;
                    if (info.length > 0) {
                        if (p === 1) {
                            setData[`items[${type}]`] = [info]
                        } else {
                            setData[`items[${type}][${p - 1}]`] = info
                        }
                        setData[`page[${type}]`] = p + 1;
                        setData.noMore = info.length !== 10;
                    } else if (info.length === 0) {
                        if (p > 1) {
                            setData[`page[${type}]`] = p - 1;
                        }
                        setData.noMore = true;
                    }
                    that.setData(setData);
                } else {
                    util2.failToast(res.message || '加载失败')
                }
            }
        )
    },

    /**
     * 获取退款订单列表
     * @param p
     * @param bol
     * @returns {Promise.<TResult>}
     */
    getRefundData({p = 1}, bol) {
        let that = this,
            setData = {}, type = 4;
        if (that.isGetRefundData)return;
        that.isGetRefundData = true;
        if (!bol) {
            util2.showLoading();
        }
        return ApiService.getRefundData({p}).finally(res => {
                that.isGetRefundData = false;
                util2.hideLoading(true);
                if (res.status === 1) {
                    let info = res.info;
                    if (info.length > 0) {
                        if (p === 1) {
                            setData[`items[${type}]`] = [info]
                        } else {
                            setData[`items[${type}][${p - 1}]`] = [info]
                        }
                        setData[`page[${type}]`] = p + 1;
                        setData.noMore = info.length !== 10;
                    } else if (info.length === 0) {
                        if (p > 1) {
                            setData[`page[${type}]`] = p - 1;
                        }
                        setData.noMore = true;
                    }
                    that.setData(setData);
                } else {
                    util2.failToast(res.message || '加载失败')
                }
            }
        )
    },

    /**
     * 生产二维码（消费码）
     * @param e
     */
    touse: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.is_used == 0) {
            this.data.qrcode.hidden = false;
            var num = item.pwd || 'error';
            this.data.qrcode.order_no = e.currentTarget.dataset.order_no;
            this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, {'size': 300});
            this.data.qrcode.num = num.match(/.{4}/g).join(' ');
            this.setData({qrcode: this.data.qrcode});
        }
    },

    closeQrcode: function () {
        this.data.qrcode.hidden = true;
        this.setData({qrcode: this.data.qrcode});
    },

    setType: function (e) {
        let type = e.target.dataset.type,
            page = this.data.page,
            p = page[type];
        this.setData({type});
        this.getOrderDataList({type, p: p > 0 ? p : 1});
    },

    /**
     * 取消订单
     * @param e
     */
    cancelBill: function (e) {
        let that = this,
            type = that.data.type,
            id = e.currentTarget.dataset.id;
        if (that.isCancelled)return;
        wx.showModal({
            title: '提示',
            content: '确定取消该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    util2.showLoading();
                    that.isCancelled = true;
                    ApiService.cancelOrder({id}).finally(res => {
                        that.isCancelled = false;
                        util2.hideLoading(true);
                        if (res.status === 1) {
                            util2.showToast('取消订单成功');
                            that.refreshData();
                        } else {
                            util2.failToast(res.message)
                        }
                    })
                }
            }
        });
    },

    /**
     * 删除订单
     * @param e
     */
    rmBill: function (e) {
        let that = this,
            id = e.currentTarget.dataset.id;
        if (that.isRmBill)return;
        wx.showModal({
            title: '提示',
            content: '确定删除该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    that.isRmBill = true;
                    util2.showLoading();
                    ApiService.deleteOrder({id}).finally(res => {
                        that.isRmBill = false;
                        util2.hideLoading(true);
                        if (res.status === 1) {
                            util2.showToast('删除订单成功');
                            that.refreshData();
                        } else {
                            util2.failToast(res.message || '删除订单失败')
                        }
                    });
                }
            }
        });
    },
    /**
     * 再付款
     * @param e
     */
    payBill: function (e) {
        let that = this,
            id = e.currentTarget.dataset.id;
        if (that.isPayBill)return;
        util2.showLoading();
        that.isPayBill = true;
        ApiService.wx2getPayInfoOfOrder({billId: id}).finally(res => {
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
    /**
     * 查看日记
     * @param e
     */
    tonote: function (e) {
        let item = e.currentTarget.dataset.item;
        if (!item)return;
        this.$route.push({path: '/pages/order/note', query: {oid: item.id, order_info_id: item.order_info_id}});
    },
    showBuyOrderDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (!id)return;
        this.$route.push({path: '/pages/order/buyDetail', query: {id}});
    },
    goOrderDetail(e){
        let item = e.currentTarget.dataset.item;
        if (!item)return;
        if (item.is_refund == 1) {
            this.$route.push({path: '/pages/order/orderDetails/index', query: {id: item.order_info_id}});
        } else {
            this.$route.push({path: '/pages/order/detail', query: {id: item.id}});
        }
    },
    buyagain: function (e) {
        let item = e.currentTarget.dataset.item;
        if (!item)return;
        this.$route.push({path: '/pages/item/detail', query: {id: item.id}});
    },
    gotoTop: function () {
        wx.pageScrollTo({scrollTop: 0});
    },
    toCardDetail(e){
        let data = e.currentTarget.dataset.item;
        if (!data)return;
        let item = {
            nickname: data.shop_name,
            shop_id: data.shop_id,
            shop_id: data.shop_id,
            bill_id: data.id,
            card_name: data.card_name,
            card_no: data.card_no
        }
        this.$route.push({path: '/page/cardBag/pages/myOrder/index', query: item})
    }
};

Page(new utilPage(appPage, methods));