/**
 * 小程序配置文件
 */
var host = 'https://app.mmtcapp.com';//开发环境
// var host = 'http://192.168.3.81';//开发环境
// var host = 'http://192.168.3.28';//开发环境(小康)
// var host = 'http://192.168.3.900';//本地后台反向代理服务器
var config = {
    // 下面的地址配合云端 Server 工作
    host,

    defaultApi: `${host}/api`,

    appApi: `${host}/app`,

    shopApi: `${host}/shopapi`,

    bdApi: `${host}/bd`,

    version: `1.0.${+new Date()}`,

    isMap: 1,

    // 美美天成-商家端 二维码生成规则
    consumeQRCode: {
        path: 'https://app.mmtcapp.com/mmtc/',
        query: {
            pwd: ''//消费ID
        }
    },

    // 图片服务器地址
    imageUrl: `https://app.mmtcapp.com`,

    // 登录地址，用于建立会话
    loginUrl: `${host}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/testRequest`,

    // 用code换取openId
    openIdUrl: `${host}/openid`,

    // 测试的信道服务接口
    tunnelUrl: `${host}/tunnel`,

    // 生成支付订单的接口
    paymentUrl: `${host}/payment`,

    // 发送模板消息接口
    templateMessageUrl: `${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `${host}/static/weapp.jpg`
};
module.exports = config;
