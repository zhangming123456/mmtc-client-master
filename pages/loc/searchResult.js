const c = require("../../utils/common.js");
let urls = ['/api/item/search', '/api/shop/searchAll', '/api/note/search'];
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.type === undefined) {
            options.type = 1;
        }
        let type = parseInt(options.type || 0);
        let kw = decodeURIComponent(options.w);
        this.setData({
            type: type,
            kw: kw
        });
        let that = this;
        c.showLoading();
        c.getLocation(function (res) {
            let lat = res.latitude;
            let lon = res.longitude;
            that.$vm = c.listGrid(that, {
                url: urls[type]
            }).setParams({
                kw: kw,
                city_id: c.getCity('id', 1),
                lon: lon,
                lat: lat
            }).loadData();
        });
    },
    doSearch: function (e) {
        let value = e.detail.value.trim();
        if (value) {
            let histories = c.getStorage('histories') || [];
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
            c.setStorage('histories', histories);
            c.excPrevPage('refreshHistories');
            this.$vm.setParam('kw', value).loadData();
        }
    },
    toggleType: function (e) {
        let id = parseInt(e.currentTarget.dataset.id);
        this.setData({
            type: id
        });
        if (id == 2) {
            this.$vm.setOnParseRows(function (rows) {
                c.wrapZan(rows);
            });
        } else {
            this.$vm.setOnParseRows(null);
        }
        this.$vm.setUrl(urls[id]).loadData();
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
    cancelSearch(){
        wx.navigateBack({});
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.$vm.loadMore();
    },
    showShopDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/home/index?shop_id=' + id,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    zan: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.items.every(function (el) {
                if (el.id == id) {
                    el.zaned = true;
                    el.zan_count++;
                    that.setData({
                        items: that.data.items
                    });
                    return false;
                }
                return true;
            });
        });
    }
})