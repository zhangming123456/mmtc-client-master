const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_src: ''
  },
  imgLoadedErr(e){
    c.alert('下载失败,请检查您的网络');
    c.hideLoading();
  },
  imgLoaded(){
    c.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    c.showLoading();  
    wx.downloadFile({
      url: c.absUrl('/api/wx_shop/showInviteQrcode'),
      header: {
        cookie: c.getSessionId()
      },
      success:  (res)=>{
        c.hideLoading();  
        this.setData({
          img_src: res.tempFilePath
        });
      }
    });
  },
  downImg: function () {
    if (!this.data.img_src){
       return;
    }
    c.showLoading()
    wx.saveImageToPhotosAlbum({
      filePath: this.data.img_src,
      complete() {
        c.hideLoading();
      },
      success(res) {
        c.toast('成功保存在相册');
      },
      fail() {
        c.alert('您取消了下载');
      }
    })
  },
  showAgreement(e) {
    wx.navigateTo({
      url: '/pages/page/index?token=agreement',
    })
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
  showActivity(){
    wx.navigateTo({
      url: '/pages/activity/index',
    })
  }
})