<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>学生管理</el-breadcrumb-item>
                <el-breadcrumb-item>学生信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--按钮+搜索-->
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='4' v-show='!form.isShow'>
                <el-button type="primary" size="small" @click='addStudent' :disabled="!auth.add">新增学生</el-button>
            </el-col>
            <el-col :span='4' v-show='form.isShow'>
                <el-button type="primary" size="small" @click='goBack'>返回列表</el-button>
            </el-col>
            <el-col :span='20' v-show='!form.isShow'>
                <el-row :gutter='10'>
                    <el-col :span='3'>
                        <el-select v-model.number="table.gradeNum" clearable placeholder="请选择年级" size='small' @change='gradeChange'>
                            <el-option v-for='item in table.gradeList' :key='item.value' :label='item.label' :value='item.value'></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3'>
                        <el-input size="small" placeholder="请输入班级数字" suffix-icon="el-icon-search" :clearable='true' @clear="clearClass" v-model="table.classNum"
                            @keyup.enter.native="queryClass"></el-input>
                    </el-col>
                    <el-col :span='4'>
                        <el-input size="small" placeholder="请输入姓名、昵称或学号" suffix-icon="el-icon-search" :clearable='true' @clear="cleanKey" v-model="table.queryKey"
                            @keyup.enter.native="queryKey"></el-input>
                    </el-col>
                    <el-col :span='2'>
                        <el-button type='primary' size='small' @click='exportExcel' :disabled="!auth.exportExcel">导出</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <!--列表-->
        <el-row class="my-margin-top-10" v-show='!form.isShow'>
            <el-table :data='table.tableData' border stripe style="width:100%" size="small" :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="studentId"></el-table-column>
                <el-table-column label='学号' prop="no" width="120"></el-table-column>
                <el-table-column label='姓名' prop="name" width="120"></el-table-column>
                <el-table-column label='昵称' prop="nickName" width="120"></el-table-column>
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
                        <span v-if='scope.row.gengradeNumder==9'>九年级</span>
                    </template>
                </el-table-column>
                <el-table-column label="班级" prop='classNum'></el-table-column>
                <el-table-column label='性别'>
                    <template slot-scope="scope">
                        <span v-if='scope.row.gender==1'>男</span>
                        <span v-if='scope.row.gender==0'>女</span>
                    </template>
                </el-table-column>
                <el-table-column label='年龄' prop="age"></el-table-column>
                <el-table-column label='生日' prop="birthday" width="120"></el-table-column>
                <el-table-column label='金币' prop="coin"></el-table-column>
                <el-table-column label='个性签名' prop="sign" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column label='创建时间' prop="createTime" width="140"></el-table-column>
                <el-table-column label='上次登录' prop="lastLoginTime" width="140"></el-table-column>
                <el-table-column label='操作' min-width='200' fixed="right">
                    <template slot-scope='scope'>
                        <el-button type="text" v-if='scope.row.usable==1' @click="modifyStudent(scope.row)" :disabled="!auth.modify">修改</el-button>
                        <el-button type="text" v-if='scope.row.usable==1' @click='resetPass(scope.row)' :disabled="!auth.resetPass">重置密码</el-button>
                        <el-button type="text" v-if='scope.row.usable==1' @click="disable(scope.row)" :disabled="!auth.disable">禁用</el-button>
                        <el-button type="text" v-if='scope.row.usable==0' @click="usable(scope.row)" :disabled="!auth.usable">启用</el-button>
                        <el-button type="text" v-if='scope.row.usable==0' @click='toDel(scope.row)' :disabled="!auth.delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle" :current-page="table.currentPage"
                :page-size="table.pageSize" layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>

        <el-row class="my-margin-top-10" :gutter="10" v-show='form.isShow'>
            <el-col :span='6'>
                <el-card>
                    <div slot='header'>
                        <span>{{form.title}}</span>
                    </div>
                    <el-form :model='form' :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-form-item label='学号' prop="no">
                            <el-input v-model="form.no" placeholder="请输入学号"></el-input>
                        </el-form-item>
                        <el-form-item label='姓名' prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label='密码' prop='password' v-if='form.isCreate'>
                            <el-input v-model='form.password' type="password" placeholder="默认密码为 123456"></el-input>
                        </el-form-item>

                        <el-form-item label="年级" prop="gradeNum">
                            <el-select v-model.number="form.gradeNum" placeholder="请选择年级" size='small' style="width:100%;">
                                <el-option v-for='item in table.gradeList' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='班级' prop='classNum'>
                            <el-input v-model.number='form.classNum' placeholder="请输入班级数字"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop='gender'>
                            <el-radio-group v-model="form.gender">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label='昵称'>
                            <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="个性签名">
                            <el-input v-model='form.sign' type="textarea" placeholder="请输入个性签名,不超过240个字" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                        </el-form-item>

                        <el-form-item label='出生日期'>
                            <el-date-picker v-model="form.birthday" type="date" placeholder="选择出生日期" style="width:100%;" :editable="false" value-format='yyyy-MM-dd'>
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-button @click="submitForm('form')" type="primary" :disabled='form.submitDisabled'>保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span='6' v-show='this.form.isCreate' :auto-upload="false">

                <el-card>
                    <div slot="header">
                        <span>批量导入</span>
                    </div>
                    <el-upload ref='upload' :action='upload.action' :headers='upload.header' :file-list="upload.fileList" :auto-upload="false"
                        :multiple='false' :limit="upload.limit" :on-exceed='onExceed' :before-upload="beforeUpload" :on-change='onUploadChange'
                        :on-preview='onPreview' :on-remove='onRemove' :on-success='onSuccess' :on-error='onError' :on-progress='onProgress'>
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="!auth.importExcel">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xlsx格式的excel文件</div>
                    </el-upload>
                        <br></br>
                        <el-button type='primary' size='small' @click='uploadExcelTemp' :disabled="!auth.uploadExcelTemp">下载模板</el-button>
                </el-card>
            </el-col>
        </el-row>

        <!--重置密码弹窗-->
        <el-dialog title='重置密码' :visible.sync='passDialog.dialog' width="25%">
            <el-form :model="passDialog" :rules='passDialog.rules' ref='passForm' size="small" label-width="80px" label-position="right">
                <el-form-item label='新密码' prop="newPass">
                    <el-input v-model="passDialog.newPass" placeholder="请输入新密码" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size='small' @click="passDialog.dialog = false">取 消</el-button>
                <el-button size='small' type="primary" @click="submitNewPass">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import gradeJS from '@/utils/grade.js'
    export default {
        data() {
            return {
                auth:{
                    add: false,
                    modify: false,
                    delete: false,
                    usable: false,
                    disable: false,
                    resetPass: false,
                    exportExcel: false,
                    importExcel: false,
                    uploadExcelTemp: false
                },
                form: {
                    isShow: false,
                    title: '',
                    studentId: '',
                    no: '',
                    name: '',
                    nickName: '',
                    gradeNum: '',
                    classNum: '',
                    gender: 1,
                    birthday: '',
                    password: '',
                    sign: '',
                    isCreate: true,
                    submitDisabled: false,
                    rules: {
                        no: [{
                            required: true,
                            message: "学号不能为空",
                            trigger: "blur"
                        }],
                        name: [{
                            required: true,
                            message: "姓名不能为空",
                            trigger: "blur"
                        }],
                        gradeNum: [{
                            required: true,
                            message: '必须选择年级',
                            trigger: 'blur,change',
                            type: "number"
                        }],
                        classNum: [{
                                required: true,
                                message: '必须输入班级',
                                trigger: 'blur'
                            },
                            {
                                type: 'number',
                                message: '班级必须是数字',
                                trigger: 'blur'
                            },
                        ]
                    }
                },
                table: {
                    tableData: [],
                    currentPage: 1,
                    pageSize: 10,
                    rowCount: 0,
                    queryKey: '',
                    gradeNum: '',
                    classNum: '',
                    //年级下拉选择
                    gradeList: [],
                },
                passDialog: {
                    dialog: false,
                    studentId: '',
                    newPass: '',
                    rules: {
                        newPass: [{
                            required: true,
                            message: "密码不能为空",
                            trigger: "blur"
                        }]
                    }
                },
                upload: {
                    action: '',
                    headers: {},
                    fileList: [],
                    limit: 1
                }
            }
        },
        methods: {

            //excel导出
            exportExcel() {
                let base = this.$myUrl.apiUrl();
                let url = base + '/student/exportExcel?gradeNum' + this.table.gradeNum + '&classNum=' + this.table.classNum +
                    '&key=' + this.table.queryKey;
                window.open(url)
            },
            //excel导入模板
            uploadExcelTemp() {
                console.log("导入模板++++");
                let base = this.$myUrl.apiUrl();
                let url = base + '/student/uploadExcelTemp'
                window.open(url)
            },
            //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            onUploadChange(file, fileList) {
                console.log('onUploadChange')
                // console.log("type",file.type)
                // console.log('file',file)
                // console.log('fileList',fileList)

                // let fileName = file.name;
                // let index1 = fileName.lastIndexOf(".");
                // let index2 = fileName.length;
                // let suffix = fileName.substring(index1+1,index2);
                // console.log(suffix)
            },

            //文件上传
            submitUpload() {
                console.log('submitUpload')
                this.$refs.upload.submit();
            },
            //文件上传之前的验证
            beforeUpload(file) {

                let fileName = file.name;
                let index1 = fileName.lastIndexOf(".");
                let index2 = fileName.length;
                let suffix = fileName.substring(index1 + 1, index2);
                if (suffix != 'xlsx') {
                    this.$notify({
                        message: '文件格式不正确',
                        type: 'error'
                    });
                    return false;
                }
                return true;
            },

            onPreview() {
                console.log('onPreview')
            },
            onRemove() {
                console.log('onRemove')
            },
            onSuccess(response, file, fileList) {
                console.log('onSuccess')
                console.log("response",response)
                console.log("file",file)
                console.log("fileList",fileList)
                if(response.code==0){
                    this.$notify({
                        message: '上传成功',
                        type: 'success'
                    });
                }else{
                    this.$notify({
                        message: response.errMsg,
                        type: 'error'
                    });
                }
                this.$refs.upload.clearFiles();
            },
            onError() {
                console.log('onError')
            },
            onProgress() {
                console.log('onProgress')
            },



            onExceed(files, fileList) {
                this.$notify({
                    message: '只能上传一个文件',
                    type: 'error'
                });
            },

            //禁用学生
            disable(row) {
                this.$confirm("是否确定禁用该学生?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        let p = {};
                        let url = '/student/disable';
                        p.studentId = row.studentId;
                        return this.$http.fetch(url, p)
                    })
                    .then(res => {
                        this.$notify({
                            message: res.sucMsg,
                            type: 'success'
                        });
                        this.getTableData();
                    })
            },

            //启用学生
            usable(row) {
                this.$confirm("是否确定启用该学生?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        let p = {};
                        let url = '/student/usable';
                        p.studentId = row.studentId;
                        return this.$http.fetch(url, p)
                    })
                    .then(res => {
                        this.$notify({
                            message: res.sucMsg,
                            type: 'success'
                        });
                        this.getTableData();
                    })
            },

            //删除学生
            toDel(row) {
                this.$confirm("是否确定删除该学生?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        let p = {};
                        let url = '/student/delete';
                        p.studentId = row.studentId;
                        return this.$http.fetch(url, p)
                    })
                    .then(res => {
                        this.$notify({
                            message: res.sucMsg,
                            type: 'success'
                        });
                        this.getTableData();
                    })
            },

            //修改密码
            resetPass(row) {
                this.passDialog.studentId = row.studentId;
                this.passDialog.newPass = '';
                this.passDialog.dialog = true;
                let form = this.$refs.passForm;
                if (form) {
                    form.clearValidate();
                }
            },

            //修改密码提交
            submitNewPass() {
                console.log(this.$refs.passForm)
                this.$refs.passForm.validate(valid => {
                    if (valid) {
                        let p = {};
                        let url = '/student/resetPass';
                        p.studentId = this.passDialog.studentId;
                        p.password = this.passDialog.newPass;
                        this.$http.fetch(url, p)
                            .then(res => {
                                this.$notify({
                                    message: res.sucMsg,
                                    type: 'success'
                                });
                                this.getTableData();
                                this.passDialog.dialog = false;
                            })
                    }
                });
            },

            //新增学生
            addStudent() {
                this.$refs['form'].clearValidate();
                this.form.isShow = true;
                this.form.title = '新增学生';
                this.form.studentId = '';
                this.form.no = '';
                this.form.name = '';
                this.form.nickName = '';
                this.form.gradeNum = '';
                this.form.classNum = '';
                this.form.gender = 1;
                this.form.birthday = '';
                this.form.password = '';
                this.form.sign = '';
                this.form.isCreate = true;
                this.form.submitDisabled = false;

                //excel 上传路径设置
                let base = this.$myUrl.apiUrl();
                let token = localStorage.token;
                this.upload.headers = {
                    "Authorization": token
                };
                this.upload.action = base + '/student/uploadExcel';

            },
            //修改学生
            modifyStudent(row) {
                this.$refs['form'].clearValidate();
                this.form.isShow = true;
                this.form.title = '修改学生';
                this.form.studentId = row.studentId;
                this.form.no = row.no;
                this.form.name = row.name;
                this.form.nickName = row.nickName;
                this.form.gradeNum = row.gradeNum;
                this.form.classNum = row.classNum;
                this.form.gender = row.gender;
                this.form.birthday = row.birthday;
                this.form.sign = row.sign;
                this.form.isCreate = false;
                this.form.submitDisabled = false;
            },

            //表单提交
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.form.submitDisabled = true;
                        let p = {};
                        let url = '/student/add';
                        if (!this.form.isCreate) {
                            p.studentId = this.form.studentId;
                            url = '/student/modify';
                        }
                        //新创建.提交密码
                        else {
                            if (this.form.password == '') {
                                p.password = '123456';
                            } else {
                                p.password = this.form.password;
                            }
                        }
                        p.no = this.form.no;
                        p.name = this.form.name;
                        p.nickName = this.form.nickName;
                        p.gradeNum = this.form.gradeNum;
                        p.classNum = this.form.classNum;
                        p.gender = this.form.gender;
                        p.birthday = this.form.birthday;
                        p.sign = this.form.sign;

                        this.$http.fetch(url, p)
                            .then(res => {
                                this.$notify({
                                    message: res.sucMsg,
                                    type: "success"
                                });
                                this.form.submitDisabled = false;
                                this.form.isShow = false;
                                this.getTableData();
                            })
                            .catch(err => {
                                this.form.submitDisabled = false;
                            })
                    }
                });
            },


            //返回列表
            goBack() {
                this.form.isShow = false;
                this.getTableData();
            },
            //选择年级
            gradeChange(value) {
                this.table.gradeNum = value;
                this.table.currentPage = 1;
                this.getTableData();
            },
            //清空年级下拉. 点击清空按钮的时候会触发[选择]事件.
            // clearGrade(){
            //     this.table.gradeNum = '';
            //     this.table.currentPage = 1;
            //     this.getTableData();
            // },
            //清除班级
            clearClass() {
                this.table.classNum = '';
                this.table.currentPage = 1;
                this.getTableData();
            },
            //班级查询
            queryClass() {
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
            //清空输入框
            cleanKey() {
                this.table.currentPage = 1;
                this.table.queryKey = '';
                this.getTableData();
            },
            //输入框查询
            queryKey() {
                this.table.currentPage = 1;
                this.getTableData();
            },

            //翻页
            currentChangeHandle(currentPage) {
                this.table.currentPage = currentPage;
                this.getTableData();
            },


            //查询列表
            getTableData() {
                let p = {};
                let url = '/student/listQuery';
                p.start = (this.table.currentPage - 1) * this.table.pageSize;
                p.num = this.table.pageSize;
                p.key = this.table.queryKey;
                p.classNum = this.table.classNum;
                p.gradeNum = this.table.gradeNum;
                this.$http.fetch(url, p)
                    .then(res => {
                        this.table.tableData = res.data.rows;
                        this.table.rowCount = res.data.total;
                    })
            },
            //获取年级下拉
            getGradeList() {
                this.table.gradeList = gradeJS.getGradeList();
            },
            getAuth(){
                let userMenus = JSON.parse(localStorage.getItem('userMenus'))
                if(userMenus['btn-student-add']){
                    this.auth.add = true;
                }
                if(userMenus['btn-student-modify']){
                    this.auth.modify = true;
                }
                if(userMenus['btn-student-delete']){
                    this.auth.delete = true;
                }
                if(userMenus['btn-student-disable']){
                    this.auth.disable = true;
                }
                if(userMenus['btn-student-usable']){
                    this.auth.usable = true;
                }
                if(userMenus['btn-student-resetPass']){
                    this.auth.resetPass = true;
                }
                if(userMenus['btn-student-exportExcel']){
                    this.auth.exportExcel = true;
                }
                if(userMenus['btn-student-importExcel']){
                    this.auth.importExcel = true;
                }
                if(userMenus['btn-student-uploadExcelTemp']){
                    this.auth.uploadExcelTemp = true;
                }
            }
        },
        mounted() {
            this.getAuth();
            this.getGradeList();
            this.getTableData();
        }
    }

</script>
