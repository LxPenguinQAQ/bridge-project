<template>
    <div id="nodeTablePart">
		<div class="title">
			<h2 v-if="matchId=='all'">所有数据展示</h2>
			<h2 v-if="matchId!=='all'">mac地址:{{matchId}}</h2>
			<h2 v-if="matchId!=='all'">地址标号:{{address}}</h2>
		</div>
		<br>
        <vxe-table
          border
          round
          ref="xTable"
          height="665" 
          :loading="loading"
		  :cell-style="vxecellStyle"
          :column-config="{resizable: true, isCurrent: true, isHover: true}"
          :row-config="{isCurrent: true, isHover: true}"
          :data="tableData" style="font-size: 18px">
          <vxe-column
            v-for="config in tableColumn"
            :key="config.key"
            :type="config.type"
            :field="config.field"
            :title="config.title"
            :fixed="config.fixed"
            :width="config.width">
            <template #default="{ row }">
                <div v-if="config.key===1"><strong>&nbsp;{{address || row.bridge_id}}</strong></div>
                <div v-else-if="config.key===2">
                    <img :src="row.ampimage" height="30" width="150">
                    <strong>&nbsp;{{row.amplitude}}</strong>
                </div>
                <div v-else-if="config.key===3"><strong>&nbsp;{{row.frequency}}</strong></div>
                <div v-else-if="config.key==4">
                    <img :src="row.accurimage" height="30" width="80">
                    <strong>&nbsp;{{row.electricity}}</strong>
                </div>
                <div v-else-if="config.key===5"><strong>&nbsp;{{row.voltage | userSlice}}V</strong></div>
                <div v-else-if="config.key===6"><strong>&nbsp;{{row.read_time}}</strong></div>
                <!-- <div v-else><button @click="drawAcceleration(row.ID)" class="showDataBtn">显示数据</button></div> -->
                <div v-else><button @click="showData(row.sensor_id, row.read_time, row.macaddress)" class="showDataBtn">显示数据</button></div>
            </template>
          </vxe-column>

          <template #empty>
            <span style="color: red;">
              <img src="../assets/img1.gif">
              <p>没有更多数据了！</p>
            </span>
          </template>
        </vxe-table>

        <vxe-pager
          border
		  background
		  perfect
          size="medium"
		  align="left"
          :loading="loading"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
		  style="font-size: 16px; height: 60px">
        </vxe-pager>
		<p style="text-align: center;"><button @click="drawTrends" style="width: 150px; height: 50px; margin: 20px 0px" v-if="matchId!=='all'">趋势分析</button></p>

		<!-- 振幅变化 -->
		<Modal
        v-model="modal1"
        title="三维振幅图"
		width=1200
        >
			<p>ID：{{msgId}}</p><p>时间：{{msgTime}}</p>
			<p>Mac地址：{{macaddress}}</p>
			<canvas id="accelerationOfX" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			<br>
			<canvas id="accelerationOfY" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			<canvas id="accelerationOfZ" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			<canvas id="accelerationOfAll" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
    	</Modal>

		<!-- 趋势分析 -->
		<Modal
        v-model="modal2"
        title="趋势分析图"
		width=1200
        >
			<div class="container">
				<div class="block">
					<p style="font-weight:bold;">位置: {{address}}</p>
					<p style="font-weight:bold;">Mac地址: {{matchId}}</p>
					<p id = "number" style="font-weight:bold;">个数：</p>
					<el-date-picker
						v-model="timeArr"
						type="datetimerange"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						align="right">
					</el-date-picker>
				</div>
				<el-button type="primary" plain style="margin-left: 20px; self-align: end;" @click="drawByTime">发送请求</el-button>
			</div>
			<canvas id="amplitudeTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			<br><br>
			<canvas id="frequencyTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			<br><br>
			<canvas id="voltageTrend" width="1000" height="300" style="border:1px solid #c3c3c3;">
			您的浏览器不支持 HTML5 canvas 标签。
			</canvas>
			
		</Modal>
	</div>
</template>

<script>
    import * as echarts from 'echarts'

    import MyButton from "./MyButton.vue"

	import {threebag} from "../buma_cal.js"

    const client = require("../client")

	Date.prototype.Format = function (fmt) { 
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    export default {
        name: "NodeTablePage",
        components: {MyButton},
        data() {
            return {
				// 判断表格是否显示加载界面
                loading: false,
				accelerationReset: false,
				trendReset: false,
                tableColumn: [  // 表格标题
                    {key: 1, field: 'bridge_id', title: '位置', width: "12%"},
                    {key: 2, field: 'amplitude', title: '振幅', width: "24%"},
                    {key: 3, field: 'frequency', title: '频率', width: "10%"},
                    {key: 4, field: 'electricity', title: '电量', width: "15%"},
                    {key: 5, field: 'voltage', title: '电压', width: "10%"},
                    {key: 6, field: 'read_time', title: '时间', width: "19%"},
                    {key: 7, field: 'showdata', title: '查看数据', width: "10%"},
                ],
                tableData: [],  // 表格数据
				// 分页组件数据
                tablePage: {
                    currentPage: 1,	// 当前页
                    pageSize: 10,	// 每页数据个数
                    totalResult: 100	// 总共数据个数
                },
				// x轴加速度
				opinionData1: [],
				// y轴加速度
				opinionData2: [],
				// z轴加速度
				opinionData3: [],
				// 振幅趋势数据
				opinionData4: [],
				// 频率趋势数据
				opinionData5: [],
				// 电压趋势数据
				opinionData6: [],
				// 综合加速度
				opinionData7: [],
				globalVar1: [],
				globalVar2: [],
				charts: null,
				modal1: false,
				modal2: false,
				msgId: "",
				msgTime: null,
				matchData: [],
				macaddress: "",
				dataMacaddress: "",
				timer: null,
				pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeArr: [],
				vxecellStyle: {
					background: 'transparent'
				}
            }
        },
        computed: {
            // 将matchId放入computed计算属性中，这样点击一个按钮后返回按钮界面再次点击按钮才能触发matchId更新
            matchId() {
                return this.$route.query.matchId
            },
			address() {
				return this.$route.query.address
			}
        },
        methods: {
			showData(id, time, mac) {
				this.macaddress = mac

				this.msgId = id
				this.msgTime = time
				this.modal1 = true

				let judegExist = JSON.parse(sessionStorage.getItem("persons"))
				if (judegExist) {
					client.getSearchSingleTweets(id, (tweets) => {
						let readData = tweets[0]["sensordata"]
					
						this.globalVar2 = []
						var obj = threebag(readData);
						this.opinionData1 = obj.x;
						this.opinionData2 = obj.y;
						this.opinionData3 = obj.z;

						// 综合加速度
						for (let i = 0; i < this.opinionData1.length; i++) {
							this.opinionData7[i] = Math.sqrt(Math.pow(this.opinionData1[i], 2) + Math.pow(this.opinionData2[i], 2) + Math.pow(this.opinionData3[i], 2))
						}

						for (let i = 1; i <= this.opinionData1.length; i++) {
							this.globalVar2.push(i.toString())
						}

						this.accelerationReset = !this.accelerationReset
					})
				}
			},

            //绘制x轴的加速度曲线
			drawAccelerationOfX(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度x'],
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},

					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2

					},
					yAxis: {
						type: 'value'
					},
					dataZoom: [{
						type: "inside"
					}],

					series: [{
						name: '加速度x',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData1
					}]
				})
			},

			drawAccelerationOfY(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度y']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					dataZoom: [{
						type: "inside"
					}],
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度y',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData2
					}]
				})
			},
			
			drawAccelerationOfZ(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['加速度z']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					dataZoom: [{
						type: "inside"
					}],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '加速度z',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData3
					}]
				})
			},
			
			drawComprehensiveAcceleration(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: "cross",
							label: {
								backgroundColor: "#6a7958"
							}
						}
					},
					legend: {
						data: ['综合加速度']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					dataZoom: [{
						type: "inside"
					}],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.globalVar2
			
					},
					yAxis: {
						type: 'value'
					},
			
					series: [{
						name: '综合加速度',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData7
					}]
				})
			},

            // 翻页功能
            handlePageChange({ currentPage, pageSize }) {
                this.tablePage.currentPage = currentPage;
                this.tablePage.pageSize = pageSize;
				this.loading = true;

				if (this.matchId === "all") {
					client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
						this.tableData = this.formattweets(tweets)

						this.tableData.forEach((obj1)=> {
							this.matchData.forEach((obj2)=> {
								if (obj1.MACADDRESS === obj2.MACADDRESS) {
									obj1.ADDRESS = obj2.INSTALLADDRESS
								}
							})
							if (!obj1.ADDRESS) {
								obj1.ADDRESS = "undefined"
							}
						})

						this.loading = false
					})
				} else {
					client.getNodeTweets(this.address, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
						this.tableData = this.formattweets(tweets)
						this.loading = false
					})
				}
                
            },

			//通过自定义时间段展示数据趋势	
			drawByTime() { 	
				const startTime = this.timeArr[0].Format("yyyy-MM-dd hh:mm:ss");
				const endTime = this.timeArr[1].Format("yyyy-MM-dd hh:mm:ss");

				let amplitude = []
				let frequency = []
				let adc = []
				this.globalVar1 = []	
				client.getTweetsForPicByTime(this.address, startTime, endTime, (tweets) => {
					for(var i = 0; i < tweets.length; i++) {
						amplitude.push(tweets[i]["amplitude"])
						frequency.push(tweets[i]["frequency"])
						adc.push(tweets[i]["adc_sensor"].toFixed(2))
						this.globalVar1.push(tweets[i]["read_time"]);
					}
					this.opinionData4 = amplitude
					this.opinionData5 = frequency
					this.opinionData6 = adc
					document.getElementById("number").innerHTML = "个数：" + tweets.length
					// 触发画图
					this.trendReset = !this.trendReset
				})
			},

			//显示趋势图的窗口
			drawTrends() {
				// 将时间设置为最近一天
				this.timeArr = [new Date(new Date().getTime() - 24*60*60*1000), new Date()];
				this.modal2 = true
				// 避免观看两个按钮时，当搜索第一个按钮一段时间电压变化，然后点击第二个按钮观察趋势，电压图会显示为上一个按钮的电压图，reset。
				this.opinionData4 = [];
				this.opinionData5 = [];
				this.opinionData6 = [];
				this.globalVar1 = [];
	
				var macaddress = this.matchId;
				var address = this.address;
				// 默认执行
				this.drawByTime();
			},

			// 绘制振幅趋势图
			drawAmplitude(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "振幅分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['振幅']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '振幅'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						// name: '振幅',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData4
					}]
				})
			},

			// 绘制频率趋势图
			drawFrequency(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "频率分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['频率']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '频率'
					},
					dataZoom:[{
						type:"inside"         
					}],
			
					series: [{
						// name: '频率',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData5
					}]
				})
			},

			// 绘制电压趋势图
			drawVoltage(id) {
				this.charts = echarts.init(document.getElementById(id))
				this.charts.setOption({
					title:{
						show: true,
						text: "电压分析图",
						top: "top",
						left: "center"
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7958'
							}
						}
					},
					legend: {
						data: ['电压']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
			
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: {
						type: 'category',
						name: '时间',
						boundaryGap: false,
						data: this.globalVar1
			
					},
					yAxis: {
						type: 'value',
						name: '电压'
					},
					dataZoom:[{
						type:"inside"         
					}],
					series: [{
						// name: '电压',
						type: 'line',
						stack: '总量',
						smooth: true,
						data: this.opinionData6
					}]
				})
			},
        },
        created() {                                       
            
        },
        // 页面挂载完成后执行
        mounted() {
			
        },
		// 监测
		watch: {
			// 对画图界面进行监视
			accelerationReset() {
				if (document.getElementById("accelerationOfX")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfX"))
					this.drawAccelerationOfX("accelerationOfX")
					
				}
				if (document.getElementById("accelerationOfY")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfY"))
					this.drawAccelerationOfY("accelerationOfY")
					
				}
				if (document.getElementById("accelerationOfZ")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfZ"))
					this.drawAccelerationOfZ("accelerationOfZ")
				}
				if (document.getElementById("accelerationOfAll")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("accelerationOfAll"))
					this.drawComprehensiveAcceleration("accelerationOfAll")			
				}
			},
			trendReset() {
				if (document.getElementById("startTime")) {
						var time = document.getElementById("startTime")
						time.setAttribute("value", this.startTime)
					}
				if (document.getElementById("endTime")) {
					var time = document.getElementById("endTime")
					time.setAttribute("value", this.endTime)
				}
				if (document.getElementById("amplitudeTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("amplitudeTrend"))
					
					this.drawAmplitude("amplitudeTrend")
					
				}
				if (document.getElementById("frequencyTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("frequencyTrend"))
					
					this.drawFrequency("frequencyTrend")
					
				}
				if (document.getElementById("voltageTrend")) {
					let myChart = echarts.getInstanceByDom(document.getElementById("voltageTrend"))

					this.drawVoltage("voltageTrend")
					
				}
			},
		},
		activated() {
			console.log("NodeTablePage激活,开启定时器");

			client.getMatchData((matchData)=> {
				this.matchData = matchData;
            })

			if (this.matchId === "all") {
				this.loading = true
				client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
					this.tableData = this.formattweets(tweets);

					this.loading = false
				})

				// 获取该matchId数据总数
				client.getAllTweetsAccount((length)=> {
						this.tablePage.totalResult = length
				})
			} else {
				this.loading = true
				client.getNodeTweets(this.address, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
					this.tableData = this.formattweets(tweets)
					this.loading = false
				})

				// 获取该matchId数据总数
				client.getTotalNodeCount(this.address, (length)=> {
					this.tablePage.totalResult = length
				})
			}

			// 刷新表格数据
            this.timer = setInterval(()=> {
				if (this.matchId === "all") {
					client.getAllTweets(this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
						this.tableData = this.formattweets(tweets)

						this.tableData.forEach((obj1)=> {
							this.matchData.forEach((obj2)=> {
								if (obj1.MACADDRESS === obj2.MACADDRESS) {
									obj1.ADDRESS = obj2.INSTALLADDRESS
								}
							})
							if (!obj1.ADDRESS) {
								obj1.ADDRESS = "undefined"
							}
						})

						this.loading = false
					})

					// 获取该matchId数据总数
					client.getAllTweetsAccount((length)=> {
						this.tablePage.totalResult = length
					})
				} else {
					client.getNodeTweets(this.address, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
						this.tableData = this.formattweets(tweets)
						this.loading = false
					})

					// 获取该matchId数据总数
					client.getTotalNodeCount(this.address, (length)=> {
						this.tablePage.totalResult = length
					})
				}
			}, 1000*60)
		},
		deactivated() {
			console.log("NodeTablePage失活,清除定时器");
			clearInterval(this.timer);

			this.tableData = []
			this.loading = true

			// 将页码恢复
			this.tablePage.currentPage = 1
			this.tablePage.pageSize = 10
			this.tablePage.totalResult = 0

			// 关闭弹窗
			this.modal1 = false;
			this.modal2 = false;
		},
    }
</script>

<style lang="css" scoped>
    #nodeTablePart {
        width: 75%;
        height: auto;
        margin: auto;
        padding-top: 25px;
    }

	h2 {
		text-align: center;
	}

	div.title {
		width: 400px;
		margin: 0 auto;
	}

	/* 显示数据按钮样式 */
    .showDataBtn {
        cursor: pointer;
    }

	p {
		line-height: 25px;
	}

	canvas {
		display: block;
		margin: 0 auto;
	}
	.container {
		display: flex;
		justify-content: center;
		margin-bottom: 50px;
	}
</style>