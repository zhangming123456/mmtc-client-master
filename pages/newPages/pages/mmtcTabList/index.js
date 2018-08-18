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
        tabList: {
            list: [
                {
                    id: '1',
                    title: '今日上新'
                },
                {
                    id: '2',
                    title: '热卖专场'
                }
            ],
            selectedId: '1',
            scroll: true,
            height: 45
        },//tab列表
        tabListData: [],//tab列表数据
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
    onReachBottom(){
        console.warn(`上拉触底事件${this.data.text}`);
        let tabList = this.data.tabList,
            id = tabList.selectedId,
            page = tabList.list[id - 1].page || 1;
        page++;
        this.getSpecialItem({page})
    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options){
        if (options.scrollTop > 5) {
            this.setData({
                isFixed: true
            })
        } else {
            this.setData({
                isFixed: false
            })
        }
    }
};
/**
 * 方法类
 */
const methods = {
    loadCb(){
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow,
            id = options.id;
        this.setData({
            [`tabList.selectedId`]: id
        });
        ApiService.getSpecialList().then(
            res => {
                if (res.status == 1) {
                    let data = {};
                    that.setData({
                        [`tabList.list`]: res.info
                    });
                }
            }
        );
    },
    loadData(){

    },
    /**
     * 地理位置回调
     * @param e
     */
    getLocationCallback(e){
        let value = e.detail;
        console.log(value, `+++++${this.data.text}+++++getLocationCallback++++++`);
        if (value.isUpdate) {
            this.getSpecialItem();
        }
    },
    getSpecialItem({page = 1, limit = 10} = {}, callback){
        let that = this,
            tabList = this.data.tabList,
            id = tabList.selectedId,
            azmLocationData = this.data.azmLocationData;
        that.setData({
            noMore: false
        });
        ApiService.getSpecialItem({
            id,
            page,
            limit,
            lon: azmLocationData.lon || 0,
            lat: azmLocationData.lat || 0
        }).then(
            res => {
                if (res.status == 1 && res.info && res.info.length > 0) {
                    if (page === 1) {
                        that.setData({
                            [`tabListData[${id - 1}]`]: [],
                            [`tabListData[${id - 1}][${page - 1}]`]: res.info,
                        });
                    } else {
                        that.setData({
                            [`tabListData[${id - 1}][${page - 1}]`]: res.info,
                        });
                    }
                    that.data.tabList.list[id - 1].page = page;
                } else {
                    that.setData({
                        noMore: true
                    })
                }
                callback && callback();
            }
        ).finally(res => {
            that.stopPullDownRefresh()
        })
    },
    bindtabchange(e){
        let id = e.detail;
        this.setData({
            [`tabList.selectedId`]: id
        });
        let page = this.data.tabList.list[id - 1].page || 1;
        if (page === 1 && !this.data.tabListData[id - 1]) {
            this.getSpecialItem();
            app.util.goToTop();
        } else {
            page++;
            this.getSpecialItem({page});
        }
    },
    bindscrolltoupper(){
        console.log(1241545);
        wx.startPullDownRefresh()
    },
    bindscrolltolower(){
        console.log('1241545fakfj');
    },
    azmLocationTap(e){
        console.log(arguments, 'sfhaklfkj');
    },
    imageLoad(e){
        console.log(e, 'Load');
    },
    imageError(e){
        console.log(e, 'Error');
    },
};
Page(new utilPage(appPage, methods));