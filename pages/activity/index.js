const app = getApp(),
    util = app.util,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage'),
    authorize = require('../../utils/azm/authorize'),
    ApiService = require('../../utils/ApiService'),
    c = require("../../utils/common");
/**
 * @author zhangxinxu(.com)
 * @licence MIT
 * @description http://www.zhangxinxu.com/wordpress/?p=7362
 */
function drawTextVertical (context, text, x, y) {
    var arrText = text.split('');
    var arrWidth = arrText.map(function (letter) {
        return 26;
        // 这里为了找到那个空格的 bug 做了许多努力，不过似乎是白费力了
        // const metrics = context.measureText(letter);
        // console.log(metrics);
        // const width = metrics.width;
        // return width;
    });

    var align = context.textAlign;
    var baseline = context.textBaseline;

    if (align == 'left') {
        x = x + Math.max.apply(null, arrWidth) / 2;
    } else if (align == 'right') {
        x = x - Math.max.apply(null, arrWidth) / 2;
    }
    if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
        y = y - arrWidth[0] / 2;
    } else if (baseline == 'top' || baseline == 'hanging') {
        y = y + arrWidth[0] / 2;
    }

    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 开始逐字绘制
    arrText.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        // 是否需要旋转判断
        var code = letter.charCodeAt(0);
        if (code <= 256) {
            context.translate(x, y);
            // 英文字符，旋转90°
            context.rotate(90 * Math.PI / 180);
            context.translate(-x, -y);
        } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
            // y修正
            y = y + arrWidth[index - 1] / 2;
        }
        context.fillText(letter, x, y);
        // 旋转坐标系还原成初始态
        context.setTransform(1, 0, 0, 1, 0, 0);
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        y = y + letterWidth;
    });
    // 水平垂直对齐方式还原
    context.textAlign = align;
    context.textBaseline = baseline;
}

// module.exports = {
//     drawTextVertical: drawTextVertical
// }

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page activityIndex',
        cookie: '',
        posterPopup_text: '这张海报已经自动帮您保存到手机相册，发送好友或群，让大家来领红包吧~',
        drawArray: [],
        downAreasStyle: 'color: #feece1;',
        bgImage: {},//源背景图数据
        _bgImage: {},//背景图数据
        qrCodeImage: {},//源二维码数据
        _qrCodeImage: {},//维码数据
        multiple: 3,//绘制几倍图
        startUp: false,
        imagesName: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadCb();
    },
    onShow () {
        if (this.data.isShow && !this.data.isHidePage) {
            this.loadCb();
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '分享有礼',
            path: `/pages/activity/wallet?invite_id=${util.getSessionId()}`,
            imageUrl: this.data._qrCodeImage.path
        };
    }
};
const methods = {
    loadCb () {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#feece1',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
        this.data.cookie = util.getSessionId();
        this.downImage();
        this.binTogglePosterPopup();
    },
    // 下载图片&二维码
    downImage () {
        util.showLoading('下载图片');
        let that = this,
            imageUrl = that.data.imageUrl,
            cookie = that.data.cookie,
            pagePath = encodeURIComponent('pages/activity/wallet'),
            imagePath = `${imageUrl}/little/redbag.png`,
            qrCodePath = `${imageUrl}/api/wx_shop/showInviteQrcode?page=${pagePath}`;
        that.data.startUp = true;
        that.data.tempFilePath = null;
        wx.getSystemInfo({
            success: res => {
                let winWidth = res.windowWidth,
                    winHeight = res.windowHeight,
                    setData = {winWidth, winHeight}, imagesName = [];
                that.setData({imagePath, qrCodePath});
                let p1 = new Promise((resolve, reject) => {
                        wx.downloadFile({
                            url: imagePath,
                            success: function (res) {
                                console.log(res, '_bgImage', 1);
                                if (res.header && /text\/html/.test(res.header[`Content-Type`])) {
                                    util.go('/page/userLogin/pages/getUserInfo/index');
                                } else if (res.statusCode === 200) {
                                    let path = res.tempFilePath;
                                    wx.getImageInfo({
                                        src: path,
                                        success: function (res) {
                                            console.log(res, '_bgImage');
                                            setData.bgImage = res;
                                            imagesName.push('_bgImage');
                                            resolve(true);
                                        },
                                        fail (err) {
                                            console.log(err, '_bgImage');
                                            util.go('/page/userLogin/pages/getUserInfo/index');
                                            reject(false);
                                        }
                                    });
                                } else {
                                    reject(false)
                                }
                            },
                            fail: () => {
                                util.showToast('网络连接失败');
                                reject();
                            }
                        });
                    }).then(result => result).catch(e => e),
                    /**
                     * 下载二维码
                     * @type {Promise<any>}
                     */
                    p2 = new Promise((resolve, reject) => {
                        wx.downloadFile({
                            url: qrCodePath,
                            header: {cookie},
                            success: function (res) {
                                console.log(res, '_qrCodeImage', 1);
                                if (res.header && /text\/html/.test(res.header[`Content-Type`])) {
                                    util.go('/page/userLogin/pages/getUserInfo/index');
                                } else if (res.statusCode === 200) {
                                    let path = res.tempFilePath;
                                    if (/(htm|html)$/.test(path)) {
                                        util.go('/page/userLogin/pages/getUserInfo/index');
                                        reject(false)
                                    } else {
                                        wx.getImageInfo({
                                            src: path,
                                            success: function (res) {
                                                console.log(res, '_qrCodeImage');
                                                setData.qrCodeImage = res;
                                                imagesName.push('_qrCodeImage');
                                                resolve(true);
                                            },
                                            fail (err) {
                                                console.log(err, '_qrCodeImage');
                                                util.go('/page/userLogin/pages/getUserInfo/index');
                                                reject(false);
                                            }
                                        });
                                    }
                                } else {
                                    reject(false)
                                }
                            },
                            fail: () => {
                                util.showToast('网络连接失败');
                                reject();
                            }
                        });
                    }).then(result => result).catch(e => e);
                Promise.all([p1, p2])
                    .then(res => {
                        console.log(res);
                    }, err => {
                        console.log(arguments);
                    })
                    .catch(res => {
                        console.log(res);
                    })
                    .finally(() => {
                        setData.imagesName = imagesName;
                        that.setData(setData);
                        that.data.startUp = false;
                        util.hideLoading();
                    });
            },
            fail: res => {
                util.hideLoading();
            }
        });
    },
    // 图片加载成功
    imageLoad (e) {
        console.log(e);
        let target = e.currentTarget || e.target,
            key = target.dataset.key,
            width = e.detail.width,
            height = e.detail.height,
            offsetX = target.offsetLeft,
            offsetY = target.offsetTop;
        this.data[`_${key}`] = {width, height, offsetX, offsetY, status: true};
    },
    /**
     * 开始绘制
     */
    async drawStart ({id = 'ctx', bgColor = '#feece1'} = {}) {
        let that = this,
            multiple = that.data.multiple,
            w = that.data.winWidth * multiple,
            h = that.data.winHeight * multiple;
        that.setData({
            [`${id}Style`]: `width: ${w}px;height: ${h}px`
        });
        // 拿到canvas context
        let ctx = wx.createCanvasContext(id);
        // 为了保证图片比例以及绘制的位置，先要拿到图片的大小
        // 绘制canvas背景，不属于绘制图片部分
        ctx.setFillStyle(bgColor);
        ctx.fillRect(0, 0, w, h);
        // 绘制背景图
        await that.drawBgImage(ctx);
        // 绘制小程序码
        await that.drawQrCodeImage(ctx);
        // // 绘制势力汉字：吴
        // that.drawInfluence(ctx, that.data.hero.HERO.INFLUENCE);
        // // 绘制武将姓名：陆逊
        // that.drawName(ctx, that.data.hero.HERO.NAME);
        // 绘制武将称号：江陵侯
        // that.drawHorner(ctx, that.data.hero.HERO.HORNER);
        // 最终调用draw函数，生成预览图
        // 一个坑点：只能调用一次，否则后面的会覆盖前面的
        console.log(4);
        await new Promise(resolve => {
            ctx.draw(true);
            console.log(5);
            that.azmShowToast('绘制结束', function () {
                that.getPictures();
            });
            resolve();
        })
    },
    /**
     * 绘制背景图
     * @param path
     */
    drawBgImage (ctx) {
        let that = this,
            multiple = that.data.multiple,
            bgImage = that.data.bgImage,
            _bgImage = that.data._bgImage,
            imageWidth = _bgImage.width * multiple,
            imageHeight = _bgImage.height * multiple,
            offsetX = _bgImage.offsetX * multiple,
            offsetY = _bgImage.offsetY * multiple,
            imagePath = bgImage.path;
        // // 计算图片占比信息
        // let maxWidth = Math.min(imageWidth, w),
        //     radio = maxWidth / imageWidth,
        //     offsetX = (w - imageWidth * radio) / 2,
        //     offsetY = h - imageHeight * radio;
        // that.setData({
        //     bg_image: {
        //         radio,
        //         width: res.width,
        //         height: res.height,
        //         w: res.width * radio,
        //         h: res.height * radio,
        //         y: offsetY,
        //         x: offsetX
        //     }
        // });
        // 绘制背景图片，path是本地路径，不可以传网络url，如果是网络图片需要先下载
        return new Promise(resolve => {
            that.getEleScrollOffset('.bgImage').then(res => {
                console.log(res);
                let imageWidth = res.width * multiple,
                    imageHeight = res.height * multiple,
                    offsetX = res.left * multiple,
                    offsetY = res.top * multiple;
                console.log('bgImage', offsetX, offsetY, imageWidth, imageHeight);
                ctx.drawImage(imagePath, offsetX, offsetY, imageWidth, imageHeight);
                console.log(0);
                ctx.draw(true);
                console.log(1);
                resolve(ctx);
            })
        })
    },
    /**
     * 绘制二维码
     * @param ctx
     */
    drawQrCodeImage (ctx) {
        let that = this,
            multiple = that.data.multiple,
            qrCodeImage = that.data.qrCodeImage,
            _qrCodeImage = that.data._qrCodeImage,
            imageWidth = _qrCodeImage.width * multiple,
            imageHeight = _qrCodeImage.height * multiple,
            offsetX = _qrCodeImage.offsetX * multiple,
            offsetY = _qrCodeImage.offsetY * multiple,
            imagePath = qrCodeImage.path;
        // let that = this,
        //     qrcodePath = that.data.qrcodePath,
        //     width = w,
        //     height = h,
        //     scale = 0.4,
        //     offset_y = 437;
        // // 计算图片占比信息
        // let maxWidth = Math.min(res.width, width * scale),
        //     radio = maxWidth / res.width,
        //     radioY = height * 2 / 1334,
        //     offsetX = (width - res.width * radio) / 2,
        //     offsetY = offset_y * radioY - res.height * radio / 2;
        return new Promise(resolve => {
            that.getEleScrollOffset('.qrcodeImage').then(res => {
                console.log(res);
                let imageWidth = res.width * multiple,
                    imageHeight = res.height * multiple,
                    offsetX = res.left * multiple,
                    offsetY = res.top * multiple;
                console.log('qrcodeImage', offsetX, offsetY, imageWidth, imageHeight);
                ctx.save();
                ctx.beginPath();
                ctx.arc(offsetX + imageWidth / 2, offsetY + imageHeight / 2, imageWidth / 2, 0, 2 * Math.PI, false);
                ctx.clip();
                ctx.drawImage(imagePath, offsetX, offsetY, imageWidth, imageHeight);
                ctx.restore();
                console.log(2);
                ctx.draw(true);
                console.log(3);
                resolve(ctx);
            })
        })
    },
    // 绘制文字
    drawText (ctx, text) {
        ctx.setFillStyle('#db3033');
        ctx.fillRect();
        // 设置字号
        ctx.setFontSize(26);
        // 设置字体颜色
        ctx.setFillStyle("#000000");
        // 计算绘制起点
        let x = this.data.offsetX + 35;
        let y = this.data.offsetY + 10;
        console.log('drawHorner' + text);
        console.log(x);
        console.log(y);

        // 绘制竖排文字，这里是个Util函数，具体实现请继续看
        // drawTextVertical(ctx, text, x, y);
    },
    /**
     * 按钮绘制图片
     */
    bindDrawImage () {
        let that = this,
            startUp = that.data.startUp,
            imagesName = that.data.imagesName,
            flag = true;

        for (let v of imagesName) {
            if (!that.data[v] || (that.data[v] && that.data[v].status === false)) {
                flag = false;
                break;
            }
        }
        if (that.data.tempFilePath) {
            that.getPictures();
        } else if (!startUp && flag) {
            util.showLoading('生成绘制海报');
            let p = that.drawStart();
            p.then(res => {
                util.hideLoading(true);
                console.log(res);
            });
        } else {
            that.azmShowToast('海报资源加载失败');
        }
    },
    // 获取canvas图片
    getPictures () {
        let that = this;
        if (that.data.isDownPage) return;
        that.data.isDownPage = true;
        if (that.data.tempFilePath) {
            that.saveImage();
            return;
        }
        util.showLoading('获取绘制海报');
        wx.canvasToTempFilePath({
            canvasId: 'ctx',
            success: function (res) {
                that.setData({
                    tempFilePath: res.tempFilePath
                });
                that.saveImage();
            },
            fail: function () {
                that.data.isDownPage = false;
                util.hideLoading();
            }
        })
    },
    // 保存海报
    saveImage () {
        let that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.tempFilePath,
            success (rt) {
                that.setData({
                    posterPopup_text: '这张海报已经自动帮您保存到手机相册，发送好友或群，让大家来领红包吧~'
                });
                that.binTogglePosterPopup(null, true);
            },
            fail () {
                that.setData({
                    posterPopup_text: '该海报保存到您的手机相册失败，可以预览海报，长按图片保存或发送朋友哦~'
                });
                that.binTogglePosterPopup(null, true);
                authorize.writePhotosAlbum(true)
                    .then(
                        res => {
                            console.log(res);
                        },
                        (res) => {
                            wx.showModal({
                                title: '',
                                content: '该海报保存到您的手机相册失败，可以预览海报，长按图片保存或发送朋友哦~',
                                confirmText: '预览',
                                cancelText: '取消',
                                success: function (res) {
                                    if (res.confirm) {
                                        that.openImage();
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    );
            },
            complete () {
                util.hideLoading();
                that.data.isDownPage = false;
            }
        })
    },
    binTogglePosterPopup (e, bol = false) {
        this.selectComponent('#posterPopup').toggle(bol);
    },
    openImage () {
        let that = this;
        wx.previewImage({
            current: that.data.tempFilePath, // 当前显示图片的http链接
            urls: [that.data.tempFilePath], // 需要预览的图片http链接列表
            complete () {
            }
        });
    },
    bindCanvasError () {

    }
};
Page(new utilPage(appPage, methods));