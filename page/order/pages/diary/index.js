const app = getApp(),
    util2 = app.util2,
    regeneratorRuntime = app.util2.regeneratorRuntime,
    ApiService = require('../../../../utils/ApiService/index'),
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    c = require("../../../../utils/common.js");

const {
    $Toast
} = require('../../../../lib/iview/base/index');
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page home',
        itemList: [{
                id: 1,
                name: '托尼',
                isSelected: false,
            },
            {
                id: 2,
                name: '佳妮',
                isSelected: false,
            },
            {
                id: 3,
                name: '伯尼',
                isSelected: false,
            },
        ],
        itemsList: [{
                id: 1,
                name: '托尼',
                isSelected: false,
            },
            {
                id: 2,
                name: '佳妮',
                isSelected: false,
            },
            {
                id: 3,
                name: '伯尼',
                isSelected: false,
            },
        ],
        select: [],
        imgs: [],
        one_1: 0,
        two_1: 5,
        one_2: 0,
        two_2: 5,
        one_3: 0,
        two_3: 5,
        one_4: 0,
        two_4: 5,
        content: '',
        is_anonymous: false

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow(options) {
        let that = this;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        let that = this;
        that.data.options = {};
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        let that = this;
    },
    /**
     * 页面渲染完成
     */
    onReady() {
        let that = this;
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        let that = this;


    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {

    },
    onPageScroll(options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {


    }
};
/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options;
        this.data.order_info_id = options.order_info_id

        that.getItemTechnician();
        that.getDataTag();
    },
    itemSelected(e) {
        let that = this;
        var index = e.currentTarget.dataset.index;
        var itemList = this.data.itemList;
        var item = itemList[index];
        var flag = true;
        item.isSelected = !item.isSelected;
        for (let v of itemList) {
            if (!v.isSelected) {
                flag = false;
                break;
            }
            // console.log(v, 1111111111);
            // technician_ids.push(v.id)
        }
        if (index > -1) {
            this.setData({
                [`itemList[${index}].isSelected`]: item.isSelected,
                isFirstCategoryAll: flag
            })
        }
    },
    itemsSelected(e) {
        var index = e.currentTarget.dataset.index;
        var itemsList = this.data.itemsList;
        var item = itemsList[index];
        var flag = true;
        item.isSelected = !item.isSelected;
        for (let v of itemsList) {
            if (!v.isSelected) {
                flag = false;
                break;
            }
        }
        if (index > -1) {
            this.setData({
                [`itemsList[${index}].isSelected`]: item.isSelected,
                isFirstCategoryAll: flag
            })
        }
    },

    // 选择技师项目下的 全选按钮
    firstCategoryAll(e) {
        console.log(e)
        var that = this
        that.data.firstCategoryArr = []
        var checkAll = e.currentTarget.dataset.checkall
        var items = that.data.itemList
        if (that.data.isFirstCategoryAll) {
            for (var i = 0; i < items.length; i++) {
                items[i].isSelected = false
            }
            that.setData({
                itemList: items,
                isFirstCategoryAll: false
            })
            return
        }
        for (var i = 0; i < items.length; i++) {
            items[i].isSelected = true
        }
        that.setData({
            itemList: items,
            isFirstCategoryAll: true
        })
    },


    chooseImage() {
        var that = this;
        if (that.data.imgs.length >= 5) {
            ui.toast('最多只能上传5张照片');
            return;
        }
        wx.chooseImage({
            count: 5 - that.data.imgs.length,
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                var uploadPath = c.absUrl('/services/uploader/uploadImg');
                var count = tempFilePaths.length;
                var index = 0;
                c.showLoading();
                var imgs = that.data.imgs;
                tempFilePaths.forEach(function (el) {
                    wx.uploadFile({
                        url: uploadPath, //仅为示例，非真实的接口地址
                        filePath: el,
                        name: '_file_',
                        success: function (res) {
                            try {
                                res.data = JSON.parse(res.data);
                                if (res.data.status == 1) {
                                    var data = res.data.info;
                                    index++;
                                    imgs.push(data);
                                    if (index == count) {
                                        c.hideLoading();
                                        that.data.imgs = imgs;
                                        that.setData({
                                            imgs: that.data.imgs
                                        });
                                    }
                                }
                            } catch (e) {

                            }
                        }
                    });
                });
            }
        });
    },


    //删除图片
    deleteImg(e) {
        var that = this
        var index = e.currentTarget.dataset.index;
        var imgs = that.data.imgs;
        imgs.splice(index, 1); //从数组中删除index下标位置，指定数量1，返回新的数组
        that.setData({
            imgs: imgs,
        });
    },


    //情况二:用户给评分
    gradeXin(e) {
        var in_xin = e.currentTarget.dataset.in;
        var one_1;
        if (in_xin === 'use_sc2') {
            one_1 = Number(e.currentTarget.id);
        } else {
            one_1 = Number(e.currentTarget.id) + this.data.one_1;
        }
        this.setData({
            one_1: one_1,
            two_1: 5 - one_1
        })
    },

    //情况二:用户给评分
    gradeXin2(e) {
        var in_xin = e.currentTarget.dataset.in;
        var one_2;
        if (in_xin === 'use_sc2') {
            one_2 = Number(e.currentTarget.id);
        } else {
            one_2 = Number(e.currentTarget.id) + this.data.one_2;
        }
        this.setData({
            one_2: one_2,
            two_2: 5 - one_2
        })
    },

    //情况二:用户给评分
    gradeXin3(e) {
        var in_xin = e.currentTarget.dataset.in;
        var one_3;
        if (in_xin === 'use_sc2') {
            one_3 = Number(e.currentTarget.id);
        } else {
            one_3 = Number(e.currentTarget.id) + this.data.one_3;
        }
        this.setData({
            one_3: one_3,
            two_3: 5 - one_3
        })
    },

    //情况二:用户给评分
    gradeXin4(e) {
        var in_xin = e.currentTarget.dataset.in;
        var one_4;
        if (in_xin === 'use_sc2') {
            one_4 = Number(e.currentTarget.id);
        } else {
            one_4 = Number(e.currentTarget.id) + this.data.one_4;
        }
        this.setData({
            one_4: one_4,
            two_4: 5 - one_4
        })
    },
    checkboxChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        let that = this;
        var is_anonymous = that.data.is_anonymous;
        that.setData({
            is_anonymous: !is_anonymous
        });
    },


    getItemTechnician() {
        let that = this;
        var order_info_id = that.data.order_info_id;
        ApiService.getItemTechnician({
            order_info_id
        }).finally(res => {
            if (res.status === 1) {
                that.setData({
                    itemList: res.info
                });

            }
        })
    },


    getDataTag() {
        let that = this;
        ApiService.getDataTag({}).finally(res => {
            if (res.status === 1) {
                that.setData({
                    itemsList: res.info
                });

            }
        })
    },

    _input(event) {
        let value = event.detail.value,
            len = parseInt(value.length)
        let that = this
        that.setData({
            currentNoteLen: len,
            'content': value
        })
    },

    getSaveModal() {
        let that = this;
        var content = that.data.content;
        var order_info_id = that.data.order_info_id;
        var major_score = that.data.one_1;
        var service_score = that.data.one_2;
        var effect_score = that.data.one_3;
        var img_src = that.data.imgs;
        var environment_score = that.data.one_4;
        var itemList = that.data.itemList;
        var itemsList = that.data.itemsList;
        var technician_ids = [];
        var score_tag_ids = []


        if (!order_info_id) return;

        for (let v of itemList) {
            if (v.isSelected === true) {
                technician_ids.push(v.id)
            }
        }
        for (let v of itemsList) {
            if (v.isSelected === true) {
                score_tag_ids.push(v.id)
            }
        }
        if (that.data.is_anonymous === false) {
            that.setData({
                is_anonymous: 0
            });
            return

        } else if (that.data.is_anonymous === true) {
            that.setData({
                is_anonymous: 1
            });
            return
        }
        var is_anonymous = that.data.is_anonymous;

        if (technician_ids.length < 1) {
            $Toast({
                content: '请至少选择一名技师'
            });
            return
        }
        if (!major_score) {
            $Toast({
                content: '请选择专业评分'
            });
            return
        }
        if (!service_score) {
            $Toast({
                content: '请选择服务评分'
            });
            return
        }
        if (!effect_score) {
            $Toast({
                content: '请选择效果评分'
            });
            return
        }
        if (!environment_score) {
            $Toast({
                content: '请选择环境评分'
            });
            return
        }
        if (!content) {
            $Toast({
                content: '请填写评论内容'
            });
            return
        }
        ApiService.getSaveModal({
            content,
            order_info_id,
            major_score,
            service_score,
            effect_score,
            environment_score,
            img_src,
            technician_ids,
            is_anonymous,
            score_tag_ids
        }).finally(res => {
            if (res.status === 1) {

                wx.showToast({
                    title: '点评成功',
                    icon: 'success',
                    duration: 2000
                })
                // wx.navigateBack({
                //     delta: 1
                // })
                wx.navigateTo({
                    url: '/page/order/pages/remarkSucceed/index?order_info_id=' + order_info_id
                })
                // that.$route.push({
                //     path: '/page/order/pages/remarkSucceed/index',
                //     query: {
                //         order_info_id: item.order_info_id
                //     }
                // });
            } else {
                util2.failToast(res.message)
            }
        })
    }

};
Page(new utilPage(appPage, methods));
