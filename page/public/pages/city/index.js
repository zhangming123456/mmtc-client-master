const app = getApp(),
    util2 = app.util2,
    map = new util2.MAP(),
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService/index");

const appPage = {
    data: {
        text: 'Page city select',
        cities: [],
        location: {},
        cityName: '',
        loading: false,
        loadingError: false,//定位失败
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
        let that = this;
        if (that.data.isShow) {
            this.loadCb()
        }
    }
};

const methods = {
    loadCb(){
        let city = app.globalData.city;
        city = util2.getCity(city);
        app.globalData.city = city;
        this.setData({cityName: city.title});
        this.getCityData();
    },
    /**
     * 重新定位
     */
    reLocate(){
        if (this.data.loading)return;
        this.setData({loading: true, loadingError: false});
        util2.showLoading();
        let that = this;
        util2.getLocation().finally(res => {
            if (res.status === 1) {
                let info = res.info;
                map.getMap({lat: info.latitude, lon: info.longitude},
                    res => {
                        util2.hideLoading(true);
                        let city = res.city;
                        app.globalData.lat_and_lon = res;
                        app.globalData.city = util2.getCity({title: city});
                        this.setData({cityName: app.globalData.city.title, loading: false});
                    },
                    rsp => {
                        util2.hideLoading(true);
                        that.setData({loading: false, loadingError: true})
                    }
                )
            } else {
                util2.hideLoading(true);
                that.setData({loading: false, loadingError: true});
            }
        });
    },
    /**
     * 获取分站城市
     */
    getCityData(){
        let that = this;
        return ApiService.getCityData().finally(res => {
                if (res.status === 1) {
                    that.setData({cities: res.info, isOpenCitySelect: true});
                    wx.setStorageSync('cities', res.info);
                }
            }
        )
    },
    /**
     * 选择城市
     * @param e
     */
    selectCity(e){
        let item = e.currentTarget.dataset.item;
        app.globalData.city = util2.getCity({title: item.title});
        this.$route.back();
    }
};
Page(new utilPage(appPage, methods));
