const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page mine coupons',
        page: 1,
        noMore: false,
        notes: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        this.loadCb()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow () {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this,
            page = that.data.page;
        this.getNoteMyNote(page)
    },
};
const methods = {
    loadCb () {
        this.getNoteMyNote()
    },
    getNoteMyNote(p = 1, bol){
        let that = this, setData = {};
        if (that.isGetNoteMyNote)return;
        this.isGetNoteMyNote = true;
        if (!bol) {
            util2.showLoading()
        }
        ApiService.getNoteMyNote({p}).finally(res => {
            this.isGetNoteMyNote = false;
            util2.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.length > 0) {
                    if (p === 1) {
                        setData[`notes`] = [info]
                    } else {
                        setData[`notes[${p - 1}]`] = info
                    }
                    setData[`page`] = p + 1;
                    setData.noMore = info.length !== 10;
                } else if (info.length === 0) {
                    if (p > 1) {
                        setData[`page`] = p - 1;
                    }
                    setData.noMore = true;
                }
                that.setData(setData);
            } else {
                util2.failToast(res.message || '加载失败')
            }
        })
    },
    showItemDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        if (!id)return;
        this.$route.push({path: '/pages/item/detail', query: {id}})
    },
    showActions(e) {
        let id = e.currentTarget.dataset.id;
        let that = this;
        if (that.isDeleteNote)return;
        if (!id)return;
        wx.showActionSheet({
            itemList: ['修改日记', '删除日记'],
            success: function (res) {
                if (res.tapIndex == 1) { // for delete
                    wx.showModal({
                        title: '提示',
                        content: '确定删除吗？',
                        success: function (res) {
                            if (res.confirm) {
                                that.isDeleteNote = true;
                                util2.showLoading();
                                ApiService.deleteNote({id}).finally(res => {
                                    that.isDeleteNote = false;
                                    util2.hideLoading(true);
                                    if (res.status === 1) {
                                        let notes = util2.pagingArrRefactor(that.data.notes, id);
                                        that.setData({notes, page: notes.length + 1})
                                    } else {

                                    }
                                })
                            } else if (res.cancel) {

                            }
                        }
                    });
                } else if (res.tapIndex == 0) {
                    that.$route.push({path: '/pages/order/note', query: {note_id: id}});
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    zan(e){
        this.$giveALike(e, 'notes');
    }
};

Page(new utilPage(appPage, methods));