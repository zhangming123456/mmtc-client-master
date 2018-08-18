// pages/onlineBuy/index.js
const app = getApp(),
    ApiService = require('../../../utils/ApiService');
Page({
    /**
     * 页面的初始数据
     */
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
        Shoptechnician: {}
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
    // 选择技师下的 项目选项
    firstCategoryChange(e) {
        console.log('发生change事件，携带value值为：', e)
        var that = this
        that.data.firstCategoryArr = []
        var items = that.data.itemList
        var checkArr = e.detail.value
        var isCheck = false
        for (var i = 0; i < items.length; i++) {
            if (checkArr.indexOf(items[i].username) != -1) {
                items[i].isSelected = true
            } else {
                items[i].isSelected = false
            }
        }
        var isFirstCategoryAll = true
        for (var i = 0; i < items.length; i++) {
            if (!items[i].isSelected) {
                isFirstCategoryAll = false
            }
        }
        that.setData({
            itemList: items,
            firstCategoryArr: checkArr,
            isFirstCategoryAll: isFirstCategoryAll
        })
    },
    // 选择项目下的 全选按钮
    secondCategoryAll(e) {
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
    secondCategoryChange(e) {
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
    clickConfirm() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        })
    },
    // textarea 失去焦点事件
    commitOpinion(e) {
        this.setData({
            option: e.detail.value
        })
    },
    // 点击底部 确定按钮
    clickSubmit() {
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let shop_id = options.shop_id;
        ApiService.getShoptechnician({
            shop_id
        }).then(res => {
            console.log(res, 1111111111111111111111);

            if (res.status == 1) {

                let info = res.info;
                that.setData({
                    Shoptechnician: info,
                    itemList: info.technician,
                    secondCategory: info.item
                })
            }
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

    togglePopup() {
        console.log("444444444444");

        this.setData({
            show: !this.data.show,
        });

    },

    toggleBottomPopup() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },

    itemSelected(e) {
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
    bindWordLimit(e) {
        var value = e.detail.value,
            len = parseInt(value.length);
        if (len > this.data.noteMaxLen) return;

        this.setData({
            currentNoteLen: len //当前字数
            //limitNoteLen: this.data.noteMaxLen - len //剩余字数
        });
    }



})