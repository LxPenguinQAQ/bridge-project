<template>
    <div>
        <h1>测试用组件(时间选择器暂时没用)</h1>
        <div class="header">
            <div class="block">
                <label>协调器</label>
                <Select v-model="model" style="width:200px; margin: 0 20px;" id="selector">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <el-date-picker
                    v-model="value2"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
            </div>
            <el-button type="primary" plain style="margin-left: 20px" @click="debounce">发送请求</el-button>
        </div>
        <div v-if="show" id="data">
            <div class="container" v-for="(part, index) in tableData" :key="index">
                <h3>{{`第${index+1}个工作周期(${part.length})`}}</h3>
                <el-table
                    v-loading = "loading"
                    :data="part"
                    height="300"
                    border
                    style="width: 80%; margin: 0 auto">
                    <el-table-column
                        prop="sensor_id"
                        label="id号"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="read_time"
                        label="创建时间"
                        width="400">
                    </el-table-column>
                    <el-table-column
                        prop="bridge_id"
                        label="位置标号"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="macaddress"
                        label="macaddress">
                    </el-table-column>
                    <el-table-column
                        prop="amplitude"
                        label="振幅">
                    </el-table-column>
                    <el-table-column
                        prop="frequency"
                        label="频率">
                    </el-table-column>
                    <el-table-column
                        prop="adc_sensor"
                        label="电压">
                    </el-table-column>
                    <el-table-column
                        prop="aeae_counts"
                        label="aeae数量">
                    </el-table-column>
                </el-table>
            </div>
        </div>    
    </div>
</template>

<script>
    const client = require('../client')
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
        name: "temp",
        data() {
            return {
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
                value2: '',
                cityList: [
                    {
                        value: '6142',
                        label: '6142'
                    },
                    {
                        value: '6143',
                        label: '6143'
                    },
                    {
                        value: '6144',
                        label: '6144'
                    },
                    {
                        value: '6145',
                        label: '6145'
                    },
                    {
                        value: '6146',
                        label: '6146'
                    },
                    {
                        value: '6242',
                        label: '6242'
                    }
                ],
                model: '',
                // 表格数据
                tableData: [],
                loading: true,
                show: false
            };
        },
        methods: {
            sendReq() {
                if (!this.show) this.show = true;
                this.tableData = new Array(10).fill(0).map(_=> []);
                this.loading = true;
                client.test(this.model, (data)=> {       
                    console.log(data);
                    this.tableData = data;
                    this.loading = false;
                })
            },
            // 防抖封装函数
            debounce: ((delay)=> {
                let timer = null;
                return function() {
                    // 点击后立即执行
                    if (!timer) {
                        this.sendReq();
                    }
                    timer = setTimeout(()=> {
                        timer = null;
                    }, delay);
                }
            })(2000),
            // 节流封装函数
            throttle: ((delay)=> {
                let timer = null;
                return function() {
                    if (!timer) {
                        timer = setTimeout(()=> {
                            this.sendReq();
                            clearTimeout(timer);
                        }, delay)
                    }
                }
            })(2000)
        },
    }
</script>

<style scoped>
    .header {
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: sticky;
        top: 10px;
        z-index: 100;
    }

    .container .block span.demonstration {
        margin-right: 25px;
    }

    .container {
        margin: 50px auto;
    }
    h1, h2, h3 {
        text-align: center;
        margin-bottom: 20px;
    }
    div#data::after {
        content: "";
        display: block;
        height: 50px;
    }
</style>