const app = getApp(),
    util2 = app.util2,
    map = new util2.MAP(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService");

let timer0 = null;
let timer1 = null;
let timer2 = null;
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        noMore0: false,
        noMore1: false,
        noMore2: false,
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
        shopList: [],
        shopPage: 1,
        itemList: [],
        itemPage: 1,
        noteList: [],
        notePage: 1,
        current: 0,
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
        search: '',//搜索关键字
        filters: {},//筛选条件
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
    onPageScroll (event) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {

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
                styleMinH: `min-height: ${windowHeight - rect.height}px;`
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
    },
    /**
     * 立即刷新按钮
     * @param e
     */
    onAbnorTap (e) {
        this.refreshData()
    },
    async refreshData () {
        let that = this,
            current = that.data.current;
        await that.getLocation();
        if (current === 2) {
            await that.getNoteSearch(that.data.notePage);
        } else if (current === 1) {
            await that.getItemSearch(that.data.itemPage);
        } else {
            await that.getShopSearchAll(that.data.shopPage);
        }
    },
    // 获取经纬度
    getLocation () {
        let that = this,
            lat_and_lon = {...app.globalData.lat_and_lon};
        if (that.isGetLocation) return;
        that.isGetLocation = true;
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
                that.isGetLocation = false;
                console.log(11);
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
                                that.isGetLocation = false;
                                console.log(3);
                                resolve()
                            },
                            rsp => {
                                that.isGetLocation = false;
                                console.log(4);
                                reject()
                            }
                        )
                    },
                    fail () {
                        that.isGetLocation = false;
                        console.log(5);
                        reject()
                    }
                });
            }
        }).catch(err => {
            console.log(6);
            that.isGetLocation = false;
        })
    },
    /**
     * 获取店铺搜索
     * @param p
     * @param setData
     * @param bol
     * @returns {*|Promise<any>}
     */
    getShopSearchAll (p = 1, setData = {}, bol) {
        let that = this,
            kw = that.data.search,
            filters = that.data.filters;
        if (that.isGetSearch) return;
        if (!filters.lon || !filters.lat) return;
        that.isGetSearch = true;
        if (!bol) {
            util2.showLoading();
        } else if (p === 1) {
            wx.vibrateShort({});
        }
        return ApiService.getShopSearchAll({...filters, kw, p}).finally(res => {
            that.isGetSearch = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData.shopList = [info];
                        // setData.tab0View = 'tab0';
                    } else if (res.info) {
                        setData[`shopList[${p - 1}]`] = info
                    }
                    setData.shopPage = p + 1;
                    setData.noMore0 = info.length !== 10;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData.shopPage = p - 1;
                    }
                    setData.noMore0 = true;
                }
                that.setData(setData);
                if (bol && p === 1) {
                    that.$Message({selector: '#message0', content: '刷新完成'})
                }
            }
        })
    },
    /**
     * 获取服务搜索
     * @param p
     * @param setData
     * @param bol
     * @returns {*|Promise<any>}
     */
    getItemSearch (p = 1, setData = {}, bol) {
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
        if (that.isGetSearch) return;
        if (!filters.lon || !filters.lat) return;
        that.isGetSearch = true;
        if (!bol) {
            util2.showLoading();
        }
        return ApiService.getItemSearch({...filters, kw, p}).finally(res => {
            that.isGetSearch = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData.itemList = [info];
                        // setData.tab1View = 'tab1';
                    } else if (res.info) {
                        setData[`itemList[${p - 1}]`] = info
                    }
                    setData.itemPage = p + 1;
                    setData.noMore1 = info.length !== 10;
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
     * 获取案例搜索
     * @param p
     * @param setData
     * @param bol
     * @returns {*|Promise<any>}
     */
    getNoteSearch (p = 1, setData = {}, bol) {
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
        if (that.isGetSearch) return;
        if (!filters.lon || !filters.lat) return;
        that.isGetSearch = true;
        if (!bol) {
            util2.showLoading();
        }
        return ApiService.getNoteSearch({...filters, kw, p}).finally(res => {
            that.isGetSearch = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData.noteList = [info];
                        // setData.tab2View = 'tab2';
                    } else if (res.info) {
                        setData[`noteList[${p - 1}]`] = info
                    }
                    setData.notePage = p + 1;
                    setData.noMore2 = info.length !== 10;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData.notePage = p - 1;
                    }
                    setData.noMore2 = true;
                }
                that.setData(setData);
                if (bol && p === 1) {
                    that.$Message({selector: '#message2', content: '刷新完成'})
                }
            }
        })
    },
    /**
     * 轮播图切换
     * @param e
     */
    bindSwiperChange (e) {
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
    handleTabChange (e) {
        let key = e.detail.key,
            tabList = this.data.tabList,
            fIndex = tabList.findIndex(v => {
                return v.key === key
            });
        if (fIndex > -1) {
            this.setData({current: fIndex});
        }
    },
    upper0 (e) {
        console.log(e, 'upper0');
        this.data.tab0TopStatus = true;
    },
    lower0 (e) {
        let that = this,
            page = that.data.shopPage;
        that.getShopSearchAll(page);
    },
    bindTabScroll0 (e) {
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
    handletouchend0 (e) {
    },
    upper1 (e) {
        console.log(e, 'upper1');
        this.data.tab1TopStatus = true;
    },
    lower1 (e) {
        let that = this,
            page = that.data.itemPage;
        that.getItemSearch(page);
    },
    bindTabScroll1 (e) {
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
    upper2 (e) {
        console.log(e, 'upper2');
        this.data.tab2TopStatus = true;
    },
    lower2 (e) {
        let that = this,
            page = that.data.notePage;
        that.getNoteSearch(page);
    },
    bindTabScroll2 (e) {
        let that = this,
            scrollTop = e.detail.scrollTop,
            scrollTop2 = this.data.scrollTop2;
        this.data.scrollTopArr[2] = scrollTop;
        switch (true) {
            case (scrollTop <= scrollTop2 - 25):
                this.setData({tab2TopStep: 1});
                break;
            case (scrollTop <= scrollTop2):
                this.setData({tab2TopStep: 0});
                break;
            default:
                this.setData({tab2TopStep: -1});
        }
        clearTimeout(timer2);
        timer2 = setTimeout(function () {
            if (that.data.tab2TopStatus) {
                let tab2TopStep = that.data.tab2TopStep,
                    x = that.data.scrollTopArr[2],
                    scrollTop2 = that.data.scrollTop2;
                switch (tab2TopStep) {
                    case 1:
                        that.setData({tab2TopStep: 2});
                        that.getNoteSearch(1, {tab2View: 'tab2', tab2TopStep: -1, tab2TopStatus: false}, true);
                        break;
                    default:
                        that.setData({tab2View: 'tab2', tab2TopStep: -1, tab2TopStatus: false});
                }
            }
        }, 100);
    },
    /**
     * 搜索输入
     * @param e
     */
    bindSearchInput (e) {
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
    /**
     * 取消搜索
     */
    bindSearchCancel () {
        this.$route.back();
    },
    toShopDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: "/page/shop/pages/home/index", query: {shop_id: id}});
        }
    },
    toItemDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: "/page/shop/pages/goods/index", query: {id: id}});
        }
    },
    toNoteDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (id) {
            this.$route.push({path: "/pages/cases/detail", query: {id: id}});
        }
    },
    zan(e){
        this.$giveALike(e);
    }
}

Page(new utilPage(appPage, methods));