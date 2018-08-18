Component({
    externalClasses: ['azm-more'],
    data: {
        name: 'more'
    },
    properties: {
        loading: {
            type: Boolean,
            value: false
        },
        noMore: {
            type: Boolean,
            value: false
        },
        loadingText: {
            type: String,
            value: '加载更多...'
        },
        nomoreText: {
            type: String,
            value: '没有更多了~'
        },
        selectedId: {
            type: [String, Number],
            value: ''
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){

    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){

    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        console.log(this);
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){

    },
    methods: {}
})
