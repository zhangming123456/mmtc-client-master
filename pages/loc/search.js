const app = getApp(),
    utilPage = require("../../utils/utilPage"),
    config = require("../../utils/config"),
    c = require("../../utils/common.js");

import { Amap, Qmap } from '../../utils/map/index';

let isMap = config.isMap;
const appPage = {
    data: {
        text: 'Page locSearch',
        cityName: '',
        kw: '',
        addrs: [],
        addrslist: [],
        isMap,
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
            isFocus = true;
        if (options.city) {
            cityName = decodeURIComponent(options.city);
        } else {
            cityName = c.getCity('title', '深圳');
        }
        if (options.w) {
            kw = decodeURIComponent(options.w);
            isFocus = false;
        }
        this.setData({
            kw,
            cityName,
            isFocus
        });
        this.search(kw, true);
        this.time = 0;
    },
    cancelSearch() {
        wx.navigateBack();
    },
    search (value, bol) {
        let that = this,
            cityName = that.data.cityName;
        value = app.util.trim(value);
        if (that.data.kw === value && !bol)return;
        that.data.kw = value;
        if (value) {
            this.searchValue = value;
            c.showLoading();
            if (isMap === 1) {
                Amap.getInputtips({
                    keywords: value,
                    city: cityName,
                    citylimit: true,
                    success: function (res) {
                        let data = []
                        for (let v of res.tips) {
                            if (app.util.common.isString(v.id)) {
                                data.push(v)
                            }
                        }
                        that.setData({
                            addrs: data
                        });
                        c.hideLoading();
                    },
                    fail: function (res) {
                        c.hideLoading();
                    }
                });
            } else {
                Qmap.getSuggestion({
                    keyword: value,
                    region: cityName,
                    region_fix: 1,
                    success: function (res) {
                        that.setData({
                            addrs: res.data
                        });
                    },
                    fail: function (res) {

                    },
                    complete: function (res) {
                        c.hideLoading();
                    }
                });
            }
        } else {
            that.setData({
                addrs: []
            });
        }
    },
    addrChange(e) {
        if ((new Date().getTime()) - this.time < 100) {
            return;
        }
        this.time = new Date().getTime();
        let value = e.detail.value.trim();
        this.search(value);
    },
    selectAddr(e) {
        let item = e.currentTarget.dataset.item,
            addr_histories = c.getStorage('addr_histories') || [],
            that = this,
            lat_lon = '',
            location = {};
        if (isMap === 1) {
            lat_lon = item.location.split(',');
            location = {
                address: item.name,
                lon: lat_lon[0],
                lat: lat_lon[1],
                name: item.address
            }
        } else {
            location = {
                address: item.title,
                lon: item.location.lng,
                lat: item.location.lat,
                name: item.address
            }
        }
        app.globalData.lat_and_lon = location;
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
        c.setStorage('addr_histories', addr_histories);
        c.setCity(app.globalData.city);
        that.setData({
            addr_histories: addr_histories
        });
        app.util.go(-2);
    }
};

Page(new utilPage(appPage, methods));