const config = require('../config');
import { HttpRequest } from "../ajax/http";

const $http = new HttpRequest();

class LoginRegister {
    constructor () {
        this.shopApi = config.shopApi;
        this.appApi = config.appApi;
        this.nodeApi = config.appApi;
        this.url = config.host;
        this.api = config.defaultApi;
        this.token = null
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
    wx2Login ({code = '', invite_id, iv, encryptedData}, resole, reject) {
        let that = this,
            data = {code, invite_id, iv, encryptedData};
        const api = '/wx2/loginByUnionid_new';
        // const api = '/wx3/oauth_userInfo';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 更新用户信息
     * @param userInfo
     * @param resole
     * @param reject
     * @returns {*}
     */
    updateUserInfo ({userInfo}, resole, reject) {
        let that = this,
            data = {userInfo};
        const api = '/wx2/loginByUnionid_new';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 注册获取手机验证码
     * @param telephone
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCheckCode (telephone = '', resole, reject) {
        let that = this,
            data = {telephone, smsLength: 4};
        const api = '/wx2/getCheckCode';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 绑定手机号码
     * @param telephone
     * @param code
     * @param userInfo
     * @param token
     * @param scene
     * @param resole
     * @param reject
     * @returns {*}
     */
    bindingMember ({telephone = '', code = '', userInfo, token}, scene = {}, resole, reject) {
        let that = this,
            data = {...scene, telephone, code, userInfo, token};
        const api = '/wx2/bindingMember';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }
}


module.exports = LoginRegister;
