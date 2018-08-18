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
        useList: []
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
        that.getOrderCardUserecord();

        console.log(options, 546464654654654);

    },
    loadData() {

    },

    // 跳转到去点评
    gotoNote(e) {

        var item = e.currentTarget.dataset.item;

        if (item && item.order_info_id) {
            this.$route.push({
                path: '/pages/order/note',
                query: {
                    order_info_id: item.order_info_id
                }
            })
        }



    },

    // 跳转到我的点评
    gotoMynotes() {
        this.$route.push({
            path: '/pages/mine/mynotes'
        })
    },

    getOrderCardUserecord() {
        let that = this;
        var bill_id = this.data.options.bill_id;
        ApiService.getOrderCardUserecord({
            bill_id
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    useList: res.info
                })
            } else {

            }
        })
    }


};
Page(new utilPage(appPage, methods));