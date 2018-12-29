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
        img: [],
        imageList: []
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
        this.getImgListDetail()

    },

    getImgListDetail(
        id
    ) {
        let that = this;
        var id = this.data.options.id;
        let imageList = that.data.imageList;
        var imageUrl = this.data.imageUrl;
        ApiService.getImgListDetail({
            id

        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    img: res.info
                });
                for (let v of res.info) {
                    console.log(v, 111111111111);
                    var img_src = util2.absUrl(v.img_src);
                    console.log(img_src, 8888888888888888);
                    imageList.push(img_src)
                }
            }
        })
    },

    /**
     * 预览图片
     */
    previewImage: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: this.data.imageList // 需要预览的图片http链接列表
        })
    },


}

Page(new utilPage(appPage, methods));
