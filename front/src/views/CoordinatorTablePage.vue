<template>
    <div id="coordinatorTablePart">
        <vxe-table
          border
          round
          ref="xTable"
          height="600" 
          :loading="loading"
          :column-config="{resizable: true, isCurrent: true, isHover: true}"
          :row-config="{isCurrent: true, isHover: true}"
          :data="tableData" style="font-size: 20px;">
          <vxe-column
            v-for="config in tableColumn"
            :key="config.key"
            :type="config.type"
            :field="config.field"
            :title="config.title"
            :fixed="config.fixed"
            :width="config.width">
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
    </div>
</template>

<script>
    const client = require("../client")

    export default {
        name: "CoordinatorTablePage",
        data() {
            return {
                loading: false,
                tableColumn: [
                    {key: 1, field: "id_main", title: "协调器ID", width: "10%"},
                    {key: 2, field: "link_status", title: "数量", width: "10%"},
                    {key: 3, field: "adc_main", title: "电量", width: "15%"},
                    {key: 4, field: "temper_main", title: "温度", width: "15%"},
                    {key: 5, field: "start_time", title: "开机时间", width: "25%"},
                    {key: 6, field: "event_time", title: "关机时间", width: "25%"}
                ],
                tableData: [],
                tablePage: {
                    currentPage: 1,	// 当前页
                    pageSize: 10,	// 每页数据个数
                    totalResult: 100	// 总共数据个数
                },
                timer: null
            }
        },
        methods: {
            handlePageChange({ currentPage, pageSize }) {
                this.tablePage.currentPage = currentPage;
                this.tablePage.pageSize = pageSize;

                client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
                    tweets.forEach((obj)=> {
                        obj.temper_main = obj.temper_main ? (obj.temper_main.toFixed(1) + '℃') : null;
                        obj.event_time = obj.event_time.slice(0, obj.event_time.length-5).replace("T", " ");
                        obj.start_time = obj.start_time.slice(0, obj.start_time.length-5).replace("T", " ");
                        obj.link_status = obj.link_status.split(" ").reduce((pre, cur)=> Number(pre)+Number(cur));
                    });
                    this.tableData = tweets;
                    this.loading = false;
                });

                // 获取该matchId数据总数
                client.getTotalCoordinatorCount(this.matchId, (length)=> {
                    this.tablePage.totalResult = length;
                });
            }
        },
        computed: {
            matchId() {
                return this.$route.query.Id;
            }
        },
        created() {
            
        },
        mounted() {
            
        },
        activated() {
            client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
                tweets.forEach((obj)=> {
                    obj.temper_main = obj.temper_main ? (obj.temper_main.toFixed(1) + '℃') : null;
                    obj.event_time = obj.event_time.slice(0, obj.event_time.length-5).replace("T", " ");
                    obj.start_time = obj.start_time.slice(0, obj.start_time.length-5).replace("T", " ");
                    obj.link_status = obj.link_status.split(" ").reduce((pre, cur)=> Number(pre)+Number(cur));
                })
                this.tableData = tweets;
                this.loading = false;
            });

            // 获取该matchId数据总数
            client.getTotalCoordinatorCount(this.matchId, (counts)=> {
                this.tablePage.totalResult = counts;
            });
            console.log("CoordinatorTablePage激活,开启定时器");
            this.timer = setInterval(()=> {
                client.getCoordinatorTweets(this.matchId, this.tablePage.currentPage, this.tablePage.pageSize, (tweets)=> {
                    tweets.forEach((obj)=> {
                        obj.temper_main = obj.temper_main ? (obj.temper_main.toFixed(1) + '℃') : null;
                        obj.event_time = obj.event_time.slice(0, obj.event_time.length-5).replace("T", " ");
                        obj.start_time = obj.start_time.slice(0, obj.start_time.length-5).replace("T", " ");
                        obj.link_status = obj.link_status.split(" ").reduce((pre, cur)=> Number(pre)+Number(cur));
                    })
                    this.tableData = tweets;
                    this.loading = false;
                });

                // 获取该matchId数据总数
                client.getTotalCoordinatorCount(this.matchId, (length)=> {
                    this.tablePage.totalResult = length;
                });
            }, 1000*60)
        },
        deactivated() {
            console.log("CoordinatorTablePage失活,清除定时器");
            clearInterval(this.timer);

            this.tableData = [];
            this.loading = true;

            // 将页码恢复
            this.tablePage.currentPage = 1;
            this.tablePage.pageSize = 10;
            this.tablePage.totalResult = 0;
        },
    }
</script>

<style scoped>
    #coordinatorTablePart {
        width: 75%;
        height: auto;
        margin: auto;
        margin-top: 100px;
    }
</style>