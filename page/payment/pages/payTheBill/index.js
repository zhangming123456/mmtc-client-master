const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index'),
    qrcode = require("../../../../utils/qrcode.js");

let discount_type, reduce_discount, toPayMoney = 0;
const appPage = {
    data: {
        nickname: '',
        imageUrl: config.imageUrl,
        cover: '',
        isShowKey: true, //键盘弹起
        totalMoney: '', //消费金额
        isRemark: false,
        shop_id: ''
    },

    onLoad: function (options) {
        let that = this;
        if (util2.hasLogin(true) > 0) {
            that.loadCb();
        } else {
            that.setData({isShowLogin: true})
        }
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        if (this.data.isShow) {
            let data = wx.getStorageSync("remark");
            let isRemark = false;
            if (data) {
                switch (true) {
                    case (data.firstCategoryArr && data.firstCategoryArr.length > 0):
                        isRemark = true;
                        break;
                    case (data.secondCategoryArr && data.secondCategoryArr.length > 0):
                        isRemark = true;
                        break;
                    case (data.option):
                        isRemark = true;
                        break;
                    default:
                        isRemark = false;
                }
            }
            this.setData({isRemark})
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
    onReachBottom () {

    },

};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        //清除缓存
        wx.removeStorageSync("remark");
        let that = this;
        let options = that.data.options;
        util2.showLoading();
        let shop_id = options.shop_id;
        if (options.scene) {
            let shop = options.scene.split(":");
            shop_id = shop[1]
        }
        if (!shop_id) {
            that.$route.tab('/page/tabBar/home/index')
        }
        that.data.shop_id = shop_id;
        ApiService.getShopBuyInfo_new({id: shop_id}).finally(res => {
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info) {
                    let discount = '';
                    discount_type = info.discount_type;
                    if (info.discount_type == 1) {
                        reduce_discount = ((10 * 100 - Math.ceil(info.discount * 100)) / 100 / 10).toFixed(2);
                        discount = info.discount + ' 折';
                    } else {
                        let v = info.discount.split(':');
                        reduce_discount = {
                            count_money: Math.ceil(v[0]) || 0,
                            reduce_money: Math.ceil(v[1]) || 0,
                            max_reduce: Math.ceil(v[2]) || 0,
                            repeated: Math.ceil(v[3]) || 0
                        };
                        discount = (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + (reduce_discount.max_reduce > 0 ? ',最多减' + reduce_discount.max_reduce : '');
                    }
                    that.setData({
                        nickname: that.data.nickname = info.nickname,
                        cover: that.data.cover = info.cover,
                        discount,
                        shop_id
                    });
                }
            }
        });
    },

    // 登录回调成功
    loginCallback () {
        this.setData({isShowLogin: false});
        this.loadCb();
    },

    checkDiscount: function (e) {
        this.setData({
            hasDiscount: this.data.hasDiscount = !this.data.hasDiscount
        });
        this.calMoney();
    },
    totalMoneyInput: function (e) {
        this.data.totalMoney = app.util.moneyFloor(e.detail.value) || 0
        this.calMoney();
        return this.data.totalMoney
    },
    calMoney: function () {
        let discountFlag = this.data.hasDiscount,
            totalMoney = parseFloat(this.data.totalMoney) || 0,
            noDiscountMoney = parseFloat(this.data.noDiscountMoney) || 0;
        if (!discountFlag) {
            noDiscountMoney = 0;
        }
        if (noDiscountMoney > totalMoney) {
            noDiscountMoney = totalMoney;
        }
        let discountSum = 0;
        if (discount_type == 1) {
            discountSum = ((totalMoney * 100 - noDiscountMoney * 100) / 100 * reduce_discount).toFixed(2);
        } else {
            let calMoney = totalMoney - noDiscountMoney;
            if (calMoney >= reduce_discount.count_money && reduce_discount.count_money > 0) {
                let reduce = reduce_discount.reduce_money;
                if (reduce_discount.repeated) {
                    reduce = Math.floor(calMoney / reduce_discount.count_money) * reduce;
                }
                if (reduce_discount.max_reduce > 0 && reduce > reduce_discount.max_reduce) {
                    reduce = reduce_discount.max_reduce;
                }
                discountSum = reduce.toFixed(2);
            }
        }
        let money = totalMoney - discountSum;
        if (money <= 0.01 && totalMoney > 0) {
            money = 0.01
        }
        if (discountSum != 0 && money != 0) {
            this.data.discountSum = '-￥' + discountSum;
        } else {
            this.data.discountSum = 0;
        }
        money = money.toFixed(2);
        if (money > 0) {
            this.data.actMoney = money;
            this.data.actMoneyUnit = ' 元';
        } else {
            this.actMoney = '';
            this.actMoneyUnit = '';
        }
        if (money > 0) {
            this.data.submitBtnEnabled = true;
        } else {
            this.data.submitBtnEnabled = false;
        }
        toPayMoney = money;
        if (this.data.totalMoney == '' || this.data.totalMoney == 0) {
            this.data.actMoney = ''
        }
        this.setData({
            toPayMoney: toPayMoney,
            actMoney: this.data.actMoney,
            discountSum: this.data.discountSum,
            submitBtnEnabled: this.data.submitBtnEnabled,
            actMoneyUnit: this.data.actMoneyUnit
        });
    },
    //定义键盘隐藏
    onKeyUpBlur: function () {
        let that = this
        that.setData({
            isShowKey: true
        })
    },

    // 完成关闭
    onKeyUpBlur2 () {
        let that = this
        that.setData({
            isShowKey: false
        })
    },
    //点击键盘显示，消费input显示
    clickNum (e) {
        let that = this
        let num = e.target.dataset.num
        let totalMoney = that.data.totalMoney + num

        if (totalMoney.length > 1) {
            if (totalMoney.substring(0, 1) == 0 & totalMoney.substring(1, 2) == 0) {
                totalMoney = 0
            } else if (totalMoney.substring(0, 1) == 0 & totalMoney.substring(1, 2) != '.') {
                return
            }
        }


        //输入框 最多显示8位数字
        if (that.data.totalMoney.length == 8) return
        that.setData({
            totalMoney: totalMoney
        })


        that.calMoney()
    },
    //自定义键盘 删除事件
    deleteNum: function () {
        let that = this
        let num = that.data.totalMoney.substr(0, that.data.totalMoney.length - 1)
        // if (that.data.totalMoney == 0) {
        //     num = 0
        // }
        that.setData({
            totalMoney: num
        });
        that.calMoney()
    },


    gotoRemarks () {
        let shop_id = this.data.shop_id;
        this.$route.push({
            path: '/page/payment/pages/remarks/index',
            query: {shop_id}
        })
    },

    noDiscountMoneyInput: function (e) {
        let that = this
        let v = app.util.moneyFloor(e.detail.value);
        let totalMoney = this.data.totalMoney;
        if (totalMoney && v) {
            v = parseFloat(v);
            if (totalMoney <= v) {
                that.setData({
                    noDiscountMoney: totalMoney - 0.01
                })
            } else {
                that.setData({
                    // noDiscountMoney: v
                })
            }
        } else {
            that.setData({
                // noDiscountMoney: 0
            })
        }
        this.calMoney();
        return v
    },
    submitOrder: function (e) {
        let that = this;
        let remark = wx.getStorageSync("remark");
        let technician_ids = remark.firstCategoryArr;
        let item_ids = remark.secondCategoryArr;
        let content = remark.option
        let shop_id = this.data.shop_id
        if (this.data.submitBtnEnabled) { // can
            let noDiscountMoney = this.data.noDiscountMoney;
            if (!this.data.hasDiscount) {
                noDiscountMoney = 0;
            }
            util2.showLoading();
            ApiService.Payment.makeOrder({
                shop_id,
                totalMoney: this.data.totalMoney,
                noDiscountMoney: noDiscountMoney,
                technician_ids: technician_ids,
                item_ids: item_ids,
                content: content
            }).finally(res => {
                util2.hideLoading(true);
                if (res.status === 1) {
                    that.$route.push({
                        path: '/page/payment/pages/orderPay/index',
                        query: {
                            money: res.info.money,
                            order_no: res.info.order_no
                        }
                    });
                } else {
                    util2.failToast(res.message || '下单失败...');
                }
            });
        }
    },


    toHome (e) {
        let shop_id = this.data.shop_id;
        wx.setStorageSync('shop_id', shop_id)
        this.$route.tab("/page/tabBar/home/index")
    }
};
Page(new utilPage(appPage, methods));
