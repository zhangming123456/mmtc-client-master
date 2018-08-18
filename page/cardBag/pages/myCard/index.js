const app = getApp(),
    util = app.util,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');

const appPage = {
    data: {
        text: "page cardBag MyCard",
        cardList: [],
        type: '可用套卡',
        myCardList: [],
    },
    onLoad: function (options) {
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
        let that = this;
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
            options = that.data.options;
        that.getOrderCardMyCard();
        that.getOrderCardMyCardUseless();

    },
    loadData() {

    },
    getOrderCardMyCard() {
        let that = this;
        ApiService.getOrderCardMyCard().finally(res => {
            if (res.status === 1) {
                that.setData({
                    cardList: res.info
                })
            } else {
                that.$Toast({
                    content: res.message
                })
            }
        })
    },


    getOrderCardMyCardUseless() {
        let that = this;
        ApiService.getOrderCardMyCardUseless(

        ).finally(res => {
            if (res.status === 1) {
                that.setData({
                    myCardList: res.info
                })
            } else {
                that.$Toast({
                    content: res.message
                })
            }
        })

    },
    gotoCardDetails(e) {
        console.log(e, 4135444444444444444213231231);
        let that = this;
        let item = e.currentTarget.dataset.item;
        let status = item.status;

        if (item && item.bill_id) {
            this.$route.push({
                path: '/page/cardBag/pages/setDetails/index',
                query: item
            })
        }
    },


   

    toggle(e) {
        var that = this;
        var type = that.data.type === '可用套卡' ? '不可用卡' : '可用套卡';
        that.setData({
            type: type
        });
    },



    // Event handler.
    viewTap: function () {
        this.setData({
            text: 'Set some data for updating view.'
        }, function () {
            // this is setData callback
        })
    },
    customData: {
        hi: 'MINA'
    },
    down() {

    }
}

Page(new utilPage(appPage, methods));