// pages/onlineBuy/index.js
const app = getApp(),
  utilPage = require('../../utils/utilPage'),
  ApiService = require('../../utils/ApiService'),
  config = require('../../utils/config'),
  c = require("../../utils/common.js");
let discount_type, reduce_discount, toPayMoney = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    imageUrl: config.imageUrl,
    cover: '',
    isShowKey: true, //键盘弹起
    totalMoney: '' //消费金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    c.showLoading();
    var that = this;
    //取缓存
    wx.removeStorageSync("remark")
 
    this.shop_id = options.shop_id;
    c.get('/api/shop/getShopBuyInfo', {
      shop_id: this.shop_id
    }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        var info = res.info;
        if (info) {
          discount_type = info.discount_type;
          if (info.discount_type == 1) {
            reduce_discount = ((10 * 100 - Math.ceil(info.discount * 100)) / 100 / 10).toFixed(2);
            str = info.discount + ' 折';
          } else {
            var v = info.discount.split(':');
            reduce_discount = {
              count_money: Math.ceil(v[0]) || 0,
              reduce_money: Math.ceil(v[1]) || 0,
              max_reduce: Math.ceil(v[2]) || 0,
              repeated: Math.ceil(v[3]) || 0
            };
            var str = (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + (reduce_discount.max_reduce > 0 ? ',最多减' + reduce_discount.max_reduce : '');
          }
          that.setData({
            nickname: that.data.nickname = info.nickname,
            cover: that.data.cover = info.cover,
            discount: str
          });
        }
      }
    });
  },
  checkDiscount: function (e) {
    this.setData({
      hasDiscount: this.data.hasDiscount = !this.data.hasDiscount
    });
    this.calMoney();
  },
  totalMoneyInput: function (e) {
    this.data.totalMoney = app.util.moneyFloor(e.detail.value) || 0
    this.calMoney();
    return this.data.totalMoney
  },
  calMoney: function () {
    let discountFlag = this.data.hasDiscount,
      totalMoney = parseFloat(this.data.totalMoney) || 0,
      noDiscountMoney = parseFloat(this.data.noDiscountMoney) || 0;
    if (!discountFlag) {
      noDiscountMoney = 0;
    }
    if (noDiscountMoney > totalMoney) {
      noDiscountMoney = totalMoney;
    }
    var discountSum = 0;
    if (discount_type == 1) {
      discountSum = ((totalMoney * 100 - noDiscountMoney * 100) / 100 * reduce_discount).toFixed(2);
    } else {
      var calMoney = totalMoney - noDiscountMoney;
      if (calMoney >= reduce_discount.count_money && reduce_discount.count_money > 0) {
        var reduce = reduce_discount.reduce_money;
        if (reduce_discount.repeated) {
          reduce = Math.floor(calMoney / reduce_discount.count_money) * reduce;
        }
        if (reduce_discount.max_reduce > 0 && reduce > reduce_discount.max_reduce) {
          reduce = reduce_discount.max_reduce;
        }
        discountSum = reduce.toFixed(2);
      }
    }
    let money = totalMoney - discountSum;
    if (money <= 0.01 && totalMoney > 0) {
      money = 0.01
    }
    if (discountSum != 0 && money != 0) {
      this.data.discountSum = '-￥' + discountSum;
    } else {
      this.data.discountSum = 0;
    }
    money = money.toFixed(2);
    if (money > 0) {
      this.data.actMoney = money;
      this.data.actMoneyUnit = ' 元';
    } else {
      this.actMoney = '';
      this.actMoneyUnit = '';
    }
    if (money > 0) {
      this.data.submitBtnEnabled = true;
    } else {
      this.data.submitBtnEnabled = false;
    }
    toPayMoney = money;
    if (this.data.totalMoney == '' || this.data.totalMoney == 0) {
      this.data.actMoney = ''
    }
    this.setData({
      toPayMoney: toPayMoney,
      actMoney: this.data.actMoney,
      discountSum: this.data.discountSum,
      submitBtnEnabled: this.data.submitBtnEnabled,
      actMoneyUnit: this.data.actMoneyUnit
    });
  },
  //定义键盘隐藏
  onKeyUpBlur: function () {
    let that = this
    that.setData({
      isShowKey: true
    })
  },

  // 完成关闭
  onKeyUpBlur2: function () {
    let that = this
    that.setData({
      isShowKey: false
    })
  },
  //点击键盘显示，消费input显示
  clickNum: function (e) {
    let that = this
    let num = e.target.dataset.num
    var totalMoney = that.data.totalMoney + num
    // if (that.data.totalMoney == 0) {
    //     totalMoney = num
    // }
    if (totalMoney.length > 1) {
      if (totalMoney.substring(0, 1) == 0 & totalMoney.substring(1, 2) == 0) {
        totalMoney = 0
      } else if (totalMoney.substring(0, 1) == 0 & totalMoney.substring(1, 2) != '.') {
        return
      }
    }
    //输入框 最多显示8位数字
    if (that.data.totalMoney.length == 8) return
    that.setData({
      totalMoney: totalMoney
    })
    that.calMoney()
  },
  //自定义键盘 删除事件
  deleteNum: function () {
    let that = this
    var num = that.data.totalMoney.substr(0, that.data.totalMoney.length - 1)
    // if (that.data.totalMoney == 0) {
    //     num = 0
    // }
    that.setData({
      totalMoney: num
    })
    that.calMoney()
  },


  gotoRemarks() {
    wx.navigateTo({
      url: '/pages/onlineBuy/remarks/index?shop_id=' + this.shop_id
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
  noDiscountMoneyInput: function (e) {
    let that = this
    var v = app.util.moneyFloor(e.detail.value);
    var totalMoney = this.data.totalMoney;
    if (totalMoney&&v) {
      v = parseFloat(v);
      if(totalMoney<=v){
        that.setData({
          noDiscountMoney:totalMoney-0.01
        })
      }else{
        that.setData({
          noDiscountMoney:v
        })
      }
    } else {
      that.setData({
        noDiscountMoney:0
      })
    }
    this.calMoney();
    return v
  },
  submitOrder: function (e) {
    console.log("1111111111");

    var remark = wx.getStorageSync("remark")
    var technician_ids = remark.firstCategoryArr;
    var item_ids = remark.secondCategoryArr;
    var content = remark.option
    console.log(remark, 'sdfjsdfjsdljflj');
    if (this.data.submitBtnEnabled) { // can
      let noDiscountMoney = this.data.noDiscountMoney;
      if (!this.data.hasDiscount) {
        noDiscountMoney = 0;
      }
      c.showLoading();
      c.post('/api/wx2/makeOrder2', {
        shop_id: this.shop_id,
        totalMoney: this.data.totalMoney,
        noDiscountMoney: noDiscountMoney,
        technician_ids: technician_ids,
        item_ids: item_ids,
        content: content
      }, function (res) {
        c.hideLoading();
        if (res.status == 1) {
          let money = toPayMoney,
            order_no = res.info;
          wx.navigateTo({
            url: 'step2?money=' + res.info.money + '&order_no=' + res.info.order_no,
          })
        } else {
          c.alert(res.info);
        }
      });
    }
  }
})