const c = require("../../../../utils/common.js");

const app = getApp(),
    util2 = app.util2,
    utilPage = require("../../../../utils/utilPage"),
    ApiService = require("../../../../utils/ApiService/index"),
    config = require("../../../../utils/config");

const appPage = {
    data: {
        text: 'Page mine feedback',
        page: 1,
        noMore: false,
        contact: '',
        content: '',
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
        let that = this
    },
};
const methods = {
    loadCb () {
    },
    setContact(e) {
        let key
        this.setData()
        this.contact = e.detail.value.trim();
    },
    setContent(e) {
        this.content = e.detail.value.trim();
    },
    doSure(e) {
        let contact = this.data.contact;
        let content = this.data.content;
        if (!this.contact) {
            c.alert('请填写手机/QQ/邮箱');
            return;
        }
        if (!this.content) {
            c.alert('请填写您的意见');
            return;
        }

        c.showLoading();
        ApiService.setMemberFeedback({})
        c.post('/api/member/feedback', {
            contact: this.contact.trim(),
            content: this.content.trim()
        }, function (ret) {
            c.hideLoading();
            if (ret.status == 1) {
                c.toast('感谢您的反馈');
                setTimeout(function () {
                    wx.navigateBack();
                }, 1000);
            } else {
                c.alert(ret.info);
            }
        });
    },
};

Page(new utilPage(appPage, methods));
