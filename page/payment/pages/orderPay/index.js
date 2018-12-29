const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index');

Page(new utilPage(
    {
        /**
         * 页面的初始数据
         */
        data: {
            order_no: null,
            money: null
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
            let that = this;
            that.loadCb();
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },
        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

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
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },
        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },
    },
    {
        loadCb () {
            let options = this.data.options;
            this.setData({order_no: options.order_no, money: options.money});
        },
        gobuyNow: function () {
            let that = this;
            let order_no = this.data.order_no;
            if (!order_no) return;
            util2.showLoading('支付中...');
            ApiService.Payment.payTheBill({order_no}).finally(res => {
                if (res.status === 1) {
                    let info = res.info.payInfo;
                    info.success = function () {
                        that.$route.replace('/pages/car/paySuccess');
                    };
                    info.fail = function () {
                        util2.failToast('支付失败');
                    };
                    wx.requestPayment(info);
                } else {
                    util2.failToast(res.message || '支付失败');
                }
            });
        }
    })
);
