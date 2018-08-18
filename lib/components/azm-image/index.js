const app = getApp(),
    util2 = app.util2,
    config = require("../../../utils/config"),
    authorize = require("../../../utils/azm/authorize");
Component({
    externalClasses: ['azm-image'],
    data: {
        name: 'image',
        newSrc: '',
        isError: false,
        isLoad: false,
        height: ``
    },
    properties: {
        type: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                // console.log(newVal, oldVal, this.data.isError, `属性值被更改时的响应函数:src`);
                this.setData({type: newVal})
            }
        },
        src: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                // console.log(newVal, oldVal, this.data.isError, `属性值被更改时的响应函数:src`);
                this.setData({
                    isLoad: true,
                    newSrc: newVal
                })
            }
        },
        nolClass: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        ratio: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (newVal > 0) {
                    this.setData({
                        ratio: newVal
                    })
                }
            }
        },
        mode: {
            type: String,
            value: 'scaleToFill',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        lazyLoad: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        defineImage: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){
        // console.log(`组件生命周期函数created`);
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){
        // console.log(`组件生命周期函数attached`);
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        // console.log(`组件生命周期函数ready`);
        let that = this,
            ratio = that.data.ratio;
        if (ratio > 0) {
            let query = wx.createSelectorQuery().in(that);
            query.select(".azm-image-box").boundingClientRect(function (res) {
                let width = res.width;
                that.setData({
                    height: `height: ${width * ratio}px;`
                })
            }).exec()
        }
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
        // console.log(`组件生命周期函数moved`);
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){
        // console.log(`组件生命周期函数detached`);
    },
    methods: {
        _bindAzmImageError(e) {
            // console.log(e, `组件事件函数_bindAzmImageError`);
            let that = this,
                type = that.data.type,
                img = 'http://app.mmtcapp.com/mmtc/imgs/mmtcTabList/banner.png',
                imgErr = 'https://app.mmtcapp.com/mmtch5/images/imageErr.png';
            if (type === 'img' && !that.data.defineImage) {
                that.setData({newSrc: imgErr});
            } else {
                that.setData({newSrc: that.data.defineImage || img});
            }
            that.triggerEvent('error', {dataset: e.detail}, {bubbles: true, composed: true});
        },
        _bindAzmImageLoad(e){
            // console.log(e, `组件事件函数_bindAzmImageLoad`);
            let that = this;
            that.setData({
                isLoad: true
            });
            that.triggerEvent('load', {dataset: e.detail}, {bubbles: true, composed: true});
        }
    }
})
