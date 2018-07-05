<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>课程信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--搜索栏-->
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span="3">
                <el-input size="small" placeholder="请输入课程名称" suffix-icon="el-icon-search" :clearable='true' @clear="cleanKey" v-model="table.queryKey"
                          @keyup.enter.native="queryKey"></el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model.number="table.gradeNum" clearable placeholder="请选择年级" size="small" @change="gradeChange">
                    <el-option v-for="item in table.gradeList"
                               :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>

        <!--表格-->
        <el-row class="my-margin-top-10">
            <el-table :data='table.tableData' border stripe style="width:100%"
                      size="small" :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="courseId"></el-table-column>
                <el-table-column label='名称' prop="name"></el-table-column>
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
                <el-table-column label='性别' prop="gender">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender==0">女</span>
                        <span v-if="scope.row.gender==1">男</span>
                        <span v-if="scope.row.gender==2">所有</span>
                    </template>
                </el-table-column>
                <el-table-column label='排序' prop="orderNum"></el-table-column>
                <el-table-column label='是否可用' prop="usable"></el-table-column>
                <el-table-column label='添加时间' prop="createTime"></el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' :total="table.rowCount"
                           @current-change="currentChangeHandle" :current-page="table.currentPage"
                           :page-size="table.pageSize" layout="total, prev, pager, next, jumper">
            </el-pagination>
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
                gradeList: []
            }
        };
    },
    methods: {
        //名称搜索
        queryKey() {
            this.table.currentPage = 1;
            this.getTableData();
        },
        //清除收索
        cleanKey() {
            this.table.currentPage = 1;
            this.getTableData();
        },
        //下拉选择
        gradeChange() {
            this.table.currentPage = 1;
            this.getTableData();
        },

        //获取年级下拉选择
        getGradeList() {
            this.table.gradeList = gradeJs.getGradeList();
        },
        //获取列表
        getTableData() {
            let p = {};
            let url = "/course/listQueryInfo";
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            p.gradeNum = this.table.gradeNum;
            this.$http.fetch(url, p).then(res => {
                this.table.tableData = res.data.rows;
                this.table.rowCount = res.data.total;
            });
        },
        //翻页
        currentChangeHandle(currentPage) {
            this.table.currentPage = currentPage;
            this.getTableData();
        }
    },
    mounted() {
        this.getGradeList();
        this.getTableData();
    }
};
</script>
