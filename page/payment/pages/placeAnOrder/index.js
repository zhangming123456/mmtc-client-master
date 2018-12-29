const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    ApiService = require('../../../../utils/ApiService/index');
import { AzmPage } from '../../../../utils/common/index.js'

AzmPage({
    data: {
        text: "Page placeAnOrder",
        cart_items: [], //多个项目信息
        is_group: 0,//是否拼团
        item_id: 0,//项目ID
        group_id: 0,//拼团ID
        activity_id: 0,//活动ID
        platformCoupons: [], //平台优惠券
        total_money: 0, //支付价格
        actual_total_money: 0, //实际价格
        original_price: 0, //原价
        selectCoupons: {},//优惠券选择
        isOpenNotice: false,
        minusStatus: 'disabled',// 使用data数据对象设置样式名
        stepper: {
            // 当前 stepper 数字
            stepper: 1,
            // 最小可到的数字
            min: 1,
            // 最大可到的数字
            max: 100,
            // 小尺寸, 默认大尺寸
            size: 'small'
        },
        popupData: [], //弹出框数据
        popupDataKey: '',
        isOpenCouponPopup: false,
        doNotUseCoupons: {
            id: 0,
            title: '不使用优惠券'
        }
    },
    onLoad: function (options) {
        let that = this;
        if (util2.hasLogin(true) > 0) {
            that.loadCb();
        } else {
            that.setData({isShowLogin: true})
        }
    },
    watch: {
        actual_total_money: function (n, o) {
            console.log(n, o);
        }
    },
    methods: {
        loadCb () {
            let that = this,
                options = that.data.options,
                item_id = options.item_id,
                group_id = options.group_id || 0,
                activity_id = options.activity_id || 0,
                is_group = options.group || 0;
            util2.showLoading();
            that.setData({is_group, item_id, group_id, activity_id});
            if (is_group) {
                wx.setNavigationBarTitle({title: '确认团单'});
            }
            this.getItemBuyInfo(item_id, is_group)
        },
        // 登录回调成功
        loginCallback () {
            this.setData({isShowLogin: false});
            this.loadCb();
        },
        /**
         * 设置价格
         * @param setData
         * @param cart_items
         */
        setTotalMoney (setData = {}, cart_items = []) {
            if (cart_items.length === 0) {
                cart_items = this.data.cart_items;
            }
            let that = this,
                total_money = 0,
                is_group = that.data.is_group,
                selectCoupons = that.data.selectCoupons;
            // 计算项目价格
            for (let v of cart_items) {
                for (let item of v.items) {
                    if (is_group) {
                        total_money += +item.group_price
                    } else {
                        total_money += +item.price * item.num
                    }
                }
            }
            let cond = total_money,
                original_price = total_money;
            // 根据优惠券计算价格
            for (let k in selectCoupons) {
                let val = selectCoupons[k];
                if (!val) continue;
                if (val.cond <= cond && !!val.id) {
                    total_money -= +val.price
                } else if (!val.id) {

                } else {
                    setData[`selectCoupons.${k}`] = undefined;
                }
            }
            total_money = util2.money(total_money);
            let actual_total_money = total_money;
            if (total_money <= 0) {
                total_money = 0.01
            }
            that.setData(Object.assign(setData, {
                total_money,
                actual_total_money,
                original_price
            }));
        },
        /**
         * 获取项目信息
         * @param item_id 项目ID
         * @param is_group 是否拼团
         * @returns {*}
         */
        getItemBuyInfo (item_id, is_group) {
            let that = this;
            return ApiService.getItemBuyInfo({item_id, is_group}).finally(res => {
                util2.hideLoading();
                if (res && res.status === 1) {
                    let info = res.info,
                        setData = {},
                        platformCoupons = info.coupons || [],
                        shopCoupons = [],
                        cart_items = info.cart_items || [];
                    setData = {platformCoupons, cart_items};
                    that.setTotalMoney(setData, cart_items);
                } else {

                }
            });
        },
        /**
         * 选择优惠券
         * @param e
         */
        bindSelectItem (e) {
            let that = this,
                dataset = e.currentTarget.dataset,
                key = dataset.key,
                actual_total_money = that.data.actual_total_money,
                original_price = that.data.original_price,
                selectCoupons = that.data.selectCoupons,
                item = dataset.item;
            if (selectCoupons[key] && selectCoupons[key].id === item.id) {

            } else if (item.id && (actual_total_money < 0 || item.cond > original_price)) {
                return;
            }
            this.bindHideCouponPopup(null, {
                [`selectCoupons.${key}`]: item
            });
            this.setTotalMoney();
        },
        /**
         * 打开优惠券popup
         * @param e
         */
        bindShowCouponPopup (e) {
            if (this.data.isOpenCouponPopup) return;
            let dataset = e.currentTarget.dataset,
                key = dataset.key,
                coupons = dataset.coupons;
            this.setData({
                popupData: coupons,
                popupDataKey: key,
                isOpenCouponPopup: true
            });
        },
        /**
         * 关闭优惠券popup
         * @param e
         */
        bindHideCouponPopup (e, setData = {}) {
            this.setData(Object.assign(setData, {
                popupData: [],
                popupDataKey: '',
                isOpenCouponPopup: false
            }))
        },
        /**
         * 设置数量
         * @param e
         * @param type 加减类型
         * @returns {null}
         */
        handleAzmStepperChange (e, type) {
            const dataset = e.currentTarget.dataset,
                disabled = dataset.disabled,
                key = dataset.key;
            let stepper = dataset.stepper,
                step = 1;
            if (disabled) return null;

            if (type === 'minus') {
                stepper -= step;
            } else if (type === 'plus') {
                stepper += step;
            }
            this.setData({
                [`${key}`]: stepper
            });
            this.setTotalMoney();
        },
        /* 点击加号 */
        handleAzmStepperPlus (e) {
            this.handleAzmStepperChange(e, 'plus');
        },
        /* 点击减号 */
        handleAzmStepperMinus (e) {
            this.handleAzmStepperChange(e, 'minus');
        },
        // 数量选择器
        onChangeNumber (e) {
            let stepper = e.detail.number,
                dataset = e.currentTarget.dataset || e.target.dataset,
                key = dataset.key;
            this.setData({
                [`${key}`]: stepper
            });
            this.setTotalMoney();
        },
        /**
         * 打开
         */
        bindShowNotice () {
            this.setData({
                isOpenNotice: !this.data.isOpenNotice
            })
        },
        // 立即付款
        bindBuyNow (e) {
            if (this.data.isRequestPayment) return;
            let that = this,
                sendData = {},
                selectCoupons = that.data.selectCoupons || {},
                cart_items = that.data.cart_items || {},
                total_money = that.data.total_money || {},
                item_id = that.data.item_id,
                group_id = that.data.group_id,
                items = [],
                is_group = that.data.is_group;
            if (that.data.isRequestPayment) {
                that.$route.go(-1);
                return;
            }
            that.data.isRequestPayment = true;
            for (let v of cart_items) {
                for (let item of v.items) {
                    items.push(item)
                }
            }
            if (is_group) {
                sendData = {
                    item_id: items[0].item_id,
                    item_num: items[0].num,
                    is_group: 1
                };
                if (group_id) {
                    sendData.group_id = group_id
                }
            } else {
                sendData = {
                    item_id: items[0].item_id,
                    item_num: items[0].num,
                    is_group: 0
                }
            }
            if (!sendData.rmcids) {
                sendData.rmcids = []
            }
            for (let k in selectCoupons) {
                let val = selectCoupons[k];
                sendData.rmcids.push(val.id)
            }
            sendData.rmcids = sendData.rmcids.join(',');
            let activity_id = that.data.activity_id
            if (activity_id) {
                sendData.activity_id = activity_id
            }
            util2.showLoading();
            that.data.isRequestPayment = true;
            ApiService.Payment.itemBuyNow(sendData).then(
                res => {
                    let info = res.info;
                    if (res.status === 1 && util2.jude.isEmptyObject(info) && parseFloat(info.total_money) == total_money) {
                        let payInfo = info.payInfo,
                            billId = info.billId,
                            no = info.no;
                        payInfo.complete = function (res) {
                            if (res.errMsg === 'requestPayment:ok') {
                                if (is_group) { // 是团购
                                    that.$route.replace({
                                        path: '/page/order/pages/groupDetails/index',
                                        query: {id: billId}
                                    })
                                } else {
                                    that.$route.replace('/pages/car/paySuccess');
                                }
                            } else {
                                if (is_group) {
                                    that.data.isRequestPayment = false;
                                    that.$Toast({content: '参团失败'})
                                } else if (billId) {
                                    that.$route.replace({
                                        path: '/page/order/pages/orderDetail/index',
                                        query: {id: billId}
                                    })
                                } else {
                                    that.$route.replace({path: '/page/order/pages/orderDetail/index', query: {no: no}});
                                }
                            }
                        };
                        wx.requestPayment(payInfo);
                    } else {
                        that.data.isRequestPayment = false;
                        that.$Toast({content: res.message || '支付失败'});
                    }
                }
            ).finally(res => {
                util2.hideLoading();
            });
        },
        bindShowToast (e) {
            let dataset = e.currentTarget.dataset,
                message = dataset.message;
            this.$Toast({content: message || '支付失败'});
        }
    }
});
