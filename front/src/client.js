import myAxios from './utils/myAxios'


//用户登录接口
export const login = function(username, password, callback) {
	myAxios.post('login', {
		username,
		password
	}).then(res=> {
		if (res.status) {
			if (res.token) {
				localStorage.setItem('Token', res.token);
			}
			callback();
		}
	})
}

//用户注册接口
export const createAccount = function(username, password, passwordRepeat, email, callback) {
	myAxios.post("accounts/createAccount", {
		username,
		password,
		passwordRepeat,
		email
	}).then(res=> {
		if (res.status) {
			if (res.token) {
				localStorage.setItem('Token', res.token);
			}
			callback();
		}
	})
}

//获取指示灯状态信息
export const getNodeStatus = function(callback) {
	myAxios.get("tweets/getNodeStatus").then(res=> {
		callback(res);
	})
}

//根据ID搜索单行列表tweets所有信息接口，显示数据
export const getSearchSingleTweets = function(searchId, callback) {
	myAxios.get("tweets/getSearchSingleTweets", {
		params: {
			searchId
		}
	}).then(res=> {
		callback(res);
	})
}

//根据ButtonID获取所有tweets数据，绘制随时间趋势图
export const getTweetsForPicByTime = function(matchId, startTime, endTime, callback) {
	myAxios.post(`tweets/getTweetsForPicBytime?matchId=${matchId}`, {
		startTime,
		endTime
	}).then(res=> {
		callback(res);
	})
}

//修改CORRESPONDRENCE中SUBMACADDRESS
export const modifyMacAddress = function(installAddress, macAddress, callback) {
	myAxios.put(`tweets/modifyMacAddress/${installAddress}/${macAddress}`).then(res=> {
		callback();
	})
}

// 获得某一按钮所有信息的个数
export const getTotalNodeCount = function(matchId, callback) {
	myAxios.get("tweets/getTotalNodeCount", {
		params: {
			matchId
		}
	}).then(res=> {
		callback(res);
	})
}

// 获取子节点所有数据的个数
export const getAllTweetsAccount = function(callback) {
	myAxios.get("tweets/getAllTweetsAccount").then(res=> {
		callback(res);
	})
}

// 根据当前页数和每页数据量来获取数据
export const getNodeTweets = function(matchId, currentPage, pageSize, callback) {
	myAxios.get("tweets/getNodeTweets", {
		params: {
			matchId,
			currentPage,
			pageSize
		}
	}).then(res=> {
		callback(res);
	})
}

// 获取匹配数据
export const getMatchData = function(callback) {
	myAxios.get("tweets/getMatchData").then(res=> {
		callback(res);
	})
}

// 获取协调器信息
export const getCoordinatorInfo = function(callback) {
	myAxios.get("tweets/getCoordinatorInfo").then(res=> {
		callback(res);
	})
}

// 获取具体某一主节点数据
export const getCoordinatorTweets = function(matchId, currentPage, pageSize, callback) {
	myAxios.get("tweets/getCoordinatorTweets", {
		params: {
			matchId,
			currentPage,
			pageSize
		}
	}).then(res=> {
		callback(res);
	})
}

// 获取所有主节点数据个数
export const getTotalCoordinatorCount = function(matchId, callback) {
	myAxios.get("tweets/getTotalCoordinatorCount", {
		params: {
			matchId
		}
	}).then(res=> {
		callback(res);
	})
}

// 根据当前页和当前每页数据个数获取所有子节点数据
export const getAllTweets = function(currentPage, pageSize, callback) {
	myAxios.get("tweets/getAllTweets", {
		params: {
			currentPage,
			pageSize
		}
	}).then(res=> {
		callback(res);
	})
}

// 测试用post
export const test = function(matchId, callback) {
	myAxios.get("test", {
		params: {
			matchId
		}
	}).then(res=> {
		callback(res);
	})
}

// 查询一个工作周期的数据
export const getWorkData = function(matchId, startTime, endTime, callback) {
	myAxios.post(`tweets/getWorkData?matchId=${matchId}`, {
		startTime,
		endTime
	}).then(res=> {
		callback(res);
	})
}


