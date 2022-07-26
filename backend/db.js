const database = require('./mysql')
const query = require('./mysql_async')

Date.prototype.Format = function (fmt) { 
	let o = {
		"M+": this.getUTCMonth() + 1, //月份
		"d+": this.getUTCDate(), //日
		"h+": this.getUTCHours(), //小时
		"m+": this.getUTCMinutes(), //分
		"s+": this.getUTCSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

//将前端传过来的用户信息插入
exports.createAccount = function(username, password, email, creationTime, callback) {
	const sql = `INSERT INTO accounts (username, password, email, createTime) VALUES ('${username}', '${password}', '${email}', '${creationTime}');`
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

//通过姓名查找用户信息
exports.getAccountByUsername = function(username, callback) {
	const sql = `SELECT password FROM accounts WHERE username = '${username}'`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data?data[0]:data);
	})
}

//通过列表单行ID来查看Tweet表格中的多个数据
exports.getSearchSingleTweets = function(id, callback) {
	const sql = `SELECT sensordata, sensor_id FROM sensor WHERE sensor_id = '${id}';`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

//通过ID获取Tweet表格中一段时间内的的数据
exports.getTweetsForPicByTime = function(matchId, startTime, endTime, callback) {
<<<<<<< HEAD
	const sql = `SELECT read_time, amplitude, frequency, adc_sensor, bridge_id FROM sensor WHERE macaddress = '${matchId}' AND read_time BETWEEN '${startTime}' AND '${endTime}';`;
=======
	const sql = `SELECT read_time, amplitude, frequency, adc_sensor, bridge_id FROM sensor WHERE bridge_id = '${matchId}' AND read_time BETWEEN '${startTime}' AND '${endTime}';`;
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

//通过address更新CORRESPONDENCE中的SUBMACADDRESS
exports.modifyMacAddress = function(installAddress, macAddress, callback) {
	const sql = `UPDATE sensor_data SET macaddress = '${macAddress}' WHERE installAddress = '${installAddress}';`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取最近的子节点数据（最近6小时）
exports.getNodeStatus = function(callback) {
<<<<<<< HEAD
	const sql = `SELECT t.amplitude, t.macaddress, t.bridge_id FROM (SELECT macaddress,MAX(sensor_id) sensor_id FROM sensor GROUP BY macaddress) a  JOIN sensor t ON t.macaddress=a.macaddress AND t.sensor_id=a.sensor_id AND LENGTH(a.macaddress)<20 AND t.read_time BETWEEN DATE_SUB(NOW(), INTERVAL 6 HOUR) AND NOW();`;
	console.log(sql);
=======
	const sql = `SELECT t.amplitude, t.macaddress, t.bridge_id FROM (SELECT macaddress,MAX(sensor_id) sensor_id FROM sensor GROUP BY macaddress) a  JOIN sensor t ON t.macaddress=a.macaddress AND t.sensor_id=a.sensor_id AND LENGTH(a.macaddress)<20 AND t.read_time>=DATE_SUB(NOW(), INTERVAL 3 HOUR);`;
	// console.log(sql);
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 通过matchId获取所有数据的个数
exports.getTotalNodeCount = function(matchId, callback) {
<<<<<<< HEAD
	const sql = `SELECT COUNT(sensor_id) count FROM sensor WHERE macaddress = '${matchId}';`
=======
	const sql = `SELECT COUNT(sensor_id) count FROM sensor WHERE bridge_id = '${matchId}';`
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data[0].count);
	})
}

// 通过页数和页面数据量获取节点数据
exports.getNodeTweets = function(matchId, currentPage, pageSize, callback) {
	const sql = `SELECT sensor_id, read_time, bridge_id, macaddress, amplitude, frequency, adc_sensor FROM sensor WHERE bridge_id = '${matchId}' ORDER BY sensor_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize};`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取mac地址 位置 所属协调器对应数据
exports.getMatchData = function(callback) {
	const sql = `SELECT * FROM sensor_data`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取协调器信息
exports.getCoordinatorInfo = function(callback) {
	const sql = `SELECT * FROM router_data`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取协调器数据
exports.getCoordinatorTweets = function(matchId, currentPage, pageSize, callback) {
<<<<<<< HEAD
	const sql = `SELECT * FROM router WHERE id_main = ${matchId} AND event_type = 'stop' ORDER BY router_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize}`;
=======
	const sql = `SELECT * FROM router WHERE id_main = ${matchId} AND event_type = 'stop' AND link_status != 'NULL' AND LENGTH(link_status) >= 5 ORDER BY router_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize}`;
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
	console.log(sql);
	database.query(sql, async (err, data)=> {
		if (!err && data.length !== 0) {
			for(let i=0; i<data.length; i++) {
				const sql = `SELECT * FROM router WHERE id_main = ${matchId} AND event_type = 'start' AND event_time < '${data[i].event_time.Format("yy-MM-dd hh:mm:ss")}' ORDER BY router_id DESC LIMIT 0, 1;`
				console.log(sql);
				const temp = await query(sql);
<<<<<<< HEAD
				data[i].adc_main = temp[0].adc_main;
				data[i].temper_main = temp[0].temper_main;
				data[i].start_time = temp[0].event_time;
=======
				if (temp[0]) {
					data[i].adc_main = temp[0].adc_main;
					data[i].temper_main = temp[0].temper_main;
					data[i].start_time = temp[0].event_time;
				} else {
					data[i].start_time = "暂无T数据";
				}
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
			}
		}
		callback(err, data);
	})
}

// 获取协调器数据的个数
exports.getTotalCoordinatorCount = function(matchId, callback) {
	const sql = `SELECT COUNT(router_id) count FROM router WHERE id_main = ${matchId} AND event_type = 'stop' AND link_status != 'NULL' AND LENGTH(link_status) >= 5`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data[0].count);
	})
}

// 获取所有数据
exports.getAllTweets = function(currentPage, pageSize, callback) {
	const sql = `SELECT sensor_id, read_time, bridge_id, macaddress, amplitude, frequency, adc_sensor FROM sensor ORDER BY sensor_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize};`
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取所有数据的个数
exports.getAllTweetsAccount = function(callback) {
	const sql = `SELECT COUNT(sensor_id) count FROM sensor;`
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data[0].count);
	});
}

// 获取某一个协调器最近十个周期的数据
exports.test = async function(matchId, callback) {
	console.log(`get ${matchId} recent ten work time data`);
	// let res = [];
	let obj = {};
	const sql = `SELECT event_time FROM router WHERE id_main = '${matchId}' AND event_type = "stop" ORDER BY router_id DESC LIMIT 0, 11;`
	try {
		let stopArr = await query(sql);
		stopArr.reverse();
		stopArr = stopArr.map(obj=> obj.event_time.Format("yy-MM-dd hh:mm:ss"));
		for (let i=0; i<stopArr.length-1; i++) {
			const sql = `SELECT event_time FROM router WHERE id_main = '${matchId}' AND event_type = 'start' AND event_time BETWEEN '${stopArr[i]}' AND '${stopArr[i+1]}' ORDER BY router_id DESC LIMIT 0, 1;`
			// console.log(sql);
			let startData = await query(sql);
			obj[startData[0].event_time.Format("yy-MM-dd hh:mm:ss")] = stopArr[i+1];
		}
		// 单条语句查询
		// console.time("单条")
		// for (let start of Object.keys(obj)) {
		// 	let end = obj[start];
		// 	const sql = `SELECT * FROM sensor WHERE id_main = '${matchId}' AND read_time BETWEEN '${start}' AND '${end}';`
		// 	const data = await query(sql);
		// 	// 检索sensordata中的aeae数量，并形成另一key字段
		// 	data.forEach(obj=> {
		// 		obj["aeae_counts"] = obj.sensordata.match(/aeae/g)?.length || 0;
		// 		delete obj["sensordata"];
		// 		obj["read_time"] = obj.read_time.Format("yy-MM-dd hh:mm:ss");
		// 	});
		// 	res.push(data);
		// }
		// console.timeEnd("单条")

		// 多条语句查询
		// console.time("多条")
		let sql1 = ""
		for (let start of Object.keys(obj)) {
			let end = obj[start];
			sql1 += `SELECT * FROM sensor WHERE id_main = '${matchId}' AND read_time BETWEEN '${start}' AND '${end}';`
		}
		const res1 = await query(sql1);
		// 检索sensordata中的aeae数量，并形成另一key字段
		res1.forEach(data=> {
			data.forEach(obj=> {
				obj["aeae_counts"] = obj.sensordata.match(/aeae/g)?.length || 0;
				delete obj["sensordata"];
				obj["read_time"] = obj.read_time.Format("yy-MM-dd hh:mm:ss");
			});
		})
		// console.timeEnd("多条");
		// console.log("两者数组长度: ", res.length === data1.length);
		// for (let i=0; i<res.length; i++) {
		// 	console.log(`两者内第${i+1}工作周期数组长度: `, res[i].length === data1[i].length)
		// 	for (let j=0; j<res[i].length; j++) {
		// 		for (let key in Object.keys(res[i][j])) {
		// 			if (res[i][j][key] !== data1[i][j][key]) {
		// 				console.log(false);
		// 			}
		// 		}
		// 	}
		// }
		callback(null, res1);
	} catch(err) {
		console.log("get err: ", err);
		callback(err, null);
	}
	
}
<<<<<<< HEAD
=======
exports.getWorkData = function(matchId, startTime, endTime, callback) {
	const sql = `SELECT * FROM sensor WHERE id_main= '${matchId}' AND read_time BETWEEN '${startTime}' AND '${endTime}'`
	database.query(sql, (err, data)=> {
		if (err) return callback(err, null);
		data.forEach(obj=> {
			obj["aeae_counts"] = obj.sensordata.match(/aeae/g)?.length || 0;
			delete obj["sensordata"];
			obj["read_time"] = obj.read_time.Format("yy-MM-dd hh:mm:ss");
		})
		callback(err, data);
	})
}
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3


