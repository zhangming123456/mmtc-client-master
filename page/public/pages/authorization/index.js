const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page authorization',
        redirect_url: ''
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
    }
};
const methods = {
    loadCb () {
        let options = this.data.options
        if (options.redirect_url) {
            this.setData({redirect_url: options.redirect_url})
        }
    }
};

Page(new utilPage(appPage, methods));