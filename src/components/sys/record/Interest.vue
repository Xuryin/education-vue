<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>成长档案</el-breadcrumb-item>
                <el-breadcrumb-item>趣味测试</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--搜索栏-->
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span="3">
                <el-input size="small" placeholder="请输入姓名或学号" suffix-icon="el-icon-search" :clearable='true' @clear="cleanKey" v-model="table.queryKey"
                          @keyup.enter.native="queryKey"></el-input>
            </el-col>
            <el-col :span='3'>
                <el-input size="small" placeholder="请输入班级数字" suffix-icon="el-icon-search" :clearable='true' @clear="clearClass" v-model="table.classNum"
                          @keyup.enter.native="queryClass"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model.number="table.state" clearable placeholder="请选择状态" size="small" @change="stateChange">
                    <el-option v-for="item in table.stateOptions"
                               :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-date-picker size="small"
                    v-model="table.time" value-format="yyyy-MM-dd"
                    type="daterange" @change="timeChange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
            <el-col :span="2" :offset="2" style="text-align: right">
                <el-button type="primary" size="small" @click='exportExcel'>导出</el-button>
            </el-col>
        </el-row>

        <!--表格-->
        <el-row class="my-margin-top-10">
            <el-table :data='table.tableData' border stripe style="width:100%" size="small" :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="recordId"></el-table-column>
                <el-table-column label='趣味测试名称' prop="interestName" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label='姓名' prop="studentName"></el-table-column>
                <el-table-column label='学号' prop="studentNum"></el-table-column>
                <el-table-column label='年级'>
                    <template slot-scope="scope">
                        <span v-if='scope.row.gradeNum==1'>一年级</span>
                        <span v-if='scope.row.gradeNum==2'>二年级</span>
                        <span v-if='scope.row.gradeNum==3'>三年级</span>
                        <span v-if='scope.row.gradeNum==4'>四年级</span>
                        <span v-if='scope.row.gradeNum==5'>五年级</span>
                        <span v-if='scope.row.gradeNum==6'>六年级</span>
                        <span v-if='scope.row.gradeNum==7'>七年级</span>
                        <span v-if='scope.row.gradeNum==8'>八年级</span>
                        <span v-if='scope.row.gradeNum==9'>九年级</span>
                    </template>
                </el-table-column>
                <el-table-column label='班级' prop="classNum"></el-table-column>
                <el-table-column label='状态'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==1">完成</span>
                        <span v-if="scope.row.state==0">未完成</span>
                    </template>
                </el-table-column>
                <el-table-column label='得分' prop="score"></el-table-column>
                <el-table-column label='开始时间' prop="startTime" width="150"></el-table-column>
                <el-table-column label='结束时间' prop="endTime" width="150"></el-table-column>
                <el-table-column label='耗时' prop="useSecond"></el-table-column>
                <el-table-column label='操作' min-width='100' fixed="right">
                    <template slot-scope='scope'>
                        <el-button type="text"  @click="detail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle" :current-page="table.currentPage"
                           :page-size="table.pageSize" layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>

    </div>
</template>
<script>
import gradeJs from "@/utils/grade.js";
export default {
    data() {
        return {
            table: {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                queryKey: "",
                gradeNum: "",
                classNum: "",
                state: "",
                time: "",
                interestId: '',

                //年级下拉选择
                gradeList: [],
                interestSelect: [],
                //认知项目的下拉选择
                interestOptions: [],
                //状态下拉选择
                stateOptions: [
                    {value: 1,label: '完成'},
                    {value: 0,label: '未完成'}
                ]
            }
        };
    },
    methods: {
        //获取年级下拉
        getGradeList() {
            this.table.gradeList = gradeJs.getGradeList();
        },
        //获取表格数据
        getTableData(){
            let p = {};
            let url = '/interest/listQuery';
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            p.classNum = this.table.classNum;
            p.gradeNum = this.table.gradeNum;
            p.state = this.table.state;
            p.interestId = this.table.interestId;
            if(this.table.time){
                p.startTimeStr = this.table.time[0];
                p.endTimeStr = this.table.time[1];
            }
            this.$http.fetch(url, p)
                .then(res => {
                    this.table.tableData = res.data.rows;
                    this.table.rowCount = res.data.total;
                })
        },
        //翻页
        currentChangeHandle(currentPage) {
            this.table.currentPage = currentPage;
            this.getTableData();
        },

        //获取课程下拉的数据
        // getInterestList(){
        //     let p = {};
        //     let url = '/interest/listInterest';
        //     this.$http.fetch(url,p)
        //         .then(res=>{
        //             this.table.interestOptions = this.setInterestList(res.data);
        //         })
        // },
        //
        // setInterestList(data){
        //     let list = [];
        //     let obj = {};
        //     let temp = {1: "一年级",2:"二年级",3:"三年级",4:"四年级",5:'五年级',6:'六年级',7:'七年级',8:'八年级',9:'九年级'};
        //     data.map(d=>{
        //         let c = {};
        //         c.value = d.InterestId;
        //         c.label = d.InterestName;
        //         if(!obj[d.grade]){
        //             obj[d.grade] = {};
        //             obj[d.grade].value = d.grade;
        //             obj[d.grade].label = temp[d.grade];
        //             obj[d.grade].children = [];
        //         }
        //         obj[d.grade].children.push(c);
        //     })
        //     for(let i in obj){
        //         list.push(obj[i]);
        //     }
        //     return list;
        // },

        //条件搜索
        queryKey(){
            this.table.currentPage = 1;
            this.getTableData();
        },
        //清除条件搜索
        cleanKey(){
            this.table.currentPage = 1;
            this.table.queryKey = '';
            this.getTableData();
        },
        //班级搜索
        queryClass(){
            if (this.table.classNum != '') {
                //验证班级是不是正整数
                var reg = /^[1-9]\d*$/;
                if (!reg.test(this.table.classNum)) {
                    this.$notify({
                        message: '班级输入有误',
                        type: 'error'
                    });
                    this.table.classNum = '';
                    return;
                }
            }
            this.table.currentPage = 1;
            this.getTableData();
        },
        //清除班级搜索
        clearClass(){
            this.table.classNum = '';
            this.table.currentPage = 1;
            this.getTableData();
        },


        //状态选择
        stateChange(){
            console.log('状态选择')
            this.table.currentPage = 1;
            this.getTableData();
        },

        //时间选择
        timeChange(){
            this.table.currentPage = 1;
            this.getTableData();
        },

        //导出excel
        exportExcel(){
            let base = this.$myUrl.apiUrl();
            let url = base + '/interest/exportExcel?'
                + 'key=' + this.table.queryKey
                + '&classNum=' + this.table.classNum
                + '&gradeNum=' + this.table.gradeNum
                + '&state=' + this.table.state
                + '&interestId=' + this.table.interestId;
            if(this.table.time){
                url = url + '&startTimeStr=' + this.table.time[0]
                + '&endTimeStr=' + this.table.time[1];
            }
            window.open(url)
        },
    },
    mounted() {
        this.getGradeList();
        this.getTableData();
        this.getInterestList();
    }
};
</script>
<style scoped>
</style>
