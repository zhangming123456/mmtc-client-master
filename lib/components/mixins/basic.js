import { classNames } from "../common/class-names";

const getCurrentPage = function () {
    let Pages = getCurrentPages();
    return Pages[Pages.length - 1]
};

function pageEvents (target) {
    if (!target) return;
    target.$el = getCurrentPage();
    let list = ['onLoad', 'onShow', 'onHide', 'onUnload', 'onReady'];
    let source = {};
    list.forEach(function (value, index, array) {
        source[value] = target.$el[value];
        target.$el[value] = function () {
            target[value] && target[value].apply(this, arguments);
            source[value] && source[value].apply(target, arguments);
        }
    });
}

export var basic = Behavior({
    created: function created () {
        var _this = this;
        wx.getSystemInfo({
            success: function success (_ref) {
                var model = _ref.model,
                    screenHeight = _ref.screenHeight;
                var isIphoneX = /iphone x/i.test(model);
                var isIphoneNew = /iPhone11/i.test(model) && screenHeight === 812;

                if (isIphoneX || isIphoneNew) {
                    _this.set({
                        isIPhoneX: true
                    });
                }
            }
        });
    },
    attached: function () {
        pageEvents(this)
    },
    methods: {
        classNames: classNames,
        $emit: function $emit () {
            this.triggerEvent.apply(this, arguments);
        },
        getRect: function getRect (selector, all) {
            var _this2 = this;

            return new Promise(function (resolve) {
                wx.createSelectorQuery().in(_this2)[all ? 'selectAll' : 'select'](selector).boundingClientRect(function (rect) {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect);
                    }

                    if (!all && rect) {
                        resolve(rect);
                    }
                }).exec();
            });
        }
    }
});
