<template>
    <div class="videoPage">
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span v-show="showTitle">{{orderNum}}：{{videoTitle}}</span>
        </div>
        <div class="video_content">
            <video id="vid" crossorigin="*" :src="sourceSrc" autoplay
                   width="64%"
                   @click="togglePlay" :poster="poster">
            </video>
            <img src="~static/imgs/play.png" alt="播放" v-if="videoStatus" class="video_status" @click="togglePlay">
        </div>


        <v-Msg @closeDialog="closeDialog"></v-Msg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>
        <v-imgDialogMsg v-if="showImgDialogMsg"></v-imgDialogMsg>
        <v-foodDialogMsg v-if="showFoodDialogMsg"></v-foodDialogMsg>

        <div class="thisPage" v-if="mulQuestionShow">
            <div class="shadow"></div>
            <div class="content_border">
                <div class="content">
                    <span
                        class="content-title">如果今天回家后你有2个小时完成自己的家庭作业，任务包括1篇日记，10个单词的背诵和5道应用题，你还想看一会儿动画片，你会怎么安排自己的时间呢？</span>
                    <div class="content-radio">
                        <div v-for="(value, key) in mulQuestion" :key="key" class="content_answer">
                            <span class="content_question_title">{{value.question}}</span>
                            <div class="content_answer_options">
                                <span v-for="(item, num) in value.answers" :key="num"
                                      @click="selectAnswer(key, item)"
                                      :class="{fontBlue: selectNum[key]['q' + (key + 1)] == item.count}">
                               {{item.count}}.{{item.content}}
                           </span>
                            </div>
                        </div>
                    </div>
                    <div class="question_confirm_button">
                        <button @click="selectMulConfirm">选好了</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vMsg from '../dialog/msg'
    import vSelectmsg from '../dialog/selectMsg'
    import {bus} from '../../../tools/bus'
    import vFinished from '../dialog/finishedDialog'
    import vImgDialogMsg from '../dialog/imgDialogMsg'
    import vFoodDialogMsg from '../dialog/foodDialogMsg'
    import {selectMsgDIalog, revertNumber, getItem} from '../../../tools/common'
    import {Notification} from 'element-ui'

    export default {
        inject: ['reload'],
        data() {
            return {
                studentName:'大宝',
                sourceSrc: '',
                questions: [],
                showMsg: false,
                msg: {},
                finishedMsg: {},
                dialogMsg: [],
                showDialogMsg: false,
                showImgDialogMsg: false,
                showFoodDialogMsg: false,
                showfinishedMsg: false,
                showFlag: false,
                isPause: false,
                errorCount: 0,
                courseId: '',
                studentId: '',
                answers: [],
                recordId: '',
                title: '交互式课程',
                videoTitle: '',
                videoWidth: '',
                currentTime: 0,
                video: document.getElementById('video'),
                nextCourseId: '',
                orderNum: 0,
                videoGrade: '',
                videoStatus: false,
                showTitle: false,
                mulQuestionShow: false,
                mulQuestion: [
                    {
                        question: '1.你的零花钱主要花在哪里？',
                        answers: [
                            {
                                count: 'A',
                                content: '学习用品'
                            },
                            {
                                count: 'B',
                                content: '零食'
                            },
                            {
                                count: 'C',
                                content: '休闲娱乐'
                            },
                            {
                                count: 'D',
                                content: '其他'
                            }
                        ]
                    },
                    {
                        question: '2.你的零花钱是否有记账？',
                        answers: [
                            {
                                count: 'A',
                                content: '有'
                            },
                            {
                                count: 'B',
                                content: '没有'
                            },
                            {
                                count: 'C',
                                content: '偶尔有'
                            }
                        ]
                    },
                    {
                        question: '3.你认为记账有必要吗？',
                        answers: [
                            {
                                count: 'A',
                                content: '有必要'
                            },
                            {
                                count: 'B',
                                content: '没必要'
                            },
                            {
                                count: 'C',
                                content: '无所谓'
                            }
                        ]
                    },
                    {
                        question: '4.如果父母忘记给你零花钱，你会？',
                        answers: [
                            {
                                count: 'A',
                                content: '大发脾气'
                            },
                            {
                                count: 'B',
                                content: '心平气和地向父母索要'
                            },
                            {
                                count: 'C',
                                content: '不消费'
                            },
                            {
                                count: 'D',
                                content: '其他'
                            }
                        ]
                    }
                ],
                selectNum: [
                    {
                        q1: 'E'
                    },
                    {
                        q2: 'E'
                    },
                    {
                        q3: 'E'
                    },
                    {
                        q4: 'E'
                    }
                ],
                poster: ''
            }
        },
        computed: {},
        created: function () {
            this.getInfo()
            this.courseId = this.$route.query.courseId
            this.detail()
        },
        methods: {
            togglePlay() {
                if (this.video.paused) {
                    this.video.play()
                    this.videoStatus = false
                } else {
                    this.video.pause()
                    this.videoStatus = true
                }
            },
            getInfo() {
                let userData = getItem('studentInfo')
                this.studentId = userData.studentId
                this.studentName = userData.studentName
            },
            detail() {
                let url = '/course/detail';
                let p = {};
                p.courseId = this.courseId;
                this.$httpWeb.fetch(url, p)
                    .then(res => {
                        this.poster = this.$myUrl.baseUrl()+res.data.poster
                        this.questions = res.data.questions
                        this.questions.forEach(function (obj) {
                            if (obj.questionId==96) obj.isShow=true
                        })
                        this.videoTitle = res.data.title
                        this.videoGrade = res.data.gradeNum
                        this.orderNum = res.data.orderNum
                        this.showTitle = true
                        console.log(res.data)
                        this.sourceSrc = this.$myUrl.baseUrl() + res.data.video
                        this.nextCourseId = res.data.nextCourseId
                    })
                    .catch(err => {
                        console.log('err', err)
                    })
            },
            showQuestion(currentTime) {
                let _this = this
                _this.questions.forEach(function (question) {
                    question.showTime > currentTime &&
                    (question.showTime -1) < currentTime &&
                    question.isShow==true&&   //todo
                    _this.openDialog(question)
                })
            },
            openDialog(question) {
                let _this = this
                let obj = {
                    question: question,
                    videoGrade: this.videoGrade
                }
                setTimeout(function () {
                    bus.$emit('openDialog', obj)
                    _this.video.pause()
                },(question.showTime-currentTime)*1000)
            },
            closeDialog(answer, question) {
                this.questions.forEach(function (obj) {
                    if (obj.questionId==question.questionId) obj.isShow=false
                })
                this.answers.push({
                    questionId: question.questionId,
                    option: answer.answerOption,
                    answerId: answer.answerId
                })
                this.checkAnswer(answer, question, this.videoGrade)
            },
            checkAnswer(answer, question, videoGrade) {
                let _this = this
                if (question.questionId!=96){
                    answer.frameNext = 106.52
                    _this.feedBackAndJump(answer,question,videoGrade)
                }else {
                    if (answer.answerId==221) {
                        setTimeout(function () {
                            _this.video.currentTime=106.52
                            _this.video.play()
                        },1000)
                    }else if (answer.answerId==222) {
                        setTimeout(function () {
                            _this.video.addEventListener('timeupdate',function () {
                                if (this.currentTime>131.48&&this.currentTime<132.48){
                                    _this.video.pause()
                                    _this.failedCourse()
                                }
                            })
                            _this.video.currentTime=120.64
                            _this.video.play()
                        },1000)
                    }
                }
            },
            feedBackAndJump(answer, question, videoGrade) {
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                _this.msg = {
                    'feedback': answer.feedback,
                    'feedbackPinyin': answer.feedbackPinyin,
                    'gradeNum': videoGrade
                }
                _this.showMsg = true
                setTimeout(function () {
                    _this.showMsg = false
                    _this.video.currentTime = 106.52
                    _this.video.play()
                }, answer.feedbackDuration)
            },
            startCourse() { //开始学习课程aa
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
            failedCourse() {
                let url = '/course/end';
                let p = {};
                let _this = this
                let options = _this.answers;
                p.recordId = _this.recordId;
                p.options = JSON.stringify(options)
                p.result = 0
                _this.$httpWeb.fetch(url, p)
                    .then(res => {
                        _this.showfinishedMsg = true
                        _this.finishedMsg = {complete: 0, success: false, score: 0}
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
            intersect (arr1, arr2) {
                let temp=false
                arr1.forEach(function (obj1) {
                    arr2.forEach(function (obj2) {
                        if (obj2==obj1){
                            temp=true
                        }
                    })
                })
                return temp
            },
            selectAnswer(num, item) {
                this.selectNum[num]['q' + (num + 1)] = item.count
            },
            selectMulConfirm () {
                console.log(this.selectNum)
                let an = JSON.stringify(this.selectNum)
                if (an.indexOf('E') > -1) {
                    Notification({
                        message: '你还没有选择完毕哦',
                        type: 'error'
                    });
                } else {
                   this.answers.extend = an
                    this.mulQuestionShow = false
                    this.endCourse()
                }
            }
        },
        mounted() {
            let _this = this
            _this.video = document.getElementById('vid')
            _this.video.ontimeupdate = function () {
                let currentTime = this.currentTime
                if (currentTime>76.88&&currentTime<77.88) {
                    setTimeout(function () {
                        _this.showImgDialogMsg = true
                        _this.video.pause()
                    },(77.88-currentTime)*1000)
                }
                if (currentTime>105.52&&currentTime<106.52) {
                    setTimeout(function () {
                        _this.showImgDialogMsg = true
                        _this.video.pause()
                    },(106.52-currentTime)*1000)
                }
                _this.showQuestion(currentTime)
            }
            _this.video.onended = function () {
                _this.mulQuestionShow = true
            }
            _this.startCourse()
            bus.$emit('sendTitle', _this.title)
            bus.$on('imgSelected', function (option) {
                _this.showImgDialogMsg=false
                switch (option){
                    case 'C':
                        _this.video.currentTime = 78.92
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId==93) obj.isShow=true
                        })
                        break
                    case 'A':
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId==94) obj.isShow=true
                        })
                        _this.video.currentTime = 88.4
                        break
                    case 'D':
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId==95) obj.isShow=true
                        })
                        _this.video.currentTime = 97.4
                        break
                }
                _this.video.play()
            })
            bus.$on('hidden', function (action) {
                console.log(action)
                if (action == 'reload') {
                    _this.reload()
                }
                if (action == 'next') {
                    _this.$router.push({name: 'video', query: {courseId: _this.nextCourseId}})
                    _this.reload()
                }
            })
            bus.$on('foodSelected', function (list) {
                _this.showFoodDialogMsg=false
                //todo 判断是否包含零食
                if (!_this.intersect(list,[1,3,4,5,6,8])){
                    _this.video.currentTime = 132.52
                }else {
                    _this.video.currentTime = 110.92
                }
               _this.video.play()
            })
        },
        beforeCreate() {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        components: {
            vMsg, vSelectmsg, vFinished, vImgDialogMsg,vFoodDialogMsg
        },
    }
</script>


<style lang="less">
    @import "~static/less/reset.less";
    @import "~static/less/video.less";
    .thisPage {
        height: 100%;
    }

    .shadow {
        height: 100%;
        opacity: 0.4;
        background-color: #333333;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content-title {
        font-size: 1.5rem;
        line-height: 2rem;
        padding: 1.5rem 2rem;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        display: flex;
        flex-wrap: wrap;
        letter-spacing: 0.15rem;
        span {
            padding: 0 0.2rem;

        }
    }

    .content-title_question {
        vertical-align: text-bottom;
    }

    .content_border {
        width: 100%;
        min-width: 1280px;
        position: absolute;
        bottom: 8%;
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

    .content_answer {
        padding: 0 1.5rem;
        .content_question_title {
            display: block;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.5rem;
        }
    }

    .content_answer_options {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        span {
            display: block;
            padding: 0 1.5rem;
            font-size: 1.2rem;
            line-height: 2.5rem;
            min-width: 25%;
        }
    }

    .question_confirm_button {
        text-align: center;
        padding: 1rem 0;
        button {
            height: 3rem;
            width: 8rem;
            background-color: #1d71f2;
            color: white;
            font-size: 1.5rem;
            line-height: 2.5rem;
            border: none;
            border-radius: 10px;
        }
    }


</style>
