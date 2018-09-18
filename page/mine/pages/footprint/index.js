const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page mine footprint',
        page: 1,
        noMore: false,
        footprints: []
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
        this.getMemberFootPlace(page)
    },
};
const methods = {
    loadCb () {
        this.getMemberFootPlace()
    },
    getMemberFootPlace(p = 1, bol){
        let that = this, setData = {};
        if (that.isGetMemberFootPlace)return;
        this.isGetMemberFootPlace = true;
        if (!bol) {
            util2.showLoading()
        }
        ApiService.getMemberFootPlace({p}).finally(res => {
            this.isGetMemberFootPlace = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                if (res.status === 1 && res.info) {
                    let info = res.info.data;
                    if (info.length > 0) {
                        if (p === 1) {
                            setData[`footprints`] = [info]
                        } else {
                            setData[`footprints[${p - 1}]`] = info
                        }
                        setData[`page`] = p + 1;
                        setData.noMore = false;
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
        if (!id) return;
        this.$route.push({path: '/page/shop/pages/goods/index', query: {id}})
    }
};

Page(new utilPage(appPage, methods));
//
// Page({
//
//     /**
//      * 页面的初始数据
//      */
//     data: {},
//
//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function (options) {
//         this.$vm = c.listGrid(this, {
//             url: '/api/member/footPlace'
//         }).setOnLoadMore(function (res) {
//             let data = this.context.data.items;
//             let lastKey = data[data.length - 1].date;
//             let info = res.info.data;
//             if (lastKey == info[0].date) {
//                 data[data.length - 1].rows.concat(info[0].rows);
//                 info.splice(0, 1);
//             }
//             this.context.data.items = this.context.data.items.concat(info);
//             let setData = {
//                 items: this.context.data.items
//             };
//             console.log('loadingmore');
//             console.log(this.context.data.items);
//             if (res.info.size < this.pageSize) {
//                 this.noMore = setData.noMore = true;
//             }
//             this.setData(setData);
//         }).setOnLoadData(function (res) {
//             let setData = {
//                 items: this.context.data.items = res.info.data
//             };
//             if (res.info.size < this.pageSize) {
//                 this.noMore = setData.noMore = true;
//             }
//             this.setData(setData);
//         }).loadData();
//     },
//
//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function () {
//
//     },
//
//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function () {
//
//     },
//
//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function () {
//         this.$vm.loadMore();
//     },
//
//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function () {
//
//     },
//
// })