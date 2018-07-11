<template>
    <div class="this_page">
        <video id="vid" crossorigin="*" :src="src" muted="muted"
               :width="videoWidth" height="100%" class="login_video"
               v-show="!showLogin">
        </video>
        <div class="login_page" @keyup.enter="login" v-show="showLogin">
            <div class="login_title">
                <span>心灵广雅</span>
            </div>
            <div class="login_form">
                <label for="num">
                    <img src="~static/imgs/login_user.png" alt="">
                    <input v-model="no" placeholder="学号" id="num"/>
                </label>
                <label for="pwd">
                    <img src="~static/imgs/login_lock.png" alt="">
                    <input v-model="password" placeholder="密码" type="password" id="pwd"/>
                </label>
                <button @click="login" id="loginButton">登录</button>
                <span class="teacher_login" @click="$router.push('/tlogin')">教师端登陆</span>
            </div>
        </div>
        <span class="copyright">Copyright  2018 广雅传媒（武汉）有限公司</span>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                no: '',
                password: '',
                video: document.getElementById('vid'),
                showLogin: false,
                videoWidth: '',
                src: '../../../../static/loginVideo.webm',
                showPage: false,
                state: null
            }
        },
        methods: {
            login() {
                let p = {};
                let url = '/student/login';
                p.no = this.no;
                p.password = this.password;
                this.$httpWeb.fetch(url, p)
                    .then(res => {
                        localStorage.studentToken = res.data.token;
                        localStorage.studentInfo = JSON.stringify(res.data);
                        this.$router.push('/web');
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            //清除本地缓存
            init() {
                localStorage.removeItem('studentToken')
                localStorage.removeItem('studentInfo')
            }
        },
        mounted() {
            let _this = this
            this.video = document.getElementById('vid')
            this.video.oncanplaythrough = function () {
                console.log(123)
                _this.video.play()
                _this.video.onclick = function () {
                    _this.video.muted = false
                }
            }
            this.state = _this.video.readyState
            this.video.onended = function () {
                _this.showLogin = true
                _this.$nextTick(function () {
                    document.getElementById('loginButton').focus()
                })
            }
        },
        created() {
            this.videoWidth = document.body.clientWidth
            this.src = '../../../../static/loginVideo.webm'
        },
        watch: {
            state(newVal, oldVal) {
                console.log(newVal)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "~static/less/reset.less";

    input {
        display: block;
        height: 3rem;
        width: 76%;
        margin-left: 12%;
        padding-left: 12%;
        border: 1px solid #dedede;
        border-radius: 5px;
        font-size: 1.2rem;
        color: #333333;
        outline: none;
    }

    label {
        display: block;
        margin-bottom: 1.2rem;
        position: relative;
        img {
            height: 3rem;
            width: 2.8rem;
            padding: 0.6rem;
            position: absolute;
            left: 14%;
            vertical-align: center;
        }
    }

    button {
        border-radius: 5px;
        height: 3rem;
        width: 76%;
        border: none;
        background-color: rgb(32, 123, 232);
        color: #ffffff;
        font-size: 1.5rem;
    }

    #vid {
        object-fit: cover;
        object-position: center center;
    }

    .this_page {
        width: 100%;
        height: 100%;
    }

    .login_video {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .login_page {
        width: 100%;
        height: 100%;
        min-width: 1280px;
        background: url(~static/imgs/login_bj.jpg) no-repeat 100% 100%;
        padding: 5% 35% 0 35%;
    }

    .login_title {
        text-align: center;
        span {
            font-size: 3.75rem;
            font-family: txjlzcyj;
            color: #02A2E4;
            font-weight: bold;
            text-shadow: 0 4px #ffffff, 4px 0 #ffffff, -4px 0 #ffffff, 0 -4px #ffffff;
        }
    }

    .login_form {
        margin-top: 8%;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        background-color: @fff;
        padding: 12% 0 8% 0;
        input:focus {
            border: 1px solid #60A7E5 !important;
            box-shadow: 1px 1px 5px #60A7E5 !important;
        }
    }

    .copyright {
        display: block;
        width: 100%;
        font-size: 1.5rem;
        text-align: center;
        position: absolute;
        bottom: 8%;
        text-shadow: 0 2px #ffffff, 2px 0 #ffffff, -2px 0 #ffffff, 0 -2px #ffffff;
    }

    .teacher_login {
        box-sizing: border-box;
        display: block;
        width: 100%;
        margin-top: 5%;
        padding: 0 12%;
        text-align: right;
        font-size: 1.2rem;
        color: #60A7E5;
    }
</style>
