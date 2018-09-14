const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService'),
    config = require('../../../../utils/config');
let $wxParse = require('../../../../wxParse/wxParse');
let shop_id = 0;
let isToBuyNow = false;
let timerGroup = null;

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page itemDetail',
        isShowLocation: true,
        showGotoTop: false,
        type: 0,
        page: 1,
        lat: 0,
        lon: 0,
        // item: {},
        loadingMore: [],
        loaded: false,
        noMore: false,
        goodsHidden: true,
        goods: {},
        collectImage: 'https://app.mmtcapp.com/mmtc/imgs/collect@2x.png',
        cases: [],
        recommends: [],
        countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        productCount: 1,
        currentTab: 0,
        tabList: [
            {
                key: "tab0",
                title: "项目详情"
            },
            {
                key: "tab1",
                title: "购买须知"
            },
            {
                key: "tab2",
                title: "美丽日记"
            }
        ],
        technicianData: [],
        currentTabnoData: false,
        bannerData: {},
        couponData: {},
        colorData: [
            {
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
        that.getPutFootPlace(that.data.options.id)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow(options) {
        if (this.data.isShow) {
            this.loadCb()
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
        let that = this,
            page = that.data.page,
            lat = that.data.lat,
            lon = that.data.lon;
        this.getItemsOfShop({p: page, lat, lon});
    },
    onPageScroll(options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {
        let goods = this.data.goods;
        if (goods && goods.cover && goods.title) {
            return {
                imageUrl: util2.absUrl(goods.cover, 750),
                title: `${goods.price}元${goods.title}`
            };
        }
    }
};


/**
 * 方法类
 */
const methods = {
    async loadCb() {
        let that = this,
            options = that.data.options,
            id = options.id;
        let lat, lon;
        util2.showLoading();
        await util2.getLocation().finally(res => {
            if (res.status === 1) {
                let info = res.info;
                lat = info.latitude;
                lon = info.longitude;
                that.setData({lat, lon});
            }
        });
        await that.getGroupGetTtemV3({id, lat, lon});
        await that.getMmgShopIndex();
        await that.getItemsOfShop({lat, lon});
        await that.getOtherGroups();
        await util2.hideLoading(true)
    },
    /**
     * 项目信息
     * @param id
     * @param lat
     * @param lon
     * @return {*}
     */
    getGroupGetTtemV3({id = 0, lat, lon} = {}) {
        let that = this;
        if (!id)return;
        return ApiService.getGroupgetItemV3({id, lat, lon}).finally(res => {
            if (res.status === 1) {
                let info = res.info;
                let shop = info.shop;
                let intro = info.intro;
                info.num = 1;
                $wxParse.wxParse('intro', 'html', intro, that);
                let label = []
                for (let v of info.item_label) {
                    if (v.title) {
                        label.push(v.title)
                    }
                }
                info.item_label = util2.unique(label);
                that.setData({shop, goods: info});
            }
        });
    },
    // 技师
    getMmgShopIndex() {
        let that = this;
        let goods = that.data.goods;
        if (!goods || !goods.shop_id) return;
        return ApiService.getMmgShopIndex({shop_id: goods.shop_id}).finally(res => {
                if (res.status === 1 && res.info.length > 0) {
                    that.setData({technicianData: res.info})
                }
            }
        )
    },
    // 拼团信息
    getOtherGroups() {
        let that = this,
            goods = that.data.goods;
        clearTimeout(timerGroup);
        if (goods && goods.group_num > 0) {
            return ApiService.getOtherGroups({item_id: goods.id}).finally(res => {
                if (res.status === 1 && res.info.time != that.prevTime) {
                    that.prevTime = res.info.time;
                    that.setData({groupData: res.info});
                    timerGroup = setTimeout(that.getOtherGroups.bind(that), 10000);
                } else {
                    this.setData({groupData: {}});
                    timerGroup = setTimeout(that.getOtherGroups.bind(that), 3000);
                }
            });
        }
    },
    /**
     * 优惠卷（获取）
     */
    getCouponInfo(){
        let that = this;
        let goods = that.data.goods;
        if (!goods || !goods.shop_id) return;
        return ApiService.getCouponInfo({shop_id: goods.shop_id}).finally(res => {
                if (res.status) {
                    that.setData({couponData: res.info})
                }
            }
        )
    },
    /**
     * 其他推荐
     * @param p
     * @param lat
     * @param lon
     */
    getItemsOfShop({p = 1, lat, lon} = {}) {
        let that = this;
        let goods = that.data.goods;
        if (!goods || !goods.shop_id || !goods.id) return;
        if (that.isItemsOfShop || that.data.noMore) return;
        that.isItemsOfShop = true;
        return ApiService.getItemsOfShop({shop_id: goods.shop_id, p, item_id: goods.id, lat, lon}).finally(res => {
            that.isItemsOfShop = false;
            let setData = {};
            if (res.status === 1) {
                let items = res.info;
                if (items.length > 0) {
                    if (p === 1) {
                        setData[`recommends`] = [items]
                    } else {
                        setData[`recommends[${p - 1}]`] = items
                    }
                    setData[`page`] = p + 1;
                    setData.noMore = items.length !== 10;
                } else if (items.length === 0) {
                    if (p > 1) {
                        setData[`page`] = p - 1;
                    }
                    setData.noMore = true;
                }
                that.setData(setData)
            }
        });
    },
    /**
     * 项目详情日记
     */
    getNotesOfItem() {
        let that = this;
        let goods = that.data.goods;
        util2.showLoading();
        ApiService.getNotesOfItem({item_id: goods.id}).finally(res => {
            util2.hideLoading(true);
            if (res.status === 1) {
                that.setData({cases: res.info});
            }
        });
    },
    /**
     * 商品浏览记录
     * @param id
     */
    getPutFootPlace(id){
        id && ApiService.getPutFootPlace({id})
    },
    /**
     * 优惠券（领取）
     * @param e
     */
    doPicker: function (e) {
        let that = this;
        let item = e.target.dataset.item;
        try {
            util2.showLoading();
            ApiService.couponDoPicker({id: item.id}).finally(res => {
                util2.hideLoading(true);
                if (res.status === 1) {
                    let info = res.info;
                    util2.failToast("您已领取")
                } else {
                    that.$Toast({content: res.message})
                }
            })
        } catch (e) {

        }
    },
    // 点击广告
    showBannerLink(e) {
        let link = e.currentTarget.dataset.link;
        try {
            if (util2.regExpUtil.isUrlPath(link)) {
                this.$route.push({path: "/pages/page/index", query: {token: link}});
            } else if (/^(\/page)/.test(link)) {
                this.$route.push(link);
            }
        } catch (e) {

        }
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
    },
    //点击切换
    clickTab: function ({detail}) {
        let key = 0,
            currentTab = this.data.currentTab;
        try {
            key = Number(detail.key.replace(/[^\d]/g, ''));
        } catch (e) {

        }
        if (currentTab === key)return;
        if (key === 2) {
            this.getNotesOfItem()
        }
        this.setData({currentTab: key});
    },
    toGo(e, t){
        let that = this,
            dataset = e && e.currentTarget.dataset,
            type = t || dataset.type,
            num = 1;
        let goods = this.data.goods;
        num = goods.num;
        if (!type)return;
        if (type === 'technician' && goods && goods.shop_id) {
            this.$route.push({path: "/pages/technician/index", query: {shop_id: goods.shop_id}})
        } else if (type === "group_rule") {
            that.$route.push("/pages/item/groupdetail")
        } else if (type === "review") {
            that.$route.push("/pages/item/moreremark")
        } else if (type === 'group_buy') {
            let id = dataset.id,
                query = {item_id: goods.id, num, group: 1};
            if (id) {
                query.group_id = id
            }
            this.$route.push({path: "/pages/car/payOrder", query});
        } else if (type === 'buy') {
            isToBuyNow = true;
            this.$route.push({path: "/pages/car/payOrder", query: {item_id: goods.id, num}});
            this.setData({goodsHidden: true});//关闭购物车
        } else if (type === 'home') {
            this.$route.tab("/page/tabBar/home/index")
        } else if (type === "shop_home") {
            that.toShopHome(goods.shop_id)
        } else if (type === "car") {
            this.$route.push("/pages/car/index")
        }
    },
    zan(e){
        this.$giveALike(e, "cases");
    },
    // getOtherGroups(id) {
    //     let that = this;
    //     return ApiService.getOtherGroups({item_id: id}).then(res => {
    //         if (res.status === 1) {
    //             if (res.info && res.info.rows.length && res.info.count) {
    //                 that.start_time = new Date().getTime();
    //                 that.countTime(res.info);
    //             }
    //         }
    //     });
    // },
    // countTime(data) {
    //     data = data || this.data.groupData;
    //     let that = this;
    //     let passedSeconds = parseInt((new Date().getTime() - this.start_time) / 1000);
    //     data.rows.forEach(function (el) {
    //         let left_seconds = el.left_seconds - passedSeconds;
    //         if (left_seconds > 0) {
    //             el.left_time = c.leftseconds2timestr(left_seconds);
    //         } else {
    //             el.left_time = '';
    //         }
    //     });
    //     this.setData({groupData: data});
    //     setTimeout(this.countTime.bind(this), 1000);
    // },
    // 收藏设置
    // 收藏
    makeCollect() {
        let that = this;
        let goods = this.data.goods;
        if (that.isMakeCollect)return;
        that.isMakeCollect = true;
        util2.showLoading();
        let cancel = !goods.collection ? 1 : 0;
        ApiService.getMakeCollection({item_id: goods.id, cancel}).finally(res => {
            that.isMakeCollect = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                if (cancel === 1) {
                    util2.showToast("添加收藏成功")
                } else if (cancel === 0) {
                    util2.showToast("取消收藏成功")
                }
                that.setData({[`goods.collection`]: cancel});
            } else {
                util2.failToast(res.message || "收藏操作失败")
            }
        });
    },
    /**
     * 导航到店
     * @param e
     */
    showLocation(e) {
        let shop = this.data.shop;
        if (shop && shop.lon) {
            wx.openLocation({
                latitude: shop.lat,
                longitude: shop.lon,
                name: shop.shop_name,
                address: shop.address,
                scale: 28
            });
        }
    },
    reduceNum(evt) {
        let num = this.data.goods.num
        if (num > 1) {
            num--;
            this.setData({[`goods.num`]: num});
        }
    },
    addNum() {
        let num = this.data.goods.num;
        if (!num) {
            num = 0
        }
        if (num > 1) {
            num++;
        }
        this.setData({[`goods.num`]: num});
    },
    changeNum(evt) {
        let num = evt.detail.value;
        this.setData({[`goods.num`]: parseInt(num)});
    },
    addToCart() {
        isToBuyNow = false;
        let that = this;
        that.setData({
            goodsHidden: false
        });
    },
    doAddToCart(e) {
        let that = this;
        let goods = that.data.goods;
        that.setData({goodsHidden: true});
        if (!goods || !goods.id)return;
        if (!isToBuyNow) {
            ApiService.cartAddToCart({item_id: goods.id, num: goods.num}).finally(res => {
                if (res.status === 1) {
                    util2.showToast('加入购物车成功');
                }
            })
        } else {
            that.toGo(e, "buy")
        }
    },
    showMasker() {
        this.setData({IsshowMasker: true});
    },
    closeMasker() {
        this.setData({IsshowMasker: false});
    },
    showeDiscount() {
        this.setData({IsshowDiscount: true});
    },
    closeDiscount() {
        this.setData({IsshowDiscount: false});
    },
    closeGoodsMasker() {
        this.setData({goodsHidden: true});
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
    onscroll(e) {
        if (e.detail.scrollTop > 300) {
            if (!this.data.showGotoTop) {
                this.setData({showGotoTop: true});
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
        ApiService.getSaveFormIds({form_id: formId})
    }
};

Page(new utilPage(appPage, methods));