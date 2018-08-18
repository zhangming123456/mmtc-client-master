// pages/order/score.js
const c = require("../../utils/common.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ens: [1, 1, 1, 1, 1],
        major: [1, 1, 1, 1, 1],
        service: [1, 1, 1, 1, 1],
        effect: [1, 1, 1, 1, 1]
    },
    toogleTechnician: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        that.data.technicians && that.data.technicians.forEach(function (el) {
            if (el.id == id) {
                el.selected = el.selected === false;
                that.setData({
                    technicians: that.data.technicians
                });
                return false;
            }
        });
    },

    toogleTags: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        that.data.tags && that.data.tags.forEach(function (el) {
            if (el.id == id) {
                el.selected = !el.selected;
                that.setData({
                    tags: that.data.tags
                });
                return false;
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        c.get('/api/item/technician', {
            order_info_id: options.id || 1
        }, function (ret) {
            if (ret.status == 1 && ret.info.length > 0) {
                that.setData({
                    technicians: that.data.technicians = ret.info
                });
                that.data.isTechnicians = true
            } else {
                that.data.isTechnicians = false
            }
        });
        c.get('/api/tag/getData', function (ret) {
            if (ret.status == 1) {
                that.setData({
                    tags: that.data.tags = ret.info
                });
            }
        });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    submitData: function () {
        var tids = [];
        this.data.technicians && this.data.technicians.forEach(function (e) {
            if (e.selected !== false) {
                tids.push(e.id);
            }
        });

        var tag_ids = [];
        this.data.tags && this.data.tags.forEach(function (e) {
            if (e.selected) {
                tag_ids.push(e.id);
            }
        });
        if (this.data.isTechnicians && !tids.length) {
            c.alert('请选择至少一个技师');
            return;
        }
        if (!tag_ids.length) {
            c.alert('请选择至少一个标签');
            return;
        }

        var ens = this.arr2num(this.data.ens);
        var major = this.arr2num(this.data.major);
        var service = this.arr2num(this.data.service);
        var effect = this.arr2num(this.data.effect);
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (prevPage) {
            prevPage.setPostData({
                environment_score: ens,
                major_score: major,
                service_score: service,
                effect_score: effect,
                technician_ids: tids,
                score_tag_ids: tag_ids
            });
            wx.navigateBack({});
        }
    },
    setMajorScore: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index) + 1;
        for (var i = 0; i < this.data.major.length; i++) {
            if (i < idx) {
                this.data.major[i] = 1;
            } else {
                this.data.major[i] = 0;
            }
        }
        this.setData({
            major: this.data.major
        });
    },
    setEnsScore: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index) + 1;
        for (var i = 0; i < this.data.ens.length; i++) {
            if (i < idx) {
                this.data.ens[i] = 1;
            } else {
                this.data.ens[i] = 0;
            }
        }
        this.setData({
            ens: this.data.ens
        });
    },
    setServiceScore: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index) + 1;
        for (var i = 0; i < this.data.service.length; i++) {
            if (i < idx) {
                this.data.service[i] = 1;
            } else {
                this.data.service[i] = 0;
            }
        }
        this.setData({
            service: this.data.service
        });
    },
    setEffectScore: function (e) {
        var idx = parseInt(e.currentTarget.dataset.index) + 1;
        for (var i = 0; i < this.data.effect.length; i++) {
            if (i < idx) {
                this.data.effect[i] = 1;
            } else {
                this.data.effect[i] = 0;
            }
        }
        this.setData({
            effect: this.data.effect
        });
    },
    arr2num: function (arr) {
        var rt = 0;
        arr.forEach(function (e) {
            if (e == 1) {
                rt++;
                return false;
            }
        });
        return rt;
    }
})