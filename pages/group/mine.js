const c = require("../../utils/common.js");
const qrcode = require("../../utils/qrcode.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        qrcode: {
            img: '',
            hidden: true
        }
    },
    showGoodDetail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/group/orderdetail?id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.$vm = c.listGrid(this, {
            url: '/api/group/items'
        }).loadData();
    },
    toggleType(e){
        let id = e.currentTarget.dataset.id;
        this.$vm.setParam('type', id).loadData();
        this.setData({
            type: id
        });
    },
    closeQrcode: function () {
        this.data.qrcode.hidden = true;
        this.setData({
            qrcode: this.data.qrcode
        });
    },
    tonote: function (e) {
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/order/note?oid=' + item.id + '&order_info_id=' + item.order_info_id
        });
    },
    touse(e){
        var item = e.currentTarget.dataset.item;
        this.data.qrcode.hidden = false;
        var num = item.pwd || 'error';
        this.data.qrcode.order_no = item.order_no;
        this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, {'size': 300});
        this.data.qrcode.num = num.match(/.{4}/g).join(' ');
        this.setData({
            qrcode: this.data.qrcode
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
        this.$vm.loadMore();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
    },
    noop(){

    }
})