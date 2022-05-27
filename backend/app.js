const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const accountRouter = require('./accountRouter')
const tweetRouter = require('./tweetRouter')
const cors = require('cors')
const md5 = require('md5-node')
const {jwtAuth, createToken} = require('./token')

const app = express()

app.use(cors({
	origin: "*",
	credentials: true
}))
app.use(jwtAuth)
app.use(express.static(__dirname + '/static'))


//解决跨域问题
// app.use(function(request, response, next) {
// 	response.setHeader("Access-Control-Allow-Origin", "http://10.133.172.180:8080")
// 	response.setHeader("Access-Control-Allow-Methods", "*")
// 	response.setHeader("Access-Control-Allow-Headers", "*")
// 	response.setHeader("Access-Control-Expose-Headers", "*")
// 	response.setHeader("Access-Control-Allow-Credentials", "true")
// 	next()
// })

//对POST请求过来的数据进行解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))

//使得accounts接口可用
app.use("/accounts", accountRouter)
//使得tweets接口可用
app.use("/tweets", tweetRouter)

// 用户登录并设置token令牌
app.post("/login", function(req, res) {
	// 将前端传来的用户信息进行解构，直接获取里面的值
	const {username,password} = req.body;
	db.getAccountByUsername(username, function(err, account) {
		if (err) {
			res.status(500).send({
				msg: "login failed as server error"
			})
		} else if (!account || account.password != md5(password)) {
			res.status(400).send({
				msg: "invalid-client"
			})
		} else {
			const token = createToken({
				username,
				password
			})
			//返回token
			res.status(200).send({
				status: true,
				msg: "login success",
				token
			})
			console.log("----------签发token----------");
		}
	})
})

app.get("/test", function(req, res) {
	const {matchId} = req.query
	db.test(matchId, function(err, data) {
		if (err) {
			res.status(500).send({
				msg: "test failed as server error"
			})
		} else if (data) {
			res.status(200).send(data);
		} else {
			res.status(400).send({
				msg: "test failed as request error"
			})
		}
	})
})

app.listen(3000, err => {
	if (!err) console.log('Successful Connection! Please Start Your Operation! The Port 3000')
})


// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  头部
// eyJhY2NvdW50SWQiOjEsImlhdCI6MTU3MjU5OTQ3MSwiZXhwIjoxNTcyNTk5NDgxfQ.  载荷
// 01kCpXKp4qQqrofs9LEtssgb6k3V8ZWl_tqsuvRfXeM 签名
