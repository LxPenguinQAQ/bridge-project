const database = require('./mysql')


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
	const sql = `SELECT sensordata FROM sensor WHERE sensor_id = '${id}';`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

//通过ID获取Tweet表格中一段时间内的的数据
exports.getTweetsForPicByTime = function(matchId, startTime, endTime, callback) {
	const sql = `SELECT read_time, amplitude, frequency, adc_sensor FROM sensor WHERE read_time BETWEEN '${startTime}' AND '${endTime}';`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

//通过address更新CORRESPONDENCE中的SUBMACADDRESS
exports.modifyMacAddress = function(installAddress, macAddress, callback) {
	const sql = `UPDATE sensor_data SET macaddress = '${macAddress}' WHERE installAddress = '${installAddress}';`;
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取最近的子节点数据（最近6小时）
exports.getNodeStatus = function(callback) {
	const sql = `SELECT t.amplitude, t.macaddress FROM (SELECT macaddress,MAX(sensor_id) sensor_id FROM sensor GROUP BY macaddress) a  JOIN sensor t ON t.macaddress=a.macaddress AND t.sensor_id=a.sensor_id AND LENGTH(a.macaddress)<20 AND t.read_time BETWEEN DATE_SUB(NOW(), INTERVAL 6 HOUR) AND NOW();`;
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 通过matchId获取所有数据的个数
exports.getTotalNodeCount = function(matchId, callback) {
	const sql = `SELECT COUNT(sensor_id) count FROM sensor WHERE macaddress = '${matchId}';`
	database.query(sql, (err, data)=> {
		callback(err, data[0].count);
	})
}

// 通过页数和页面数据量获取节点数据
exports.getNodeTweets = function(matchId, currentPage, pageSize, callback) {
	const sql = `SELECT sensor_id, read_time, bridge_id, macaddress, amplitude, frequency, adc_sensor FROM sensor WHERE macaddress = '${matchId}' ORDER BY sensor_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize};`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取mac地址 位置 所属协调器对应数据
exports.getMatchData = function(callback) {
	const sql = `SELECT * FROM sensor_data`;
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
	const sql = `SELECT * FROM router WHERE id_main = ${matchId} ORDER BY router_id DESC LIMIT ${(currentPage-1)*pageSize}, ${pageSize}`;
	console.log(sql);
	database.query(sql, (err, data)=> {
		callback(err, data);
	})
}

// 获取协调器数据的个数
exports.getTotalCoordinatorCount = function(matchId, callback) {
	const sql = `SELECT COUNT(router_id) count FROM router WHERE id_main = ${matchId}`;
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



