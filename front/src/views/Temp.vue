<template>
    <div class="container">
        <div class="block">
            <span class="demonstration">带快捷选项</span>
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
        <el-button type="primary" plain style="margin-left: 20px" @click="getTime">发送请求</el-button>
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
                value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                value2: '',
            };
        },
        methods: {
            getTime() {
                let start = this.value2[0].Format("yyyy-MM-dd hh:mm:ss");
                let end = this.value2[1].Format("yyyy-MM-dd hh:mm:ss");
                console.log(start, end);
                client.test(start, end, (data)=> {
                    console.log(data);
                })
            }
    },
    }
</script>

<style scoped>
    .container {
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .container .block span.demonstration {
        margin-right: 25px;
    }
</style>