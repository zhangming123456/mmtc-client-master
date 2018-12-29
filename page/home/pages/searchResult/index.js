const app = getApp(),
    util2 = app.util2,
    map = new util2.MAP(),
    regeneratorRuntime = app.util2.regeneratorRuntime,
    utilPage = require("../../../../utils/utilPage"),
    config = require('../../../../utils/config'),
    ApiService = require("../../../../utils/ApiService/index");

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {

        follows: [],
        name: '',
        kw: [],
        page: 1,
        latitude: '',
        longitude: '',
        lat: 0,
        lon: 0

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadCb();
        // wx.getLocation({
        //     type: 'wgs84',
        //     success: (res) => {
        //         var latitude = res.latitude
        //         var longitude = res.longitude
        //         var speed = res.speed
        //         var accuracy = res.accuracy
        //         this.setData({
        //             latitude: latitude,
        //             longitude: longitude
        //         })

        //     }

        // })

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        let that = this;
    },
    /**
     * 页面渲染完成
     */
    onReady() {
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        let that = this
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {
        this.cancelSearch(null, true);
    },
    //页面滚动执行方式
    onPageScroll(event) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
}
const methods = {
    async loadCb() {
        let that = this;
        let options = that.data.options;
        let lat, lon, kw, page;

        util2.getLocation().finally(async res => {
            if (res && res.status === 1) {
                let info = res.info;
                lat = info.latitude;
                lon = info.longitude;
                that.setData({
                    lat,
                    lon
                });
                wx.setStorageSync('lat', lat)
                wx.setStorageSync('lon', lon)
            }
            await that.getMyFollows({
                lat,
                lon
            });
            await that.cancelSearch({
                kw,
                p: page,
                lon,
                lat
            });

        });


    },

    // 获取店铺数据
    getMyFollows() {
        let that = this;
        let lon = that.data.lon;
        let lat = that.data.lat;

        ApiService.getMyFollows({
            lon,
            lat
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    follows: res.info
                });
            }
        })
    },

    formName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    cancelSearch(e, bol = false) {
        let that = this;
        var kw = this.data.name;
        let page = that.data.page;
        let lon = that.data.lon;
        let lat = that.data.lat;
        if (!kw) return;
        if (!bol) {
            that.data.page = 1;
            page = 1;
        }
        ApiService.getDoSearch({
            kw,
            p: page,
            lon,
            lat
        }).finally(res => {
            if (res.status === 1) {
                that.data.page++;
                if (!Array.isArray(that.data.kw)) {
                    that.data.kw = []
                }
                if (page === 1) {
                    that.setData({
                        kw: res.info
                    });
                } else {
                    that.setData({
                        kw: that.data.kw.concat(res.info)
                    });
                }
            }
        })
    },


    doHome(e) {
        console.log(e, 1111111111111);
        var item = e.currentTarget.dataset.item;
        wx.setStorageSync('shop_id', item.shop_id)
        if (item && item.shop_id) {
            this.$route.tab({
                path: '/page/tabBar/home/index'
            })
        }
    }
}

Page(new utilPage(appPage, methods));
