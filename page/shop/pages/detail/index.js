// pages/home/detail.js
const app = getApp(),
    util2 = app.util2,
    util = app.util,
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService'),
    config = require('../../../../utils/config'),
    c = require("../../../../utils/common.js");
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
        util2.showLoading();
        ApiService.wx2shopDetail({id: shop_id}).finally(res => {
            util2.hideLoading(true);
            if (res.status === 1) {
                that.setData({item: res.info});
            }
        })
    },
    showQrcode() {
        let that = this,
            shop_id = this.data.shop_id,
            setData = {};
        if (!this.data.qrcode) {
            util2.showLoading();
            ApiService.wx_shopShowQrcode({page: 'page/shop/pages/home/index', shop_id}).finally(res => {
                util2.hideLoading(true);
                if (res.status === 1 && res.info.path) {
                    setData.qrcode = res.info.path;
                    setData.showMasker = true
                } else {
                    setData.showMasker = false
                    util2.failToast(res.message)
                }
                that.setData(setData);
            });
        } else {
            setData.showMasker = true;
            that.setData(setData)
        }
    },
    onLoadQrcode(){
        util2.hideLoading(true);
    },
    closeMasker(){
        this.setData({showMasker: false});
    },
    noop(){

    },
    saveImage(){
        let that = this,
            tempFilePath = this.data.qrcode;
        if (tempFilePath) {
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                complete(res){
                    if (res.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
                        util2.failToast('取消保存')
                    } else if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                        util2.showToast('保存成功');
                    } else if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                        that.$route.push('/page/public/pages/authorization/index')
                    } else {
                        util2.failToast('保存失败')
                    }
                }
            })
        }
    }
};


Page(new utilPage(appPage, methods));