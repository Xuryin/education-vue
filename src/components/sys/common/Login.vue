<template>
    <div>
        <el-row type="flex" justify="center">
			<el-col :span="6">
				<div class="title">
                    心理健康教育智能辅导系统
                </div>
			</el-col>
		</el-row>
		<el-row type="flex" justify="center">
			<el-col :xs="10" :sm="8" :md="6" :lg="5" :xl="4">
				<div>
					<div>
						<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
							<el-form-item prop="username">
								<el-input v-model="ruleForm.username" placeholder="用户名">

								</el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">

								</el-input>
							</el-form-item>
							<div class="login-btn">
								<el-button type="primary" @click="submitForm('ruleForm')">
									登录
								</el-button>
							</div>
						</el-form>
					</div>

				</div>
			</el-col>
		</el-row>
    </div>
</template>
<script>
export default {
    data: function() {
		return {
			ruleForm: {
				username: '',
				password: ''
			},
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			}
		}
	},
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    let p = {}
                    let url = '/member/login'
                    p.username = this.ruleForm.username;
                    p.password = this.ruleForm.password;
                    this.$http.fetch(url,p)
                    .then(res=>{
                        this.$notify({
                            message: '登录成功',
                            type: 'success'
                        });
                        localStorage.setItem('token',res.data.token);
                        localStorage.setItem('memberId',res.data.memberId);
                        localStorage.setItem('username',res.data.username);
						this.$router.push('/system');
						this.getSysInfo();
                    }).catch(err=>{

                    })
                }
            });
        },
        getSysInfo(){
            let p = {};
            let url = '/info/get';
            this.$http.fetch(url,p)
            .then(res=>{
                localStorage.setItem('sysInfo',JSON.stringify(res.data));
            })
		},
		init(){
			//清除本地缓存
			localStorage.removeItem('memberId')
			localStorage.removeItem('token')
			localStorage.removeItem('username')
		}
    },
    mounted(){
		this.init();
    }
};
</script>
<style scoped>
.title {
	text-align: center;
	font-size: 35px;
	margin-top: 250px;
	margin-bottom: 20px;
	white-space:nowrap;
}

.login-btn button {
	width: 100%;
}
</style>
