<template>
    <div class="my-padding-10">
        <!--面包屑-->
        <el-row class="my-margin-top-10">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <el-row class="my-margin-top-20" :gutter="10">
            <el-col :span='8'>
                <el-card>
                    <el-form :model='form' :rules='form.rules' ref='form' size='small' label-width="80px" label-position="right">
                        <el-form-item label='系统名称' prop="title">
                            <el-input v-model="form.title" placeholder="请输入系统名称"></el-input>
                        </el-form-item>
                        <el-form-item label='学校' prop="school">
                            <el-input v-model="form.school" placeholder="请输入学校"></el-input>
                        </el-form-item>
                        <el-form-item label='版权' prop="copyright">
                            <el-input v-model="form.copyright" placeholder="请输入版权"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="schoolType">
                            <el-radio-group v-model="form.schoolType">
                                <el-radio label="primary" border>小学</el-radio>
                                <el-radio label="middle" border>初中</el-radio>
                                <el-radio label="all" border>全部</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="submitForm('form')" type="primary" :disabled="!auth.infoSet">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            auth: {
                infoSet: false
            },
            form: {
                title: '',
                school: '',
                copyright: '',
                schoolType: '',
                rules: {
                    title: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
                    school: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
                    copyright: [{ required: true, message: '请输入版权信息', trigger: 'blur' }],
                    schoolType: [{ required: true, message: '请选择学校类型', trigger: 'blur' }],
                }
            }
        }
    },
    methods: {
        getInfo() {
            let info = JSON.parse(localStorage.getItem('sysInfo'));
            this.form.title = info.title;
            this.form.school = info.school;
            this.form.schoolType = info.schoolType;
            this.form.copyright = info.copyright;
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                let url = '/info/set';
                let p = {};
                p.title = this.form.title;
                p.school = this.form.school;
                p.copyright = this.form.copyright;
                p.schoolType = this.form.schoolType;
                this.$http.fetch(url,p)
                .then(res=>{
                    this.$notify({
                        message: res.sucMsg,
                        type: 'success'
                    });
                })
            })
        },
        //获取权限
        getAuth(){
            let userMenus = JSON.parse(localStorage.getItem('userMenus'))
            if(userMenus['btn-sysInfo-set']){
                this.auth.infoSet = true;
            }
        }
    },
    mounted(){
        this.getAuth();
        this.getInfo();
    }
  
}
</script>
<style scoped>

</style>
