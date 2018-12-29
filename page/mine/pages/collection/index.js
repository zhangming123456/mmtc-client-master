const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService/index"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page mine collection',
        page: 1,
        noMore: false,
        collectionList: []
    },
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
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this,
            page = that.data.page;
        this.getCollectionItems(page)
    },
};
const methods = {
    loadCb () {
        this.getCollectionItems()
    },
    getCollectionItems(p = 1, bol){
        let that = this, setData = {}
        if (that.isGetCollectionItems)return;
        this.isGetCollectionItems = true;
        if (!bol) {
            util2.showLoading()
        }
        ApiService.getCollectionItems({p}).finally(res => {
            this.isGetCollectionItems = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                if (res.status === 1) {
                    let info = res.info;
                    if (info.length > 0) {
                        if (p === 1) {
                            setData[`collectionList`] = [info]
                        } else {
                            setData[`collectionList[${p - 1}]`] = info
                        }
                        setData[`page`] = p + 1;
                        setData.noMore = info.length !== 10;
                    } else if (info.length === 0) {
                        if (p > 1) {
                            setData[`page`] = p - 1;
                        }
                        setData.noMore = true;
                    }
                    that.setData(setData);
                } else {
                    util2.failToast(res.message || '加载失败')
                }
            }
        })
    },
    showItemDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: '/page/shop/pages/goods/index', query: {id}})
        }
    }
};

Page(new utilPage(appPage, methods));
