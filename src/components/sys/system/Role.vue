<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!--按钮+搜索-->   
        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='4' v-show='!form.isShow'>
                <el-button type="primary" size="small" @click='addRole' :disabled="!auth.add">新增角色</el-button>
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

        <!--列表-->
        <el-row class="my-margin-top-10" v-show='!form.isShow'>
            <el-table :data='table.tableData' border stripe style="width:100%" size="small" :highlight-current-row="true" ref="multipleTable">
                <el-table-column label='编号' prop="roleId"></el-table-column>
                <el-table-column label='名称' prop="name"></el-table-column>
                <el-table-column label='标识' prop="tag"></el-table-column>
                <el-table-column label='描述' prop="description"></el-table-column>
                <el-table-column label='创建时间' prop="createTime"></el-table-column>
                <el-table-column label='操作' min-width='150'>
                    <template slot-scope='scope'>
                        <el-button type="text" @click="modifyRole(scope.row)" :disabled="!auth.modify">修改</el-button>
                        <el-button type="text" @click='toDel(scope.row.roleId)' :disabled="!auth.delete">删除</el-button>
                        <el-button type="text" @click='getMenu(scope.row.roleId)' :disabled="!auth.lookMenu">权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class='my-margin-top-10 my-el-pagination' @current-change="currentChangeHandle" 
                :current-page="table.currentPage" :page-size="table.pageSize" 
                layout="total, prev, pager, next, jumper" :total="table.rowCount"></el-pagination>
        </el-row>

        <!--表单-->
        <el-row class="my-margin-top-10" :gutter="10" v-show='form.isShow'>
            <el-col :span='6'>
                <el-card>
                    <div slot='header'>
                        <span>{{form.title}}</span>
                    </div>
                    <el-form :model='form' :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-form-item label='角色名称' prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label='角色标识' prop="tag">
                            <el-input v-model="form.tag" placeholder="请输入标识"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="description">
                            <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入标识"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="submitForm('form')" type="primary" :disabled='form.submitDisabled'>保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>

        <!--权限弹窗-->
        <el-dialog title="角色权限" :visible.sync="tree.dialog" width='25%'>
            <div>
                <el-tree ref='menuTree' node-key="menuId" show-checkbox 
                :data='tree.treeData' :props="tree.defaultProps"
                :default-checked-keys='tree.checkKeys'
                :check-strictly='true'>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size='small' @click="tree.dialog = false">取 消</el-button>
                <el-button size='small' type="primary" @click="saveMenus" :disabled='!auth.setMenu'>确 定</el-button>
            </div>
        </el-dialog>
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
                lookMenu: false,
                setMenu: false,
                delete: false
            },
            form: {
                isShow: false,
                roleId: '',
                name: '',
                tag: '',
                description: '',
                isCreate: true,
                submitDisabled: false,
                title: '',
                rules: {
                    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
                    tag: [{ required: true, message: "标识不能为空", trigger: "blur" }],
                    description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
                }
            },
            table: {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                rowCount: 0,
                queryKey: '',
                
            },
            tree: {
                treeData: [],
                defaultProps: {
                    children: "children",
                    label: "name"
                },
                roleId: '',
                dialog: false,
                checkKeys: []
            }
        }
    },
    methods: {
        //添加角色
        addRole(){
            this.form.title = '新增角色';
            this.form.name = '';
            this.form.tag = '';
            this.form.description = '';
            this.form.isCreate = true;
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
            this.form.isShow = true;
        },
        //修改角色
        modifyRole(row){
            this.form.title = '修改角色';
            this.form.roleId = row.roleId;
            this.form.name = row.name;
            this.form.tag = row.tag;
            this.form.description = row.description;
            this.form.isCreate = false;
            this.form.submitDisabled = false;
            this.$refs['form'].clearValidate();
            this.form.isShow = true;
        },
        //删除角色
        toDel(roleId){
            this.$confirm("是否确定删除该角色?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(()=>{
                let p = {};
                let url = '/role/delete';
                p.roleId = roleId;
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
        //返回列表
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
        //获取列表
        getTableData(){
            let p = {};
            let url = '/role/listQuery'
            p.start = (this.table.currentPage - 1) * this.table.pageSize;
            p.num = this.table.pageSize;
            p.key = this.table.queryKey;
            this.$http.fetch(url,p)
            .then(res=>{
                this.table.tableData = res.data.rows;
                this.table.rowCount = res.data.total;
            })
        },
        //提交表单
        submitForm(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    //禁用按钮
                    this.form.submitDisabled = true;
                    let p = {};
                    let url = '/role/add'
                    if(!this.form.isCreate){
                        url = '/role/modify'
                        p.roleId = this.form.roleId;
                    }
                    p.name = this.form.name;
                    p.tag = this.form.tag;
                    p.description = this.form.description;
                    this.$http.fetch(url,p)
                    .then(res=>{
                        this.$notify({
                                message: res.sucMsg,
                                type: "success"
                            });
                        this.form.submitDisabled = false;
                        this.form.isShow = false;
                        this.getTableData();
                    })
                    .catch(err=>{
                        this.form.submitDisabled = false;
                    })
                }
            });
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

        //分页条
        currentChangeHandle(currentPage){
            this.table.currentPage = currentPage;
            this.getTableData();
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

        //打开权限树弹窗,获取角色的权限
        getMenu(roleId){
            this.tree.roleId = roleId;

            let p = {};
            p.roleId = roleId;
            let url = '/menu/listByRoleId';
            this.$http.fetch(url,p)
            .then(res=>{
                let menuIdList = res.data.map(menu=>{
                    return menu.menuId;
                })
                this.tree.checkKeys = [];
                //第一是 undefined,设置默认选中项
                if(!this.$refs.menuTree){
                    this.tree.checkKeys = menuIdList;
                }
                //后面显示树的时候,就通过 setCheckedKeys 去设置选中项
                else{
                    this.$refs.menuTree.setCheckedKeys(menuIdList)
                }
                this.tree.dialog = true;
            })
        },
        //保存权限
        saveMenus(){
            let p = {};
            p.roleId = this.tree.roleId;
            let keys = this.$refs['menuTree'].getCheckedKeys();
            p.menuIdList = keys
            this.$http.fetch('/role/setMenu',p)
            .then(res=>{
                this.tree.dialog = false;
                this.tree.checkKeys = [];
                this.getTableData();
            })
        },
        //获取权限
        getAuth(){
            let userMenus = JSON.parse(localStorage.getItem('userMenus'))
            if(userMenus['btn-role-add']){
                this.auth.add = true;
            }
            if(userMenus['btn-role-modify']){
                this.auth.modify = true;
            }
            if(userMenus['btn-role-lookMenu']){
                this.auth.lookMenu = true;
            }
            if(userMenus['btn-role-setMenu']){
                this.auth.setMenu = true;
            }
            if(userMenus['btn-role-delete']){
                this.auth.delete = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getTableData();
        this.getTreeData();
        
    }
}
</script>
<style scoped>

</style>
