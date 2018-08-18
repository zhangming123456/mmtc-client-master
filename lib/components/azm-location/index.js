const app = getApp(),
    util = app.util,
    util2 = app.util2,
    map = new util2.MAP(),
    config = require("../../../utils/config"),
    authorize = require("../../../utils/azm/authorize");

let isMap = config.isMap;
Component({
    externalClasses: ['azm-location'],
    data: {
        name: 'addressLocation',
        currentPageRoute: '',
        componentsName: '',
        location: {
            lat: 0,
            lon: 0
        },
        options: {},
        styleStr: '',
        isCreated: false,
        isPullDownRefresh: false,
        isPageShow: true,
        currentPage: null,

    },
    properties: {
        options: {
            type: Object,
            value: {},
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        position: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        styleData: {
            type: Object,
            value: {},
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        class: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        storageKey: {
            type: String,
            value: 'lat_and_lon',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        storageName: {
            type: String,
            value: 'addr',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        address: {
            type: String,
            value: '加载中...',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (newVal !== '加载中...') {
                    wx.hideNavigationBarLoading()
                }
            }
        },
        isShow: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (this.data.isCreated && newVal && newVal !== oldVal) {
                    this.setData({
                        address: '加载中...'
                    });
                    this._bindAzmGetLocation();
                }
            }
        },
        isTap: {
            type: Boolean,
            value: true,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        isRefresh: {
            type: Boolean,
            value: true,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){
        console.log('组件生命周期函数created', util.getCurrentPages());
        wx.showNavigationBarLoading();
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){
        console.log('组件生命周期函数attached', util.getCurrentPage());
        let that = this;
        let currentPage = util.getCurrentPage();
        this.data.currentPage = currentPage;
        this.data.currentPageRoute = currentPage.route;
        this.data.currentPage.azmLocation_onRefresh = function (options, type) {
            if (type === 'onPullDownRefresh' && !that.data.isRefresh) {
                return;
            } else if (type === 'onPullDownRefresh') {
                that.data.isPullDownRefresh = true;
            } else if (type === 'onShow') {
                that.data.isPageShow = true;
            }
            that._onRefresh();
        };
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        let that = this;
        this._bindAzmGetLocation();
        this.data.isCreated = true;
        console.log('组件生命周期函数ready');
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
        console.log('组件生命周期函数moved');
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){
        console.log('组件生命周期函数detached');
    },
    methods: {
        _onRefresh(){
            let that = this;
            that.setData({
                address: '加载中...'
            });
            that._bindAzmGetLocation();
        },
        onTap(e){
            if (!this.data.isTap)return;
            let myEventDetail = {
                    dataset: Object.assign(e.detail, this.data)
                }, // detail对象，提供给事件监听函数
                myEventOption = {
                    bubbles: true,
                    composed: true
                }; // 触发事件的选项
            if (this.data.address === '加载中...') {
                this._bindAzmGetLocation(true)
            } else {
                let page = app.util.getCurrentPage(),
                    url = '/page/public/pages/location/index',
                    data = {};
                if (page.route === 'page/tabBar/near/index') {
                    data = {is: 1}
                }
                util2.router.push({path: url, query: data});
            }
            this.triggerEvent('azmtap', myEventDetail, myEventOption)
        },
        _bindAzmGetLocation(flag) {
            console.log(this.data.currentPageRoute, 'ddddd');
            let that = this,
                location = app.globalData.lat_and_lon,
                isLocation = app.globalData.isLocation;// detail对象，提供给事件监听函数
            that.data.location = location;
            wx.getLocation({
                type: 'gcj02',
                success(res) {
                    if (!isLocation || !location.lat || !location.lon || !location.address) {
                        app.globalData.isLocation = false;
                        location = {
                            lat: res.latitude,
                            lon: res.longitude
                        };
                    }
                    that._getLocation(res, location);
                },
                fail(res) {
                    authorize.userLocation(true)
                        .then(
                            () => {
                                that._bindAzmGetLocation()
                            },
                            () => {
                                that._getLocation(res, location);
                            }
                        );
                }
            })
        },
        _getLocation(res, location, myEventOption = {bubbles: true, composed: true}){
            let that = this,
                oldLocation = that.data.location,
                oldAddress = oldLocation.address,
                isLocation = app.globalData.isLocation,
                myEventDetail = {
                    dataset: location,
                    res,
                    isUpdate: true
                };
            this.data.currentPage.data.azmLocationData = location;
            if (oldLocation.lat === location.lat && oldLocation.lon === location.lon) {
                myEventDetail.isUpdate = that.data.isPullDownRefresh || that.data.isPageShow;
                myEventDetail.isPullDownRefresh = that.data.isPullDownRefresh || that.data.isPageShow;
                that.data.isPullDownRefresh = false;
                that.data.isPageShow = false;
            }
            if (!isLocation || !location.lat || !location.lon || !oldAddress) {
                app.globalData.isLocation = false;
                map.getMap(location,
                    res => {
                        app.globalData.lat_and_lon = res;
                        myEventDetail.dataset.address = res.address;
                        that.setCallback(res.address, myEventDetail, myEventOption);
                    },
                    rsp => {
                        that.setCallback(oldAddress, myEventDetail, myEventOption);
                    })
            } else {
                that.setCallback(oldAddress, myEventDetail, myEventOption)
            }
        },
        setCallback(address, myEventDetail, myEventOption){
            let that = this;
            let lan_lon = app.globalData.lat_and_lon;
            app.globalData.city = util2.getCity({title: lan_lon.city});
            that.triggerEvent('callback', myEventDetail, myEventOption);
            that.setData({address});
        }
    }
});
