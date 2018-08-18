const c = require("../../utils/common.js");
let histories;
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        histories = c.getStorage('histories') || [];
        this.setData({
            histories: histories
        });
        c.showLoading();
        let that = this;
        c.get('/api/keywords/getData', function (ret) {
            c.hideLoading();
            if (ret.status == 1) {
                that.setData({
                    searches: ret.info
                });
            }
        });
    },
    refreshHistories(){
        histories = c.getStorage('histories') || [];
        this.setData({
            histories: histories
        });
    },
    doSearch(e) {
        let value = e.detail.value.trim();
        if (value) {
            histories.every(function (el, idx) {
                if (el.title == value) {
                    histories.splice(idx, 1);
                    return false;
                }
                return true;
            });
            histories.unshift({title: value});
            if (histories.length > 20) {
                histories = histories.slice(0, 20);
            }
            this.setData({
                histories: histories
            });
            c.setStorage('histories', histories);
            wx.navigateTo({
                url: '/pages/loc/searchResult?w=' + encodeURIComponent(value),
            })
        }
    },
    cancelSearch() {
        wx.navigateBack();
    },
    clearHistory() {
        c.removeStorage('histories');
        this.setData({
            histories: histories = []
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
    showResult(e) {
        let item = e.currentTarget.dataset.item;
        if (item.link) {
            wx.navigateTo({
                url: '/pages/page/index?token=' + encodeURIComponent(item.link)
            });
        } else {
            wx.navigateTo({
                url: '/pages/loc/searchResult?w=' + encodeURIComponent(item.title),
            });
        }
    }
})