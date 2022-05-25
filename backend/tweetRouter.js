const express = require('express')
const db = require('./db')
const router = express.Router()


//根据address修改subMacAddress
router.put("/modifyMacAddress/:installAddress/:macAddress", function(req, res) {
	const {installAddress, macAddress} = req.params
	db.modifyMacAddress(installAddress, macAddress, function(err) {
		if (err) {
			if (err.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed") {
				res.status(400).send({
					msg: "modify failed as request error"
				})
			} else {
				res.status(500).send({
					msg: "modify failed as server error"
				})
			}
		} else {
			res.status(200).send({
				status: true,
				msg: "modify success"
			})
		}
	})
})

//根据ButtonID获取该mac地址所有Tweet数据绘图
router.post("/getTweetsForPicByTime", function(req, res) {
	const {matchId} = req.query;
	const {startTime, endTime} = req.body;
	db.getTweetsForPicByTime(matchId, startTime, endTime, function(err, tweets) {
		if (err) {
			res.status(500).send({
				msg: "draw trendence failed as server error"
			})
		} else if (tweets) {
			res.status(200).json(tweets)
		} else {
			res.status(404).send({
				msg: "draw trendence failed as request error"
			})
		}
	})
})

//根据列表单行ID获取Tweet信息
router.get("/getSearchSingleTweets", function(req, res) {
	const {searchId} = req.query;
	db.getSearchSingleTweets(searchId, function(err, tweets) {
		if (err) {
			res.status(500).send({
				msg: "show data failed as server error"
			})
		} else if (tweets) {
			res.status(200).send(tweets)
		} else {
			res.status(404).send({
				msg: "show data failed as request error"
			})
		}
	})
})

//获取最近数据信息
router.get("/getNodeStatus", function(req, res) {
	db.getNodeStatus(function(err, tweets) {
		if (err) {
			res.status(500).send({
				msg: "get node status failed as server error"
			})
		} else {
			res.status(200).json(tweets)
		}
	})
})

// 获取某一matchId的所有数据的个数
router.get("/getTotalNodeCount", function(req, res) {
	const {matchId} = req.query;
	db.getTotalNodeCount(matchId, function(err, counts) {
		if (err) {
			res.status(500).send({
				msg: "get node count failed as server error"
			})
		} else if (counts) {
			res.status(200).json(counts)
		} else {
			res.status(404).send({
				msg: "get node count failed as request error"
			})
		}
	})
})

// 通过当前页数和每页多少数据获取数据
router.get("/getNodeTweets", function(req, res) {
	const {matchId, currentPage, pageSize} = req.query
	db.getNodeTweets(matchId, currentPage, pageSize, function(err, tweets) {
		if (err) {
			res.status(500).send({
				msg: "get node data failed as server error"
			})
		} else if (tweets) {
			res.status(200).send(tweets)
		} else {
			res.status(404).send({
				msg: "get node data failed as request error"
			})
		}
	})
})

// 获取mac地址 位置 所属协调器对应数据
router.get("/getMatchData", function(req, res) {
	db.getMatchData(function(err, matchData) {
		if (err) {
			res.status(500).send({
				msg: "get matchData failed as server error"
			})
		} else if (matchData) {
			res.status(200).send(matchData)
		} else {
			res.status(404).send({
				msg: "get matchData failed as request error"
			})
		}
	})
})

// 获取协调器个数信息
router.get("/getCoordinatorInfo", function(req, res) {
	db.getCoordinatorInfo(function(err, coordinatorData) {
		if (err) {
			res.status(500).send({
				msg: "get coordinator info failed as server error"
			})
		} else if (coordinatorData) {
			res.status(200).send(coordinatorData)
		} else {
			res.status(404).send({
				msg: "get coordinator info failed as request error"
			})
		}
	})
})

// 获取协调器数据
router.get("/getCoordinatorTweets", function(req, res) {
	const {matchId, currentPage, pageSize} = req.query;
	db.getCoordinatorTweets(matchId, currentPage, pageSize, function(err, tweets) {
		if (err) {
			res.status(500).send({
				msg: "get coordinator data failed as server error"
			})
		} else if (tweets) {
			res.status(200).send(tweets);
		} else {
			res.status(404).send({
				msg: "get coordinator data failed as request error"
			})
		}
	})
})

// 获取协调器数据的个数
router.get("/getTotalCoordinatorCount", function(req, res) {
	const {matchId} = req.query;
	db.getTotalCoordinatorCount(matchId, function(err, counts) {
		if (err) {
			res.status(500).send({
				msg: "get coordinator count failed as server error"
			});
		} else if (counts) {
			// 由于counts为number类型，无法使用send
			res.status(200).json(counts);
		} else {
			res.status(404).send({
				msg: "get coordinator count failed as request error"
			});
		}
	})
})

// 根据当前页数和一页个数获取所有数据
router.get("/getAllTweets", function(req, res) {
	const {currentPage, pageSize} = req.query;
	db.getAllTweets(currentPage, pageSize, function(err, allTweets) {
		if (err) {
			res.status(500).send({
				msg: "get all node data failed as server error"
			})
		} else if (allTweets) {
			res.status(200).send(allTweets)
		} else {
			res.status(404).send({
				msg: "get all node data failed as request error"
			})
		}
	})
})

// 获取所有数据的个数
router.get("/getAllTweetsAccount", function(req, res) {
	db.getAllTweetsAccount(function(err, counts) {
		if (err) {
			res.status(500).send({
				msg: "get all node data count failed as server error"
			})
		} else if (counts) {
			res.status(200).json(counts)
		} else {
			res.status(404).send({
				msg: "get all node data count failed as request error"
			})
		}
	})
})

module.exports = router
