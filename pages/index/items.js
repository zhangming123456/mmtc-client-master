// pages/index/index.js
const app = getApp(),
    c = require("../../utils/common.js"),
    utilPage = require("../../utils/utilPage"),
    ApiService = require("../../utils/ApiService"),
    config = require("../../utils/config");
const stypes = ['智能排序', '销量最高', '价格最低', '案例最多', '好评优先', '离我最近'];
const ltypes = ['全部', '拼团特惠'];
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page indexItem',
        shops: [],
        scrollTop: 0,
        type: -1,
        topFixed: false,
        address: c.getAddress() || '',
        filters: {},
        page: 1
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        try {
            if (options) {
                Object.assign(that.data.options, options);
                console.warn(`初始化${that.data.text}`, options);
            } else {
                throw {message: '初始化options为空'};
            }
        } catch (e) {
            console.warn(e, options);
        }
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        if (this.data.isShow) {
            this.loadData();
        }
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
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        this.setData({
            noMore: false
        });
        this.getSpecialItemNear({page: 1}, res => {
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
    },
    onPageScroll: function (e) {
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {
    }
};
const methods = {
    loadCb(){
        c.showLoading();
        let that = this,
            options = that.data.options;
        app.globalData.pages.indexPage = this;
        this.p = 1;
        this.cid = options.cid || 0;
        that.data.filters = {};
        ApiService.getCategoryDataList().then(
            res => {
                if (res.status == 1) {
                    res.info[1] = res.info[0].children[0].children;
                    res.info[0].children[0].selected = true;
                    that.prevCategoryIndex = 0;
                    let categories = res.info;
                    let ctitle = '';
                    res.info[0].children.every(function (el) {
                        if (el.id == that.cid) {
                            ctitle = el.title;
                            return false;
                        }
                        return true;
                    });
                    c.getLocation(function (res) {
                        that.lat = res.latitude;
                        that.lon = res.longitude;
                        let flag = false;
                        c.setLatAndLon({
                            lat: that.lat,
                            lon: that.lon
                        });
                        let filter = {
                            'category_id': options.cid,
                            'type_id': options.type_id,
                            'near_type': options.near_type,
                            'sort': options.sort
                        };
                        let ltypes_name = ltypes[options.type_id],
                            filter_name = {};
                        if (ctitle) {
                            flag = true
                            filter_name['ctitle'] = ctitle
                        }
                        if (ltypes_name) {
                            flag = true
                            filter_name['ltitle'] = ltypes_name
                        }
                        if (flag) {
                            that.addFilter(filter).doFilter();
                        } else {
                            that.doFilter();
                        }
                        that.setData(Object.assign(filter_name, {categories}));
                    });
                }
            });
        ApiService.getTradingGetData().then(ret => {
            if (ret.status == 1) {
                that.area = ret.info;
                that.setData({
                    topAreas: that.area.trading,
                    areaIndex: [0, 0],
                    areaType: 0
                });
            }
        });
    },
    loadData () {
        let that = this,
            data = app.globalData.lat_and_lon || {};
        if (!data.lon || !data.lat || !this.lat || !this.lon) {
            return;
        }
        if (data.lon === that.lon && that.lat === data.lat) {
            return;
        }
        that.goodsList();
    },
    // 触底函数
    bindscrolltolower () {
        if (this.isLoading || this.data.noMore) {
            return;
        }
        this.isLoading = true;
        let that = this,
            page = that.data.page;
        page++;
        this.setData({
            loadingMore: true
        });
        that.goodsList({p: page}).finally(function (res) {
            that.data.page = that.data.shops.length;
            that.isLoading = false;
        });
    },
    doFilter() {
        let that = this;
        c.showLoading();
        this.setData({
            noMore: false
        });
        that.goodsList().finally(function () {
            c.hideLoading();
        });
    },
    goodsList({p = 1} = {}){
        let that = this,
            latAndLon = app.globalData.lat_and_lon || {},
            data = {
                lon: latAndLon.lon,
                lat: latAndLon.lat,
                p
            },
            filters = that.data.filters;
        that.lon = data.lon;
        that.lat = data.lat;
        if (p === 1 && that.data.shops.length > 0) {
            that.setData({
                shops: []
            })
        }
        for (let k in filters) {
            if (filters[k] === null || filters[k] === undefined || filters[k] === '') {
                delete filters[k]
            }
        }
        return ApiService.getGroupGoodsList(Object.assign(data, filters))
            .then(
                res => {
                    if (res.status == 1) {
                        let setData = {
                            [`shops[${p - 1}]`]: res.info,
                            address: c.getAddress()
                        };
                        if (res.info.length < c.getPageSize()) {
                            setData.noMore = true;
                        }
                        that.setData(setData);
                    }
                }
            )
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
    addFilter(fieldName, fieldValue) {
        if (app.util.common.isObject(fieldName)) {
            for (let k in fieldName) {
                this.data.filters[k] = fieldName[k];
            }
        } else {
            this.data.filters[fieldName] = fieldValue;
        }
        return this;
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
    showShopDetail: function (e) {
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
    gotoTop: function () {
        this.setData({
            scrollTop: 0
        });
    },
    closeFilter() {
        this.setData({
            type: -1
        });
    }
};
Page(new utilPage(appPage, methods));