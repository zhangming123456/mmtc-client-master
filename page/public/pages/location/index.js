const app = getApp(),
    util2 = app.util2,
    map = new util2.MAP(),
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService");

const appPage = {
    data: {
        text: 'Page location',
        isOpenCitySelect: false,
        cities: [],
        location: {},
        cityName: '',
        loading: false,
        histories: []
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
        let addr_histories = wx.getStorageSync('addr_histories'),
            data = [],
            city = app.globalData.city;
        for (let v of addr_histories) {
            if (!/%/.test(v)) {
                data.push(v)
            }
        }
        data = util2.unique(data);
        wx.setStorageSync('addr_histories', data);
        city = util2.getCity(city);
        app.globalData.city = city;
        this.setData({
            cityName: city.title,
            location: app.globalData.lat_and_lon,
            histories: data
        });
    },
    doSearch(data){
        this.$route.push({path: "/page/public/pages/locSearch/index", query: data});
        this.closeSelectCity();
    },
    /**
     * 清除记录
     */
    clearHistories(){
        wx.removeStorageSync('addr_histories');
        this.setData({histories: []});
    },
    searchHistory(e){
        let value = e.currentTarget.dataset.item;
        this.doSearch({w: value});
    },
    /**
     * 重新定位
     */
    relocAddr(){
        if (this.data.loading)return;
        this.setData({loading: true});
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                map.getMap({lat: res.latitude, lon: res.longitude}, res => {
                        let city = res.city;
                        app.globalData.lat_and_lon = res;
                        app.globalData.city = util2.getCity({title: city});
                        that.$route.back();
                    }
                )
            },
            fail(){
                that.setData({loading: false});
            }
        });
    },
    /**
     * 打开选择城市选项
     */
    bindSelectCity(){
        let that = this;
        if (that.data.isOpenCitySelect) {
            that.setData({
                isOpenCitySelect: false
            })
        } else {
            ApiService.getCityData().then(
                res => {
                    if (res.status === 1) {
                        that.setData({
                            cities: res.info,
                            isOpenCitySelect: true
                        });
                        wx.setStorageSync('cities', res.info);
                    }
                }
            )
        }
    },
    /**
     * 选择城市
     * @param e
     */
    selectCity(e){
        let item = e.currentTarget.dataset.item;
        this.setData({isOpenCitySelect: false});
        this.doSearch({city: item.title});
    },
    /**
     * 关闭选择城市选项
     */
    closeSelectCity(){
        this.setData({
            isOpenCitySelect: false
        })
    }
};
Page(new utilPage(appPage, methods));