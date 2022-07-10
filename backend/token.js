const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
// token加密规则
const accessTokenSecret = 'bridge-project';

// 登录接口 生成token的方法
const createToken = function(username, password) {
    const token = jwt.sign({username, password}, accessTokenSecret, {expiresIn: '24h'});
    return token;
}

// 各个接口需要验证token的方法
const jwtAuth = expressJwt({
    secret: accessTokenSecret,
    CredentialsRequired: false,
    algorithms: ['HS256']
}).unless({
    path: ["/home", "/login"]
})

module.exports = {jwtAuth, createToken};






