// pages/cases/detail.js
const c = require("../../utils/common.js");
var note_id = 0;
var page = 1;
var WxParse = require('../../wxParse/wxParse');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollHeight: 0,
        comments: [],
        focus: false,
        note: {},
        type: 0,
        loadingMore: false,
        hasMore: true,
        placeholder: '评论一下'
    },
    replyComment: function (e) {
        this.data.focus = true;
        var item = e.currentTarget.dataset.item;
        this.data.placeholder = '@' + item.nickname;
        this.reply_comment_id = item.id;
        this.reply_member_id = item.member_id;
        this.setData({
            placeholder: this.data.placeholder,
            currentValue: '',
            focus: this.data.focus
        });
    },
    bindblurComment: function () {
        this.reply_comment_id = 0;
        this.reply_member_id = 0;
        this.setData({
            currentValue: '',
            placeholder: this.data.placeholder = '评论一下'
        });

    },
    sendComment: function (e) {
        var content = e.detail.value.trim();
        if (!content) {
            c.alert('请输入评论内容');
            return;
        }
        c.showLoading();
        var that = this;
        var reply_comment_id = this.reply_comment_id;
        c.post('/api/note/comment', {
            note_id: note_id,
            content: content,
            reply_comment_id: this.reply_comment_id || 0,
            reply_member_id: this.reply_member_id || 0
        }, function (ret) {
            c.hideLoading();
            if (ret.status == 1) {
                var newRow = ret.info;
                if (reply_comment_id > 0) { // for replies
                    that.data.comments.forEach(function (el) {
                        if (el.id == reply_comment_id) {
                            if (!el.replies) {
                                el.replies = [];
                            }
                            el.replies.push(newRow);
                            return false;
                        }
                    });
                } else { // for commment
                    that.data.comments.unshift(newRow);
                }
                that.setData({
                    comments: that.data.comments
                });
                c.toast('评论成功');
            } else {
                c.alert(ret.info || '评论失败');
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        note_id = options.id || 167;
        this.data.type = options.type || 0;
        console.log(this.data.type);
        if (this.data.type == 2) {
            wx.setNavigationBarTitle({
                title: '动态详情',
            });
            this.setData({
                type: this.data.type
            });
        }
        page = 1;
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.data.scrollHeight = res.windowHeight - 17 * res.pixelRatio;
                // that.setData({
                //   scrollHeight: res.windowHeight - 17 * res.pixelRatio
                // });
                let inc = 1;
                try {
                    let key = 'v' + note_id;
                    if (wx.getStorageSync(key)) {
                        inc = 0;
                    }
                    wx.setStorageSync(key, 1);
                } catch (e) {

                }
                that.loadData(function (res) {
                    if (res.status == 1) {
                        let info = res.info;
                        that.data.note = c.wrapZanRow(info.note);
                        WxParse.wxParse('intro', 'html', that.data.note.content, that);
                        that.data.comments = c.wrapZan(info.comments, 'zanc');
                        let setData = {
                            note: that.data.note,
                            comments: that.data.comments
                        };
                        if (that.data.comments.length < c.getPageSize()) {
                            setData.noMore = true;
                        }
                        that.setData(setData);
                    }
                }, inc);
            }
        });
    },
    loadData: function (callback, inc) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        inc = inc || 0;
        var that = this;
        c.get("/api/note/detail", {id: note_id, p: page, inc: inc}, function (res) {
            that.isLoading = false;
            callback && callback(res);
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
        if (!this.isLoading && !this.data.noMore) {
            page++;
            this.setData({
                loadingMore: true
            });
            let that = this;
            this.loadData(function (res) {
                if (res.status == 1) {
                    let info = res.info;
                    let setData = {};
                    if (info.comments.length < c.getPageSize()) {
                        setData.noMore = true;
                    }
                    that.data.comments = that.data.comments.concat(c.wrapZan(info.comments, 'zanc'));
                    setData.comments = that.data.comments;
                    that.setData(setData);
                }
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    prevImg: function (e) {
        if ('index' in e.target.dataset) {
            var urls = c.str2absattr(this.data.note.img_src);
            var index = parseInt(e.target.dataset.index);
            wx.previewImage({
                current: urls[index], // 当前显示图片的http链接
                urls: urls  // 需要预览的图片http链接列表
            });
        }
    },
    zan: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.note.zaned = true;
            that.data.note.zan_count++;
            that.setData({
                note: that.data.note
            });
        });
    },
    zanComment: function (e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        var hasZan = c.getStorage('zanc' + id);
        if (hasZan) {
            return;
        }
        var that = this;
        c.get('/api/note/incZanOfComment', {
            cid: id
        }, function (ret) {
            if (ret.status == 1) {
                c.setStorage('zanc' + id, 1);
                c.toast('点赞成功');
                that.data.comments.every(function (el) {
                    if (id == el.id) {
                        el.zaned = true;
                        el.zan_count++;
                        that.setData({
                            comments: that.data.comments
                        });
                        return false;
                    }
                    return true;
                });
            }
        });
    }
})