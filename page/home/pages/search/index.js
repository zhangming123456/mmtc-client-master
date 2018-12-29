const app = getApp(),
    util2 = app.util2,
    ApiService = require("../../../../utils/ApiService/index"),
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");

let histories;
const appPage = {
    data: {
        name: '',
        item: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let that = this;
        if (that.data.isShow) {}
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        let that = this;
    },
    /**
     * 页面渲染完成
     */
    onReady() {
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        let that = this
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {},
    onPageScroll(options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
}
const methods = {
    loadCb() {
        let that = this;
    },

    // 获取店铺数据
    cancelSearch() {
        let that = this;
        var shop_id = this.data.options.shop_id;
        var kw = this.data.name;
        ApiService.getSearchItems({
            shop_id,
            kw
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    item: res.info
                });
            }
        })
    },

    gotoShopDetails(e) {
        console.log(e, 546465465465465465321);
        var item = e.currentTarget.dataset.item
        if (item && item.id) {
            this.$route.push({
                path: '/page/shop/pages/goods/index',
                query: {
                    id: item.id
                }
            })
        }
    },

    formName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
}

Page(new utilPage(appPage, methods));
