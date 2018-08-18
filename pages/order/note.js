// pages/order/note.js
const c = require("../../utils/common.js");
var oid = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: [],
        editMode: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        oid = options.oid || 0;
        this.note_id = options.note_id || 0;
        this.order_info_id = options.order_info_id || 0;
        this.setData({
            editMode: this.note_id > 0
        });
        if (this.note_id) {
            c.showLoading();
            let that = this;
            c.get('/api/note2/getDetail', {id: this.note_id}, function (ret) {
                c.hideLoading();
                if (ret.status == 1) {
                    let imgs = [];
                    that.content = ret.info.content;
                    that.img_src = ret.info.img_src;
                    that.setData({
                        item: ret.info,
                        imgs: ret.info.img_src ? ret.info.img_src.split(',') : []
                    });
                }
            });
        }
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

    },
    bindContentChange: function (e) {
        this.content = e.detail.value.trim();
    },
    showScoreWin: function () {
        wx.navigateTo({
            url: '/pages/order/score?id=' + this.order_info_id
        });
    },
    submitData: function () {
        var postData = this.postData;
        if (this.note_id > 0) {
            postData = {};
        }
        if (!this.note_id && !postData) {
            c.alert('请先评分~');
            return;
        }
        if (!this.content) {
            c.alert('请写下评论鼓励一下吧~');
            return;
        }
        if (!this.data.imgs || this.data.imgs.length == 0) {
            c.alert('请上传至少一张照片');
            return;
        }
        postData.content = this.content;
        let savedUrl = '';
        if (!this.note_id) {
            postData.order_info_id = this.order_info_id;
            savedUrl = '/api/note/saveModal';
        } else {
            postData.id = this.note_id;
            savedUrl = '/api/note2/saveModal';
        }
        let that = this;
        postData.img_src = this.data.imgs.join(',');
        c.showLoading();
        c.post(savedUrl, postData, function (ret) {
            c.hideLoading();
            if (ret.status == 1) {
                c.toast('提交成功');
                if (that.note_id > 0) {
                    c.excPrevPage('refreshData', postData);
                } else {
                    c.excPrevPage('refreshData');
                }
                wx.navigateBack({});
            } else {
                c.alert(ret.info);
            }
        });
    },
    setPostData: function (postData) {
        this.postData = postData;
        this.data.scoreTip = '已评分';
        this.setData({
            scoreTip: this.data.scoreTip
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    chooseImage: function () {
        var that = this;
        if (that.data.imgs.length >= 5) {
            ui.toast('最多只能上传5张照片');
            return;
        }
        wx.chooseImage({
            count: 5 - that.data.imgs.length,
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                var uploadPath = c.absUrl('/services/uploader/uploadImg');
                var count = tempFilePaths.length;
                var index = 0;
                c.showLoading();
                var imgs = that.data.imgs;
                tempFilePaths.forEach(function (el) {
                    wx.uploadFile({
                        url: uploadPath, //仅为示例，非真实的接口地址
                        filePath: el,
                        name: '_file_',
                        success: function (res) {
                            try {
                                res.data = JSON.parse(res.data);
                                if (res.data.status == 1) {
                                    var data = res.data.info;
                                    index++;
                                    imgs.push(data);
                                    if (index == count) {
                                        c.hideLoading();
                                        that.data.imgs = imgs;
                                        that.setData({
                                            imgs: that.data.imgs
                                        });
                                    }
                                }
                            } catch (e) {

                            }
                        }
                    });
                });
            }
        });
    }
})