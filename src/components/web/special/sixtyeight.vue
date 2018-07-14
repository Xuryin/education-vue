<template>
    <div class="videoPage">
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span v-show="showTitle">{{orderNum}}：{{videoTitle}}</span>
        </div>
        <div class="video_content">
            <video id="vid" crossorigin="*" :src="sourceSrc" autoplay
                   width="64%"
                   @click="togglePlay">
            </video>
            <img src="~static/imgs/play.png" alt="播放" v-if="videoStatus" class="video_status" @click="togglePlay">
        </div>


        // 五个选项的弹窗
        <div class="thisPage" v-if="dialogVisible">
            <div class="shadow"></div>
            <div class="content_border">
                <div class="content" >
                    <span class="content-title">问题：{{questions[0].content}}</span>
                    <div class="content-radio" >
                        <div v-for="(value, key) in questions[0].answers"
                              @click="changeAnswer(value)">
                            <span>
                                {{value.answerOption}}.
                            </span>
                            <span>
                                {{value.answerContent}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg"></v-finished>
    </div>
</template>

<script>
    import vMulMsg from '../dialog/mulMsg'
    import vSelectmsg from '../dialog/selectMsg'
    import {bus} from '../../../tools/bus'
    import vFinished from '../dialog/finishedDialog'
    import {selectMsgDIalog, revertNumber, getItem} from '../../../tools/common'

    export default {
        inject:['reload'],
        data() {
            return {
                sourceSrc:'',
                questions: [],
                showMsg: false,
                msg: '',
                finishedMsg:{},
                showfinishedMsg:false,
                showFlag: false,
                courseId: '',
                studentId: '',
                answers: [],
                recordId: '',
                title: '交互式课程',
                videoTitle: '',
                videoWidth: '',
                currentTime:0,
                video:document.getElementById('video'),
                nextCourseId:'',
                orderNum: 0,
                videoGrade: '',
                videoStatus: false,
                showTitle: false,
                dialogVisible: false
            }
        },
        computed: {

        },
        created:function () {
            this.getInfo()
            this.courseId = this.$route.query.courseId
            this.detail()
        },
        methods: {
            togglePlay () {
                if (this.video.paused) {
                    this.video.play()
                    this.videoStatus = false
                } else {
                    this.video.pause()
                    this.videoStatus = true
                }
            },
            getInfo(){
                let userData = getItem('studentInfo')
                this.studentId = userData.studentId
            },
            detail(){
                let url = '/course/detail';
                let p = {};
                p.courseId = this.courseId;
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        this.questions = res.data.questions
                        this.questions.forEach(function (obj) {
                            obj.isShow=true
                        })
                        this.videoTitle = res.data.title
                        this.videoGrade = res.data.gradeNum
                        this.orderNum = res.data.orderNum
                        this.showTitle = true
                        console.log(res.data)
                        this.sourceSrc = this.$myUrl.baseUrl() + res.data.video
                        this.nextCourseId = res.data.nextCourseId
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
            showQuestion(currentTime) {
                let _this = this
                _this.questions.forEach(function (question) {
                    question.showTime > currentTime &&
                    (question.showTime - 1) < currentTime &&
                    question.isShow==true&&   //todo
                    _this.openDialog(question)
                })
            },
            openDialog(question) {
                let obj = {
                    question: question,
                    videoGrade: this.videoGrade
                }
                let _this = this
                setTimeout(function () {
                    console.log(123)
                    _this.video.pause()
                    _this.dialogVisible = true
                },(question.showTime-_this.video.currentTime)*1000)
            },
            startCourse() { //开始学习课程
                let url = '/course/start';
                let p = {};
                let _this = this
                p.studentId = _this.studentId;
                p.courseId = _this.courseId;
                _this.$httpWeb.fetch(url, p)
                    .then(res => {
                        _this.recordId = res.data.recordId
                        //console.log('ok',res)
                    })
                    .catch(err => {
                        console.log('err', err)
                    })
            },
            endCourse() { //视频播放结束后调用此方法，提交答案到后台
                let url = '/course/end';
                let p = {};
                let _this = this
                let options = _this.answers;
                console.log(options);
                p.recordId = _this.recordId;
                p.options = JSON.stringify(options)
                p.result = 1
                _this.$httpWeb.fetch(url, p)
                    .then(res => {
                        _this.showfinishedMsg = true
                        _this.finishedMsg = res.data
                        _this.finishedMsg.success = true
                        _this.finishedMsg.nextCourseId = _this.nextCourseId
                    })
                    .catch(err => {
                        console.log('err', err)
                    })
            },
            changeAnswer (value) {
                console.log(value)
                this.dialogVisible = false
                this.video.play()
                // todo 在这里写传过去的答案
                this.answers.push({
                    questionId: 210,
                    option: value.answerOption,
                    answerId: value.answerId
                })
            }
        },
        mounted() {
            let _this = this
            _this.video = document.getElementById('vid')
            _this.video.ontimeupdate = function () {
                let currentTime = this.currentTime
                _this.showQuestion(currentTime)
            }
            _this.video.onended = function () {
                _this.endCourse()
            }
            _this.startCourse()
            bus.$emit('sendTitle', _this.title)
            bus.$on('hidden', function (action) {
                console.log(action)
                if (action == 'reload') {
                    _this.reload()
                }
                if (action == 'next') {
                    _this.$router.push({name: 'sixtynine', query: {courseId: 69}})
                    _this.reload()
                }
            })
        },
        beforeCreate () {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        components: {
            vSelectmsg,vFinished,vMulMsg
        },
    }
</script>


<style lang="less" >
    @import "~static/less/reset.less";
    @import "~static/less/video.less";

    .thisPage {
        height: 100%;
    }

    .shadow {
        height: calc(98% - 10rem);
        margin-top: 10rem;
        margin-left: 18%;
        width: 64%;
        opacity: 0.2;
        background-color: #333333;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content-title {
        font-size: 1.5rem;
        line-height: 2.5rem;
        padding: 1.2rem 2rem;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        display: flex;
        flex-wrap: wrap;
        letter-spacing: 0.15rem;
        word-wrap: break-word;
    }

    .content-radio {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 1rem 2rem;
        div {
            display: block;
            width: 30%;
            font-size: 1.2rem;
            line-height: 2.5rem;
            span:nth-child(1) {
                font-weight: 500;
            }
        }
    }


    .content-title_question {
        vertical-align: text-bottom;
    }

    .content_border {
        width: 100%;
        min-width: 1280px;
        position: absolute;
        bottom: 20%;
        display: flex;
        justify-content: center;
    }

    .content {
        border-radius: 10px;
        text-align: left;
        max-width: 40rem;
        min-width: 20rem;
        background-color: @fff;
    }

</style>
