const oldApi = require('./oldApi')

const LoginRegister = require('./LoginRegister')
const Payment = require('./Payment')

class Index extends oldApi {
    constructor () {
        super();
    }

    LoginRegister = new LoginRegister()

    Payment = new Payment()
}


module.exports = new Index();
