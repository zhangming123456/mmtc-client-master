const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");

let isMap = config.isMap;

const appPage = {
    data: {
        text: 'Page locSearch'

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {}
};
const methods = {
    loadCb() {
        let options = this.data.options,
            kw = '',
            cityName = '',
            isFocus = true;

    },


    gotoMycard() {
        this.$route.push({
            path: '/page/cardBag/pages/myCard/index'
        })
    }


};

Page(new utilPage(appPage, methods));