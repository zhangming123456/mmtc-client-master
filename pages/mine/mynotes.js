const c = require("../../utils/common.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {},
    showItemDetail: function (e) {
        wx.navigateTo({
            url: '/pages/item/detail?id=' + e.currentTarget.dataset.id,
        })
    },
    zan: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.items.every(function (el) {
                if (el.id == id) {
                    el.zaned = true;
                    el.zan_count++;
                    that.setData({
                        items: that.data.items
                    });
                    return false;
                }
                return true;
            });
        });
    },
    refreshData(newData) {
        if (newData && newData.id) {
            this.data.items.every(function (el) {
                if (el.id == newData.id) {
                    el = c.extend(el, newData);
                    return false;
                }
                return true;
            });
            this.setData({
                items: this.data.items
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.$vm = c.listGrid(this, {
            url: '/api/note/mynote'
        }).setOnParseRows(function (rows) {
            return c.wrapZan(rows);
        }).loadData();
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
        this.$vm.loadMore();
    },
    showActions(e) {
        let id = e.currentTarget.dataset.id;
        let that = this;
        wx.showActionSheet({
            itemList: ['修改日记', '删除日记'],
            success: function (res) {
                if (res.tapIndex == 1) { // for delete
                    c.confirm('确定删除吗？', function () {
                        c.showLoading();
                        c.post('/api/note/deleteNote', {id: id}, function (ret) {
                            c.hideLoading();
                            if (ret.status == 1) {
                                that.data.items.every(function (el, idx) {
                                    if (el.id == id) {
                                        that.data.items.splice(idx, 1);
                                        return false;
                                    }
                                    return true;
                                });
                                that.setData({
                                    items: that.data.items
                                });
                            }
                        });
                    });
                } else if (res.tapIndex == 0) {
                    wx.navigateTo({
                        url: '/pages/order/note?note_id=' + id,
                    });
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})