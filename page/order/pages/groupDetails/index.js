const app = getApp(),
    util2 = app.util2,
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index'),
    c = require("../../../../utils/common.js");
let timerGroup = null;
let calcLeftTimer = null;
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        left_time: {},
        left_num: 1,
        leftTime: null,
        members: [],
        info: null
    },
    onLoad () {
        this.loadCb()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.$vm && this.$vm.loadMore();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const group = this.data.group;
        const id = this.data.id;
        if (util2.jude.isEmptyObject(group)) {
            return {
                title: '【仅剩' + (group.num - group.num_used) + '人】快来' + group.price + '元拼 ' + group.item.title,
                path: '/page/group/pages/shared/index?id=' + id,
                complete: function (res) {
                    // 转发成功
                    this.setData({
                        isSharing: false
                    });
                }.bind(this)
            };
        }
    }
};

const methods = {
    loadCb () {
        let that = this,
            options = that.data.options,
            id = options.id || 0; // group_open_id
        if (!id) {
            that.$route.back();
            return;
        }
        this.data.id = id;
        that.getGroupInfo();
        util2.getLocation().finally(function (res) {
            let lat, lon;
            if (res && res.status === 1) {
                let info = res.info;
                lat = info.latitude;
                lon = info.longitude;
            }
            that.$vm = c.listGrid(that, {url: '/api/group/goods'}).setParams({
                lon: lon,
                lat: lat,
                exclude_id: id
            }).loadData();
        });
    },
    getGroupInfo () {
        let that = this;
        let id = that.data.id;
        if (!id) return;
        clearTimeout(timerGroup);
        let page = that.$route.getCurrentPage();
        if (page.route !== 'page/order/pages/groupDetails/index') return;
        console.log(util2.date.getTimeNumber('30s'), page.route);
        if (that.data.left_num > 0) {
            ApiService.getGroupInfo({id}).finally(res => {
                if (res.status === 1) {
                    let info = res.info;
                    let left_num = info.num - info.num_used;
                    let num = parseInt(info.num);
                    if (left_num > 0) {
                        !that.data.leftTime && that.calcLeftTime();
                        for (let i = 0; i < left_num; i++) {
                            info.members.push({id: 0, nickname: ''});
                        }
                    }
                    that.data.group = info;
                    that.data.leftTime = info.left_time;
                    that.data.start_time = (new Date()).getTime();
                    that.setData({
                        item: info.item,
                        info: info,
                        num_used: info.num_used,
                        left_num: left_num,
                        member_id: info.member_id,
                        members: info.members
                    });
                    if (left_num > 0) {
                        timerGroup = setTimeout(that.getGroupInfo.bind(that), util2.date.getTimeNumber('10s'));
                    } else {
                        timerGroup = setTimeout(that.getGroupInfo.bind(that), util2.date.getTimeNumber('30s'));
                    }
                } else {
                    util2.failToast(res.message)
                }
            });
        }
    },
    closeMasker () {
        this.setData({
            hideMasker: true
        });
    },
    inviteFriend () {
        let item = this.data.item;
        let id = this.data.id;
        if (+item.status === 1) {
            if (this.data.leftTime <= 0) { //到期了，一键发起开团
                wx.navigateTo({
                    url: '/page/payment/pages/itemPay/index?item_id=' + item.id + '&num=1&group=1'
                });
            } else { // 直接参团
                wx.navigateTo({
                    url: '/page/payment/pages/itemPay/index?item_id=' + item.id + '&num=1&group=1&group_id=' + id
                });
            }
        }
    },
    calcLeftTime () {
        clearTimeout(calcLeftTimer);
        let start_time = this.data.start_time;
        let left_time = this.data.leftTime;
        let end_time = new Date().getTime();
        let leftTime = left_time - Math.floor((end_time - start_time) / 1000);
        if (leftTime <= 0) {
            this.setData({btnText: '一键发起开团'});
            return;
        }
        let hour = Math.floor(leftTime / 60 / 60); // left hour
        let minute = Math.floor(leftTime / 60 % 60); // minutes
        let second = leftTime % 60;
        this.setData({left_time: {hour: hour, minute: minute, second: second}});
        let page = this.$route.getCurrentPage();
        if (page.route !== 'page/order/pages/groupDetails/index') return;
        calcLeftTimer = setTimeout(this.calcLeftTime.bind(this), 1000);
    },

    // 拼团人数（轮询）
    getOtherGroups () {

    },

    touse () {
        let id = this.data.id;
        // util.go('/pages/group/orderdetail', {data: {id, isQrcode: 1}})
        this.$route.push({
            path: "/pages/group/orderdetail",
            query: {
                id
            }
        });
    },
};
Page(new utilPage(appPage, methods));
