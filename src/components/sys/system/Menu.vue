<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--按钮+搜索-->   
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='4' v-show='!form.isShow'>
                <el-button type="primary" size="small" @click='addMenu' :disabled="!auth.add">新增权限</el-button>
            </el-col>
            <el-col :span='4' v-show='form.isShow'>
                <el-button type="primary" size="small" @click='goBack'>返回列表</el-button>
            </el-col>
            <el-col :span='4' v-show='!form.isShow'>
                <el-input size="small" placeholder="请输入名称或者标识" suffix-icon="el-icon-search" 
                :clearable='true' @clear="cleanTable"
                v-model="table.queryKey" @keyup.enter.native="queryTable"></el-input>
            </el-col>
        </el-row>

        <!--树+表格-->
        <el-row class="my-margin-top-10" :gutter="10">
            <!--权限树-->
            <el-col :span='4'>
                <el-card>
                    <div slot='header'>
                        <span>权限树</span>
                    </div>
                    <div>
                        <el-tree :data='tree.treeData' :props="tree.defaultProps" @node-click="treeNodeClick"></el-tree>
                    </div>
                </el-card>
            </el-col>

            <!--表格-->
            <el-col :span='20' v-show="!form.isShow">
                <el-table :data='table.tableData' border stripe style="width:100%" size="small" :highlight-current-row="true" ref="multipleTable" v-loading="table.loading">
                    <el-table-column label='编号' prop="menuId" width="80"></el-table-column>
                    <el-table-column label='名称' prop="name"></el-table-column>
                    <el-table-column label='类型' prop="type" width="80">
                        <template slot-scope='scope'>
                            <el-tag v-if='scope.row.type==1' size="small">目录</el-tag>
                            <el-tag v-if='scope.row.type==2' type="warning" size="small">菜单</el-tag>
                            <el-tag v-if='scope.row.type==3' type="success" size="small">按钮</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label='标识' prop="tag" width="200" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='地址' prop="url" width="150" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='图标' prop="icon" width="80">
                        <template slot-scope='scope'>
                            <span v-if='scope.row.icon' style="font-size:20px;">
                                <i :class="scope.row.icon"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label='是否可用' prop="usable" width="80">
                        <template slot-scope='scope'>
                            <span style="font-size:20px;">
                                <i v-if='scope.row.usable==1' class="el-icon-check"></i>
                                <i v-else class="el-icon-close"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label='父权限' prop="pname"></el-table-column>
                    <el-table-column label='排序' prop="orderNum" width="60"></el-table-column>
                    <el-table-column label='创建时间' prop="createTime" width="140" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label='操作' fixed="right" width="150">
                        <template slot-scope='scope'>
                            <el-button v-if='scope.row.usable==1' type="text" @click="modifyMenu(scope.row)" :disabled="!auth.modify">修改</el-button>
                            <el-button v-if='scope.row.usable==1' type="text" @click='disable(scope.row.menuId)' :disabled="!auth.disable">禁用</el-button>
                            <el-button v-if='scope.row.usable==0' type="text" @click='usable(scope.row.menuId)' :disabled="!auth.usable">启用</el-button>
                            <el-button v-if='scope.row.usable==0' type="text" @click='toDel(scope.row.menuId)' :disabled="!auth.delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle" 
                :current-page="table.currentPage" :page-size="table.pageSize" 
                layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
            </el-col>
            <!--表单-->
            <el-col :span='8' v-show='form.isShow'>
                <el-card>
                    <div slot='header'>
                        <span>{{form.title}}</span>
                    </div>
                    <el-form :model='form' :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-form-item label='权限名称' prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label='权限标识' prop="tag">
                            <el-input v-model="form.tag" placeholder="请输入标识"></el-input>
                        </el-form-item>
                        <el-form-item label='权限类型' prop="type">
                            <el-select v-model.number="form.type" placeholder="请选择类型" style="width:100%">
                                <el-option v-for="item in form.typeItems" :key="item.typeId" :label="item.typeName" :value="item.typeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='页面url' prop="url">
                            <el-input v-model="form.url" placeholder="请输入url"></el-input>
                        </el-form-item>
                        <el-form-item label='权限图标' prop="icon">
                            <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
                        </el-form-item>
                        <el-form-item label='父权限' prop="pname">
                            <el-input :disabled="true" v-model="form.pname" placeholder="请在左侧选择父权限菜单"></el-input>
                        </el-form-item>
                        <el-form-item label='排序' prop="orderNum">
                            <el-input-number :min='1' :max='50' v-model="form.orderNum" @change='orderNumChange' style="width:100%"></el-input-number>
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
        return {
            //操作权限
            auth:{
                add: false,
                modify: false,
                disable: false,
                usable: false,
                delete: false
            },
            //表单
            form: {
                isShow: false,
                menuId: '',
                title: '',
                name: '',
                tag: '',
                type: '',
                url: '',
                icon: '',
                pid: '',
                pname: '',
                orderNum: '',
                loading: false,
                typeItems: [
                    {
                        typeId: 1,
                        typeName: "目录"
                    },
                    {
                        typeId: 2,
                        typeName: "菜单"
                    },
                    {
                        typeId: 3,
                        typeName: "按钮"
                    }
                ],
                isCreate: true,
                submitDisabled: false,
                rules: {
                    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
                    tag: [{ required: true, message: "标识不能为空", trigger: "blur" }],
                    type: [
                        {
                            required: true,
                            message: "请选择类型",
                            trigger: "change",
                            type: "number"
                        }
                    ]
                }
            },
            //树
            tree: {
                treeData: [],
                defaultProps: {
                    children: "children",
                    label: "name"
                },
            },
            //表格
            table: {
                queryKey: '',
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                tableData: []
            }
        }
    },
    methods:{

        //排序修改
        orderNumChange(val) {
            let num = parseInt(val);
            this.form.orderNum = num;
        },

        //添加权限
        addMenu(){
            this.form.title = '新增权限';
            this.form.name = '';
            this.form.tag = '';
            this.form.type = '';
            this.form.url = '';
            this.form.icon = '';
            this.form.pid = 0;
            this.form.pname = '';
            this.form.orderNum = '';
            this.form.isCreate = true;
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
            this.form.isShow = true;
        },
        //修改权限
        modifyMenu(row){
            this.form.menuId = row.menuId;
            this.form.title = '修改权限';
            this.form.name = row.name;
            this.form.tag = row.tag;
            this.form.type = row.type;
            this.form.url = row.url;
            this.form.icon = row.icon;
            this.form.pid = row.pid;
            this.form.pname = row.pname;
            this.form.orderNum = row.orderNum;
            this.form.isCreate = false;
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
            this.form.isShow = true;
        },
        //返回表格
        goBack(){
            this.form.isShow = false;
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

        //分页条
        currentChangeHandle(value){
            this.table.currentPage = value;
            this.getTableData();
        },

        //获取表格数据
        getTableData(){
            let p = {};
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;

            this.table.loading = true;
            this.$http.fetch('/menu/listQuery', p)
            .then(res => {
                this.table.tableData = res.data.rows;
                this.table.rowCount = res.data.total;
                this.table.loading = false;
            })
            .catch(err=>{
                this.table.loading = false;
            })
        },
        //权限树点击事件
        treeNodeClick(data) {
            this.form.pid = data.menuId
            this.form.pname = data.name
        },
        //生成树结构
        createTree(data, pid) {
            pid = pid || 0;
            let list = [];
            data.map(item => {
                if (item.pid == pid) {
                    item.children = this.createTree(data, item.menuId);
                    list.push(item);
                }
            });
            return list;
        },
        //从后台获取权限树的数据
        getTreeData() {
            let p = {};
            this.$http.fetch('/menu/listAllUsable', p)
                .then(res => {
                    let tdata = this.createTree(res.data, 0);
                    this.tree.treeData = tdata;
                })
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //禁用按钮
                    this.form.submitDisabled = true;
                    let p = {};
                    let url = '/menu/add'
                    if(!this.form.isCreate){
                        url = '/menu/modify'
                        p.menuId = this.form.menuId;
                    }
                    p.name = this.form.name;
                    p.tag = this.form.tag;
                    p.url = this.form.url;
                    p.pid = this.form.pid;
                    p.orderNum = this.form.orderNum;
                    p.icon = this.form.icon;
                    p.type = this.form.type;
                    this.$http.fetch(url,p)
                    .then(res=>{
                        this.$notify({
                                message: res.sucMsg,
                                type: "success"
                            });
                        this.form.submitDisabled = false;
                        this.form.isShow = false;
                        this.getTreeData();
                        this.getTableData();
                    })
                    .catch(err=>{
                        this.form.submitDisabled = false;
                    })
                }
            })
        },
        //禁用权限
        disable(menuId){
            this.$confirm("是否确定禁用该权限?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/menu/disable';
                p.menuId = menuId;
                return this.$http.fetch(url, p);
            })
            .then(res=>{
                this.$notify({
                    message: res.sucMsg,
                    type: 'success'
                });
                this.getTreeData();
                this.getTableData();
            })
        },

        //启用权限
        usable(menuId){
            this.$confirm("是否确定启用该权限?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/menu/usable';
                p.menuId = menuId;
                return this.$http.fetch(url, p);
            })
            .then(res=>{
                this.$notify({
                    message: res.sucMsg,
                    type: 'success'
                });
                this.getTreeData();
                this.getTableData();
            })
        },
        //删除权限
        toDel(menuId){
            this.$confirm("是否确定删除该权限?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/menu/delete';
                p.menuId = menuId;
                return this.$http.fetch(url, p);
            })
            .then(res=>{
                this.$notify({
                    message: res.sucMsg,
                    type: 'success'
                });
                this.getTreeData();
                this.getTableData();
            })
        },
        //获取权限
        getAuth(){
            let userMenus = JSON.parse(localStorage.getItem('userMenus'))
            if(userMenus['btn-menu-add']){
                this.auth.add = true;
            }
            if(userMenus['btn-menu-modify']){
                this.auth.modify = true;
            }
            if(userMenus['btn-menu-disable']){
                this.auth.disable = true;
            }
            if(userMenus['btn-menu-usable']){
                this.auth.usable = true;
            }
            if(userMenus['btn-menu-delete']){
                this.auth.delete = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getTreeData();
        this.getTableData();
    }
}
</script>
<style scoped>

</style>
