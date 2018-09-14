const app = getApp(),
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService'),
    c = require("../../../../utils/common.js");

const appPage = {
    data: {
        text: "Page mmtcTabList",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        currentTab: 0,
        billDetail: {},
        qrcode: ''
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
    onReachBottom() {

    },

};
/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow,
            id = options.id;
        that.getOrderGetBillDetail(options.bill_id)

    },
    loadData() {

    },

    getOrderGetBillDetail(bill_id) {
        let that = this;

        ApiService.getOrderGetBillDetail({
            bill_id
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    billDetail: res.info,
                })
            }
        })
    },

    gotoMycard() {
        this.$route.push({
            path: '/page/cardBag/pages/myCard/index'
        })
    },

    makeCall() {
        let that = this;

        wx.makePhoneCall({
            phoneNumber: '4001848008' //仅为示例，并非真实的电话号码
        });

    },

    copyBtn(e) {
        var that = this;
        wx.setClipboardData({
            data: that.data.billDetail.order_no,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
    },
    gotoShop(){
        var item = this.data.billDetail.shop_id;
        this.$route.push({
            path: '/page/shop/pages/home/index',
            query: {
                shop_id: item
            }
        })
    }

};
Page(new utilPage(appPage, methods));