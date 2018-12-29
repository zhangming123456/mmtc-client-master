const config = require('../config');
import { HttpRequest } from "../ajax/http";
import regeneratorRuntime from '../runtime';//使用async，await
const $http = new HttpRequest();

class OldApi {
    constructor () {
        this.shopApi = config.shopApi;
        this.appApi = config.appApi;
        this.url = config.host;
        this.api = config.defaultApi;
        this.token = null
    }

    /**
     * category/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCategoryDataList (data = {}, resole, reject) {
        let that = this;
        const api = '/category/dataList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取项目列表数据goodsList
     * category/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     * lon=114.05454&lat=22.52291&category_id=18&near_type=-1&sort=1&type_id=1&_f=1
     */
    getGroupGoodsList (data = {
        category_id: 0,
        near_type: 0,
        sort: 0,
        type_id: 0
    }, resole, reject) {
        let that = this;
        const api = '/group/goodsList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * /trading/getData
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     * lon=114.05454&lat=22.52291&category_id=18&near_type=-1&sort=1&type_id=1&_f=1
     */
    getTradingGetData (data = {}, resole, reject) {
        let that = this;
        const api = '/trading/getData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * order/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getOrderDataList (data = {
        type: 0,
        p: 1
    }, resole, reject) {
        let that = this;
        const api = '/order/dataList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取附近项目列表
     * /shop/filterData
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getShopFilterData (data = {
        lan: 0,
        lat: 0,
        p: 0
    }, resole, reject) {
        let that = this;
        const api = '/shop/filterData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 验证登录信息
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2CheckSession (data = {}, resole, reject) {
        let that = this;
        const api = '/wx2/checkSession';
        const http = $http.get(that.api + api, data, resole, reject).finally(res => {
            if (res.status === 1 && res.info && res.info.userInfo) {
                wx.setStorageSync('_userInfo_', res.info.userInfo)
            } else {
                wx.setStorageSync('_userInfo_', {})
            }
        });
        return http;
    }

    /**
     * 登入
     * @param code
     * @param invite_id
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2Login ({
                  code = '',
                  invite_id = 0
              }, resole, reject) {
        let that = this,
            data = {
                code,
                invite_id
            };
        const api = '/wx2/login_new';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 微信手机号码登入
     * @param encryptedData 获取微信手机号码加密数据
     * @param iv 获取微信手机号码加密信息
     * @param invite_id  邀请码
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2LoginByPhone ({
                         encryptedData = null,
                         iv = null,
                         encryptedData_1 = null,
                         iv_1 = null,
                         invite_id = 0
                     }, resole, reject) {
        let that = this,
            data = {
                encryptedData,
                iv,
                encryptedData_1,
                iv_1,
                invite_id
            };
        const api = '/wx2/loginByPhone';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 获取开通城市列表
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCityData (data = {}, resole, reject) {
        let that = this;
        const api = '/city/getData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取拼团信息
     * @param id
     * @param lat
     * @param lon
     * @param detail
     * @param resole
     * @param reject
     * @returns {*}
     */
    getGroupInfo ({id = 0, lat, lon, detail}, resole, reject) {
        let that = this, data = {id, lat, lon, detail};
        const api = '/group/getGroupInfo';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 拼团订单详情
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    getGroupDetail ({id = 0}, resole, reject) {
        let that = this,
            data = {id};
        const api = '/group/detail';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取分享领奖领取记录
     * @param resole
     * @param reject
     * @returns {*}
     */
    getActivityNotice ({} = {}, resole, reject) {
        let that = this,
            data = {};
        const api = '/activity/notice';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 注册领奖信息
     * @param is_from_sz
     * @param resole
     * @param reject
     * @returns {*}
     */
    setActivityRegister ({
                             is_from_sz = 0
                         } = {}, resole, reject) {
        let that = this,
            data = {
                is_from_sz
            };
        const api = '/activity/register';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

}

class ApiService extends OldApi {
    constructor (...args) {
        super(...args); // 调用父类的constructor(x, y)
        this.url = config.host;
        this.api = config.defaultApi;
        this.token = null
    }


    getToken () {
        const app = getApp();
        if (this.token && this.token.length > 0) {
            return this.token;
        } else {
            return app.getToken();
        }
    }

    /**
     * 获取首页banner
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getBanners (data = {}, resole, reject) {
        let that = this;
        const api = '/wx_shop/banners';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * banner
     * api/special/banner
     * 品子banner图
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialBanner (data = {}, resole, reject) {
        let that = this;
        const api = '/special/banner';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取所有专题商品列表分类名
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialList (data = {}, resole, reject) {
        let that = this;
        const api = '/special/special_list';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取首页专题列表集合
     * @param resole
     * @param reject
     * @returns {*}
     */
    getAlbumDataList ({} = {}, resole, reject) {
        let that = this,
            data = {};
        const api = '/album/dataList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取专题商品列表
     * @param id
     * @param page
     * @param limit
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItem ({
                        id = 1,
                        page = 1,
                        limit = 3
                    }, resole, reject) {
        let that = this,
            data = {
                id,
                page,
                limit
            };
        const api = '/special/special_item';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 获取专题商品列表(App)
     * @param lon
     * @param lat
     * @param resole
     * @param reject
     * @returns {*}
     */
    getAppSpecialItem ({
                           lon,
                           lat
                       }, resole, reject) {
        let that = this,
            data = {
                lon,
                lat
            };
        const api = '/special/special_item';
        const http = $http.get(that.appApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取附近项目
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItemNear (data = {
        p: 1,
        lon: 0,
        lat: 0
    }, resole, reject) {
        let that = this;
        const api = '/special/item_near';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 专题商品列表banner
     * @id  get列表ID
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItemNear (data = {
        p: 1,
        lon: 0,
        lat: 0
    }, resole, reject) {
        let that = this;
        const api = '/special/item_near';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 退款列表接口
     * api/refund/refund
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getRefundData (data = {
        p: 1
    }, resole, reject) {
        let that = this;
        const api = '/refund/refund';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 退款列表接口
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getRefundInfo (data = {
        id: 1
    }, resole, reject) {
        let that = this;
        const api = '/refund/refund_info';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取项目信息
     * group/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getItemBuyInfo ({
                        item_id = 0,
                        item_num = 1,
                        is_group = 1
                    } = {}, resole, reject) {
        let that = this,
            data = {
                item_id,
                item_num,
                is_group
            };
        const api = '/group/getItemBuyInfo_1';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 保存form_id
     * /store/saveFormIds
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    saveFormIds ({
                     form_id = 0
                 } = {}, resole, reject) {
        let that = this,
            data = {
                form_id
            };
        const api = '/store/saveFormIds';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 立即购买
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
    getPayInfoOfBuyNow ({
                            item_id = 0,
                            item_num = 1,
                            is_group = 0,
                            group_id = 0,
                            rmcids = '',
                            activity_id = ''
                        } = {}, resole, reject) {
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
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取技师接口
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getMmgShopIndex (data = {
        shop_id: 0
    }, resole, reject) {
        let that = this;
        const api = '/shop/technician';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 日记banner
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getBannerInfo (data = {
        id: 1
    }, resole, reject) {
        let that = this;
        const api = '/group/getBanner';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 优惠卷
     * @param shop_id
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCouponInfo ({
                       shop_id = 0
                   }, resole, reject) {
        let that = this;
        let data = {
            shop_id
        }
        const api = '/wx2/coupon';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 查看店铺详细
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2shopDetail ({
                       id = 0
                   }, resole, reject) {
        let that = this,
            data = {
                id
            };
        const api = '/wx2/shopDetail';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 查看店铺买单二维码
     * @param id
     * @returns {*}
     */
    getShopBuyInfo_new ({
                            id = 0
                        }) {
        let that = this,
            data = {
                id
            };
        const api = '/shop/getShopBuyInfo_new';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 查看店铺买单信息
     * @param shop_id
     * @returns {*}
     */
    getShopBuyInfo ({
                        shop_id = 0
                    }) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/shop/getShopBuyInfo';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 商品浏览记录
     * @param id
     * @returns {*}
     */
    getPutFootPlace ({
                         id = 0
                     }) {
        let that = this,
            data = {
                id
            };
        const api = '/mmg/putFootPlace';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 项目详情日记
     * @param item_id
     * @returns {*}
     */
    getNotesOfItem ({
                        item_id = 0
                    }) {
        let that = this,
            data = {
                item_id
            };
        const api = '/note/getNotesOfItem';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 项目详情其他推荐
     * @param shop_id
     * @param item_id
     * @param p
     * @param lat
     * @param lon
     * @returns {*}
     */
    getItemsOfShop ({
                        shop_id,
                        item_id,
                        p = 1,
                        lat,
                        lon
                    }) {
        let that = this,
            data = {
                shop_id,
                item_id,
                p,
                lat,
                lon
            };
        const api = '/wx2/getItemsOfShop';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 项目详情
     * @param id
     * @returns {*}
     */
    getGroupgetItemV3 ({
                           id = 0,
                           lat = 0,
                           lon = 0
                       }) {
        let that = this,
            data = {
                id,
                lat,
                lon
            };
        const api = '/group/getItemV3';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 项目详情立即抢购
     * @param id
     * @returns {*}
     */
    getSaveFormIds ({
                        form_id = 0
                    }) {
        let that = this,
            data = {
                form_id
            };
        const api = '/store/saveFormIds';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 项目详情收藏
     * @param id
     * @returns {*}
     */
    getMakeCollection ({
                           item_id = 0,
                           cancel = 0
                       }) {
        let that = this,
            data = {
                item_id,
                cancel
            };
        const api = '/mmg/makeCollection';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 团购信息
     * @param item_id
     * @returns {*}
     */
    getOtherGroups ({
                        item_id = 0
                    }) {
        let that = this,
            data = {
                item_id
            };
        const api = '/group/getOtherGroups';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     *
     * @param id
     * @returns {*}
     */
    getGroupMsgg ({
                      item_id = 0
                  }) {
        let that = this,
            data = {
                item_id,
            };
        const api = '/msg/getGroupMsgg';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 店铺主页
     * @param p
     * @param shop_id
     * @param lat
     * @param lon
     * @returns {*}
     */
    getHomeIndex ({
                      p = 1,
                      shop_id = 0,
                      lat,
                      lon
                  }) {
        let that = this,
            data = {
                shop_id,
                lat,
                lon,
                p
            };
        const api = '/wx2/index';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 店铺下项目
     * @param p
     * @param shop_id
     * @param category_id
     * @returns {*}
     */
    getShopProjects ({
                         p = 1,
                         shop_id = 0,
                         category_id = 0
                     }) {
        let that = this,
            data = {
                shop_id,
                category_id,
                p
            };
        const api = '/wx2/items';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 备注数据
     * @param shop_id
     * @returns {*}
     */
    getShoptechnician ({
                           shop_id = ''
                       }) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/shop/getShopTechnician';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 获取我的卡包数据(可用)
     * @return {*}
     * @return nickname 店铺名称
     * @return card_id 套卡ID
     * @return card_name 套卡名
     * @return card_no 套卡编号
     * @return cover 店铺图像
     * @return bill_id  订单ID
     * @return shop_id  店铺ID
     */
    getOrderCardMyCard ({} = {}) {
        let that = this,
            data = {};
        const api = '/order_card/my_card';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 卡包使用记录
     * @return {*}
     * @return
     * @return
     */
    getOrderCardUserecord ({
                               bill_id = ''
                           } = {}) {
        let that = this,
            data = {
                bill_id
            };
        const api = '/order_card/use_record';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 卡包使用记录
     * @return {*}
     * @return
     * @return
     */
    getOrderCardShopcard ({
                              shop_id = 0
                          } = {}) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/order_card/shop_card';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 套卡详情(购买)
     * @return {*}
     * @return
     * @return
     */
    getOrderShopCardInfo ({
                              card_id = ''
                          } = {}) {
        let that = this,
            data = {
                card_id
            };
        const api = '/order_card/shop_card_info';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 套卡详情（使用）
     * @return {*}
     * @return
     * @return
     */
    getOrderCardInfo ({
                          bill_id = '',
                          status = ''
                      } = {}) {
        let that = this,
            data = {
                bill_id,
                status
            };
        const api = '/order_card/card_info';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 获取热门搜索
     * @return {*}
     * @return
     * @return
     */
    getKeywordsGetData ({} = {}) {
        let that = this,
            data = {};
        const api = '/keywords/getData';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 搜索店铺
     * @param kw
     * @param city_id
     * @param lon
     * @param lat
     * @param p
     * @return
     */
    getShopSearchAll ({
                          kw = "",
                          city_id = 0,
                          lon = 0,
                          lat = 0,
                          p = 1
                      }) {
        let that = this,
            data = {
                kw,
                city_id,
                lon,
                lat,
                p
            };
        const api = '/shop/searchAll';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 搜索服务
     * @param kw
     * @param city_id
     * @param lon
     * @param lat
     * @param p
     * @return
     */
    getItemSearch ({
                       kw = "",
                       city_id = 0,
                       lon = 0,
                       lat = 0,
                       p = 1
                   }) {
        let that = this,
            data = {
                kw,
                city_id,
                lon,
                lat,
                p
            };
        const api = '/item/search';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 搜索案例
     * @param kw
     * @param city_id
     * @param lon
     * @param lat
     * @param p
     * @return
     */
    getNoteSearch ({
                       kw = "",
                       city_id = 0,
                       lon = 0,
                       lat = 0,
                       p = 1
                   }) {
        let that = this,
            data = {
                kw,
                city_id,
                lon,
                lat,
                p
            };
        const api = '/note/search';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 立即支付（套卡）
     * @param card_id
     * @param num
     * @param invite_id
     * @param activity_id
     * @return
     */
    orderCardGetPayInfoOfBuyNow ({
                                     card_id,
                                     num = 1,
                                     invite_id = 0,
                                     activity_id = ''
                                 }) {
        let that = this,
            data = {
                card_id,
                num,
                invite_id,
                activity_id
            };
        const api = '/order_card/getPayInfoOfBuyNow';
        const http = $http.post2(that.api + api, data);
        return http;
    }


    /**
     * 获取我的卡包数据（不可用）
     * @return {*}
     * @return nickname 店铺名称
     * @return card_id 套卡ID
     * @return card_name 套卡名
     * @return card_no 套卡编号
     * @return cover 店铺图像
     * @return bill_id  订单ID
     * @return shop_id  店铺ID
     */
    getOrderCardMyCardUseless ({} = {}) {
        let that = this,
            data = {};
        const api = '/order_card/my_card_useless';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 查看卷码
     * @return {*}
     */
    getOrderCardCheckPwd ({
                              bill_id = '',
                              card_item_id = ''
                          } = {}) {
        let that = this,
            data = {
                bill_id,
                card_item_id
            };
        const api = '/order_card/check_pwd';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 卡订单详情
     * @return {*}
     */
    getOrderGetBillDetail ({
                               bill_id = ''
                           } = {}) {
        let that = this,
            data = {
                bill_id
            };
        const api = '/order_card/getBillDetail1';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 获取二维码(小程序码)（用于商家端）
     * @param page
     * @param scene
     * @param resole
     * @param reject
     * @returns {*}
     */
    showShopQrcodeOp ({
                          page,
                          scene
                      }, resole, reject) {
        let that = this,
            data = {
                page,
                scene
            };
        const api = `/shop/shopQrcodeApi`;
        const http = $http.downImage(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取二维码(小程序码)(不用登入)
     * @param page （默认首页）
     * @param shop_id
     * @returns {*}
     */
    wx_shopShowQrcode ({
                           page = 'page/tabBar/home/index',
                           shop_id
                       } = {}) {
        let that = this,
            data = {
                page,
                shop_id
            };
        const api = '/wx_shop/showQrcode';
        const http = $http.downImage(that.api + api, data, 'image');
        return http;
    }

    /**
     * 点赞
     * @param nid
     * @param resole
     * @param reject
     * @returns {*}
     */
    noteIncZan ({
                    nid = 0
                }, resole, reject) {
        let that = this,
            data = {
                nid
            };
        const api = `/note/incZan`;
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 取消订单
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    cancelOrder ({
                     id = 0
                 }, resole, reject) {
        let that = this,
            data = {
                id
            };
        const api = `/order/cancelOrder`;
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 登入(测试)
     * @param code
     * @param invite_id
     * @param encryptedData
     * @param userInfo
     * @param iv
     * @param resole
     * @param reject
     * @returns {*}
     */
    login2wxLogin ({
                       code = '',
                       invite_id,
                       iv,
                       encryptedData,
                       userInfo
                   }, resole, reject) {
        let that = this,
            data = {
                code,
                invite_id,
                iv,
                encryptedData,
                userInfo
            };
        const api = '/login2/wxLogin';
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }


    /**
     * 绑定手机号验证码接口(测试)
     * @param telephone
     * @param resole
     * @param reject
     * @returns {*}
     */
    login2bindSMS ({
                       telephone
                   }, resole, reject) {
        let that = this,
            data = {
                telephone
            };
        const api = '/login2/bindSMS';
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 绑定手机号验证码接口(测试)
     * @param telephone
     * @param code
     * @param resole
     * @param reject
     * @returns {*}
     */
    login2bindPhone ({
                         telephone,
                         code
                     }, resole, reject) {
        let that = this,
            data = {
                telephone,
                code
            };
        const api = '/login2/bindPhone';
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 删除订单
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    deleteOrder ({
                     id = 0
                 }, resole, reject) {
        let that = this,
            data = {
                id
            };
        const api = '/order/rmOrder';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 再支付
     * @param billId
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2getPayInfoOfOrder ({
                              billId = 0
                          }, resole, reject) {
        let that = this,
            data = {
                billId
            };
        const api = '/wx2/getPayInfoOfOrder';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 退出登入
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2logoff ({} = {}, resole, reject) {
        let that = this,
            data = {};
        const api = '/wx2/logoff';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 我的收藏list
     * @param p
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCollectionItems ({
                            p = 1
                        }, resole, reject) {
        let that = this,
            data = {
                p
            };
        const api = '/collection/items';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 我的优惠券
     * @param p
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCouponGetCouponsOfMine ({
                                   p = 1
                               }, resole, reject) {
        let that = this,
            data = {
                p
            };
        const api = '/coupon/getCouponsOfMine';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 我的日记
     * @param p
     * @param resole
     * @param reject
     * @returns {*}
     */
    getNoteMyNote ({
                       p = 1
                   }, resole, reject) {
        let that = this,
            data = {
                p
            };
        const api = '/note/mynote';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 我的日记
     * @param p
     * @param resole
     * @param reject
     * @returns {*}
     */
    getMemberFootPlace ({
                            p = 1
                        }, resole, reject) {
        let that = this,
            data = {
                p
            };
        const api = '/member/footPlace';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 删除日记
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    deleteNote ({
                    id = 0
                }, resole, reject) {
        let that = this,
            data = {
                id
            };
        const api = '/note/deleteNote';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 意见反馈
     * @param contact
     * @param content
     * @param resole
     * @param reject
     * @returns {*}
     */
    setMemberFeedback ({
                           contact = '',
                           content = ''
                       }, resole, reject) {
        let that = this,
            data = {
                contact,
                content
            };
        const api = '/member/feedback';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 领取优惠券
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    couponDoPicker ({
                        id = 0
                    }) {
        let that = this,
            data = {
                id
            };
        const api = '/coupon/doPicker';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 添加商品到购物车
     * @param item_id
     * @param num
     * @param resole
     * @param reject
     * @returns {*}
     */
    cartAddToCart ({
                       item_id = 0,
                       num = 1
                   }) {
        let that = this,
            data = {
                item_id,
                num
            };
        const api = '/cart/addToCart';
        const http = $http.post(that.api + api, data);
        return http;
    }


    /**
     * 新店铺首页
     *
     */
    getShopNewIndex ({
                         shop_id = 0,
                         is_qrcode

                     }) {
        let that = this,
            data = {
                shop_id,
                is_qrcode
            };
        const api = '/shop_new/shop_index';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 详情
     *
     */
    getShopNewDetail ({
                          shop_id = 0,
                          lat,
                          lon
                      }) {
        let that = this,
            data = {
                shop_id,
                lat,
                lon
            };
        const api = '/shop_new/shop_detail';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 新店铺 - 详情
     *
     */
    getFollow ({
                   shop_id = 0
               }) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/shop_new/follow_on';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 获取优惠券
     *
     */
    getCoupon ({
                   shop_id = 0
               }) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/shop_new/get_coupon';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 相册列表
     *
     */
    getImgList ({
                    shop_id = 0
                }) {
        let that = this,
            data = {
                shop_id
            };
        const api = '/shop_new/img_list';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 相册列表
     *
     */
    getImgListDetail ({
                          id = 0
                      }) {
        let that = this,
            data = {
                id
            };
        const api = '/shop_new/img_list_detail';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 相册列表
     *
     */
    getMyFollows ({
                      lon,
                      lat
                  }) {
        let that = this,
            data = {
                lon,
                lat
            };
        const api = '/shop_new/my_follows';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 新店铺 - 相册列表
     */
    getSearchItems ({
                        shop_id = 0,
                        kw,
                        category_id = 0,
                        p
                    }) {
        let that = this,
            data = {
                shop_id,
                kw,
                category_id,
                p
            };
        const api = '/shop_new/s_items';
        const http = $http.get(that.api + api, data);
        return http;
    }

    /**
     * 新店铺 - 相册列表
     *
     */
    getDoPicker ({
                     id = 0
                 }) {
        let that = this,
            data = {
                id
            };
        const api = '/shop_new/doPicker';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 新店铺 - 相册列表
     *
     */
    getDoSearch ({
                     kw,
                     lon,
                     lat,
                     p
                 }) {
        let that = this,
            data = {
                kw,
                lon,
                lat,
                p
            };
        const api = '/shop_new/search';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 点评技师
     *
     */
    getItemTechnician ({
                           order_info_id
                       }) {
        let that = this,
            data = {
                order_info_id
            };
        const api = '/item/technician';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 点评技师
     *
     */
    getDataTag ({}) {
        let that = this,
            data = {};
        const api = '/tag/getData';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 点评提交
     *
     */
    getSaveModal ({
                      content,
                      order_info_id,
                      major_score,
                      service_score,
                      effect_score,
                      environment_score,
                      img_src,
                      technician_ids,
                      is_anonymous,
                      score_tag_ids
                  }) {
        let that = this,
            data = {
                content,
                order_info_id,
                major_score,
                service_score,
                effect_score,
                environment_score,
                img_src,
                technician_ids,
                is_anonymous,
                score_tag_ids
            };
        const api = '/note/saveModal';
        const http = $http.post2(that.api + api, data);
        return http;
    }


    /**
     * 点评技师
     *
     */
    getNoteLists ({
                      order_info_id
                  }) {
        let that = this,
            data = {
                order_info_id
            };
        const api = '/note/lists';
        const http = $http.get(that.api + api, data);
        return http;
    }


    /**
     * 点评技师
     *
     */
    getOrderList ({}) {
        let that = this,
            data = {};
        const api = '/order/dataList1';
        const http = $http.get(that.api + api, data);
        return http;
    }
}

module.exports = ApiService
