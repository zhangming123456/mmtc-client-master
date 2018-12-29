const c = require("../../../../utils/common.js");
const app = getApp(),
    util2 = app.util2,
    ApiService = require("../../../../utils/ApiService/index"),
    utilPage = require("../../../../utils/utilPage"),
    config = require("../../../../utils/config");
Page(new utilPage(
    {
        /**
         * 页面的初始数据
         */
        data: {
            left_time: {}
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
            this.loadCb()
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },
        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },
        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },
        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },
        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

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
            const id = this.data.id;
            const group = this.data.group;
            if (util2.jude.isEmptyObject(group)) {
                this.setData({
                    isSharing: true
                });
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
    },
    {
        loadCb () {
            const options = this.data.options;
            let id = options.id || 23; // group_open_id
            this.data.id = id;
            this.data.activity_id = options.activity_id;
            let that = this;
            util2.getLocation().finally(res => {
                let lat, lon;
                if (res && res.status === 1) {
                    let info = res.info;
                    lat = info.latitude;
                    lon = info.longitude;
                }
                ApiService.getGroupInfo({
                    id: id,
                    lat: lat,
                    lon: lon,
                    detail: 1
                }).finally(res => {
                    if (res.status === 1) {
                        let info = res.info;
                        that.data.group = info;
                        let left_num = info.num - info.num_used;
                        let num = parseInt(info.num);
                        that.data.leftTime = info.left_time;
                        that.start_time = (new Date()).getTime();
                        let btnText = '';
                        if (info.num <= info.num_used) {
                            btnText = '一键发起开团!';
                        } else {
                            that.calcLeftTime();
                        }
                        if (info.members.length < num) {
                            for (let i = 0; i < num - info.members.length; i++) {
                                info.members.push({id: 0, nickname: ''});
                            }
                        }
                        that.setData({
                            item: info.item,
                            price: info.price,
                            info: info,
                            btnText: btnText,
                            left_num: left_num,
                            member_id: info.member_id,
                            members: info.members
                        });
                    }
                });
                that.$vm = c.listGrid(that, {
                    url: '/api/group/goods'
                }).setParams({
                    lon: lon,
                    lat: lat,
                    exclude_id: id
                }).loadData();
            })
        },
        closeMasker () {
            this.setData({
                hideMasker: true
            });
        },
        inviteFriend () {
            const item = this.data.item;
            const id = this.data.id;
            const activity_id = this.data.activity_id;
            const info = this.data.info;
            if (+item.status === 1) { // 没下架
                let query = {};
                if (this.data.leftTime <= 0 || info.num <= info.num_used) { //到期了，一键发起开团
                    query = {
                        item_id: item.id,
                        num: 1,
                        group: 1,
                        activity_id
                    }
                } else { // 直接参团
                    query = {
                        item_id: item.id,
                        num: 1,
                        group: 1,
                        group_id: id,
                        activity_id
                    }
                }
                this.$route.push({
                    path: '/page/payment/pages/itemPay/index',
                    query
                })
            }
        },
        calcLeftTime () {
            let end_time = new Date().getTime();
            let leftTime = this.data.leftTime - Math.floor((end_time - this.start_time) / 1000);
            if (leftTime <= 0) {
                this.setData({
                    btnText: '一键发起开团'
                });
                return;
            }
            let hour = Math.floor(leftTime / 60 / 60); // left hour
            let minute = Math.floor(leftTime / 60 % 60); // minutes
            let second = leftTime % 60;
            this.setData({
                left_time: {
                    hour: hour,
                    minute: minute,
                    second: second
                }
            });
            setTimeout(this.calcLeftTime.bind(this), 1000);
        },
        openOtherTuan () {
            let item = this.data.item;
            let activity_id = this.data.activity_id;
            if (util2.jude.isEmptyObject(item)) {
                this.$route.push({
                    path: '/page/payment/pages/itemPay/index',
                    query: {
                        item_id: item.id,
                        num: 1,
                        group: 1,
                        activity_id
                    }
                })
            }
        },
    }
))
