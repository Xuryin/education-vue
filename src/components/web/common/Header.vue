<template>
    <div>
        <div class="page_header">
            <div class="left_sec">
                <span>心灵广雅</span>
                <span>{{title}}</span>
            </div>
            <div class="right_sec">
                <div @mouseout="dialog = false" @mouseover="dialog = true">
                    <img src="~static/imgs/user_boy.png" alt="头像" v-if="userData.gender == 1 && !userData.headImg"  @click.stop="showDialog">
                    <img src="~static/imgs/user_girl.png" alt="头像" v-if="userData.gender == 0 && !userData.headImg"  @click.stop="showDialog">
                    <img :src="$myUrl.baseUrl() + userData.headImg" alt="头像" v-if="userData.headImg"  @click.stop="showDialog">
                    <span  @click.stop="showDialog">你好，{{userData.name}}</span>
                    <img src="~static/imgs/index_arrow.png" alt="down" v-if="!dialogFlag">
                    <img src="~static/imgs/index_arrow_up.png" alt="down" v-else>

                    <div class="dialog" v-if="dialogFlag">
                        <div>
                            <img src="~static/imgs/user_boy.png" alt="头像" v-if="userData.gender == 1"  width="88px" height="88">
                            <img src="~static/imgs/user_girl.png" alt="头像" v-if="userData.gender == 0"  width="88px" height="88">
                            <ul>
                                <li>{{userData.name}}</li>
                                <li>积分:  {{userData.coin}}</li>
                            </ul>
                        </div>
                        <p>{{userData.sign}}</p>
                        <div class="dialog_school">
                            <img src="~static/imgs/indxe_icon_xx.png" alt="school">
                            <span>{{userData.school}}</span>
                        </div>
                        <ul class="dialog_class">
                            <li>
                                <img src="~static/imgs/index_icon_bj.png" alt="class">
                                <span>{{userData.gradeNum}}年级</span>
                            </li>
                            <li>
                                <img src="~static/imgs/index_icon_sz.png" alt="setting">
                                <span>设置</span>
                            </li>
                        </ul>

                    </div>
                </div>
                <div @click="logout">
                    <img src="~static/imgs/indxe_quit.png" alt="">
                    <span>退出</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../../tools/bus'
    import {getItem, setItem} from '../../../tools/common'

    export default {
        data() {
            return {
                title: '',
                userData: {},
                dialogFlag: false
            }
        },
        methods: {
            showDialog() {
                this.dialogFlag = !this.dialogFlag
                if (this.dialogFlag) {
                    this.getInfo()
                }
                return false
            },
            getInfo() {
                let _this = this
                let url = '/student/info'
                let studentId = getItem('studentInfo').studentId
                let p = {}
                p.studentId = studentId
                this.$httpWeb.fetch(url, p).then(res => {
                    _this.userData = res.data
                    if (_this.userData.nickName != "" || !_this.userData.nickName) {
                        _this.userData.name = _this.userData.nickName
                    } else {
                        _this.userData.name = _this.userData.name
                    }
                }).catch(err => {
                    console.log(err)
                })

            },
            logout () {
                this.$router.push('/login')
                setItem('studentInfo', '')
                setItem('studentToken', '')
                localStorage.removeItem("currentGrade")
            }
        },
        mounted() {
            let _this = this
            document.addEventListener('click', function () {
                _this.dialogFlag = false
            })
            bus.$on('sendTitle', function (obj) {
                _this.title = obj
            })
            this.getInfo()
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/header.less";
</style>
