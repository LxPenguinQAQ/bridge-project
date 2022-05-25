const express = require('express')
const db = require('./db')
const md5 = require('md5-node')
const {createToken} = require('./token')

const router = express.Router()

//添加用户信息
router.post("/createAccount", function(req, res) {
	// 接收前端传过来的用户信息（解构赋值）
	const {
		username,
		password,
		passwordRepeat,
		email
	} = req.body
	//在后台定义用户注册时间才是符合规范的
	const creationTime = new Date().toLocaleString()
	if (
		typeof username != "string" ||
		typeof password != "string" ||
		typeof passwordRepeat != "string" ||
		typeof email != "string" ||
		typeof creationTime != "string"
	) {
		res.status(422).end()
		return;
	}
	//这里对用户所有密码都进行了加密
	db.createAccount(username, md5(password), email, creationTime, function(err, id) {
		if (err) {
			if (err.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.username") {
				res.status(400).send({
					status: false,
					msg: "username has taked"
				})
			} else {
				res.status(500).send({
					status: false,
					msg: "register failed"
				})
			}
		} else {
			const token = createToken({
				username,
				password,
			});

			res.status(200).send({
				status: true,
				msg: "register success",
				token
			})
			console.log("----------签发token-----------");
		}
	})

})

module.exports = router
