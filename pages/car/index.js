// pages/car/index.js
const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenMasker: true,
    items: [],
    is_edit_mode: false,
    total_money: 0,
    loaded: false,
    allChecked: false
  },

  pickConpon: function (e) {
    this.setData({
      hiddenMasker: false,
      coupons: e.currentTarget.dataset.coupons
    });
  },
  pickCoupon: function (e) {
    var id = e.currentTarget.dataset.id;
    if (id) {
      c.showLoading();
      var that = this;
      c.get('/api/coupon/doPicker', {
        id: id
      }, function (res) {
        c.hideLoading();
        if (res.status == 1) {
          var info = res.info;
          var errmsg = info.errmsg;
          that.data.coupons.every(function (el) {
            if (el.id == id) {
              el.errmsg = errmsg;
              el.picked = 1;
              that.setData({
                coupons: that.data.coupons
              });
              return false;
            }
            return true;
          });
        } else {
          c.alert(res.info);
        }
      });
    }
  },
  closeMasker: function () {
    this.setData({
      hiddenMasker: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.pages.cart1 = this;
    c.showLoading();
    var that = this;
    this.loadData(function () {
      c.hideLoading();
      that.data.loaded = true;
      that.setData({
        loaded: true
      });
    });
  },

  loadData: function (callback) {
    var that = this;
    c.get('/api/wx2/getCarts', function (ret) {
      if (ret.status == 1) {
        ret = ret.info;
        that.setData({
          items: ret.cart_items
        });
      }
      callback && callback();
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
  selectAllChange: function (e) {
    var shops = this.data.items;
    var checked = e.detail.value[0] == 1;
    for (var i = 0; i < shops.length; i++) {
      shops[i].checked = checked;
      for (var j = 0; j < shops[i].items.length; j++) {
        shops[i].items[j].checked = checked;
      }
    }
    this.setData({
      total_money: this.calcTotalMoney(),
      items: this.data.items
    });
  },
  inArray: function (el, arr) {
    if (arr && arr.length) {
      for (var i = 0; i < arr.length; i++) {
        if (el == arr[i]) {
          return true;
        }
      }
    }
    return false;
  },
  changeSelectedItems: function (e) { // for item
    let value = e.detail.value || [];
    let shop_index = parseInt(e.currentTarget.dataset.index);
    let items = this.data.items[shop_index].items;
    let shop_checked = true;
    for (var i = 0; i < items.length; i++) {
      if (this.inArray(i, value)) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
        shop_checked = false;
      }
    }
    this.data.items[shop_index].checked = shop_checked;
    this.setData({
      total_money: this.calcTotalMoney(),
      allChecked: this.calAllChecked(),
      items: this.data.items
    });
  },
  changeSelectedShops: function (e) { // for shop
    let value = e.detail.value || [];
    let shops = this.data.items;
    for (var i = 0; i < shops.length; i++) {
      if (this.inArray(i, value)) {
        shops[i].checked = true;
      } else {
        shops[i].checked = false;
      }
      for (var j = 0; j < shops[i].items.length; j++) {
        shops[i].items[j].checked = shops[i].checked;
      }
    }
    this.setData({
      total_money: this.calcTotalMoney(),
      items: shops,
      allChecked: this.calAllChecked()
    });
  },
  calAllChecked() {
    let shops = this.data.items;
    for (var i = 0; i < shops.length; i++) {
      if (!shops[i].checked) {
        return false;
      }
    }
    return true;
  },
  toggleEditMode: function () {
    this.data.is_edit_mode = !this.data.is_edit_mode;
    this.setData({
      is_edit_mode: this.data.is_edit_mode
    });
  },
  collectItem: function (e) {
    var ids = [];
    for (var i = 0; i < this.data.items.length; i++) {
      for (var j = 0; j < this.data.items[i].items.length; j++) {
        if (this.data.items[i].items[j].checked) {
          ids.push(this.data.items[i].items[j].id);
        }
      }
    }
    if (!ids.length) {
      c.toast('请选择至少一个项目');
      return;
    }
    var that = this;
    c.confirm("确定移入收藏夹吗？", function () {
      c.get('/api/wx2/collectAndRmCartItem', { ids: ids.join(',') }, function (res) {
        if (res.status == 1) {
          c.toast('移入收藏夹成功');
          that.loadData();
          that.setData({
            total_money: 0
          });
        }
      });
    });
  },
  rmBillItem: function (e) {
    var ids = [];
    for (var i = 0; i < this.data.items.length; i++) {
      for (var j = 0; j < this.data.items[i].items.length; j++) {
        if (this.data.items[i].items[j].checked) {
          ids.push(this.data.items[i].items[j].id);
        }
      }
    }
    if (!ids.length) {
      c.toast('请选择至少一个项目');
      return;
    }
    var that = this;
    c.confirm("确定所选项目吗？", function () {
      c.get('/api/wx2/rmCartItem', { ids: ids.join(',') }, function (res) {
        if (res.status == 1) {
          c.toast('删除成功');
          that.loadData();
          that.setData({
            total_money: 0
          });
        }
      });
    });
  },
  gobuyNow: function () {
    var ids = [];
    for (var i = 0; i < this.data.items.length; i++) {
      for (var j = 0; j < this.data.items[i].items.length; j++) {
        if (this.data.items[i].items[j].checked) {
          ids.push(this.data.items[i].items[j].id);
        }
      }
    }
    if (!ids.length) {
      c.toast('请选择至少一个项目');
      return;
    }
    wx.navigateTo({
      url: '/pages/car/payOrder?item_ids=' + ids.join(',')
    });
  },
  minuNum: function (e) {
    let index = e.currentTarget.dataset.index;
    let sindex = index.split('-');
    let item = this.data.items[parseInt(sindex[0])].items[parseInt(sindex[1])];
    item.num--;
    this.changeItemNum(item.id, item.num);  
    this.setData({
      total_money: this.calcTotalMoney(),
      items: this.data.items
    });
  },
  calcTotalMoney: function () {
    var sum = 0;
    var shops = this.data.items;
    for (var i = 0; i < shops.length; i++) {
      for (var j = 0; j < shops[i].items.length; j++) {
        if (shops[i].items[j].checked) {
          sum += parseInt(shops[i].items[j].price * 100) * shops[i].items[j].num;
        }
      }
    }
    sum = sum / 100;
    return sum;
  },
  changeNum: function (e) {
    let index = e.currentTarget.dataset.index;
    let sindex = index.split('-');
    let item = this.data.items[parseInt(sindex[0])].items[parseInt(sindex[1])];
    item.num = parseInt(e.detail.value);
    this.changeItemNum(item.id, item.num);
    this.setData({
      total_money: this.calcTotalMoney(),
      items: this.data.items
    });
  },
  changeItemNum: function (id, num) {
    c.post('/api/cart/setNum', { id: id, num: num });
  },
  plusNum: function (e) {
    let index = e.currentTarget.dataset.index;
    let sindex = index.split('-');
    let item = this.data.items[parseInt(sindex[0])].items[parseInt(sindex[1])];
    item.num++;
    this.changeItemNum(item.id, item.num);
    this.setData({
      total_money: this.calcTotalMoney(),
      items: this.data.items
    });
  },
  tapMaskerBox: function (e) {

  }
})