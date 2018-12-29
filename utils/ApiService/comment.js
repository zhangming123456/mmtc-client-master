function login (bol) {
    return new Promise((resolve, reject) => {
        const options = {
            timeout: 3000,
            success (res) {
                resolve(res)
            },
            fail () {
                reject()
            }
        }
        if (bol) {
            wx.login(options);
        } else {
            wx.checkSession({
                success: function () {
                    //session_key 未过期，并且在本生命周期一直有效
                    resolve();
                },
                fail: function () {
                    // session_key 已经失效，需要重新执行登录流程
                    wx.login(options);
                }
            });
        }
    })
}
