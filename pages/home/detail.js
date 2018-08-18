// pages/home/detail.js
const app = getApp(),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService'),
    config = require('../../utils/config'),
    util = require('../../utils/azm/util'),
    c = require("../../utils/common.js");
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page home detail',
        item: {},
        shop_id: null,
        qrcode: ''
    },
    onLoad(){
        this.loadCb();
    }
};


const methods = {
    /**
     * 生命周期函数--监听页面加载
     */
    loadCb: function () {
        let that = this,
            options = that.data.options;
        let shop_id = options.shop_id;
        that.data.shop_id = shop_id;
        c.showLoading();
        ApiService.wx2shopDetail({id: shop_id}).then(res => {
            if (res.status === 1) {
                res.info.avatar = c.absUrl(res.info.avatar, 200);
                that.setData({
                    item: res.info
                });
            }
        }).finally(res => {
            c.hideLoading();
        });
    },
    showQrcode() {
        let that = this,
            setData = {
                showMasker: true
            };
        if (!this.data.qrcode) {
            util.showLoading();
            ApiService.wx_shopShowQrcode({page: 'pages/onlineBuy/index', shop_id: this.data.shop_id}).then(res => {
                setData.qrcode = res.info;
            }).finally(res => {
                that.setData(setData);
                util.hideLoading();
            });
        } else {
            that.setData(setData)
        }
    },
    onLoadQrcode(){
        util.hideLoading();
    },
    closeMasker(){
        this.setData({
            showMasker: false
        });
    },
    noop(){

    },
    saveImage(){
        if (this.data.qrcode) {
            let tempFilePath = this.data.qrcode;
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {
                    util.showToast('成功保存到相册');
                },
                fail(res){
                    util.failToast('图片保存失败');
                }
            })
        }
    }
};


Page(new utilPage(appPage, methods));