const app = getApp(),
    utilPage = require("../../utils/utilPage"),
    ApiService = require("../../utils/ApiService"),
    c = require("../../utils/common.js");
/**
 * 小程序原生数据与生命周期函数
 * @type {{data: {text: string, isOpenCitySelect: boolean, cities: Array, location: {}, cityName: string, loading: boolean, histories: Array}, onLoad: ((options)), onShow: (())}}
 */
const appPage = {
    data: {
        text: 'Page locIndex',
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
        this.indexPage = app.globalData.pages.indexPage;
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {
        let addr_histories = c.getStorage('addr_histories'),
            data = [];
        for (let v of addr_histories) {
            if (!/%/.test(v)) {
                data.push(v)
            }
        }
        wx.setStorageSync('addr_histories', data);
        let city = app.util.getCity();
        app.globalData.city = city;
        this.setData({
            cityName: city.title,
            location: app.globalData.lat_and_lon,
            histories: data
        });
    }
};
/**
 * 个人定义方法与绑定方法
 * @type {{loadCb: (()), doSearch: ((data)), setAddress: ((item)), clearHistories: (()), searchHistory: ((e)), relocAddr: (()), bindSelectCity: (()), selectCity: ((e)), closeSelectCity: (())}}
 */
const methods = {
    loadCb(){

    },
    doSearch(data){
        app.util.go('/pages/loc/locSearch', {data});
        this.closeSelectCity()
    },
    setAddress(item){
        c.setAddress(item.title);
        this.setData({
            address: item.title
        });
        this.indexPage.setAddress({
            lat: item.location.lat,
            lon: item.location.lng,
            addr: item.title
        });
    },
    /**
     * 清除记录
     */
    clearHistories(){
        c.removeStorage('addr_histories');
        this.setData({
            histories: []
        });
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
        this.setData({
            loading: true
        });
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                app.util.getMap(
                    {
                        lat: res.latitude,
                        lon: res.longitude
                    },
                    res => {
                        let city = res.city;
                        app.globalData.lat_and_lon = res;
                        let item = app.util.getCity({title: city.substr(0, city.length - 1)});
                        app.globalData.city = item;
                        c.setCity(item);
                        app.util.go(-1);
                    }
                )
            },
            fail(){
                this.setData({
                    loading: false
                });
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
        app.globalData.city = item;
        // c.setCity(item);
        this.setData({
            isOpenCitySelect: false
        });
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