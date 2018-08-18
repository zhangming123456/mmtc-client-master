const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");
import { Amap, Qmap } from '../../../../utils/map/index';
let isMap = config.isMap;

const appPage = {
    data: {
        text: 'Page locSearch',
        cityName: '',
        kw: '',
        isMap,
        addrs: [],
        addrslist: [],
        isFocus: false
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
        let options = this.data.options,
            kw = '',
            cityName = '',
            isFocus = true,
            city = app.globalData.city;
        if (options.city) {
            cityName = decodeURIComponent(options.city);
        } else {
            cityName = util2.getCity(city).title;
        }
        if (options.w) {
            kw = decodeURIComponent(options.w);
            isFocus = false;
        }
        this.setData({kw, cityName, isFocus});
        this.search(kw, true);
        this.time = 0;
    },
    cancelSearch() {
        this.$route.back();
    },
    search (value, bol) {
        let that = this,
            cityName = that.data.cityName;
        value = util2.trim(value);
        if (that.data.kw === value && !bol)return;
        that.data.kw = value;
        if (value) {
            this.searchValue = value;
            util2.showLoading();
            if (isMap === 1) {
                Amap.getInputtips({
                    keywords: value,
                    city: cityName,
                    citylimit: true,
                    success: function (res) {
                        let data = []
                        for (let v of res.tips) {
                            if (util2.jude.isString(v.id)) {
                                data.push(v)
                            }
                        }
                        that.setData({addrs: data});
                        util2.hideLoading(true);
                    },
                    fail: function (res) {
                        util2.hideLoading(true);
                    }
                });
            } else {
                Qmap.getSuggestion({
                    keyword: value,
                    region: cityName,
                    region_fix: 1,
                    success: function (res) {
                        that.setData({addrs: res.data});
                    },
                    fail: function (res) {

                    },
                    complete: function (res) {
                        util2.hideLoading(true);
                    }
                });
            }
        } else {
            that.setData({addrs: []});
        }
    },
    addrChange(e) {
        if ((new Date().getTime()) - this.time < 100) {
            return;
        }
        this.time = new Date().getTime();
        let value = util2.trim(e.detail.value);
        this.search(value);
    },
    selectAddr(e) {
        let item = e.currentTarget.dataset.item,
            cityName = this.data.cityName,
            addr_histories = wx.getStorageSync('addr_histories') || [],
            that = this,
            lat_lon = '',
            location = {};
        if (isMap === 1) {
            lat_lon = item.location.split(',');
            location = {
                address: item.name,
                lon: lat_lon[0],
                lat: lat_lon[1],
                name: `${item.district || ''}${item.address || ''}`,
                city: cityName
            }
        } else {
            location = {
                address: item.title,
                lon: item.location.lng,
                lat: item.location.lat,
                name: item.address,
                city: cityName
            }
        }
        app.globalData.lat_and_lon = location;
        app.globalData.city = util2.getCity({title: cityName});
        app.globalData.isLocation = true;
        addr_histories.every(function (el, index) {
            if (el == that.searchValue) {
                addr_histories.splice(index, 1);
                return false;
            }
            return true;
        });
        addr_histories.unshift(this.searchValue);
        if (addr_histories.length > 10) {
            addr_histories.splice(addr_histories.length - 1, 1);
        }
        wx.setStorageSync('addr_histories', addr_histories);
        that.setData({addr_histories: addr_histories});
        that.$route.go(-2);
    }
};

Page(new utilPage(appPage, methods));