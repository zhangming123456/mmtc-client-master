const config = require('../config');
import { HttpRequest } from "../ajax/http";
import regeneratorRuntime from '../runtime';//使用async，await
const $http = new HttpRequest();

import { login } from '../util'

class Payment {
    constructor () {
        this.shopApi = config.shopApi;
        this.appApi = config.appApi;
        this.url = config.host;
        this.api = config.defaultApi;
        this.token = null
    }

    /**
     * 立即购买(项目)
     * @param data
     * @param item_id
     * @param item_num
     * @param is_group  大于1 拼团
     * @param group_id
     * @param rmcids 优惠券ID  string  ID1，ID2。。。
     * @param activity_id 活动ID
     * @param resole
     * @param reject
     * @returns {*}
     */
    itemBuyNow ({item_id = 0, item_num = 1, is_group = 0, group_id = 0, rmcids = '', activity_id = ''}) {
        let that = this,
            data = {
                item_id,
                item_num,
                is_group,
                group_id,
                rmcids,
                activity_id
            };
        const api = '/wx2/getPayInfoOfBuyNow';
        return new Promise(async (resolve, reject) => {
            await login(true).finally(function (res) {
                data.code = res.code
            });
            await $http.post2(that.api + api, data).finally(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        });
    }

    /**
     * 立即购买（套卡）
     * @param card_id
     * @param num
     * @param invite_id
     * @param activity_id
     * @return
     */
    cardsBuyNow ({card_id, num = 1, invite_id = 0, activity_id = ''}) {
        let that = this,
            data = {card_id, num, invite_id, activity_id};
        const api = '/order_card/getPayInfoOfBuyNow';
        return new Promise(async (resolve, reject) => {
            await login(true).finally(function (res) {
                data.code = res.code
            });
            await $http.post2(that.api + api, data).finally(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        });
    }

    /**
     * 买单
     * @param order_no  需要支付的订单号
     * @return
     */
    payTheBill ({order_no}) {
        let that = this,
            data = {order_no};
        const api = '/wx2/getPayInfoOfBuy';
        return new Promise(async (resolve, reject) => {
            await login(true).finally(function (res) {
                data.code = res.code
            });
            await $http.post2(that.api + api, data).finally(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        });
    }


    /**
     * 下单(买单)
     * @param shop_id
     * @param totalMoney
     * @param noDiscountMoney
     * @param technician_ids
     * @param item_ids
     * @param content
     * @returns {*}
     */
    makeOrder ({shop_id, totalMoney, noDiscountMoney, technician_ids, item_ids, content}) {
        let that = this,
            data = {shop_id, totalMoney, noDiscountMoney, technician_ids, item_ids, content};
        const api = '/wx2/makeOrder2';
        return $http.post2(that.api + api, data);
    }

    

    /**
     * 再支付
     * @param billId
     * @param resole
     * @param reject
     * @returns {*}
     */
    oldItemBuyNow({billId = 0}) {
        let that = this,
            data = {
                billId
            };
        const api = '/wx2/getPayInfoOfOrder';
        return new Promise(async (resolve, reject) => {
            await login(true).finally(function (res) {
                data.code = res.code
            });
            await $http.get(that.api + api, data).finally(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        });
    }
}


module.exports = Payment;
