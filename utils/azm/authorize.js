let scope = {
    userInfo: 'scope.userInfo',//用户信息
    userLocation: 'scope.userLocation',//地理位置
    address: 'scope.address',//通讯地址
    invoiceTitle: 'scope.invoiceTitle',//发票抬头
    werun: 'scope.werun',//微信运动步数
    record: 'scope.record',//录音功能
    writePhotosAlbum: 'scope.writePhotosAlbum',//保存到相册
};


module.exports = {
    authSetting: null,
    open(resolve, reject) {
        let _this = this;
        this.getSetting().then(() => {
            let all = {
                'scope.userLocation': false
            };
            if (_this.authSetting) {
                Object.assign(all, _this.authSetting);
            }
            let allFn = [];
            for (let k in all) {
                if (!all[k]) {
                    allFn.push(_this.setPromise(k));
                }
            }
            if (allFn.length > 0) {
                Promise.all(allFn).then(resolve, reject);
            }
        })
    },
    getSetting() {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let flag = false;
            wx.getSetting({
                success(res) {
                    // console.log(res.authSetting, 'authSetting');
                    _this.authSetting = res.authSetting;
                    flag = true;
                },
                complete() {
                    if (flag) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            })
        });
    },
    openSetting(scopeStr) {
        return new Promise(function (resolve, reject) {
            let content = '当前操作需要您的用户权限';
            if (scopeStr === scope.userInfo) {
                content = '当前操作需要您的用户信息';
                wx.getUserInfo({
                    success(res){
                        wx.setStorageSync('isGetUserInfoErrMsg', res.errMsg);
                        resolve(res)
                    },
                    fail(rsp){
                        if (rsp.errMsg !== 'getUserInfo:fail scope unauthorized') {
                            openModal(content)
                        } else {
                            reject(rsp)
                        }
                        wx.setStorageSync('isGetUserInfoErrMsg', rsp.errMsg);
                    }
                })
            } else if (scopeStr === scope.userLocation) {
                content = '当前操作需要您的地理位置';
                openModal(content);
            } else if (scopeStr === scope.address) {
                content = '当前操作需要您的通讯地址信息';
                openModal(content);
            } else if (scopeStr === scope.invoiceTitle) {
                content = '当前操作需要您的发票抬头信息';
                openModal(content);
            } else if (scopeStr === scope.werun) {
                content = '当前操作需要您的微信步数信息';
                openModal(content);
            } else if (scopeStr === scope.record) {
                content = '当前操作需要您的录音功能';
                openModal(content);
            } else if (scopeStr === scope.writePhotosAlbum) {
                content = '当前操作需要您的相册权限';
                openModal(content);
            } else {
                reject();
            }
            function openModal (content) {
                let flag = false;
                wx.showModal({
                    title: '',
                    content: content,
                    confirmText: '去开启',
                    cancelText: '取消',
                    success: function (res) {
                        if (res.confirm) {
                            wx.openSetting({
                                success(res) {
                                    flag = res.authSetting[scopeStr];
                                },
                                complete() {
                                    if (flag) {
                                        resolve();
                                    } else {
                                        reject();
                                    }
                                }
                            });
                        } else if (res.cancel) {
                            reject();
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        });
    },
    setPromise(scopeStr, isOpen) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.getSetting().then(function () {
                if (!_this.authSetting[scopeStr]) {
                    wx.authorize({
                        scope: scopeStr,
                        complete(res) {
                            _this.getSetting().then(() => {
                                if (_this.authSetting[scopeStr]) {
                                    resolve();
                                } else if (isOpen) {
                                    _this.openSetting(scopeStr).then(function () {
                                        resolve();
                                    }, function () {
                                        reject();
                                    })
                                } else {
                                    reject();
                                }
                            });
                        }
                    })
                } else {
                    resolve();
                }
            }, function () {
                reject();
            });
        });
    },
    userLocation(isOpen) {
        let scopeStr = scope.userLocation;
        return this.setPromise(scopeStr, isOpen);
    },
    userInfo(isOpen) {
        let scopeStr = scope.userInfo;
        return this.setPromise(scopeStr, isOpen);
    },
    address(isOpen) {
        let scopeStr = scope.address;
        return this.setPromise(scopeStr, isOpen);
    },
    invoiceTitle(isOpen) {
        let scopeStr = scope.invoiceTitle;
        return this.setPromise(scopeStr, isOpen);
    },
    werun(isOpen) {
        let scopeStr = scope.werun;
        return this.setPromise(scopeStr, isOpen);
    },
    record(isOpen) {
        let scopeStr = scope.record;
        return this.setPromise(scopeStr, isOpen);
    },
    writePhotosAlbum(isOpen) {
        let scopeStr = scope.writePhotosAlbum;
        return this.setPromise(scopeStr, isOpen);
    }
};