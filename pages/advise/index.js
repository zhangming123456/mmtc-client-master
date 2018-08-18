const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  setContact(e) {
    this.contact = e.detail.value.trim();
  },
  setContent(e) {
    this.content = e.detail.value.trim();
  },
  doSure() {
    if (!this.contact) {
      c.alert('请填写手机/QQ/邮箱');
      return;
    }
    if (!this.content) {
      c.alert('请填写您的意见');
      return;
    }
    c.showLoading();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})