const app = getApp(),
    util2 = app.util2;
Component({
    externalClasses: ['azm-image'],
    data: {
        name: 'image',
        newSrc: '',
        isError: false,
        isLoad: false,
        height: ``,
        borderRadius: ``
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
                let img = null;
                // if (newVal) {
                //     img = this.saveImage(newVal, true)
                // }
                this.setData({isLoad: true, newSrc: img || newVal})
            }
        },
        nolClass: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        round: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        ratio: {
            type: [String, Number],
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (newVal > 0) {
                    this.setData({ratio: newVal})
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
    created () {
        // console.log(`组件生命周期函数created`);
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached () {
        // console.log(`组件生命周期函数attached`);
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready () {
        // console.log(`组件生命周期函数ready`);
        let that = this,
            ratio = that.data.ratio,
            round = that.data.round;
        let query = wx.createSelectorQuery().in(that);
        query.select(".c-azm-image-box").boundingClientRect(function (res) {
            if (res && res.width) {
                let width = res.width, setData = {};
                if (ratio > 0) {
                    setData = {height: `height: ${width * ratio}px;`}
                }
                if (round) {
                    setData.borderRadius = `border-radius:100%;`;
                }
                that.setData(setData)
            }
        }).exec()
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved () {
        // console.log(`组件生命周期函数moved`);
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached () {
        // console.log(`组件生命周期函数detached`);
    },
    methods: {
        _bindAzmImageError (e) {
            // console.log(e, `组件事件函数_bindAzmImageError`);
            let that = this,
                type = that.data.type,
                defineImage = that.data.defineImage,
                img = 'http://app.mmtcapp.com/mmtc/imgs/mmtcTabList/banner.png',
                imgErr = 'https://app.mmtcapp.com/mmtch5/images/imageErr.png';
            if (type === 'img' && !defineImage) {
                // let imgErr2 = that.saveImage(imgErr);
                // that.setData({newSrc: imgErr2 || imgErr});
                that.setData({newSrc: imgErr});
            } else {
                // let defineImage2 = that.saveImage(defineImage || img);
                // that.setData({newSrc: defineImage2 || defineImage || img});
                that.setData({newSrc: defineImage || img});
            }
            that.triggerEvent('error', {dataset: e.detail}, {bubbles: true, composed: true});
        },
        saveImage(src1, bol){
            let src = util2.absUrl(src1);
            if (!/^https:\/\//.test(src))return;
            let arr = src.split(/[\/ : . @ _]+/);
            let key = `_images_${arr.join('')}`;
            let images = wx.getStorageSync(key);
            if (images) {
                return images;
            } else if (!bol) {
                wx.request({
                    url: src,
                    method: 'GET',
                    responseType: 'arraybuffer',
                    success: function (res) {
                        let base64 = wx.arrayBufferToBase64(res.data);
                        if (base64) {
                            wx.setStorageSync(key, `data:image/jpg;base64,${base64}`);
                        }
                        console.log(res.savedFilePath, arr, 'saveImage')
                        wx.getImageInfo({
                            src: res,
                            success (rsp) {
                                if (rsp.errMsg === "getImageInfo:ok") {

                                }
                            }
                        })
                    }
                });

            }
        },
        _bindAzmImageLoad (e) {
            let that = this;
            let src = that.data.newSrc;
            // that.saveImage(src);
            // console.log(e, `组件事件函数_bindAzmImageLoad`);
            that.setData({isLoad: true});
            that.triggerEvent('load', {dataset: e.detail}, {bubbles: true, composed: true});
        }
    }
})
