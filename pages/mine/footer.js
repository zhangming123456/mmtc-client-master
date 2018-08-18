// pages/mine/footer.js
const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$vm = c.listGrid(this, {
      url: '/api/member/footPlace'
    }).setOnLoadMore(function (res) {
        let data = this.context.data.items;
        let lastKey = data[data.length - 1].date;
        let info = res.info.data;
        if (lastKey == info[0].date) {
            data[data.length-1].rows.concat(info[0].rows);
            info.splice(0,1);
        }
        this.context.data.items = this.context.data.items.concat(info);
        let setData = {
          items: this.context.data.items
        };
        console.log('loadingmore');
        console.log(this.context.data.items);
        if (res.info.size < this.pageSize) {
          this.noMore = setData.noMore = true;
        }
        this.setData(setData);
      })
      .setOnLoadData(function (res) {
        let setData = {
          items: this.context.data.items = res.info.data
        };
        if(res.info.size < this.pageSize){
          this.noMore = setData.noMore = true;
        }
        this.setData(setData);
      })
      .loadData();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showItemDetail:function(e){
    var id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: '/pages/item/detail?id=' + id
      })
    }
  }
})