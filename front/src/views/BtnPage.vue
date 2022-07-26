<template>
    <div id="BtnPage">
        <el-container>
            <!-- 用户信息界面 -->
            <el-aside width="200px">
                <div class="info">
                    <h2>用户名:&nbsp;{{user}}</h2>
                    <div id="logout"><icon type="md-power" size="30" @click="logout" class="icon"/></div><br>
                    <h3>协调器状态:<br>编号:{{" "+num+' 号'}}<br>电量:{{" "+electricity+' V'}}<br>温度:{{" "+temper+' °C'}}</h3>
                    <p style="text-align: center; margin-top: 20px;">
                        <button @click="dialog=true;" class="settingBtn">设置</button>
                        <button @click="showAllTweets" class="settingBtn">全部数据</button>
                        <button @click="test" class="settingBtn">测试用接口</button>
                    </p>
                </div>
            </el-aside>
            <!-- 按钮展示界面 -->
            <el-container>
                <el-main ref="main">
                    <div class="coordinatorPart">
                        <h1>协调器</h1>
                        <MyButton v-for="obj in coordinatorData" :address="obj.router_id" :ref="obj.router_id" :key="obj.id" type="coordinator" matchId=""/>
                    </div>

                    <div v-for="arr of matchArr" :key="arr[0].id" class="btnPart">
                        <h1>bridge_id:{{arr[0].installAddress | addressSlice}}</h1>
                        <MyButton v-for="obj of arr" :matchId="obj.macaddress" :address="obj.installAddress" :ref="obj.installAddress" :key="obj.id" type="node"/>
                    </div>
                </el-main>
            </el-container>
            <!-- 设置页面 -->
            <el-drawer
            title="设置页面"
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            >
            <div class="demo-drawer__content">
                <el-form :model="form">
                    <h2>报警阀值设置</h2>
                    <el-form-item label="alarmThreshold1:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold1" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="alarmThreshold2:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold2" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <el-form-item label="alarmThreshold3:" style="margin-left: 20%; margin-right: 20%; margin-top: 20px">
                        <el-input v-model.number="form.alarmThreshold3" autocomplete="off" style="width: 50%;"></el-input>
                    </el-form-item>
                    <h2>子节点mac地址配置</h2>
                    <label>阻尼器编号</label>
                    <el-form-item style="margin-top: 20px">
                        <el-select v-model="form.selector" style="width: 45%;">
                            <p v-for="(arr, index) in matchArr" :key="index"><el-option v-for="(obj, index) in arr" :label="obj.installAddress" :value="obj.installAddress" :key="index"></el-option></p>
                        </el-select>
                    </el-form-item>
                    <label>子字节mac地址</label>
                    <el-form-item style="margin-top: 20px">
                        <el-input v-model="macaddress" autocomplete="off" style="width: 45%;" ></el-input>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer" style="margin-left: 35%; margin-right: 35%; margin-top: 20%">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
            </el-drawer>
        </el-container>
    </div>
</template>

<script>
    import MyButton from "./MyButton.vue"

    const client = require("../client")
    export default {
        name: "BtnPage",
        data() {
            return {
                alertDialog: false, // 设置界面阈值是否修改
                alertMacaddress: false, // 设置界面macaddress是否修改
                dialog: false,      // 设置界面是否弹出
                loading: false,     // 设置界面确定按钮是否加载中字样
                user: "--",     // 用户名
                num: "--",
                electricity: "--",
                temper: "--",
                // 报警阀值
                alarmThreshold1: Number(localStorage.getItem("alarmThreshold1")) || 150,   
				alarmThreshold2: Number(localStorage.getItem("alarmThreshold2")) || 100,
				alarmThreshold3: Number(localStorage.getItem("alarmThreshold3")) || 70,
                // 设置页面中显示
                form: {
                    alarmThreshold1: 0,
                    alarmThreshold2: 0,
                    alarmThreshold3: 0,

                    selector: "",
                },
                macaddress: "",
                timer: null,
                // 匹配信息数据
                matchData: [],
                // 协调器信息数据
                coordinatorData: [],
                refresh: true,
                timer_1: null,
                // 判断是否获取按钮状态
                judgeGetStatus: true,
<<<<<<< HEAD
                // 存放红色按钮
                alertList: [],
                // 音频对象
                alertSound: new Audio('./alertSound.mp3'),
                alertInterval: null,
                judgeAlertSound: true,
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
            }
        },
        computed: {
            // 依据installAddress进行分类得到所有位置种类的CLASSICFICATION数组
            classificationArr() {
                let arr = [];
                this.matchData.forEach(obj=> {
                    const temp = obj.installAddress.split("-");
                    temp.pop();
                    const className = temp.join("-")
                    if (!arr.includes(className)) {
                        arr.push(className);
                    }
                })
                // 排序顺序为升序，先比较第一项数字，再比较第二项字母，再比较第三项字母
                return arr.sort((a, b)=> {
                    let num1, w1_1, w1_2, num2, w2_1, w2_2;
                    [num1, w1_1, w1_2] = a.split("-");
                    [num2, w2_1, w2_2] = b.split("-");
                    if (num1 !== num2) {
                        return num1 - num2;
                    } else if (w1_1 !== w1_2) {
                        return w1_2.charCodeAt() - w1_1.charCodeAt();
                    } else {
                        return w2_2.charCodeAt() - w2_1.charCodeAt();
                    }
                });
            },
            // 按照classification编号分类形成数组后组合的大数组
            matchArr() {
                let arrTotal = [];
                let arr = [];
                this.classificationArr.forEach((str)=> {
                    this.matchData.forEach((obj)=> {
                        const temp = obj.installAddress.split("-");
                        temp.pop();
                        const className = temp.join("-")
                        if (className === str) {
                            arr.push(obj);
                        }
                    })
                    // 给arr进行降序，arr存储节点数据
                    arr.sort(function(m, n) {
                        m = Number(m.installAddress.split("-").pop());
                        n = Number(n.installAddress.split("-").pop());
                        return m - n;
                    })

                    arrTotal.push(arr);
                    arr = [];
                })
                return arrTotal;
            },
            // 根据matchArr中的分类顺序形成一个关于macaddress的数组，顺序很重要，顺序为按钮的布置顺序
            matchIdArr() {
                let matchIdArr = []
                this.matchArr.forEach((arr)=> {
                    arr.forEach((obj)=> {
                        matchIdArr.push(obj.macaddress)
                    })
                })
                return matchIdArr
            },

        },
        components: {MyButton},
        methods: {
            //退出登录，清除localStorage中的用户信息并跳转到登录页
			logout() {
				localStorage.removeItem("persons");
                localStorage.removeItem("Token");
				this.$router.push("/")
			},
            // 设置界面
            setting() {
                this.openDialog = true;
                this.$nextTick(()=>{
                    this.refs.testDialog.init();
                })

            },

            // 关闭设置页面前执行
            handleClose(done) {
                if (this.loading) {
                    return;
                }
                // 如果数据没有修改，直接退出
                // if (!this.alertDialog) {
                //     this.dialog = false;
                //     return;
                // }
                this.matchData.forEach(obj=> {
                    if (obj.installAddress === this.form.selector) {

                    }
                })
                for (let i=0; i<this.matchData.length; i++) {
                    if (this.matchData[i].installAddress === this.form.selector) {
                        if (this.matchData[i].macaddress !== this.macaddress) {
                            this.alertMacaddress = true;
                            break;
                        }
                    }
                }

                if (this.alarmThreshold1 !== this.form.alarmThreshold1 || this.alarmThreshold2 !== this.form.alarmThreshold2 || this.alarmThreshold3 !== this.form.alarmThreshold3) {
                    this.alertDialog = true;
                }

                if (!this.alertDialog && !this.alertMacaddress) {
                    this.cancelForm();
                    return;
                }

                //数据被修改，询问是否保存数据
                this.$confirm('确定要提交表单吗？')
                    .then(_ => {
                        this.loading = true;
                        // 同步改动的报警阀值
                        this.alarmThreshold1 = this.form.alarmThreshold1;
                        this.alarmThreshold2 = this.form.alarmThreshold2;
                        this.alarmThreshold3 = this.form.alarmThreshold3;

                        localStorage.setItem("alarmThreshold1", this.form.alarmThreshold1);
                        localStorage.setItem("alarmThreshold2", this.form.alarmThreshold2);
                        localStorage.setItem("alarmThreshold3", this.form.alarmThreshold3);

                        if (this.alertMacaddress) {
                            // 修改数据库中的macaddress
                            client.modifyMacAddress(this.form.selector, this.macaddress, ()=> {
                                this.refresh = !this.refresh;
                            })
                            this.alertMacaddress = false;
                        }

                        this.timer = setTimeout(() => {
                            done();
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        }, 500);
                    })
                    .catch(_ => {this.cancelForm()});
            },
            // 退出设置界面
            cancelForm() {
                this.loading = false;
                this.dialog = false;
                this.alertMacaddress = false;
                this.alertDialog = false;
                // 当未确认退出时候，同步form和实际的阀值
                this.form.alarmThreshold1 = this.alarmThreshold1;
                this.form.alarmThreshold2 = this.alarmThreshold2;
                this.form.alarmThreshold3 = this.alarmThreshold3;

                this.form.selector = this.matchData[0].installAddress;
                this.macaddress = this.matchData[0].macaddress;
                clearTimeout(this.timer);
            },

            // 显示所有数据
            showAllTweets() {
                this.$router.push({path:'NodeTablePage', query: {matchId: "all"}});
            },

            // 测试用接口
            test() {
                this.$router.push("/Temp");
<<<<<<< HEAD
            },

            // 关闭警报
            closeAlertSound() {
                this.judgeAlertSound = false;
                clearInterval(this.alertInterval);
                this.alertSound.pause();
                this.alertSound.src = './alertSound.mp3';
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
            }
        },
        created() {
            this.alertSound.loop = true;
            // 将form中报警阀值同步
            this.form.alarmThreshold1 = this.alarmThreshold1;
            this.form.alarmThreshold2 = this.alarmThreshold2;
            this.form.alarmThreshold3 = this.alarmThreshold3;


            //如果用户名未登录， 返回空。做判断防止报错
            let judegExist = JSON.parse(localStorage.getItem("persons"));
            if (judegExist) {
                this.user = JSON.parse(localStorage.getItem("persons"))[0].user;
            } else {
                this.user = "未登录!";
            }

            // 从数据库获取的位置 mac地址 所属协调器信息
            client.getMatchData((matchData)=> {
                this.matchData = matchData;
            })

            // 从数据库获取的协调器信息
            client.getCoordinatorInfo((coordinatorData)=> {
                // 排序后赋值给coordinatorData
                this.coordinatorData = coordinatorData.sort(function(m, n) {
                    m = Number(m.macaddress);
                    n = Number(n.macaddress);
                    return m - n;
                })
            })
            if (this.judgeGetStatus) {
                this.judgeGetStatus = false;
                client.getNodeStatus((tweets)=> {
                    for (let i=0; i<this.matchData.length; i++) {
                        this.$refs[this.matchData[i].installAddress][0].state=0;
                    }
<<<<<<< HEAD
                    const alertList = [];
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                    for (let i=0; i<tweets.length; i++) {
                        if (this.$refs[tweets[i].bridge_id]) {
                            if (tweets[i].amplitude > this.alarmThreshold1) {
                                this.$refs[tweets[i].bridge_id][0].state = 1;
<<<<<<< HEAD
                                const obj = {
                                    bridge_id: tweets[i].bridge_id,
                                    ref: this.$refs[tweets[i].bridge_id][0],
                                    amplitude: tweets[i].amplitude
                                };
                                alertList.push(obj);
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                            } else if (tweets[i].amplitude > this.alarmThreshold2) {
                                this.$refs[tweets[i].bridge_id][0].state = 2;
                            } else if (tweets[i].amplitude > this.alarmThreshold3) {
                                this.$refs[tweets[i].bridge_id][0].state = 3;
                            } else if (tweets[i].amplitude > -1) {
                                this.$refs[tweets[i].bridge_id][0].state = 4;
                            } else {
                                this.$refs[tweets[i].bridge_id][0].state = 0;
                            }
                        }
                    }
                    this.judgeGetStatus = true;
<<<<<<< HEAD
                    this.alertList = alertList;
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                })
            } else {
                console.log("上次getNodeStatus请求未响应");
            }
        },
        mounted() {
<<<<<<< HEAD

=======
            
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
        },
        watch: {
            form: {
                deep: true,
                handler() {
                    this.matchArr.forEach((arr)=> {
                        arr.forEach((obj)=> {
                            if (obj.installAddress === this.form.selector) {
                                this.macaddress = obj.macaddress;
                                return;
                            }
                        })
                    })
                }
            },
            matchArr: {
                deep: true,
                handler() {
                    this.form.selector = this.matchArr[0][0].installAddress;
                    this.macaddress = this.matchArr[0][0].macaddress;
                }
            },
            // refresh变化时更新matchData、classificationArr、matchArr、matchIdArr
            refresh() {
                // 从数据库获取的位置 mac地址 所属协调器信息
                if (this.judgeGetStatus) {
                    this.judgeGetStatus = false;
                    client.getNodeStatus((tweets)=> {
                        for (let i=0; i<this.matchData.length; i++) {
                            this.$refs[this.matchData[i].installAddress][0].state=0;
                        }
                        const alertList = [];
                        for (let i=0; i<tweets.length; i++) {
                            if (this.$refs[tweets[i].bridge_id]) {
                                if (tweets[i].amplitude > this.alarmThreshold1) {
                                    this.$refs[tweets[i].bridge_id][0].state = 1;
<<<<<<< HEAD
                                    const obj = {
                                        bridge_id: tweets[i].bridge_id,
                                        ref: this.$refs[tweets[i].bridge_id][0],
                                        amplitude: tweets[i].amplitude
                                    };
                                    alertList.push(obj);
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                                } else if (tweets[i].amplitude > this.alarmThreshold2) {
                                    this.$refs[tweets[i].bridge_id][0].state = 2;
                                } else if (tweets[i].amplitude > this.alarmThreshold3) {
                                    this.$refs[tweets[i].bridge_id][0].state = 3;
                                } else if (tweets[i].amplitude > -1) {
                                    this.$refs[tweets[i].bridge_id][0].state = 4;
                                } else {
                                    this.$refs[tweets[i].bridge_id][0].state = 0;
                                }
                            }
                        }
                        this.judgeGetStatus = true;
<<<<<<< HEAD
                        this.alertList = alertList;
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                    })
                } else {
                    console.log("上次getNodeStatus请求未响应");
                }
            },
<<<<<<< HEAD
            alertList(newV, oldV) {
                if (this.judgeAlertSound) {
                    const judge_1 = Boolean(newV.length);
                    const judge_2 = Boolean(oldV.length);
                    if (judge_1 === judge_2) {
                        return;
                    } else if (judge_1) {
                        this.$notify({
                            title: '警告',
                            message: '这是一条警告的提示消息',
                            type: 'warning',
                            duration: 0,
                            onClose: this.closeAlertSound,

                        });
                        const func = ()=> {
                            this.alertSound.play();
                            setTimeout(()=> {
                                this.alertSound.pause();
                                this.alertSound.src = './alertSound.mp3';
                            }, 30*1000);
                            return func;
                        }
                        this.alertInterval = setInterval(func(), 5*60*1000);
                    } else {
                        this.alertSound.pause();
                        this.alertSound.src = './alertSound.mp3';
                        clearInterval(this.alertInterval);
                    }
                } else {
                    return;
                }
            }
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
        },
        activated() {
            console.log("BtnPage组件激活,定时器启动");
            console.log(this.$refs["29-01 "])
            this.timer_1 = setInterval(()=> {
                // 根据数据库信息判断按钮颜色
                if (this.judgeGetStatus) {
                    this.judgeGetStatus = false;
                    client.getNodeStatus((tweets=[])=> {
                        for (let i=0; i<this.matchData.length; i++) {
                            this.$refs[this.matchData[i].installAddress][0].state=0;
                        }
<<<<<<< HEAD
                        const alertList = [];
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                        for (let i=0; i<tweets.length; i++) {
                            if (this.$refs[tweets[i].bridge_id]) {
                                if (tweets[i].amplitude > this.alarmThreshold1) {
                                    this.$refs[tweets[i].bridge_id][0].state = 1;
<<<<<<< HEAD
                                    const obj = {
                                        bridge_id: tweets[i].bridge_id,
                                        ref: this.$refs[tweets[i].bridge_id][0],
                                        amplitude: tweets[i].amplitude
                                    };
                                    alertList.push(obj);
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                                } else if (tweets[i].amplitude > this.alarmThreshold2) {
                                    this.$refs[tweets[i].bridge_id][0].state = 2;
                                } else if (tweets[i].amplitude > this.alarmThreshold3) {
                                    this.$refs[tweets[i].bridge_id][0].state = 3;
                                } else if (tweets[i].amplitude > -1) {
                                    this.$refs[tweets[i].bridge_id][0].state = 4;
                                } else {
                                    this.$refs[tweets[i].bridge_id][0].state = 0;
                                }
                            }
                        }
                        this.judgeGetStatus = true;
<<<<<<< HEAD
                        this.alertList = alertList;
=======
>>>>>>> ba949ca4f0302236e2dbf8cb9612fa80613b05c3
                    })
                } else {
                    console.log("上次getNodeStatus请求未响应");
                }
            }, 1000)
        },
        deactivated() {
            console.log("BtnPage组件失活,清除定时器");
            clearInterval(this.timer_1);
        },
    }

</script>

<style lang="css" scoped>

    h2 {
        text-align: center;
        font-size: 25px;
        margin-top: 25px;
        margin-bottom: 25px;
    }

    .el-header, .el-footer {
        /* background-color: #B3C0D1; */
        color: #333;
        text-align: center;
        line-height: 60px;
        font-size: 35px;
        font-style: italic;
    }

    .el-aside {
        /* background-color: #D3DCE6; */
        color: #333;
        text-align: center;
        line-height: 30px;
        border: 2px groove pink;
    }

    .el-main {
        /* background-color: #E9EEF3; */
        background-color: transparent;
        color: #333;
        text-align: center;
        line-height: 50px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .coordinatorPart {
        width: 90%;
        margin: auto;
        margin-top: 10px;
        border: 2px groove red; 
    }

    .btnPart {
        width: 90%;
        margin: auto;
        margin-top: 10px;
        border: 2px groove blue; 
    }

    div.demo-drawer__content {
        text-align: center;
    }

    /* 设置按钮样式 */
    .settingBtn {
        cursor: pointer;
        width: 200px;
        width: 100px;
        margin-right: 50px;
        margin-bottom: 25px;
    }

    button {
        display: block;
        margin: 0 auto;
    }

    .info {
        width: 200px;
        margin: 0 auto;
        position: fixed;
        top: 50px;
    }
    .demo-drawer__footer {
        display: flex;
        justify-content: center;
    }
    div#logout {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        /* border: 2px solid gray; */
        position: relative;
    }
    .icon {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;

    }
    div#logout:hover {
        background-color: rgba(96, 96, 96, 0.2);
    }
</style>