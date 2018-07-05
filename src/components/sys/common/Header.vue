<template>
    <div class="box">
        <div>
            <img src="../../../assets/images/logo.png"/>
        </div>
        <div class='header-right'>
            <div class="title">
                <span>{{sysInfo.title}}</span>
                <span class="title-span">{{sysInfo.school}}</span>
            </div>
            <div class="user">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link" style="cursor:pointer;">
                        <img class="user-logo" src="../../../assets/images/user.jpg"/>
                        <span class="user-logo-name">{{username}}</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!--修改密码框-->
        <el-dialog title="修改密码" :visible.sync="dialogVisible" width='25%'>
            <el-form :model="form" label-position='right' label-width='80px' size='small' ref='form' :rules="rules">
                <el-form-item label="旧密码" prop="oldPass">
                    <el-input type="password" v-model="form.oldPass" placeholder="输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="form.newPass" placeholder="输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePass">
                    <el-input type="password" v-model="form.rePass" placeholder="输入确认密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot='footer'>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="changePass">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import Http from "@/utils/ajax";
let timeOnline
export default {
    data(){
        let validateOldPass = (rules,value,callback) => {
            if(value==''){
                callback(new Error('请输入旧密码'));
            }else if(value.length<6){
                callback(new Error('密码最少6位数'));
            }else{
               callback()
            }
        };
        let validateNewPass = (rules,value,callback) => {
            if(value==''){
                callback(new Error('请输入新密码'));
            }else if(value.length<6){
                callback(new Error('密码最少6位数'));
            }else{
                if(this.form.rePass!=''){
                    this.$refs.form.validateField('rePass')
                }
                callback()
            }
        }
        let validateRepass = (rules,value,callback) => {
            if(value==''){
                callback(new Error('请输入新密码'));
            }else if(value != this.form.newPass){
                callback(new Error('两次输入密码不一致'));
            }else {
                callback()
            }
        }
        return {
            dialogVisible: false,
            form: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            rules: {
                oldPass: [{validator: validateOldPass, trigger: 'blur'}],
                newPass: [{validator: validateNewPass, trigger: 'blur'}],
                rePass: [{validator: validateRepass, trigger: 'blur'}],
            },
            sysInfo: {
                title: '',
                school: '',
            }
        }
    },
    computed:{
        username(){
            let username = localStorage.getItem('username')
            return username? username : '管理员';
        },
        deptName(){
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            let deptName = userInfo.deptFullName
            return deptName? deptName : ''
        }
    },
    methods: {
        handleCommand(command){
            if(command=='loginout'){
                //退出系统,清除本地缓存
                localStorage.removeItem('memberId')
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                this.$router.push('/tlogin');
            }else if(command='changPassword'){
                this.dialogVisible = true
                this.form.oldPass = ''
                this.form.newPass = ''
                this.form.rePass = ''
            }
        },
        changeSide(){
            bus.$emit('changeSide');
        },
        changePass(){
            this.$refs.form.validate(valid=>{
                if(valid){
                    let p = {};
                    p.oldPass = this.form.oldPass;
                    p.newPass = this.form.newPass;
                    let memberId = localStorage.getItem('memberId');
                    p.memberId = memberId;
                    let url = '/member/changePass'
                    Http.fetch(url, p)
                    .then(res => {
                        this.dialogVisible = false
                        this.$message({
                            showClose: true,
                            message: res.sucMsg,
                            type: 'success'
                        })
                    })
                    .catch(error=>{
                    })
                }
            })
        },

        //定时请求后台.
        online(){
            console.log('online')
            let p = {}
            let url = '/member/online'
            Http.fetch(url,p)
            .then(res=>{

            })
            .catch(err=>{
                console.log(err)
                this.$router.push('/login');
            })
        },
        times(){
            timeOnline = window.setInterval(()=>{
                this.online()
            },60000)
        },
        //设置系统参数
        setSysInfo(){
            let sysInfo = JSON.parse(localStorage.getItem('sysInfo'));
            this.sysInfo.title = sysInfo.title;
            this.sysInfo.school = sysInfo.school;
        },
    },
    mounted(){
        // this.times()
        this.setSysInfo();
    },
    destroyed(){
        window.clearInterval(timeOnline)
    }
}
</script>
<style scoped>
.box{
    display: flex;
    flex-direction: row;
}
.header-right{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}
.header-right .title{
    display: flex;
    font-size: 30px;
    padding-left: 20px;
    color:aliceblue;
    align-items: flex-end;
}

.title-span {
    font-size: 20px;
    color: 	#CCCCCC;
    margin-left: 20px;
}

.header-right .user{
    margin-right: 40px;

}

.header-right .user .user-logo-name{
    color:aliceblue;
    font-size: 20px;
}

.header-right .user .user-logo{
    border-radius: 50%;
    width: 40px;
    height: 40px;
}
</style>

