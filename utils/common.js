const baseUrl = "https://app.mmtcapp.com";
let c = {};
c.absUrl = (url, imgw) => {
    if (!url) {
        return '';
    }
    if (url.indexOf('://') !== -1) {
        return url;
    }
    if (imgw) {
        url += '!' + imgw + 'x' + imgw;
    }
    return baseUrl + url;
};
c.leftseconds2timestr = function (seconds) {
    let hours = Math.floor(seconds / 60 / 60);
    let minutes = Math.floor(seconds / 60) % 60;
    let s = seconds % 60;
    return c.w(hours) + ':' + c.w(minutes) + ':' + c.w(s);
};
c.getShopId = () => {
    return getApp().globalData.shop_id || 0;
};
c.getPrevPage = function () {
    let pages = getCurrentPages();
    return pages[pages.length - 2];
};

c.getCurrentPage = function () {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
};

c.setShopId = function (id) {
    getApp().globalData.shop_id = id;
};
c.showLoading = function (title) {
    if (c.showLoading.isLoading) {
        return;
    }
    c.showLoading.isLoading = true;
    wx.showLoading({
        title: title || '正在加载...',
    });
};
c.setUserInfo = function (data) {
    if (data) {
        if (data.avatar) {
            data.avatar = c.absUrl(data.avatar);
        }
        var minePage = getApp().globalData.pages.minePage;
        if (minePage) {
            minePage.setData({
                user: data
            });
        }
    }
    wx.setStorageSync('_userInfo_', data);
};
c.getUserInfo = function () {
    return wx.getStorageSync('_userInfo_') || null;
};
c.rmUserInfo = function () {
    wx.removeStorageSync('_userInfo_');
};
c.hideLoading = function () {
    if (c.showLoading.isLoading) {
        c.showLoading.isLoading = false;
        wx.hideLoading();
    }
};
c.getPageSize = function () {
    return 10;
};
c.ajax = (opts) => {
    var headers = {
        'content-type': 'application/json' // 默认值
    };
    var sid = c.getSessionId();
    if (sid) {
        headers['cookie'] = sid;
    }
    let options = c.extend(
        {
            header: headers,
            dataType: 'json'
        },
        opts
    );
    var old_success = options.success;
    options.success = function (res) {
        console.log(options.url);
        console.log(res.data);
        var setCookie = res.header['Set-Cookie'];
        if (setCookie && setCookie.indexOf('PHPSESSID=') !== -1) {
            var lpos = setCookie.indexOf(';');
            if (lpos != -1) {
                setCookie = setCookie.substr(0, lpos);
            }
            c.saveSessionId(setCookie);
        }
        if (res.data.status == 202) {
            console.log(1);
            getApp().globalData._ajax_callback = c.ajax.bind(c, opts);
            c.rmUserInfo();
            if (c.getCurrentPage().route != 'pages/mine/index') {
                wx.navigateTo({
                    url: '/page/userLogin/pages/getUserInfo/index',
                });
                return;
            }
        }
        old_success && old_success(res.data, res);
    };
    if (!options.data) {
        options.data = {};
    }
    options.data['_f'] = 1;
    console.log("request url:" + options.url);
    console.log("requeest data:" + JSON.stringify(options.data));
    wx.request(options);
};
c.refreshPrevPage = function () {
    let c = getApp().globalData._ajax_callback;
    c && c();
};
c.extend = function () {
    var args = Array.prototype.slice.call(arguments);
    var a = args[0];
    for (var i = 1; i < args.length; i++) {
        var arg = args[i];
        for (var key in arg) {
            if (typeof arg[key] !== 'undefined') {
                a[key] = arg[key];
            }
        }
    }
    return a;
};
c.get = (url, data, callback, dataType) => {
    dataType = dataType || 'json';
    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    c.ajax({
        url: c.absUrl(url), //仅为示例，并非真实的接口地址
        dataType: dataType,
        data: data,
        method: 'GET',
        success: callback
    });
};

c.hasLoginWx = function () {
    let _login_time = c.getStorage('_login_time') || 0
    if (!_login_time || (Date.now() - _login_time) / 1000 / 60 > 4.5) {
        return false
    }
    return true
}
c.setHasLoginWx = function () {
    c.setStorage('_login_time', Date.now())
}
c.removeHasLoginWx = function () {
    c.removeStorage('_login_time')
}
c.str2attr = function (strs) {
    if (strs) {
        strs = strs.split(',');
        return strs;
    }
    return [];
};


c.post = (url, data, callback, dataType) => {
    dataType = dataType || 'json';
    if (typeof data === 'function') {
        callback = data;
        data = {};
    }
    c.ajax({
        url: c.absUrl(url), //仅为示例，并非真实的接口地址
        dataType: dataType,
        data: data,
        method: 'POST',
        success: callback
    });
};

c.str2absattr = function (strs) {
    if (strs) {
        strs = strs.split(',');
        for (var i = 0; i < strs.length; i++) {
            strs[i] = c.absUrl(strs[i]);
        }
        return strs;
    }
    return [];
};
c.showToast = function (msg, icon) {
    wx.showToast({
        title: msg || '',
        icon: icon || 'success',
        duration: 2000
    });
};
c.toast = function (msg, icon) {
    c.showToast(msg, icon);
};
c.hideToast = function () {
    wx.hideToast();
};
c.alert = function (content, onConfirm) {
    wx.showModal({
        title: '提示',
        showCancel: false,
        content: content,
        success: function (res) {
            if (res.confirm) {
                onConfirm && onConfirm();
            }
        }
    });
};
c.confirm = function (content, onConfirm, onCancel) {
    wx.showModal({
        title: '提示',
        content: content,
        success: function (res) {
            if (res.confirm) {
                onConfirm && onConfirm();
            } else if (res.cancel) {
                onCancel && onCancel();
            }
        }
    });
};
c.getCity = function (field, def) {
    let v = c.getCity.value || {};
    if (field) {
        return v[field] || def;
    }
    return v;
};
c.setCity = function (city, value) {
    if (city && typeof value !== 'undefined') {
        c.getCity.value[city] = value;
        return;
    }
    c.getCity.value = city;
};
c.getLocation = function (callback, onFail) {
    wx.getLocation({
        type: 'gcj02',
        success: function (res) {
            callback(res);
        },
        fail(){
            onFail && onFail()
        }
    });
};
c.hasLoginSync = function () { // 同步
    var sid = wx.getStorageSync('sid');
    return !!sid;
};
c.hasLogin = function (callback) { // 异步
    if (c.hasLoginSync()) {
        callback && callback();
    } else {
        wx.navigateTo({
            url: '/page/userLogin/pages/getUserInfo/index',
        });
    }
};
c.refreshBillPage = function () {
    var page = getApp().globalData.pages.billpage;
    if (page) {
        page.refreshData && page.refreshData();
    }
};
c.logoff = function () {
    c.rmUserInfo();
    c.rmSessionId();
    c.removeHasLoginWx();
    c.get('/api/wx2/logoff');
};
c.setStorage = function (key, data) {
    wx.setStorageSync(key, data);
};
c.getStorage = function (key) {
    return wx.getStorageSync(key);
};
c.removeStorage = function (key) {
    wx.removeStorageSync(key);
};
c.saveSessionId = function (sid) {
    try {
        wx.setStorageSync('sid', sid);
    } catch (e) {

    }
};
c.getSessionId = function () {
    try {
        return wx.getStorageSync('sid');
    } catch (e) {
        return null;
    }
};

c.getSessionIdValue = function () {
    let sid = c.getSessionId();
    if (sid) {
        return sid.substr(10);
    }
    return sid;
};

c.rmSessionId = function () {
    try {
        wx.removeStorageSync('sid');
    } catch (e) {

    }
};
var ListGrid = function (context, options) {
    this.options = options;
    this.context = context;
    this.params = {};
    this.pageSize = c.getPageSize();
    this.page = 1;
    this.onLoadData = null;
    this.onLoadMore = null;
    this.isLoading = false;
    this.noMore = false;
};
ListGrid.defaults = {
    autoLoad: true
};
ListGrid.prototype.getParams = function () {
    return this.params;
};
ListGrid.prototype.setOnParseRows = function (func) {
    this.onParseRows = func;
    return this;
};
ListGrid.prototype.loadMore = function (callback) {
    if (this.isLoading || this.noMore) {
        return;
    }
    var params = this.getParams(), that = this;
    params.p = ++this.page;
    var options = this.options;
    that.context.setData({
        loadingMore: true
    });
    c.get(options.url, params, function (res) {
        that.isLoading = false;
        if (res.status == 1) {
            if (that.onLoadMore) {
                that.onLoadMore.call(that, res);
            } else {
                if (that.onParseRows) {
                    let rt = that.onParseRows(res.info);
                    if (rt !== undefined) {
                        res.info = rt;
                    }
                }
                that.context.data.items = that.context.data.items.concat(res.info);
                let setData = {
                    items: that.context.data.items
                };
                if (res.info.length < that.pageSize) {
                    setData.noMore = that.noMore = true;
                }
                that.context.setData(setData);
            }
        }
        callback && callback(res);
    });
    return this;
};

ListGrid.prototype.setOnLoadMore = function (onLoadMore) {
    this.onLoadMore = onLoadMore;
    return this;
};
ListGrid.prototype.setUrl = function (url) {
    this.options.url = url;
    return this;
};
ListGrid.prototype.setOnLoadData = function (onLoadData) {
    this.onLoadData = onLoadData;
    return this;
};

ListGrid.prototype.loadData = function (callback) {
    if (this.isLoading) {
        return;
    }
    this.noMore = false;
    var params = this.getParams();
    params.p = this.page = 1;
    var options = this.options;
    var that = this;
    c.showLoading();
    that.setData({
        noMore: this.noMore,
        loadingMore: false,
        isEmpty: false,
        items: []
    });
    c.get(options.url, params, function (res) {
        that.isLoading = false;
        if (res.status == 1) {
            if (that.onLoadData) {
                that.onLoadData.call(that, res);
            } else {
                if (that.onParseRows) {
                    let rt = that.onParseRows(res.info);
                    if (rt !== undefined) {
                        res.info = rt;
                    }
                }
                that.context.data.items = res.info;
                let setData = {
                    items: that.context.data.items
                };
                if (res.info.length < that.pageSize) {
                    if (res.info.length == 0) {
                        setData.isEmpty = true;
                    } else {
                        setData.isEmpty = false;
                    }
                    if (res.info.length > 0) {
                        setData.noMore = true;
                    }
                    that.noMore = true;
                } else {
                    setData.isEmpty = false;
                }
                that.context.setData(setData);
            }
        }
        callback && callback(res);
        c.hideLoading();
    });
    return this;
};
ListGrid.prototype.setData = function (data) {
    this.context.setData(data);
};
ListGrid.prototype.setParams = function (params) {
    this.params = params;
    return this;
};
ListGrid.prototype.setParam = function (field, value) {
    this.params[field] = value;
    return this;
};

ListGrid.prototype.rmParam = function (field, value) {
    if (field in this.params) {
        delete this.params[field];
    }
    return this;
};
c.excPrevPage = function (functionName, params) {
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (prevPage) {
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage[functionName] && prevPage[functionName](params);
    }
};
c.flushCarts = function () {
    var cart = getApp().globalData.pages.cart2;
    if (cart) {
        cart.loadData();
    }
    cart = getApp().globalData.pages.cart1;
    if (cart) {
        cart.loadData();
    }
};
c.w = function (num) {
    return num >= 10 ? num : '0' + num;
};
c.isPhone = function (phone) {
    return /^1[34578]\d{9}$/.test(phone);
};
c.listGrid = function (context, options) {
    return new ListGrid(context, options);
};
c.zan = function (nid, callback) {
    if (c.getStorage('zan' + nid)) {
        console.log(nid + 'hasZaned');
        return false;
    }
    c.setStorage('zan' + nid, 1);
    c.get('/api/note/incZan', {nid: nid}, function (ret) {
        if (ret.status == 1) {
            c.toast('点赞成功');
            callback && callback();
        }
    });
    return true;
};
c.getLatAndLon = function () {
    return c.getStorage('lat_and_lon') || {};
};
c.setLatAndLon = function (data) {
    c.setStorage('lat_and_lon', data);
};
c.hasZaned = function (nid, prefix) {
    return !!c.getStorage((prefix || 'zan') + nid);
};
c.wrapZan = function (list, prefix) {
    list && list.every(function (el) {
        el.zaned = c.hasZaned(el.id, prefix);
        return true;
    });
    console.log(list);
    return list;
};
c.wrapZanRow = function (row, prefix) {
    row.zaned = c.hasZaned(row.id, prefix);
    return row;
};
c.getAddress = function () {
    return c.getStorage('addr') || '';
};
c.setAddress = function (addr) {
    c.setStorage('addr', addr);
    return this;
};
module.exports = c;