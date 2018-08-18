// pages/index/index.js
const app = getApp(),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService'),
    config = require('../../utils/config'),
    c = require("../../utils/common.js");
const stypes = ['智能排序', '销量最高', '价格最低', '案例最多', '好评优先', '离我最近'];
const ltypes = ['全部', '拼团特惠', '', '买单优惠'];

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page indexNear',
        imageUrl: config.imageUrl,
        filters: {},
        page: 1,
        location: {},
        shops: [],
        scrollTop: 0,
        type: -1,
        topFixed: false,
        address: ''
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

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },
    /**
     * 页面渲染完成
     */
    onReady () {

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
        let that = this,
            p = that.data.page,
            location = that.data.location;
        p++;
        c.showLoading();
        that.getShopFilterData({
            lat: location.lat,
            lon: location.lon,
            p
        })
    },
    onPageScroll(options){
        this._onPageScroll(options)
    }
};
/**
 * 方法类
 */
const methods = {
    loadCb() {
        var that = this,
            options = that.data.options;
        c.showLoading();
        app.globalData.pages.indexPage = this;
        wx.createSelectorQuery().select('#toolbar').boundingClientRect(function (rect) {
            that.top = rect.top;
        }).exec();
    },
    _onPageScroll (e) {
        let that = this;
        wx.createSelectorQuery().select('#toolbar').boundingClientRect(function (rect) {
            if (rect.top <= 0) {
                if (!that.data.topFixed) {
                    that.setData({
                        topFixed: true
                    });
                }
            } else {
                if (that.data.topFixed) {
                    that.setData({
                        topFixed: false
                    });
                }
            }
        }).exec();
    },

    getLocationCallback(e){
        let dataset = e.detail.dataset,
            that = this;
        this.setData({
            location: dataset,
            address: dataset.address || ''
        });
        that.loadTypeData();
        if (e.detail.isUpdate) {
            that.getShopFilterData({lat: dataset.lat, lon: dataset.lon}).finally(
                res => {
                    that.stopPullDownRefresh()
                }
            );
        }
    },
    /**
     * 获取附近项目列表
     * @param lon
     * @param lat
     * @param p
     * @returns {Promise.<TResult>}
     */
    getShopFilterData({lon = 0, lat = 0, p = 1, size = 10}){
        let that = this,
            filters = that.data.filters;
        let _setData = {
            loadingMore: true
        };
        this.isLoading = true;
        that.setData(_setData);
        return ApiService.getShopFilterData(c.extend({lon, lat, p}, filters)).then(
            function (res) {
                that.isLoading = false;
                c.hideLoading();
                if (res.status === 1) {
                    if (p == 1) {
                        _setData.shops = []
                    }
                    that.setData(_setData);
                    let setData = {
                        page: p,
                        [`shops[${p - 1}]`]: res.info
                    };
                    if (res.info.length < size) {
                        setData.noMore = true;
                    }
                    that.setData(setData);
                }
            }
        );
    },
    selectSortType(e) {
        let type = parseInt(e.currentTarget.dataset.index);
        this.setData({
            stitle: stypes[type],
            type: -1
        });
        this.addFilter('sort', type).doFilter();
    },
    selectFilterType(e) {
        let type = parseInt(e.currentTarget.dataset.index);
        this.setData({
            ltitle: ltypes[type],
            type: -1
        });
        this.addFilter('type_id', type).doFilter();
    },
    toggleType(e) {
        let type = parseInt(e.currentTarget.dataset.type);
        let that = this;
        if (type == this.data.type) {
            this.setData({
                type: -1
            });
            return;
        }
        if (!that.toolbarTop) {
            wx.createSelectorQuery().select('#toolbar').boundingClientRect(function (rect) {
                that.toolbarTop = rect.top;
                that._toggleType(type);
            }).exec();
        } else {
            that._toggleType(type);
        }
    },
    _toggleType(type) {
        this.setData({
            type: type,
            scrollTop: this.toolbarTop
        });
    },
    pickArea () {
        wx.navigateTo({
            url: '/pages/loc/index',
        });
    },
    doSearch () {
        wx.navigateTo({
            url: '/page/home/pages/search/index',
        });
    },
    loadTypeData() {
        let that = this,
            data = {},
            p = ApiService.getCategoryDataList(),
            p1 = ApiService.getTradingGetData();
        p.then(res => {
            console.log(9);
            if (res.status == 1) {
                res.info[1] = res.info[0].children;
                res.info[0].selected = true;
                that.prevCategoryIndex = -1;
                data.categories = res.info
            }
        });
        p1.then(
            res => {
                console.log(10);
                if (res.status == 1) {
                    that.area = res.info;
                    data.topAreas = that.area.trading;
                    data.areaIndex = [0, 0];
                    data.areaType = 0;
                }
            }
        );
        Promise.all([p, p1]).finally(
            res => {
                console.log(11);
                that.setData(data);
                c.hideLoading();
            }
        )
    },
    addFilter(fieldName, fieldValue) {
        this.data.filters[fieldName] = fieldValue;
        return this;
    },
    doFilter() {
        let that = this,
            location = that.data.location;
        c.showLoading();
        this.setData({
            noMore: false
        });
        wx.pageScrollTo({
            scrollTop: that.top || 0
        });
        that.getShopFilterData({
            lon: location.lon,
            lat: location.lat
        });
    },
    toggleAreaType(e) {
        let type = parseInt(e.currentTarget.dataset.type);
        if (type == this.data.areaType) {
            return;
        }
        this.setData({
            areaType: type,
            topAreas: type == 0 ? this.area.trading : this.area.metro
        });
    },
    selectArea(e) {
        let index = parseInt(e.target.dataset.index);
        let data = this.data.areaType == 0 ? this.area.trading : this.area.metro;
        let item = data[this.data.areaIndex[this.data.areaType]].children[index];
        let atitle = item.title;
        let aid = item.id;
        this.setData({
            type: -1,
            atitle: atitle
        });
        this.addFilter('near_type', aid).doFilter();
    },
    toggleTopArea(e) {
        let index = parseInt(e.target.dataset.index);
        if (index == this.data.areaIndex[this.data.areaType]) {
            return;
        }
        this.data.areaIndex[this.data.areaType] = index;
        this.setData({
            areaIndex: this.data.areaIndex
        });
    },
    showShopDetail (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/home/index?shop_id=' + id,
        })
    },
    toggleCategory(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        if (this.prevCategoryIndex != index) {
            if (index != -1) {
                if (this.prevCategoryIndex == -1) {
                    this.data.categories[0].selected = false;
                } else {
                    this.data.categories[0].children[this.prevCategoryIndex].selected = false;
                }
                this.data.categories[0].children[index].selected = true;
                this.data.categories[1] = this.data.categories[0].children[index].children;
            } else {
                this.data.categories[0].selected = true;
                this.data.categories[0].children[this.prevCategoryIndex].selected = false;
                this.data.categories[1] = this.data.categories[0].children;
            }
            this.prevCategoryIndex = index;
            this.setData({
                categories: this.data.categories
            });
        }
    },
    selectCategory(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        let cid = 0, ctitle;
        if (index == -1) { // 选择全部
            if (this.prevCategoryIndex == -1) { // for top category
                cid = 0;
                ctitle = '全部项目';
            } else {
                cid = this.data.categories[0].children[this.prevCategoryIndex].id;
                ctitle = this.data.categories[0].children[this.prevCategoryIndex].title;
            }
            // temp
        } else {
            if (this.prevCategoryIndex == -1) { // for top category
                cid = this.data.categories[0].children[index].id;
                ctitle = this.data.categories[0].children[index].title;
            } else {
                cid = this.data.categories[0].children[this.prevCategoryIndex].children[index].id;
                ctitle = this.data.categories[0].children[this.prevCategoryIndex].children[index].title;
            }
        }
        this.setData({
            type: -1,
            ctitle: ctitle
        });
        this.addFilter('category_id', cid).doFilter();
    },
    gotoTop () {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    closeFilter() {
        this.setData({
            type: -1
        });
    }
};

Page(new utilPage(appPage, methods));