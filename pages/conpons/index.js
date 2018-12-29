const app = getApp(),
  util2 = app.util2,
  regeneratorRuntime = util2.regeneratorRuntime,
  config = require('../../utils/config'),
  utilPage = require('../../utils/utilPage'),
  ApiService = require('../../utils/ApiService/index');
let $wxParse = require('../../wxParse/wxParse');

const appPage = {
  data: {
    text: "page shop home",
    coupon: []
  },
  onLoad: function () {
    let that = this;
    that.loadCb();
  },
  /**
   * 进入页面
   */
  onShow: function (options) {
    let that = this;
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
   * 页面渲染完成
   */
  onReady: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    this.getCoupon()
    wx.stopPullDownRefresh()

  },
  /**
   * 上拉触底
   */
  onReachBottom() {
    let that = this,
      page = that.data.page;

  },
  /**
   * 页面滚动
   * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
   */
  onPageScroll(options) {

  }
}
const methods = {
  async loadCb() {
    let that = this,
      options = that.data.options,
      shop_id = options.shop_id;
    this.getCoupon()

  },
  // 获取店铺优惠券
  getCoupon() {
    let that = this;
    var shop_id = this.data.options.shop_id;
    ApiService.getCoupon({
      shop_id

    }).finally(res => {
      if (res.status === 1) {

        that.setData({
          coupon: res.info
        });
      }
    })
  },

  doPicker(e) {
    console.log(e, 4444444444);
    var id = e.currentTarget.dataset.item.id;
    ApiService.getDoPicker({
      id
    }).finally(res => {
      if (res.status === 1) {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000,
        })
        this.getCoupon()
      }
    })
  },


  doItmes(e) {
    var item = e.currentTarget.dataset.item;
    if (item && item.shop_id) {
      this.$route.push({
        path: '/page/shop/pages/projects/index',
        query: {
          shop_id: item.shop_id,
          category_id: 0
        }
      })
    }

  },

}

Page(new utilPage(appPage, methods));
