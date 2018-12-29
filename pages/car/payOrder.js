const app = getApp(), util2 = app.util2;
Page({
    onLoad: function (options) {
        let that = this;
        util2.showToast('跳转中...');
        for (let k in options) {
            options[k] = decodeURIComponent(options[k]);
        }
        util2.router.replace({
            path: '/page/payment/pages/itemPay/index',
            query: {...options}
        }).finally(res => {
            util2.hideToast();
        })
    },
});
