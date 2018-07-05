<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--按钮+搜索-->   
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='4' v-show='!form.isShow'>
                <el-button type="primary" size="small" @click='addMember' :disabled="!auth.add">新增用户</el-button>
            </el-col>
            <el-col :span='4' v-show='form.isShow'>
                <el-button type="primary" size="small" @click='goBack'>返回列表</el-button>
            </el-col>
            <el-col :span='4' v-show='!form.isShow'>
                <el-input size="small" placeholder="请输入用户名" suffix-icon="el-icon-search" 
                :clearable='true' @clear="cleanTable"
                v-model="table.queryKey" @keyup.enter.native="queryTable"></el-input>
            </el-col>
        </el-row>

        <!--列表-->
        <el-row class="my-margin-top-10" v-show='!form.isShow'>
            <el-table :data='table.tableData' border stripe style="width:100%" size="small" 
            :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="memberId"></el-table-column>
                <el-table-column label='用户名' prop="username"></el-table-column>
                <el-table-column label='邮箱' prop="email"></el-table-column>
                <el-table-column label='创建时间' prop="createTime"></el-table-column>
                <el-table-column label='上次登录时间' prop="lastLoginTime"></el-table-column>
                <el-table-column label='角色' show-overflow-tooltip>
                    <template slot-scope='scope'>
                        <span v-for='(role,index) in scope.row.roleList' :key="role.roleId">
                            <span v-if='index==0'>{{role.roleName}}&nbsp;</span>
                            <span v-else-if='index==(scope.row.roleList.length-1)'>&nbsp;{{role.roleName}}</span>
                            <span v-else>&nbsp;{{role.roleName}}&nbsp;</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='是否可用' prop="usable">
                    <template slot-scope='scope'>
                        <span style="font-size:20px;">
                            <i v-if='scope.row.usable==1' class="el-icon-check"></i>
                            <i v-else class="el-icon-close"></i>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button v-if='scope.row.usable==1' type="text" @click="modifyMember(scope.row)" :disabled="!auth.modify">修改</el-button>
                        <el-button v-if='scope.row.usable==1' type="text" @click='disable(scope.row.memberId)' :disabled="!auth.disable">禁用</el-button>
                        <el-button v-if='scope.row.usable==0' type="text" @click='usable(scope.row.memberId)' :disabled="!auth.usable">启用</el-button>
                        <el-button v-if='scope.row.usable==0' type="text" @click='toDel(scope.row.memberId)' :disabled="!auth.delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle" 
                :current-page="table.currentPage" :page-size="table.pageSize" 
                layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>

        <!--表单-->
        <el-row class="my-margin-top-10" v-show='form.isShow'>
            <el-col :span='6'>
                <el-card>
                    <div slot='header'>
                        <span>{{form.title}}</span>
                    </div>
                    <el-form :model='form' :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-form-item label='用户名' prop="username">
                            <el-input :disabled='!form.isCreate' v-model="form.username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label='邮箱' prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                        <!--添加用户时需要密码和确认密码-->
                        <el-form-item label='密码' prop="password" v-if='form.isCreate'>
                            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label='确认密码' prop="rePassword" v-if='form.isCreate'>
                            <el-input type="password" v-model="form.rePassword" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="是否可用">
                            <el-switch v-model="form.usable"
                            active-text='可用' inactive-text='禁用'
                            :active-value='1' :inactive-value='0'></el-switch>
                        </el-form-item>
                        <el-form-item label="角色选择">
                            <el-select v-model="form.roleIdList" :multiple='true' placeholder="请选择角色" style="width:100%">
                                <el-option v-for='rItem in form.roles' :key='rItem.roleId'
                                :label="rItem.name" :value="rItem.roleId"></el-option>
                            </el-select>
                        </el-form-item> 

                        <el-form-item>
                            <el-button @click="submitForm('form')" type="primary" :disabled='form.submitDisabled'>保存</el-button>
                        </el-form-item>

                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){

        let validPass = (rules,value,callback) => {
            if(value==''){
                callback(new Error('请输入密码'));
            }else if(value.length<6 || value.length>12){
                callback(new Error('密码的长度为6-12位'))
            }else{
                callback();
            }
        }
        let validRePass = (rules,value,callback) => {
            if(value==''){
                callback(new Error('请输入确认密码'));
            }else if(value != this.form.password){
                callback(new Error('两次输入密码不一致'))
            }else{
                callback();
            }
        }

        return {
            //操作权限
            auth:{
                add: false,
                modify: false,
                disable: false,
                usable: false,
                delete: false
            },
            form: {
                isShow: false,
                isCreate: true,
                memberId: '',
                username: '',
                email: '',
                password: '',
                rePassword: '',
                usable: '',
                roleIdList: [],
                roles: [],
                submitDisabled: false,
                rules: {
                    username: [{ required: true, message: "用户名不能为空", trigger: "blur" },
                                {min:4, max:12, message: '用户名长度为4-12位'}],
                    password: [{required: true, validator: validPass, trigger: 'blur'}],
                    rePassword: [{required: true, validator: validRePass, trigger: 'blur'}],
                    email: [{ required: true, message: "邮箱不能为空", trigger: "blur"},
                            {type: 'email', message: '邮箱格式不正确'}],
                }
            },
            table: {
                tableData: [],
                queryKey: '',
                currentPage: 1,
                pageSize: 10,
                rowCount: 0
            },
        }
    },
    methods: {
        //新增用户
        addMember(){
            this.form.isShow = true;
            this.form.title = '创建用户';
            this.form.isCreate = true;
            this.form.memberId = '';
            this.form.username = '';
            this.form.email = '';
            this.form.password = '';
            this.form.rePassword = '';
            this.form.usable = 1;
            this.form.roleIdList = [];
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
        },
        //修改用户
        modifyMember(row){
            this.form.isShow = true;
            this.form.title = '修改用户'
            this.form.isCreate = false;
            this.form.memberId = row.memberId;
            this.form.username = row.username;
            this.form.email = row.email;
            this.form.usable = row.usable;
            let roleIdList = row.roleList.map(role=>{
                return role.roleId;
            })
            this.form.roleIdList = roleIdList;
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
        },
        //返回列表
        goBack(){
            this.form.isShow = false;
        },

        //分页条
        currentChangeHandle(currentPage){
            this.table.currentPage = currentPage;
            this.getTableData();
        },

        //清除搜索
        cleanTable(){
            this.table.currentPage = 1;
            this.table.queryKey = '';
            this.getTableData();
        },

        //搜索
        queryTable(){
            this.table.currentPage = 1;
            this.getTableData();
        },

        //获取列表数据
        getTableData(){
            let p = {};
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            this.$http.fetch('/member/listQuery', p)
            .then(res => {
                this.table.tableData = res.data.rows;
                this.table.rowCount = res.data.total;
            })
        },
        //获取所有的角色
        getAllRole(){
            let p = {};
            let url = '/role/listAll';
            this.$http.fetch(url,p)
            .then(res=>{
                this.form.roles = res.data;
            })
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.form.submitDisabled = true;
                    let p = {};
                    let url = '';
                    if(!this.form.isCreate){
                        url = '/member/modify'
                        p.memberId = this.form.memberId;
                    }else{
                        url = '/member/add'
                        p.username = this.form.username;
                        p.password = this.form.password;
                    }
                    p.email = this.form.email;
                    p.usable = this.form.usable;
                    p.roleIdList = this.form.roleIdList;
                    this.$http.fetch(url,p)
                    .then(res=>{
                        this.form.submitDisabled = false;
                        this.form.isShow = false;
                        this.getTableData();
                    })
                    .catch(err=>{
                        this.form.submitDisabled = false;
                    })
                }
            })
        },
        //禁用用户
        disable(memberId){
            this.$confirm("是否确定禁用该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/member/disable';
                p.memberId = memberId;
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
        //启用用户
        usable(memberId){
            this.$confirm("是否确定启用该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/member/usable';
                p.memberId = memberId;
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
        //删除用户
        toDel(memberId){
            this.$confirm("是否确定删除该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/member/delete';
                p.memberId = memberId;
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
            if(userMenus['btn-member-add']){
                this.auth.add = true;
            }
            if(userMenus['btn-member-modify']){
                this.auth.modify = true;
            }
            if(userMenus['btn-member-disable']){
                this.auth.disable = true;
            }
            if(userMenus['btn-member-usable']){
                this.auth.usable = true;
            }
            if(userMenus['btn-member-delete']){
                this.auth.delete = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getTableData();
        this.getAllRole();
    }
}
</script>
<style scoped>

</style>
