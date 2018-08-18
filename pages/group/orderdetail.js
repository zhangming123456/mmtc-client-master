const app = getApp(),
    util = app.util,
    c = require("../../utils/common.js"),
    qrcode = require("../../utils/qrcode.js"),
    ApiService = require("../../utils/ApiService"),
    utilPage = require('../../utils/utilPage');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page groupOrderDetail',
        qrcode: {
            img: '',
            hidden: true
        }
    },
    onLoad(){
        this.loadCb()
    },
    onShow(){
        if (this.data.isShow) {
            this.loadCb()
        }
    }
};
const methods = {
    /**
     * 生命周期函数--监听页面加载
     */
    loadCb() {
        let options = this.data.options,
            id = options.id || 9,
            isQrcode = options.isQrcode;
        options.isQrcode = false;
        this.id = id;
        util.showLoading();
        let that = this;
        ApiService.getGroupDetail({id}).then(
            res => {
                if (res.status === 1) {
                    that.start_time = new Date().getTime();
                    that.countTime(res.info.left_seconds);
                    that.item = res.info;
                    that.setData({
                        item: res.info
                    });
                    if (isQrcode) {
                        that.touse();
                    }
                }
            }
        ).finally(res => {
            util.hideLoading();
        });
    },
    countTime(seconds){
        seconds = seconds || this.data.item.left_seconds;
        let passedSeconds = parseInt((new Date().getTime() - this.start_time) / 1000);
        let left_time = seconds - passedSeconds;
        if (left_time <= 0) {
            this.data.item.left_seconds = -1;
            this.setData({
                left_time: 0,
                item: this.data.item
            });
            return;
        }
        left_time = c.leftseconds2timestr(left_time);
        this.setData({
            left_time: left_time
        });
        setTimeout(this.countTime.bind(this), 1000);
    },
    tostartagain(){
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + this.data.item.id + '&num=1&group=1',
        });
    },
    toshare(){ 
        wx.navigateTo({
            url: '/pages/group/shared?id=' + this.id,
        });
    },
    closeQrcode: function () {
        this.data.qrcode.hidden = true;
        this.setData({
            qrcode: this.data.qrcode
        });
    },
    touse(e) {
        var item = this.item;
        if (!item) {
            return;
        }
        this.data.qrcode.hidden = false;
        var num = item.pwd || 'error';
        this.data.qrcode.order_no = item.order_no;
        this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, {'size': 300});
        this.data.qrcode.num = num.match(/.{4}/g).join(' ');
        this.setData({
            qrcode: this.data.qrcode
        });
    },
    noop(){

    }
};
Page(new utilPage(appPage, methods));