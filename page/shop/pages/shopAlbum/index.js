const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index');
let $wxParse = require('../../../../wxParse/wxParse');

const appPage = {
    data: {
        text: "page shop home",
        img: []
    },
    onLoad: function () {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        let that = this;
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
    onReady: function () {},
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
        let that = this,
            page = that.data.page;

    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options) {

    }
}
const methods = {
    async loadCb() {
        let that = this,
            options = that.data.options,
            shop_id = options.shop_id;
        this.getImgList()

    },
    // 获取店铺介绍数据
    getImgList(
        shop_id
    ) {
        let that = this;
        var shop_id = this.data.options.shop_id;
        ApiService.getImgList({
            shop_id

        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    img: res.info
                });
            }
        })
    },


    gotoDisplayPicture(e) {

        console.log(e, 44444444444444444);
        var item = e.currentTarget.dataset.item;
        if (item && item.id)
            this.$route.push({
                path: '/page/shop/pages/displayPicture/index',
                query: {
                    id: item.id
                }
            })
    }



}

Page(new utilPage(appPage, methods));
