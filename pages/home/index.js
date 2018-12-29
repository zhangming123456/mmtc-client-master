const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Pages home',
        isShow: false,
        options: {},
        cityName: "",
        imageUrl: config.imageUrl,
        isShowLocation: true,
        page: 1,
        shops: [],
        tabListData: [],
        specialBanner: [],
        gridList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        let that = this;
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
        let that = this;
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {

    },
    onPageScroll (options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let options = this.data.options;
        if (options.scene && /^shop_id:[0-9]+$/.test(options.scene)) {
            let scene = options.scene.split(":");
            if (scene[1]) {
                this.$route.reLaunch({path: '/page/payment/pages/payTheBill/index', query: {shop_id: scene[1]}})
            }
        } else {
            this.$route.tab('/page/tabBar/home/index')
        }
    }
};
Page(new utilPage(appPage, methods));
