const app = getApp(),
    util2 = app.util2,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService/index');
const appPage = {
    data: {
        show: false,

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

        id: 0,
        noteMaxLen: 120,
        showBottomPopup: false,
        secondCategory: [{
            project: "洗剪吹",
            price: '¥123',
            checked: false
        }, {
            project: "洗剪",
            price: '¥12',
            checked: false
        }, {
            project: "洗",
            price: '¥25',
            checked: false
        }],
        isFirstCategoryAll: false, //选择技师全部按钮是否选中
        isSecondCategoryAll: false, //选择项目全部按钮是否选中
        firstCategoryArr: [], //保存选中的选择技师
        secondCategoryArr: [], //保存选中的选择项目
        option: '', //textarea 文本框内容
        Shoptechnician: {},
        isRemark: false

    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {


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
    onReady: function () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        that.getOrderCardCheckPwd();
        wx.stopPullDownRefresh();
    },
    /**
     * 上拉触底
     */
    onReachBottom () {

    },

};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let that = this;
        let options = that.data.options;
        let shop_id = options.shop_id;
        let data = wx.getStorageSync('remark');

        ApiService.getShoptechnician({shop_id}).then(res => {
            if (res.status == 1) {
                let info = res.info;
                let itemList = data.firstCategoryArr || [],
                    arr = [],
                    flag = 0;
                let secondCategory = data.secondCategoryArr || [],
                    arr2 = [],
                    flag2 = 0;
                let option = data.option;


                for (let v of itemList) {
                    if (v.isSelected) {
                        arr.push(v.id)
                    }
                }

                for (let val of info.technician) {
                    if (arr.indexOf(val.id) !== -1) {
                        val.isSelected = true
                        flag++
                    }
                }


                for (let a of secondCategory) {
                    if (a.checked) {
                        arr2.push(a.id)
                    }
                }

                for (let val2 of info.item) {
                    if (arr2.indexOf(val2.id) !== -1) {
                        val2.checked = true
                        flag2++
                    }
                }

                that.setData({
                    Shoptechnician: info,
                    itemList: info.technician,
                    isFirstCategoryAll: info.technician && info.technician.length === flag ? true : false,
                    isSecondCategoryAll: info.item && info.item.length === flag2 ? true : false,
                    option: option,
                    secondCategory: info.item
                })
            }
        });
    },
    loadData () {

    },

    // 选择技师项目下的 全选按钮
    firstCategoryAll (e) {
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

    // 选择项目下的 全选按钮
    secondCategoryAll (e) {
        console.log(e)
        var that = this
        that.data.secondCategoryArr = []
        var checkAll = e.currentTarget.dataset.checkall
        var items = that.data.secondCategory
        if (that.data.isSecondCategoryAll) {
            for (var i = 0; i < items.length; i++) {
                items[i].checked = false
            }
            that.setData({
                secondCategory: items,
                isSecondCategoryAll: false
            })
            return
        }
        for (var i = 0; i < items.length; i++) {
            items[i].checked = true
            that.data.secondCategoryArr = that.data.secondCategoryArr.concat(items[i].project)
        }
        that.setData({
            secondCategory: items,
            isSecondCategoryAll: true
        })
    },
    // 选择项目下的 项目选项
    secondCategoryChange (e) {
        var that = this
        that.data.secondCategoryArr = []
        var items = that.data.secondCategory
        var checkArr = e.detail.value
        var isCheck = false
        for (var i = 0; i < items.length; i++) {
            if (checkArr.indexOf(items[i].title) != -1) {
                items[i].checked = true
            } else {
                items[i].checked = false
            }
        }
        that.setData({
            secondCategory: items,
            secondCategoryArr: checkArr
        })
    },
    // 点击选择项目下的 确定按钮
    clickConfirm () {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        })
    },
    // textarea 失去焦点事件
    commitOpinion (e) {
        this.setData({
            option: e.detail.value
        })
    },
    // 点击底部 确定按钮
    clickSubmit () {
        var that = this
        var remarkObj = {}

        var itemList = that.data.itemList

        var secondCategory = that.data.secondCategory

        remarkObj.firstCategoryArr = []
        remarkObj.secondCategoryArr = []


        for (let v of itemList) {
            if (v.isSelected === true) {
                remarkObj.firstCategoryArr.push(v)
            }
        }

        for (let i of secondCategory) {
            if (i.checked === true) {
                remarkObj.secondCategoryArr.push(i)
            }
        }


        remarkObj.option = that.data.option
        //建立缓存
        wx.setStorageSync("remark", remarkObj)
        wx.navigateBack({
            delta: 1
        })
    },


    togglePopup () {
        console.log("444444444444");

        this.setData({
            show: !this.data.show,
        });

    },

    toggleBottomPopup () {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },

    itemSelected (e) {
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
        }
        if (index > -1) {
            this.setData({
                [`itemList[${index}].isSelected`]: item.isSelected,
                isFirstCategoryAll: flag
            })
        }
    },

    //字数限制
    bindWordLimit (e) {
        var value = e.detail.value,
            len = parseInt(value.length);
        if (len > this.data.noteMaxLen) return;

        this.setData({
            currentNoteLen: len //当前字数
            //limitNoteLen: this.data.noteMaxLen - len //剩余字数
        });
    }
};
Page(new utilPage(appPage, methods));
