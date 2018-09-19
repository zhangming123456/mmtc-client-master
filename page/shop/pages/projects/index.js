// pages/cases/index.js
const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = util2.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');

const appPage = {
    data: {
        text: "page shop projects",
        projects: [],
        page: [],
        noMore: false,
        categories: [],
        cid: 0,
        _scrollLeft: 0,
        scrollLeft: 0,
        scrollHeight: 0,
        loadingMore: false,
        hasMore: true
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
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options) {

    }
};
const methods = {
    loadCb(){
        let that = this;
        let options = that.data.options;
        that.data.shop_id = options.shop_id;
        that.getShopProjects()
    },
    getShopProjects({p = 1, category_id = 0} = {}){
        let that = this;
        let shop_id = that.data.shop_id;
        if (!shop_id)return;
        ApiService.getShopProjects({p, category_id, shop_id}).finally(res => {
            if (res.status === 1) {
                let setData = {};
                let categories = res.info.categories;
                if (categories && categories.length > 0) {
                    setData.categories = categories;
                }
                let info = res.info.rows;
                if (info.length > 0) {
                    if (p === 1) {
                        setData[`projects`] = [info]
                    } else {
                        setData[`projects[${p - 1}]`] = info
                    }
                    setData[`page`] = p + 1;
                    setData.noMore = info.length !== 10;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData[`page`] = p - 1;
                    } else {
                        setData[`projects`] = []
                    }
                    setData.noMore = true;
                }
                that.setData(setData, function () {
                    if (categories && categories.length > 0) {
                        that.setHeight();
                    }
                });
            } else {
                util2.failToast(res.message || '加载失败')
            }
        })
    },
    setHeight(){
        let that = this;
        let dom = that.querySelector("#navTab");
        dom.boundingClientRect(function (rect) {
            let windowHeight = that.data.systemInfo.windowHeight,
                H = rect.height;
            that.setData({scrollHeight: windowHeight - H});
        }).exec();
    },
    toggleCategory ({currentTarget, target}) {
        let that = this;
        let windowWidth = that.data.systemInfo.windowWidth
        let scrollLeft = this.data._scrollLeft;
        let category_id = this.data.cid;
        let left = currentTarget.offsetLeft - windowWidth / 2;
        let page = this.data.page;
        if (left < 0) {
            left = 0;
        }
        let cid = currentTarget.dataset.id;
        if (cid <= -1)return;
        if (category_id !== cid) {
            page = 1;
        }
        this.setData({cid, scrollLeft: left});
        this.getShopProjects({category_id: cid, p: page});
    },
    scrolltolower(){
        let category_id = this.data.cid;
        let p = this.data.page;
        this.getShopProjects({category_id, p})
    },
    scroll({detail}){
        this.data._scrollLeft = detail.scrollLeft
    },
    onViewScroll({detail}){
        this.selectComponent('#azmGoTop').scroll(detail)
    },
    azmtap(e){
        console.log(e);
        this.setData({scrollTop: 0})
    }
};
Page(new utilPage(appPage, methods));