const c = require("../../../../utils/common.js");
let urls = ['/api/item/search', '/api/shop/searchAll', '/api/note/search'];
const app = getApp(),
    util2 = app.util2,
    map = new util2.MAP(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService");

let timer0 = null
let timer1 = null
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        noMore: false,
        scrollTop: 0,
        scrollTopArr: [50, 50, 50],
        scrollTop0: 50,
        scrollTop1: 50,
        scrollTop2: 50,
        tab0View: 'tab0',
        tab1View: 'tab1',
        tab2View: 'tab2',
        tab0TopStatus: false,
        tab1TopStatus: false,
        tab2TopStatus: false,
        tab0TopStep: -1,
        tab1TopStep: -1,
        tab2TopStep: -1,
        current: 0,
        shopList: [],
        shopPage: 1,
        itemList: [],
        itemPage: 1,
        tabList: [
            {
                title: '店铺',
                key: 'tab0'
            },
            {
                title: '服务',
                key: 'tab1'
            },
            {
                title: '案例',
                key: 'tab2'
            }
        ],
        styleSwiper: '',
        styleMinH: '',
        search: '',
        filters: {}
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
        let that = this;
        if (that.data.isShow) {
        }
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
        let that = this
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
    },
    //页面滚动执行方式
    onPageScroll(event){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
}
const methods = {
    async loadCb () {
        let that = this;
        let options = that.data.options,
            setData = {},
            windowHeight = that.data.systemInfo.windowHeight;
        that.querySelector('#azm-header').boundingClientRect(function (rect) {
            that.setData({
                styleSwiper: `height: ${windowHeight - rect.height}px;`,
                styleMinH: `min-height: ${windowHeight - rect.height + 50}px;`
            })
        }).exec();
        that.querySelector('.azm-refresh').boundingClientRect(function (rect) {
            that.setData({
                scrollTop0: rect.height,
                scrollTop1: rect.height,
                scrollTop2: rect.height,
            })
        }).exec();
        if (options.type > -1) {
            setData.current = parseInt(options.type || 0);
        }
        if (options.w) {
            setData.search = options.w
        }
        this.setData(setData);
        that.refreshData();
        console.log(1);
    },
    onAbnorTap(e){
        console.log(2);
        this.refreshData()
    },
    async refreshData(){
        let that = this,
            current = that.data.current;
        await that.getLocation();
        if (current === 2) {

        } else if (current === 1) {
            await that.getItemSearch();
        } else {
            await that.getShopSearchAll();
        }
    },
    // 获取经纬度
    getLocation(){
        let that = this,
            lat_and_lon = {...app.globalData.lat_and_lon};
        return new Promise((resolve, reject) => {
            let city_id = null;
            if (!lat_and_lon || !lat_and_lon.lon) {
                lat_and_lon = that.data.filters;
            }
            if (lat_and_lon && lat_and_lon.city) {
                city_id = util2.getCity({title: lat_and_lon.city}).id
            } else if (lat_and_lon && lat_and_lon.city_id) {
                city_id = lat_and_lon.city_id
            }
            if (lat_and_lon && lat_and_lon.lon && city_id) {
                let lat = lat_and_lon.lat;
                let lon = lat_and_lon.lon;
                that.data.filters = {lat, lon, city_id};
                resolve()
            } else {
                wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        let lat = res.latitude;
                        let lon = res.longitude;
                        map.getMap(
                            {lat, lon},
                            res => {
                                let lat = res.lat;
                                let lon = res.lon;
                                let city_id = util2.getCity({title: res.city}).id;
                                that.data.filters = {lat, lon, city_id};
                                resolve()
                            },
                            rsp => {
                                reject()
                            }
                        )
                    },
                    fail(){
                        reject()
                    }
                });
            }
        }).catch(err => {

        })
    },
    getShopSearchAll(p = 1, setData = {}, bol){
        let that = this,
            kw = that.data.search,
            filters = that.data.filters;
        if (that.isGetShopSearchAll)return;
        that.setData({noMore: false});
        that.isGetShopSearchAll = true;
        if (!bol) {
            util2.showLoading();
        } else if (p === 1) {
            wx.vibrateShort({});
        }
        return ApiService.getShopSearchAll({...filters, kw, p}).finally(res => {
            that.isGetShopSearchAll = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData.shopList = [info];
                        setData.tab0View = 'tab0';
                    } else if (res.info) {
                        setData[`shopList[${p - 1}]`] = info
                    }
                    setData.shopPage = p + 1;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData.shopPage = p - 1;
                    }
                    setData.noMore = true;
                }
                that.setData(setData);
                if (bol && p === 1) {
                    that.$Message({selector: '#message0', content: '刷新完成'})
                }
            }
        })
    },
    getItemSearch(p = 1, setData = {}, bol){
        let that = this,
            kw = that.data.search,
            filters = that.data.filters;
        if (bol && p === 1) {
            wx.vibrateShort({});
        }
        if (!kw) {
            that.setData(setData);
            return;
        }
        if (that.isGetItemSearch)return;
        that.setData({noMore1: false});
        that.isGetItemSearch = true;
        if (!bol) {
            util2.showLoading();
        }
        return ApiService.getItemSearch({...filters, kw, p}).finally(res => {
            that.isGetItemSearch = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData.itemList = [info];
                        setData.tab1View = 'tab1';
                    } else if (res.info) {
                        setData[`itemList[${p - 1}]`] = info
                    }
                    setData.itemPage = p + 1;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData.itemPage = p - 1;
                    }
                    setData.noMore1 = true;
                }
                that.setData(setData);
                if (bol && p === 1) {
                    that.$Message({selector: '#message1', content: '刷新完成'})
                }
            }
        })
    },
    /**
     * 轮播图切换
     * @param e
     */
    bindSwiperChange(e){
        let current = e.detail.current;
        if (current > -1) {
            this.setData({current});
            console.log(3);
            this.refreshData();
        }
    },
    /**
     * 点击tab切换
     * @param e
     */
    handleTabChange(e){
        let key = e.detail.key,
            tabList = this.data.tabList,
            fIndex = tabList.findIndex(v => {
                return v.key === key
            });
        if (fIndex > -1) {
            this.setData({current: fIndex});
            console.log(4);
            this.refreshData();
        }
    },
    upper0(e){
        console.log(e, 'upper0');
        this.data.tab0TopStatus = true;
    },
    lower0(e){
        let that = this,
            page = that.data.shopPage;
        that.getShopSearchAll(page);
    },
    bindTabScroll0(e){
        let that = this,
            scrollTop = e.detail.scrollTop,
            scrollTop0 = this.data.scrollTop0;
        this.data.scrollTopArr[0] = scrollTop;
        switch (true) {
            case (scrollTop <= scrollTop0 - 25):
                this.setData({tab0TopStep: 1});
                break;
            case (scrollTop <= scrollTop0):
                this.setData({tab0TopStep: 0});
                break;
            default:
                this.setData({tab0TopStep: -1});
        }
        clearTimeout(timer0);
        timer0 = setTimeout(function () {
            if (that.data.tab0TopStatus) {
                let tab0TopStep = that.data.tab0TopStep,
                    x = that.data.scrollTopArr[0],
                    scrollTop0 = that.data.scrollTop0;
                switch (tab0TopStep) {
                    case 1:
                        that.setData({tab0TopStep: 2});
                        that.getShopSearchAll(1, {tab0View: 'tab0', tab0TopStep: -1, tab0TopStatus: false}, true);
                        break;
                    default:
                        that.setData({tab0View: 'tab0', tab0TopStep: -1, tab0TopStatus: false});
                }
            }
        }, 100);
    },
    handletouchend0(e){
    },
    upper1(e){
        console.log(e, 'upper1');
        this.data.tab1TopStatus = true;
    },
    lower1(e){
        let that = this,
            page = that.data.itemPage;
        that.getItemSearch(page);
    },
    bindTabScroll1(e){
        let that = this,
            scrollTop = e.detail.scrollTop,
            scrollTop1 = this.data.scrollTop1;
        this.data.scrollTopArr[1] = scrollTop;
        switch (true) {
            case (scrollTop <= scrollTop1 - 25):
                this.setData({tab1TopStep: 1});
                break;
            case (scrollTop <= scrollTop1):
                this.setData({tab1TopStep: 0});
                break;
            default:
                this.setData({tab1TopStep: -1});
        }
        clearTimeout(timer1);
        timer1 = setTimeout(function () {
            if (that.data.tab1TopStatus) {
                let tab1TopStep = that.data.tab1TopStep,
                    x = that.data.scrollTopArr[1],
                    scrollTop1 = that.data.scrollTop1;
                switch (tab1TopStep) {
                    case 1:
                        that.setData({tab1TopStep: 2});
                        that.getItemSearch(1, {tab1View: 'tab1', tab1TopStep: -1, tab1TopStatus: false}, true);
                        break;
                    default:
                        that.setData({tab1View: 'tab1', tab1TopStep: -1, tab1TopStatus: false});
                }
            }
        }, 100);
    },
    bindSearchInput(e){
        let value = util2.trim(e.detail.value);
        this.setData({search: value});
    },
    /**
     * 搜索
     * @param e
     */
    doSearch: function (e) {
        let value = util2.trim(e.detail.value);
        if (value) {
            let histories = wx.getStorageSync('histories') || [];
            histories.every(function (el, idx) {
                if (el.title === value) {
                    histories.splice(idx, 1);
                    return false;
                }
                return true;
            });
            histories.unshift({title: value});
            if (histories.length > 20) {
                histories = histories.slice(0, 20);
            }
            wx.setStorageSync('histories', histories);
        }
        this.setData({search: value});
        console.log(5);
        this.refreshData();
    },
    toggleType: function (e) {
        let id = parseInt(e.currentTarget.dataset.id);
        this.setData({
            type: id
        });
        if (id == 2) {
            this.$vm.setOnParseRows(function (rows) {
                c.wrapZan(rows);
            });
        } else {
            this.$vm.setOnParseRows(null);
        }
        this.$vm.setUrl(urls[id]).loadData();
    },
    cancelSearch(){
        wx.navigateBack({});
    },
    showShopDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/home/index?shop_id=' + id,
        })
    },
    zan (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.items.every(function (el) {
                if (el.id == id) {
                    el.zaned = true;
                    el.zan_count++;
                    that.setData({
                        items: that.data.items
                    });
                    return false;
                }
                return true;
            });
        });
    }
}

Page(new utilPage(appPage, methods));