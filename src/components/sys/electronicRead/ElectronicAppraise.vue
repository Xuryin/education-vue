<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>图书管理</el-breadcrumb-item>
                <el-breadcrumb-item>阅读心得</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <!--条件搜索 -->
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span="3">
                <el-input size="small" placeholder="请输入姓名或学号或者书名" suffix-icon="el-icon-search" :clearable='true' @clear="cleanKey" v-model="table.queryKey"
                          @keyup.enter.native="queryKey"></el-input>
            </el-col>
            <el-col :span='3'>
                <el-input size="small" placeholder="请输入班级数字" suffix-icon="el-icon-search" :clearable='true' @clear="clearClass" v-model="table.classNum"
                          @keyup.enter.native="queryClass"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model.number="table.gradeId" clearable placeholder="请选择年级" size="small" @change="gradeChange">
                    <el-option v-for="item in table.gradeList"
                               :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :span="2" :offset="2" style="text-align: right">
                <el-button type="primary" size="small" @click='exportExcel'>导出</el-button>
            </el-col>
        </el-row>
        <!--列表-->
        <el-row class="my-margin-top-10" v-show='!form.isShow'>
            <el-table :data='table.tableData' border stripe style="width:100%" size="small"
            :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="id"></el-table-column>
                <el-table-column label='书名' prop="bookName"></el-table-column>
                <el-table-column label='作者' prop="author"></el-table-column>
                <el-table-column label='学号' prop="studentNo"></el-table-column>
                <el-table-column label='姓名' prop="studentName"></el-table-column>
                <el-table-column label='年级'>
                    <template slot-scope="scope">
                        <span v-if='scope.row.gradeId==1'>一年级</span>
                        <span v-if='scope.row.gradeId==2'>二年级</span>
                        <span v-if='scope.row.gradeId==3'>三年级</span>
                        <span v-if='scope.row.gradeId==4'>四年级</span>
                        <span v-if='scope.row.gradeId==5'>五年级</span>
                        <span v-if='scope.row.gradeId==6'>六年级</span>
                        <span v-if='scope.row.gradeId==7'>七年级</span>
                        <span v-if='scope.row.gradeId==8'>八年级</span>
                        <span v-if='scope.row.gradeId==9'>九年级</span>
                    </template>
                </el-table-column>
                <el-table-column label='班级' prop="classNum"></el-table-column>
                <el-table-column label='阅读状态'>
                    <template slot-scope="scope">
                        <span v-if='scope.row.readType==0'>未读</span>
                        <span v-if='scope.row.readType==1'>已读</span>
                        <span v-if='scope.row.readType==2'>在读</span>
                    </template>
                </el-table-column>
                <el-table-column label='阅读心得' prop="appraise"></el-table-column>
                <el-table-column label='发布时间' prop="createTime" width="150"></el-table-column>
                <el-table-column label='操作' min-width='200' fixed="right">
                    <template slot-scope='scope'>
                        <el-button type="text"  @click='toDel(scope.row)' :disabled="!auth.delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle"
                :current-page="table.currentPage" :page-size="table.pageSize"
                layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>
    </div>
</template>
<script>
    import gradeJS from '@/utils/grade.js'
export default {
    data(){
        return {
            //操作权限
            auth:{
                delete: false
            },
            form:{

            },
            table: {
                queryKey: "",
                gradeId: "",
                classNum: "",
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                //年级下拉选择
                gradeList: [],
            },
        }
    },
    methods: {

        //返回列表
        goBack(){
            this.form.isShow = false;
        },

        //分页条
        currentChangeHandle(currentPage){
            this.table.currentPage = currentPage;
            this.getTableData();
        },
        //清空输入框
        cleanKey() {
            this.table.currentPage = 1;
            this.table.queryKey = '';
            this.getTableData();
        },
        //清除班级
        clearClass() {
            this.table.classNum = '';
            this.table.currentPage = 1;
            this.getTableData();
        },
        //搜索
        queryTable(){
            this.table.currentPage = 1;
            this.getTableData();
        },
        //班级查询
        queryClass  () {
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
        //获取列表数据
        getTableData(){
            let p = {};
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            p.classNum = this.table.classNum;
            p.gradeId = this.table.gradeId;
            this.$http.fetch('/electronicAppraise/listQuery', p)
            .then(res => {
                this.table.tableData = res.data.rows;
                this.table.rowCount = res.data.total;
            })
        },
        //下拉选择
        gradeChange() {
            this.table.currentPage = 1;
            this.getTableData();
        },
        //获取年级下拉
        getGradeList() {
            this.table.gradeList = gradeJS.getGradeList();
        },
        //条件搜索
        queryKey(){
            this.table.currentPage = 1;
            this.getTableData();
        },
        //导出excel
        exportExcel(){
            let base = this.$myUrl.apiUrl();
            let url = base + '/electronicAppraise/exportExcel?'
                + 'key=' + this.table.queryKey
                + '&classNum=' + this.table.classNum
                + '&gradeId=' + this.table.gradeId
            window.open(url)
        },

        //删除用户
        toDel(row){
            this.$confirm("是否确定删除此条心得?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/electronicAppraise/delete';
                p.id = row.id;
                return this.$http.fetch(url,p)
            })
            .then(res=>{
                this.$notify({
                    message: res.sucMsg,
                    type: 'success'
                });
                this.getTableData();
            })
        },

        //获取权限
        getAuth(){
            let userMenus = JSON.parse(localStorage.getItem('userMenus'))
            if(userMenus['btn-electronicAppraise-delete']){
                this.auth.delete = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getTableData();
        this.getGradeList();
    }
}
</script>
<style scoped>

</style>
