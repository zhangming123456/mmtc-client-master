const app = getApp(),
    util2 = app.util2,
    ApiService = require("../../../../utils/ApiService"),
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");

let histories;
const appPage = {
    data: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {
        let that = this;
        if (that.data.isShow) {
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        let that = this;
    },
    /**
     * 页面渲染完成
     */
    onReady () {
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {
        let that = this
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
    },
    onPageScroll(options){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
}
const methods = {
    loadCb () {
        let that = this;
        histories = wx.getStorageSync('histories') || [];
        this.setData({histories: histories});
        that.getKeywordsGetData()
    },
    getKeywordsGetData(){
        let that = this;
        util2.showLoading();
        ApiService.getKeywordsGetData().finally(res => {
            util2.hideLoading(true);
            if (res.status === 1) {
                that.setData({
                    searches: res.info
                });
            }
        })
    },
    refreshHistories(){
        histories = wx.getStorageSync('histories') || [];
        this.setData({histories: histories});
    },
    doSearch(e) {
        let value = util2.trim(e.detail.value);
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
            this.setData({histories: histories});
            wx.setStorageSync('histories', histories);
            this.$route.push({path: "/pages/loc/searchResult", query: {w: value}});
        }
    },
    cancelSearch() {
        this.$route.back();
    },
    clearHistory() {
        wx.removeStorageSync('histories');
        this.setData({histories: histories = []});
    },
    showResult(e) {
        let item = e.currentTarget.dataset.item;
        if (item && item.link) {
            this.$route.push({path: "/pages/page/index", query: {token: item.link}});
        } else {
            this.$route.push({path: "/pages/loc/searchResult", query: {w: item.title}});
        }
    }
}

Page(new utilPage(appPage, methods));