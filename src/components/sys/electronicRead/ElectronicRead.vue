<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>成长档案</el-breadcrumb-item>
                <el-breadcrumb-item>图书管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--按钮+搜索-->
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='4' v-show='!form.isShow'>
                <el-button type="primary" size="small" @click='addBook' :disabled="!auth.add">新增图书</el-button>
            </el-col>
            <el-col :span='4' v-show='form.isShow'>
                <el-button type="primary" size="small" @click='goBack'>返回列表</el-button>
            </el-col>
            <el-col :span='4' v-show='!form.isShow'>
                <el-input size="small" placeholder="请输入书名" suffix-icon="el-icon-search"
                :clearable='true' @clear="cleanTable"
                v-model="table.queryKey" @keyup.enter.native="queryTable"></el-input>
            </el-col>
        </el-row>

        <!--列表-->
        <el-row class="my-margin-top-10" v-show='!form.isShow'>
            <el-table :data='table.tableData' border stripe style="width:100%" size="small"
            :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="id"  width="50"></el-table-column>
                <el-table-column label='书名' prop="bookName"></el-table-column>
                <el-table-column label='作者' prop="author"></el-table-column>
                <el-table-column label='出版社' prop="publish"></el-table-column>
                <el-table-column label='封面图片' prop="cover" width="80">
                    <template slot-scope="scope">
                        <img :src='scope.row.cover' alt="" style="height: 50px"/>
                    </template>
                </el-table-column>
                <el-table-column label='价格' prop="price"  width="50"></el-table-column>
                <el-table-column label='介绍' width="650" prop="introduce"></el-table-column>
                <el-table-column label='适用年级'  width="80">
                    <template slot-scope="scope">
                        <span v-if='scope.row.useGrade==1'>一年级</span>
                        <span v-if='scope.row.useGrade==2'>二年级</span>
                        <span v-if='scope.row.useGrade==3'>三年级</span>
                        <span v-if='scope.row.useGrade==4'>四年级</span>
                        <span v-if='scope.row.useGrade==5'>五年级</span>
                        <span v-if='scope.row.useGrade==6'>六年级</span>
                        <span v-if='scope.row.useGrade==7'>七年级</span>
                        <span v-if='scope.row.useGrade==8'>八年级</span>
                        <span v-if='scope.row.useGrade==9'>九年级</span>
                    </template>
                </el-table-column>
                <el-table-column label='课程进度' prop="courseId"  width="80"></el-table-column>
                <el-table-column label='操作' min-width='200' fixed="right">
                    <template slot-scope='scope'>
                        <el-button type="text"  @click="modifyBook(scope.row)" :disabled="!auth.modify">修改</el-button>
                        <el-button type="text"  @click='toDel(scope.row)' :disabled="!auth.delete">删除</el-button>
                        <el-button type="text"  @click='lookEvent(scope.row.id)' :disabled="!auth.detail">阅读心得</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle"
                :current-page="table.currentPage" :page-size="table.pageSize"
                layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>

        <!--表单-->
        <el-row class="my-margin-top-10" v-show='form.isShow'>
            <el-col :span='12'>
                <el-card>
                    <div slot='header'>
                        <span>{{form.title}}</span>
                    </div>
                    <el-form :model='form'  :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-col :span="10">
                        <el-form-item label='书名' prop="bookName">
                            <el-input v-model="form.bookName" placeholder="请输入书名"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label='作者' prop="author">
                            <el-input v-model="form.author" placeholder="请输入作者"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label='出版社' prop="publish">
                            <el-input v-model="form.publish" placeholder="请输入出版社"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label='价格' prop="price">
                            <el-input v-model.number="form.price" placeholder="请输入价格"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="20">
                        <el-form-item label='介绍' prop="introduce">
                            <el-input v-model="form.introduce" type="textarea" placeholder="请输入介绍,不超过240个字" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label="适用年级" prop="useGrade">
                            <el-select v-model.number="form.useGrade" placeholder="请选择年级" size='small' style="width:100%;">
                                <el-option v-for='item in table.gradeList' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label='课程进度' prop="publish">
                            <el-input v-model.number="form.courseId" placeholder="请输入课程数字"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="10">
                        <el-form-item label="封面上传" >
                            <el-upload
                                class="upload-demo"
                                ref="upload"
                                :action="upload.action"
                                :headers='upload.header'
                                :limit="upload.limit"
                                :multiple='false'
                                :on-error='onError'
                                :on-success='onSuccess'
                                :on-progress='onProgress'
                                :on-change='onUploadChange'
                                :before-upload="beforeUpload"
                                :on-preview="onPreview"
                                :data="upload.ondate"
                                :on-remove="onRemove"
                                :file-list="upload.fileList"
                                list-type="picture"
                                >
                                <el-button size="small"  type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        </el-col>
                        <el-col :span="20">
                        <el-form-item>
                            <el-button @click="submitForm('form')" type="primary" :disabled='form.submitDisabled'>保存</el-button>
                        </el-form-item>
                        </el-col>
                    </el-form>
                </el-card>

            </el-col>
        </el-row>
        <!--书评弹窗-->
        <el-dialog title='书评列表'
         :visible.sync='eventDialog.dialog'
          width='1300px'>
            <el-table :data='eventDialog.tableData'
                      border stripe style='width:100%' size="small"
                      :highlight-current-row="true" ref="eventDialogTable">
                <el-table-column label='书名' prop="bookName"></el-table-column>
                <el-table-column label='作者' prop="author"></el-table-column>
                <el-table-column label='学号' prop="studentNo"></el-table-column>
                <el-table-column label='姓名' prop="studentName" width="50"></el-table-column>
                <el-table-column label='年级'  width="65">
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
                <el-table-column label='班级' prop="classNum"  width="50"></el-table-column>
                <el-table-column label='阅读状态' width="60">
                    <template slot-scope="scope">
                        <span v-if='scope.row.readType==0'>未读</span>
                        <span v-if='scope.row.readType==1'>已读</span>
                        <span v-if='scope.row.readType==2'>在读</span>
                    </template>
                </el-table-column>
                <el-table-column label='阅读心得' prop="appraise" width="550"></el-table-column>
                <el-table-column label='评论时间' prop="createTime"  width="150"></el-table-column>
            </el-table>
            <el-pagination class='bone-top-10 my-el-pagination'
                           @current-change="handleEventDialogChange"
                           :current-page="eventDialog.currentPage"
                           :page-size="eventDialog.pageSize"
                           :total="eventDialog.rowCount"
                           layout="total, prev, pager, next, jumper">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
    import gradeJS from '@/utils/grade.js'
export default {
    data(){


        return {
            //操作权限
            auth:{
                usable: false,
                add: false,
                modify: false,
                delete: false,
                uploadImg: false,
                detail: false,
                disable: false
            },
            form: {
                isShow: false,
                isCreate: true,
                id: '',
                bookName: '',
                author: '',
                publish: '',
                cover: '',
                price: '',
                introduce: '',
                useGrade: '',
                courseId: '',
                submitDisabled: false,
                rules: {
                    bookName: [{
                        required: true,
                        message: "书名不能为空",
                        trigger: "blur"
                    }],
                    author: [{
                        required: true,
                        message: "作者不能为空",
                        trigger: "blur"
                    }],
                    publish: [{
                        required: true,
                        message: "出版社不能为空",
                        trigger: "blur"
                    }],
                    price: [{
                        required: true,
                        message: "价格不能为空",
                        trigger: "blur"
                    }],
                    introduce: [{
                        required: true,
                        message: "介绍不能为空",
                        trigger: "blur"
                    }],
                    useGrade: [{
                        required: true,
                        message: '必须选择年级',
                        trigger: 'blur,change',
                        type: "number"
                    }],
                    courseId: [{
                        required: true,
                        message: "课程进度不能为空",
                        trigger: "blur",
                    },
                        {
                            type: 'number',
                            message: '课程进度必须为数字',
                            trigger: 'blur'
                        },],
                }
            },
            table: {

                tableData: [],
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                queryKey: '',
                //年级下拉选择
                gradeList: [],
            },
            upload: {
                action: '',
                headers: {},
                fileList: [],
                limit: 1
            },
            eventDialog: {
                dialog: false,
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                bookId: ''
            },
        }
    },
    methods: {
        //新增用户
        addBook(){
            this.form.isShow = true;
            this.form.title = '创建书籍';
            this.form.isCreate = true;
            this.form.bookName = '';
            this.form.author = '';
            this.form.publish = '';
            this.form.cover = '';
            this.form.price = '';
            this.form.introduce = '';
            this.upload.fileList = [];
            this.form.useGrade = '';
            this.form.courseId = '';
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();

            //图片上传路径设置

            let token = localStorage.token;
            this.upload.headers = {
                "Authorization": token
            };
            this.upload.ondate = {
                "type":"book"
            }
        },
        //修改用户
        modifyBook(row){
            this.form.isShow = true;
            this.form.title = '修改书籍'
            this.form.isCreate = false;
            this.form.id = row.id;
            this.form.bookName = row.bookName;
            this.form.author = row.author;
            this.form.publish = row.publish;
            this.form.cover = row.cover;
            this.form.price = row.price;
            this.form.introduce = row.introduce;
            this.form.useGrade = row.useGrade;
            this.form.courseId = row.courseId;
            this.upload.fileList = [{url:row.cover}];
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.form.submitDisabled = true;
                    let p = {};
                    let url = '';
                    if(!this.form.isCreate){
                        url = '/electronicRead/modify'
                        p.id = this.form.id;
                    }else{
                        url = '/electronicRead/add'
                    }
                    p.bookName = this.form.bookName;
                    p.author = this.form.author;
                    p.introduce = this.form.introduce;
                    p.cover = this.form.cover;
                    p.courseId = this.form.courseId;
                    p.useGrade = this.form.useGrade;
                    p.publish = this.form.publish;
                    p.price = this.form.price;
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
        //点击查看书评
        lookEvent(id){
            this.eventDialog.bookId = id
            this.getEventTableData()
            this.eventDialog.dialog = true
        },
        //书评弹窗获取表格数据
        getEventTableData(){
            let p = {}
            let url = '/electronicAppraise/detail'
            p.start = (this.eventDialog.currentPage - 1) * this.eventDialog.pageSize;
            p.num = this.eventDialog.pageSize;
            p.bookId = this.eventDialog.bookId
            this.$http.fetch(url,p)
                .then(res=>{
                    this.eventDialog.tableData = res.data.rows;
                    this.eventDialog.rowCount = res.data.total;
                })
        },
        //书评弹窗表格翻页
        handleEventDialogChange(val){
            this.eventDialog.currentPage = val
            this.getEventTableData()
        },
        //获取列表数据
        getTableData(){
            let p = {};
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            this.$http.fetch('/electronicRead/listQuery', p)
            .then(res => {

                let data = res.data.rows;
                data.map(d => {
                    if(d.cover.substring(0,4)!='http'){
                        let cover = this.$myUrl.baseUrl() + d.cover;
                        d.cover = cover;
                    }
                })
                // this.table.tableData = res.data.rows;

                this.table.tableData = data;
                this.table.rowCount = res.data.total;
            })
        },
        //获取8000端口
        getImgUrl(){
            let base = this.$myUrl.uploadUrl();
            this.upload.action = base;
        },
        //获取年级下拉
        getGradeList() {
            this.table.gradeList = gradeJS.getGradeList();
        },
        onUploadChange(file, fileList) {
            console.log('onUploadChange')
            // console.log('file',file)
            // console.log('fileList',fileList)

            // let fileName = file.name;
            // let index1 = fileName.lastIndexOf(".");
            // let index2 = fileName.length;
            // let suffix = fileName.substring(index1+1,index2);
            // console.log(suffix)
        },

        //封面上传
        submitUpload() {
            console.log('submitUpload')
            this.$refs.upload.submit();
        },
        onRemove() {
            console.log('onRemove')
        },
        onPreview() {
            console.log('onPreview')
        },
        onSuccess(response, file, fileList) {
            console.log('onSuccess')
            console.log("response",response)
            console.log("file",file)
            console.log("fileList",fileList)
            let a = response.data;
            let b = "";
            a.map(d => {
               b =  d.urlList[0];
            })
            this.upload.fileList = fileList;
            this.form.cover = b;
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
        beforeUpload(file) {
            let fileName = file.name;
            let index1 = fileName.lastIndexOf(".");
            let index2 = fileName.length;
            let suffix = fileName.substring(index1 + 1, index2);
            if (suffix!="jpg"&&suffix!="png") {
                this.$notify({
                    message: '文件格式不正确',
                    type: 'error'
                });
                return false;
            }
            return true;
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
        //事件弹窗获取表格数据
        getEventTableData(){
            let p = {}
            let url = '/electronicAppraise/detail'
            p.start = (this.eventDialog.currentPage - 1) * this.eventDialog.pageSize;
            p.num = this.eventDialog.pageSize;
            p.bookId = this.eventDialog.bookId
            this.$http.fetch(url,p)
                .then(res=>{
                    this.eventDialog.tableData = res.data.rows;
                    this.eventDialog.rowCount = res.data.total;
                })
        },
        //弹窗表格翻页
        handleEventDialogChange(val){
            this.eventDialog.currentPage = val
            this.getEventTableData()
        },
        //删除用户
        toDel(row){
            this.$confirm("是否确定删除该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/electronicRead/delete';
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
        //书本心得

        //获取权限
        getAuth(){
            let userMenus = JSON.parse(localStorage.getItem('userMenus'))
            if(userMenus['btn-electronicRead-add']){
                this.auth.add = true;
            }
            if(userMenus['btn-electronicRead-modify']){
                this.auth.modify = true;
            }
            if(userMenus['btn-electronicRead-uploadImg']){
                this.auth.uploadImg = true;
            }
            if(userMenus['btn-electronicRead-delete']){
                this.auth.delete = true;
            }
            if(userMenus['btn-electronicRead-detail']){
                this.auth.detail = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getTableData();
        this.getGradeList();
        this.getImgUrl();
    }
}
</script>
<style scoped>

</style>
