const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
let $wxParse = require('../../../../wxParse/wxParse');
const appPage = {
    data: {
        text: "Page mmtcTabList",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        currentTab: 0,
        card_id: null,
        bill_id: null,
        cardList: {},
        buyCardList: {},
        bgstyle: '',
        intro: null,
        show: false,
        isShowT: false,
        qrCode: '',
        invite_id: ''
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
        if (this.options.bill_id) {
            that.getOrderCardInfo(this.options.bill_id, this.options.status);
            that.setData({
                bill_id: this.options.bill_id,
                status: this.options.status
            })
        } else if (this.options.card_id) {
            that.getOrderShopCardInfo(this.options.card_id);
            that.setData({
                card_id: this.options.card_id,

            })
        } else {

        }
        wx.stopPullDownRefresh();
    },
    /**
     * 上拉触底
     */
    onReachBottom() {

    },

};
/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow,
            id = options.id;
        console.log(options);
        if (options.bill_id) {
            that.getOrderCardInfo(options.bill_id, options.status);
            that.setData({
                bill_id: options.bill_id,
                status: options.status
            })
        } else if (options.card_id) {
            that.getOrderShopCardInfo(options.card_id);
            that.setData({
                card_id: options.card_id
            })
        } else if (options.scene) {
            let data = util2.queryString.parse(options.scene)
            if (data.card_id) {
                that.getOrderShopCardInfo(data.card_id);
                that.setData({
                    card_id: data.card_id,
                    invite_id: data.invite_id
                })
            }
        } else {
            that.$route.back();
        }
    },
    loadData() {

    },

    // 跳转到项目详情
    gotoShopDetails(e) {
        console.log(e, 546465465465465465321);
        var item = e.currentTarget.dataset.item
        if (item && item.id) {
            this.$route.push({
                path: '/pages/item/detail',
                query: {
                    id: item.id
                }
            })
        }
    },


    // 分享二维码
    gotoShare() {

    },

    // 导航到店
    gotoNavShop() {
        if (this.data.buyCardList.info) {
            let data = {
                latitude: parseFloat(this.data.buyCardList.info.latitude),
                longitude: parseFloat(this.data.buyCardList.info.longitude),
                name: this.data.buyCardList.info.name,
                address: this.data.buyCardList.info.address,
                scale: 28
            };
            console.log(data);
            wx.openLocation(data);
        }
    },

    // 跳转到体验记录
    gotoRecord() {
        var item = this.data.bill_id;

        console.log(item, 444444444444444444444);

        this.$route.push({
            path: '/page/cardBag/pages/record/index',
            query: {
                bill_id: item
            }
        })
    },

    // 套卡详情(购买)
    getOrderShopCardInfo(card_id) {
        let that = this;
        ApiService.getOrderShopCardInfo({card_id}).finally(res => {
            if (res.status === 1) {
                let info = res.info;
                that.setData({
                    cardList: res.info
                })
                $wxParse.wxParse('intro', 'html', info.info.intro, that)
            } else {
                util2.failToast(res.message)
            }
        })
    },


    // 拨打商家电话
    makeCall(e) {
        let that = this;
        if (this.data.bill_id) {
            var service_phone = this.data.buyCardList.info.service_phone;
            if (service_phone) {
                wx.makePhoneCall({
                    phoneNumber: service_phone //仅为示例，并非真实的电话号码
                });
            }
        } else if (this.data.card_id) {
            var service_phone = this.data.cardList.info.service_phone;
            if (service_phone) {
                wx.makePhoneCall({
                    phoneNumber: service_phone //仅为示例，并非真实的电话号码
                });
            }
        } else {
            that.$Toast({
                content: "没有服务电话"
            })
        }
    },


    gotoMakeCall() {
        wx.makePhoneCall({
            phoneNumber: '4001848008' //仅为示例，并非真实的电话号码
        });
    },

    // 套卡详情(已购买)
    getOrderCardInfo(bill_id, status) {
        let that = this,
            imageUrl = that.data.imageUrl;
        ApiService.getOrderCardInfo({
            bill_id,
            status
        }).finally(res => {
            if (res.status === 1) {
                let img = imageUrl + res.info.bj.bj2;
                let info = res.info;
                if (!status) {
                    img = imageUrl + res.info.bj.bj1
                }
                that.setData({
                    buyCardList: res.info,
                    bgstyle: `background: url('${img}') no-repeat center center;`
                })
                console.log(res.info.intro, 544444444444444);

                $wxParse.wxParse('intro', 'html', info.info.intro, that)
            }
        })
    },

    // 点击查看卷码
    gotoLookCard(e) {
        console.log(e, 5121212121212);
        var item = this.data.options.bill_id;
        var card_id = e.currentTarget.dataset.item;

        console.log(item);
        if (card_id && card_id.card_item_id) {
            this.$route.push({
                path: '/page/cardBag/pages/cardCode/index',
                query: {
                    bill_id: item,
                    card_item_id: card_id.card_item_id
                }
            })
        }


    },

    // 购买
    bindbuy() {
        let card_id = this.data.card_id,
            invite_id = this.data.invite_id,
            cardList = this.data.cardList;
        if (!card_id) return;
        this.$route.push({
            path: '/page/cardBag/pages/setBuy/index',
            query: { ...cardList.info,
                invite_id
            }
        })
    },

    // 跳转到店铺
    gotoShop() {
        if (this.data.bill_id) {
            var item = this.data.buyCardList.info.shop_id;
            console.log(item, 866666666666);
            this.$route.push({
                path: '/page/shop/pages/home/index',
                query: {
                    shop_id: item
                }
            })
        } else if (this.data.card_id) {
            var item = this.data.cardList.info.shop_id;
            console.log(item, 866666666666);
            this.$route.push({
                path: '/page/shop/pages/home/index',
                query: {
                    shop_id: item
                }
            })
        } else {

        }


    },


    // 获取分享二维码
    showShopQRCode() {
        let that = this;
        let card_id = that.data.card_id

        if (!card_id) return;
        ApiService.showShopQrcodeOp({
            page: `page/cardBag/pages/setDetails/index`,
            scene: `card_id=${card_id}`
        }).finally(res => {
            if (res.status === 1 && res.info.path) {
                that.setData({
                    qrCode: res.info.path
                })
            } else {
                that.$Toast({
                    content: res.message
                })
            }
        })
    },


   


    togglePopup() {
        this.setData({
            isShowT: !this.data.isShowT
        });
        this.showShopQRCode()
    },

    //滑动切换
    swiperTab: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    // 点击下载二维码
    downloadImage(){
        let qrCode = this.data.qrCode, that = this;
        if (qrCode) {
            wx.saveImageToPhotosAlbum({
                filePath: qrCode,
                complete(res){
                    if (res.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
                        util2.failToast('取消保存')
                    } else if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                        util2.showToast('保存成功');
                    } else if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                        that.$route.push('/page/public/pages/authorization/index')
                    } else {
                        util2.failToast('保存失败')
                    }
                }
            })
        }
    }

};
Page(new utilPage(appPage, methods));