// pages/order/detail.js
const c = require("../../utils/common.js");
const qrcode = require("../../utils/qrcode.js");
var bill_id, trade_no;
let orderNumber = function (obj, type = 0) {
    // A:未支付 - 0  B:已支付 { 全部未使用：1，部分完成（含部分退款、部分已经写好日记与未使用）：2，全部使用：3，完成退款：4}
    var status = 0,
        flag = false;
    if (obj.payed == 1 && obj.order_type == 0) {
        if (obj.count > 0 && obj.count == obj.items.length) {
            if (obj.count_used == 0 && obj.count_refund == 0) {//全部未使用
                status = 1;
                if (type == 2) {
                    flag = true;
                }
            } else if (obj.count_used > 0 || obj.count_refund > 0 || obj.count_noted > 0) {
                status = 2;
                flag = true;
            } else if (obj.count_used == obj.count) {
                status = 3;
                if (type == 3)
                    flag = true;
            } else if (type == 0 || type == 1 || type == 4) {
                flag = true;
            }
            if (obj.count_refund == obj.count) {
                status = 4;
            }
        }
    }
    return {status: status, flag: flag};
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: {},
        qrcode: {
            img: '',
            hidden: true
        }
    },
    tonote: function (e) {
        var item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/order/note?oid=' + item.id + '&order_info_id=' + item.order_info_id
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options,4555555555555);
        
        let no = options.no;
        let url, postData;
        if (no) {
            url = '/api/order/getBillDetailByNo';
            trade_no = no;
            postData = {
                no: trade_no
            };
        } else {
            url = '/api/order/getBillDetailV2';
            bill_id = options.id;
            postData = {
                bill_id: bill_id
            };
        }
        c.showLoading();
        var that = this;
        c.get(url, postData, function (res) {
            c.hideLoading();
            if (res.status == 1) {
                res.info.status = orderNumber(res.info).status;
                that.setData({
                    data: res.info
                });
            }
        });
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
    showItemDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        if (id) {
            wx.navigateTo({
                url: '/pages/item/detail?id=' + id
            });
        }
    },
    touse: function (e) {
        var item = e.currentTarget.dataset.item;
        if (item.is_used == 0) {
            this.data.qrcode.hidden = false;
            var num = item.pwd || 'error';
            this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, {'size': 300});
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
    payBill: function () {
        var id = bill_id;
        let url, postData;
        if (id) {
            url = '/api/wx2/getPayInfoOfOrder';
            postData = {billId: id};
        } else {
            url = '/api/wx2/getPayInfoOfOrderByNo';
            postData = {no: trade_no};
        }
        c.showLoading();
        var that = this;
        c.get(url, postData, function (res) {
            c.hideLoading();
            if (res.status == 1) {
                var info = res.info;
                info.success = function (res) {
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
    cancelBill: function () {
        var id = bill_id;
        let url, postData;
        if (id) {
            url = '/api/order/cancelOrder';
            postData = {id: id};
        } else {
            url = '/api/order/cancelOrderByNo';
            postData = {no: trade_no};
        }
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定取消该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    c.showLoading();
                    c.get(url, postData, function (res) {
                        c.hideLoading();
                        if (res.status == 1) {
                            c.toast('取消订单成功');
                            wx.navigateBack();
                        }
                    });
                }
            }
        });
    },
    rmBill: function (e) {
        var id = bill_id;
        var that = this;
        let url, postData;
        if (id) {
            url = '/api/order/rmOrder';
            postData = {id: id};
        } else {
            url = '/api/order/rmOrderByNo';
            postData = {no: trade_no};
        }
        wx.showModal({
            title: '提示',
            content: '确定删除该订单吗?',
            success: function (res) {
                if (res.confirm) {
                    c.showLoading();
                    c.get(url, postData, function (res) {
                        c.hideLoading();
                        if (res.status == 1) {
                            if (id) {
                                c.excPrevPage('rmItemById', id);
                            }
                            wx.navigateBack();
                            c.toast('删除订单成功');
                        }
                    });
                }
            }
        });
    }
})