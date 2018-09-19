// pages/cases/index.js
const c = require("../../utils/common.js");
var page = 0;
var scrollLeft = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    categories: [],
    cid: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    loadingMore: false,
    hasMore: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0;
    this.shop_id = options.shop_id;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        scrollLeft = parseInt(res.windowWidth / 3);
        that.setData({
          scrollHeight: res.windowHeight - res.windowWidth/750 * 96
        });
        c.showLoading();
        that.loadData(function(){
          c.hideLoading();
        });
      }
    });
  },
  loadData: function (callback, isAppend) {
    if (!this.data.hasMore) {
      return;
    }
    if (!this.loadingMore) {
      page++;
      var that = this;
      this.data.loadingMore = 1;
      if (isAppend){
        this.setData({
          loadingMore: 1
        });
      }      
      c.get("/api/wx2/items", { shop_id: this.shop_id, p: page, category_id: this.data.cid }, function (res) {
        that.data.loadingMore = 0;
        let setData = {
          loadingMore: 0
        };
        if (res.status == 1) {
          if (res.info.rows.length < c.getPageSize()) {
            that.data.hasMore = 0;            
            if (res.info.rows.length==0){
               setData.isEmpty = true;
            }else{
              setData.hasMore = 0;
            }
          }
          if (isAppend) {
            that.data.data = that.data.data.concat(res.info.rows);
          } else {
            that.data.data = res.info.rows;
          }
          setData.data = that.data.data;
          if (page == 1 && that.data.cid == 0) { //first page and category_id = 0          
            that.data.categories = setData.categories = res.info.categories;
          }
        }
        callback && callback();
        that.setData(setData);
      });
    }
  },
  toggleCategory: function (e) {
    this.data.hasMore = 1;
    page = 0;
    var left = e.currentTarget.offsetLeft - scrollLeft;
    if (left < 0) {
      left = 0;
    }
    this.data.scrollLeft = left;
    this.data.cid = e.target.dataset.id;
    this.setData({
      cid: this.data.cid,
      scrollLeft: this.data.scrollLeft
    });
    c.showLoading();
    this.loadData(function(){
      c.hideLoading();
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

  scrolltolower: function (e) {
    this.loadData(null, 1);
  }
})