const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index');
const appPage = {
    data: {
        text: "Page mmtcTabList",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        currentTab: 0,
        // input默认是1
        num: 1,
        // 使用data数据对象设置样式名
        minusStatus: 'disabled',
        info: {},
        invite_id: ''
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {

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
    },
    /**
     * 上拉触底
     */
    onReachBottom () {

    },

};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow,
            id = options.id,
            invite_id = options.invite_id;
        that.setData({
            info: {
                nickname: options.nickname,
                cover: options.cover,
                card_id: options.card_id,
                price: options.price,
                market_price: options.market_price
            },
            invite_id
        })
    },
    loadData () {

    },
    /* 点击减号 */
    bindMinus: function () {
        var num = this.data.num;
        if (num > 1) {
            num--;
        }
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        this.setData({
            num: num,
            minusStatus: minusStatus
        });
    },
    /* 点击加号 */
    bindPlus: function () {
        var num = this.data.num;
        num++;
        var minusStatus = num < 1 ? 'disabled' : 'normal';
        this.setData({
            num: num,
            minusStatus: minusStatus
        });
    },
    /* 输入框事件 */
    bindManual: function (e) {
        var num = e.detail.value;
        this.setData({
            num: num
        });
    },
    bindpay () {
        let that = this,
            invite_id = that.data.invite_id,
            info = that.data.info,
            card_id = info.card_id,
            num = that.data.num;
        if (num > 0 && card_id && !that.isBindPay) {
            that.isBindPay = true;
            util2.showLoading('支付中。。。');
            ApiService.Payment.cardsBuyNow({card_id, num, invite_id}).finally(res => {
                if (res.status === 1) {
                    let info = res.info;
                    try {
                        let payInfo = info.payInfo,
                            billId = info.billId,
                            no = info.no;
                        payInfo.complete = function (res) {
                            that.isBindPay = false;
                            util2.hideLoading(true);
                            if (res.errMsg === 'requestPayment:ok') {
                                that.$route.replace({
                                    path: '/page/public/pages/paySucceed/index',
                                    query: {
                                        bill_id: billId
                                    }
                                })
                            } else if (res.errMsg === 'requestPayment:fail cancel') {
                                util2.failToast('取消支付');
                            } else {
                                util2.failToast(res.message || '支付失败');
                            }
                        };
                        wx.requestPayment(payInfo);
                    } catch (err) {
                        that.isBindPay = false;
                        util2.hideLoading(true);
                        util2.failToast(res.message || '支付失败')
                    }
                } else {
                    that.isBindPay = false;
                    util2.hideLoading(true);
                    util2.failToast(res.message || '支付失败')
                }
            })
        }
    }
};
Page(new utilPage(appPage, methods));
