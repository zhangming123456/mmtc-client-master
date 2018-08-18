// pages/item/detail.js
const app = getApp(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService'),
    config = require('../../utils/config'),
    c = require("../../utils/common");
let $wxParse = require('../../wxParse/wxParse');
let shop_id = 0;
var not_collected = 'https://app.mmtcapp.com/mmtc/imgs/collect@2x.png';
var collected = 'https://app.mmtcapp.com/mmtc/imgs/collected.png';
let loadFlag = [],
    item_id = 0,
    typePageMap,
    currentType = 0,
    isToBuyNow = false;

let timerGroup = null;

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page itemDetail',
        isShow: false,
        options: {},
        imageUrl: config.imageUrl,
        isShowLocation: true,
        item: {},
        showGotoTop: false,
        type: 0,
        loadingMore: [],
        loaded: false,
        noMore: [],
        goodsHidden: true,
        goods: {},
        collectImage: 'https://app.mmtcapp.com/mmtc/imgs/collect@2x.png',
        cases: [],
        recommends: [],
        id: null,
        countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        productCount: 1,
        currentTabsIndex: 0,
        currentTab: 0,
        technicianData: [],
        currentTabnoData: false,
        bannerData: {},
        couponData: {},
        colorData: [{
            type: 0,
            color: 'purple'
        },
            {
                type: 1,
                color: 'yellow'
            }
        ]

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        that.loadCb();
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow(options) {
        if (this.timeFlag) {
            return;
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        clearTimeout(timerGroup);
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clearTimeout(timerGroup);
    },
    /**
     * 页面渲染完成
     */
    onReady() {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {

    },
    onPageScroll(options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};


/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options,
            id = options['id'] || 1;

        ApiService.getPutFootPlace({
            id: id
        }).then(res => {
        },);
        loadFlag[1] = 0;
        item_id = id;
        loadFlag[0] = 1;
        currentType = 0;
        loadFlag[2] = 0;
        typePageMap = [];
        if (c.getStorage('love' + item_id)) {
            this.data.collectImage = collected;
            this.setData({
                collectImage: this.data.collectImage
            });
        }
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                let lat = res.latitude;
                let lon = res.longitude;
                c.showLoading();
                that.getGroupGetTtemV3({
                    id: id,
                    lat: lat,
                    lon: lon
                });
            }
        });
        this.loadCases();


    },
    // 优惠券
    doPicker: function (e) {
        var that = this;
        try {
            let item = e.target.dataset.item
            c.showLoading();
            c.get('/api/coupon/doPicker', {
                id: item.id
            }, function (res) {
                c.hideLoading();
                if (res.status == 1) {
                    var info = res.info;
                    app.util.failToast({
                        title: '您已领取',
                        duration: 1000,
                        mask: true
                    })
                } else {
                    c.alert(res.info);
                }
            });
        } catch (e) {

        }
    },
    // 技师
    getMmgShopIndex(id) {
        let that = this;
        ApiService.getMmgShopIndex({
            shop_id: id
        }).then(
            res => {
                if (res.status === 1 && res.info.length > 0) {
                    that.setData({
                        technicianData: res.info
                    })
                }
            },
            rsp => {

            }
        )
    },
    // 点击日记banner跳转H5页面
    showBannerLink(e) {
        let link = e.currentTarget.dataset.link;
        if (link) {
            try {
                if (link.indexOf('://') !== -1) {
                    link = encodeURIComponent(link);
                    wx.navigateTo({
                        url: '/pages/page/index?token=' + link,
                    })
                } else {
                    wx.navigateTo({
                        url: link,
                    })
                }
            } catch (e) {

            }
        }
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;

    },
    //点击切换
    clickTab: function (e) {

        var that = this,
            current = e.target.dataset.current;

        if (this.data.currentTab == current) {
            return;
        } else {
            that.setData({
                currentTab: current
            })
        }
    },
    // 跳转到更多点评
    gotoRemark() {
        wx.navigateTo({
            url: '/pages/item/moreremark'
        })
    },
    // 跳转到更多点评
    gotoTechnician() {
        wx.navigateTo({
            url: '/pages/technician/index?shop_id=' + this.data.item.shop_id
        })
    },
    async  getGroupGetTtemV3({id = 0, lat = 0, lon = 0} = {}) {
        let that = this;
        ApiService.getGroupgetItemV3({id: id, lat: lat, lon: lon}).then(async res => {
            if (res.status == 1) {
                let item = res.info;
                that.data.goods = res.info;
                that.data.goods.num = 1;
                that.data.shop = res.info.shop;
                shop_id = res.info.shop_id;
                that.loadRecommends(function () {
                    c.hideLoading();
                });
                $wxParse.wxParse('intro', 'html', res.info.intro, that);
                that.setData({
                    item,
                    loaded: true,
                    shop: that.data.shop,
                    goods: that.data.goods
                });
                if (item.group_num > 0) {
                    that.loadMsg();
                    that.loadGroupRows();
                }

                ApiService.getCouponInfo({
                    shop_id: res.info.shop_id
                }).then(
                    res => {
                        if (res.status) {
                            that.setData({
                                couponData: res.info
                            })
                        }
                    }
                )
                that.getMmgShopIndex(res.info.shop_id);
            } else {
                c.hideLoading();
            }
        });
    },
    async loadGroupRows() {
        let that = this;
        ApiService.getOtherGroups({item_id: item_id}).then(res => {
            if (res.status === 1) {
                if (res.info && res.info.rows.length && res.info.count) {
                    that.start_time = new Date().getTime();
                    that.countTime(res.info);
                }
            }
        });
    },
    countTime(data) {
        data = data || this.data.groupData;
        let that = this;
        let passedSeconds = parseInt((new Date().getTime() - this.start_time) / 1000);
        data.rows.forEach(function (el) {
            let left_seconds = el.left_seconds - passedSeconds;
            if (left_seconds > 0) {
                el.left_time = c.leftseconds2timestr(left_seconds);
            } else {
                el.left_time = '';
            }
        });
        this.setData({groupData: data});
        setTimeout(this.countTime.bind(this), 1000);
    },
    loadMsg() {
        let that = this,
            item = that.data.item;
        clearTimeout(timerGroup);
        if (item && item.group_num > 0) {
            ApiService.getMakeCollection({item_id: item_id}).then(res => {
                if (res.status === 1 && res.info.time != that.prevTime) {
                    that.prevTime = res.info.time;
                    that.setData({msgitem: res.info});
                    timerGroup = setTimeout(that.loadMsg.bind(that), 10000);
                } else {
                    this.setData({msgitem: null});
                    timerGroup = setTimeout(that.loadMsg.bind(that), 3000);
                }
            });
        }
    },
    loadCases() {
        let requestData = {
            item_id: item_id
        };
        let that = this;

        ApiService.getNotesOfItem({
            requestData
        }).then(res => {
            if (res.status == 1) {
                that.setData({
                    cases: c.wrapZan(res.info)
                });
            } else {
                c.alert(res.info);
            }
        });
    },
    loadRecommends(callback) {
        let url = '/api/wx2/getItemsOfShop';
        let requestData = {
            shop_id: shop_id,
            p: this.p || 1,
            item_id: item_id
        };
        let that = this;
        c.get(url, requestData, function (ret) {
            let setData = {};
            callback && callback();
            if (ret.status == 1) {
                if (ret.info.lengh < c.getPageSize()) {
                    setData.noMore = true;
                }
                setData.recommends = ret.info;
                that.setData(setData);
            } else {
                c.alert(ret.info);
            }
        });
        // ApiService.getItemsOfShop({
        //     requestData
        // }).then(res => {
        //     let setData = {};
        //     callback && callback();
        //     if (res.status == 1) {
        //         if (res.info.lengh < c.getPageSize()) {
        //             setData.noMore = true;
        //         }
        //         setData.recommends = res.info;
        //         that.setData(setData);
        //     } else {
        //         c.alert(res.info);
        //     }
        // });
    },
    makeCall(evt) {
        if (this.data.shop) {
            var service_phone = this.data.shop.service_phone;
            if (service_phone) {
                wx.makePhoneCall({
                    phoneNumber: service_phone //仅为示例，并非真实的电话号码
                });
            } else {
                wx.showToast({
                    title: '没有服务电话',
                    icon: 'success',
                    duration: 2000
                })
            }
        }
    },
    makeCollect(evt) {
        var that = this;
        c.hasLogin(function () {
            var key = 'love' + item_id;
            if (c.getStorage(key)) {
                that.data.collectImage = not_collected;
                c.removeStorage(key);
                c.toast('取消收藏成功');
                that.sendData(1);

            } else {
                that.data.collectImage = collected;
                c.setStorage(key, 1);
                c.toast('添加收藏成功');
                that.sendData(0);
            }
            that.setData({
                collectImage: that.data.collectImage
            });
        });
    },
    gotoShop() {
        //  wx.navigateBack({
        //    delta:9
        //  });
        wx.navigateTo({
            url: '/pages/car/index'
        });
    },
    gotoShopIndex() {
        if (shop_id) {
            wx.navigateTo({
                url: '/pages/home/index?shop_id=' + shop_id,
            })
        }
    },
    sendData(cancel) {
        // c.get('/api/mmg/makeCollection', {
        //     item_id: item_id,
        //     cancel: cancel
        // });

        ApiService.getMakeCollection({
            item_id: item_id,
            cancel: cancel
        }).then(res => {

        });
    },
    reduceNum(evt) {
        if (this.data.goods.num > 1) {
            this.data.goods.num--;
            this.setData({
                goods: this.data.goods
            });
        }
    },
    addNum(evt) {
        if (!this.data.goods.num) {
            this.data.goods.num = 0;
        }
        this.data.goods.num++;
        this.setData({
            goods: this.data.goods
        });
    },
    changeNum(evt) {
        var num = evt.detail.value;
        this.data.goods.num = parseInt(num);
    },
    addToCart() {
        isToBuyNow = false;
        var that = this;
        that.setData({
            goodsHidden: false
        });
    },
    doAddToCart(e) {
        var that = this;
        that.setData({
            goodsHidden: true
        });
        c.hasLogin(function () {
            if (!isToBuyNow) {
                c.post('/api/cart/addToCart', {
                    item_id: item_id,
                    num: that.data.goods.num
                }, function (res) {
                    if (res.status == 1) {
                        c.toast('加入购物车成功');
                        c.flushCarts();
                    }
                });
            } else {
                wx.navigateTo({
                    url: '/pages/car/payOrder?item_id=' + item_id + '&num=' + that.data.goods.num
                });
            }
        });
    },
    buyNow() {
        isToBuyNow = true;
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1'
        });
        // var that = this;
        // that.data.goodsHidden = false;
        // that.setData({
        //   goodsHidden: false
        // });
    },
    buyNow2() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/car/payOrder?item_id=' + item_id + '&num=1'
            });
        });
    },
    goodsInnerTap(e) {

    },
    showMasker() {
        this.setData({
            IsshowMasker: true
        });
    },
    closeMasker() {
        this.setData({
            IsshowMasker: false
        });
    },
    showeDiscount() {
        this.setData({
            IsshowDiscount: true
        });
    },
    closeDiscount() {
        this.setData({
            IsshowDiscount: false
        });
    },
    closeGoodsMasker() {
        this.setData({
            goodsHidden: true
        });
    },
    zan(e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.cases.every(function (el) {
                if (el.id == id) {
                    el.zaned = true;
                    el.zan_count++;
                    that.setData({
                        cases: that.data.cases
                    });
                    return false;
                }
                return true;
            });
        });
    },
    showLocation(e) {
        if (this.data.shop) {
            var longitude = parseFloat(this.data.shop.lon);
            var latitude = parseFloat(this.data.shop.lat);
            wx.openLocation({
                latitude: latitude,
                longitude: longitude,
                name: this.data.shop.shop_name,
                address: this.data.shop.address,
                scale: 28
            });
        }
    },
    showGroupDetail() {
        wx.navigateTo({
            url: '/pages/item/groupdetail',
        })
    },
    groupBuy() {
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1&group=1'
        });
    },
    joinThisGroup(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1&group=1&group_id=' + id
        });
    },
    onShareAppMessage() {
        if (this.data.item) {
            return {
                imageUrl: c.absUrl(this.data.item.cover, 750),
                title: this.data.item.price + '元 ' + this.data.item.title
            };
        }
    },
    closeBuyListMasker() {
        this.setData({
            isShowingByList: false
        });
    },
    showBuyListArea() {
        if (this.data.groupData.count > 3) {
            this.setData({
                isShowingByList: true
            });
        }
    },
    noop() {

    },
    gotoHomePage() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onscroll(e) {
        if (e.detail.scrollTop > 300) {
            if (!this.data.showGotoTop) {
                this.setData({
                    showGotoTop: true
                });
            }

        } else {
            if (this.data.showGotoTop) {
                this.setData({
                    showGotoTop: false
                });
            }
        }
    },
    gotoTop() {
        this.setData({
            scrollTop: 0
        });
    },
    reportSubmit(e) {
        let formId = e.detail.formId;


        ApiService.getSaveFormIds({
            form_id: formId
        }).then(res => {

        });
    }
};

Page(new utilPage(appPage, methods));