// pages/page/index.js
const c = require("../../utils/common.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = decodeURIComponent(options.token);
        let url = '';
        if (token.indexOf('://') == -1) {
            url = c.absUrl('/api/page_data/getPage?token=' + (token || 'agreement'));
        } else {
            url = token;
        }
        let sid;
        if (sid = c.getSessionId()) {
            sid = sid.substr(10);
            if (url.indexOf('?') !== -1) {
                url += '&_session_id=' + sid;
            } else {
                url += '?_session_id=' + sid;
            }
        }
        if (url.indexOf('location=1') !== -1) {
            let that = this;
            c.getLocation(function (loc) {
                let lat = loc.latitude;
                let lon = loc.longitude;
                if (url.indexOf('?') !== -1) {
                    url += '&';
                } else {
                    url += '?';
                }
                url += 'lat=' + lat + '&lon=' + lon;
                console.log(url);
                that.setData({
                    src: url
                });
            });
        } else {
            this.setData({
                src: url
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
    onGetMsg(e) {
        console.log(e);
        c.alert(JSON.stringify(e.detail));
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})