<template>
    <div class="videoPage">
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span v-show="showTitle">{{orderNum}}：{{videoTitle}}</span>
        </div>
        <div class="video_content">
            <video id="vid" crossorigin="*" :src="sourceSrc" autoplay
                   width="64%"
                   @click="togglePlay"  :poster="poster">
            </video>
            <img src="~static/imgs/play.png" alt="播放" v-if="videoStatus" class="video_status" @click="togglePlay">
        </div>
        <v-Msg @closeDialog="closeDialog"></v-Msg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>

        <!--弹窗-->
        <div class="thisPage" v-if="mulQuestionShow">
            <div class="shadow"></div>
            <div class="content_border">
                <div class="content">
                    <span
                        class="content-title">如果今天回家后你有2个小时完成自己的家庭作业，任务包括1篇日记，10个单词的背诵和5道应用题，你还想看一会儿动画片，你会怎么安排自己的时间呢？</span>
                    <div class="content-radio">
                        <div v-for="(value, key) in mulQuestion" :key="key" class="content_answer">
                            <span>{{value.question}}</span>
                            <span v-for="(item, num) in value.answers" :key="num"
                                  @click="selectAnswer(key, item)"
                                  :class="{fontBlue: selectNum[key]['q' + (key + 1)] == item.count}">
                               {{item.count}}.{{item.content}}
                           </span>
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
    import {selectMsgDIalog, revertNumber, getItem} from '../../../tools/common'
    import {Notification} from 'element-ui'

    export default {
        inject: ['reload'],
        data() {
            return {
                sourceSrc: '',
                questions: [],
                showMsg: false,
                msg: {},
                finishedMsg: {},
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
                        question: '5道应用题',
                        answers: [
                            {
                                count: 'A',
                                content: '10分钟'
                            },
                            {
                                count: 'B',
                                content: '25分钟'
                            },
                            {
                                count: 'C',
                                content: '30分钟'
                            },
                            {
                                count: 'D',
                                content: '45分钟'
                            }
                        ]
                    },
                    {
                        question: '休息',
                        answers: [
                            {
                                count: 'A',
                                content: '10分钟'
                            },
                            {
                                count: 'B',
                                content: '25分钟'
                            },
                            {
                                count: 'C',
                                content: '30分钟'
                            },
                            {
                                count: 'D',
                                content: '45分钟'
                            }
                        ]
                    },
                    {
                        question: '10个单词',
                        answers: [
                            {
                                count: 'A',
                                content: '10分钟'
                            },
                            {
                                count: 'B',
                                content: '25分钟'
                            },
                            {
                                count: 'C',
                                content: '30分钟'
                            },
                            {
                                count: 'D',
                                content: '45分钟'
                            }
                        ]
                    },
                    {
                        question: '休息',
                        answers: [
                            {
                                count: 'A',
                                content: '10分钟'
                            },
                            {
                                count: 'B',
                                content: '25分钟'
                            },
                            {
                                count: 'C',
                                content: '30分钟'
                            },
                            {
                                count: 'D',
                                content: '45分钟'
                            }
                        ]
                    },
                    {
                        question: '1篇日记',
                        answers: [
                            {
                                count: 'A',
                                content: '10分钟'
                            },
                            {
                                count: 'B',
                                content: '25分钟'
                            },
                            {
                                count: 'C',
                                content: '30分钟'
                            },
                            {
                                count: 'D',
                                content: '45分钟'
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
                    },
                    {
                        q5: 'E'
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
                            obj.isShow = true
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
                    question.showTime < currentTime &&
                    (question.showTime + 1) > currentTime &&
                    question.isShow == true &&   //todo
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
                    _this.video.pause()
                    bus.$emit('openDialog', obj)
                },(question.showTime-_this.video.currentTime)*1000)
            },
            closeDialog(answer, question) {
                this.questions.forEach(function (obj) {
                    if (obj.questionId == question.questionId) {
                        obj.isShow = false
                    }
                })
                question.isShow = false
                if (question.crux == 1 && answer.crux == 1) {
                    this.answers.push({
                        questionId: question.questionId,
                        option: answer.answerOption,
                        answerId: answer.answerId
                    })
                    this.errorCount = 1
                }
                if (question.crux == 0) {
                    this.answers.push({
                        questionId: question.questionId,
                        option: answer.answerOption,
                        answerId: answer.answerId
                    })
                }
                this.checkAnswer(answer, question, this.videoGrade)
            },
            checkAnswer(answer, question, videoGrade) {
                let _this = this
                switch (answer.type) {
                    case 1:
                        _this.natural(answer, question)
                        break
                    case 2:
                        _this.showFeedback(answer, question, videoGrade)
                        break
                    case 3:
                        _this.jump(answer, question)
                        break
                    case 4:
                        _this.feedBackAndJump(answer, question, videoGrade)
                        break
                }
            },
            showFeedback(answer, question, videoGrade) {
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
                    if (answer.crux == 0 && question.crux == 1) {
                        if (_this.errorCount < 3) {
                            _this.errorCount++
                            _this.openDialog(question)
                        } else {
                            _this.answers.push({
                                questionId: question.questionId,
                                option: answer.answerOption,
                                answerId: answer.answerId
                            })
                            _this.questions.forEach(function (obj) {
                                if (obj.questionId == question.questionId) {
                                    obj.isShow = false
                                }
                            })
                            //视频播放结束，弹出游戏失败等信息
                            _this.failedCourse()
                        }
                    } else {
                        _this.video.currentTime = _this.video.currentTime
                        _this.video.play()
                    }
                }, answer.feedbackDuration)
            },
            natural(answer, question) {
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                if (answer.crux == 0 && question.crux == 1) {
                    if (_this.errorCount < 3) {
                        _this.errorCount++
                        _this.openDialog(question)
                    } else {
                        //视频播放结束，弹出游戏失败等信息
                        _this.answers.push({
                            questionId: question.questionId,
                            option: answer.answerOption,
                            answerId: answer.answerId
                        })
                        this.questions.forEach(function (obj) {
                            if (obj.questionId == question.questionId) {
                                obj.isShow = false
                            }
                        })
                        _this.failedCourse()
                    }
                } else {
                    _this.video.currentTime = _this.video.currentTime
                    _this.video.play()
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
                    if (answer.crux == 0 && question.crux == 1) {
                        if (_this.errorCount < 3) {
                            _this.errorCount++
                            setTimeout(function () {
                                _this.questions.forEach(function (obj) {
                                    if (obj.questionId == question.questionId) {
                                        obj.isShow = true
                                    }
                                })
                            }, 2000)
                            _this.video.addEventListener('timeupdate', function () {
                                if (_this.video.currentTime < answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                                    if (question.isShow === true){
                                        setTimeout(function () {
                                            _this.openDialog(question)
                                        },(answer.frameEnd-_this.video.currentTime)*1000)
                                    }
                                }
                            })
                            _this.video.currentTime = answer.frameStart
                            _this.video.play()
                        } else {
                            //视频播放结束，弹出游戏失败等信息
                            _this.answers.push({
                                questionId: question.questionId,
                                option: answer.answerOption,
                                answerId: answer.answerId
                            })
                            _this.questions.forEach(function (obj) {
                                if (obj.questionId == question.questionId) {
                                    obj.isShow = false
                                }
                            })
                            _this.failedCourse()
                            return false
                        }

                    } else {
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId == question.questionId) {
                                obj.isShow = false
                            }
                        })
                        _this.video.addEventListener('timeupdate', function () {
                            if (_this.video.currentTime < answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                                // if (Math.floor(answer.frameNext) == Math.floor(_this.video.currentTime)) {
                                //     answer.frameNext += 1
                                // }
                                setTimeout(function () {
                                    _this.video.currentTime = answer.frameNext
                                },(answer.frameEnd-_this.video.currentTime)*1000)
                            }
                        })
                        _this.video.currentTime = answer.frameStart
                        _this.video.play()
                    }

                }, answer.feedbackDuration)
            },
            jump(answer, question) {
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                if (answer.crux == 0 && question.crux == 1) {
                    setTimeout(function () {
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId == question.questionId) {
                                obj.isShow = true
                            }
                        })
                    },2000)
                    if (_this.errorCount < 3) {
                        _this.errorCount++
                        _this.video.addEventListener('timeupdate', function () {
                            if (_this.video.currentTime < answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                                if (question.isShow === true){
                                    setTimeout(function () {
                                        _this.openDialog(question)
                                    },(answer.frameEnd-_this.video.currentTime)*1000)
                                }
                            }
                        })
                        _this.video.currentTime = answer.frameStart
                        _this.video.play()
                    } else {
                        //视频播放结束，弹出游戏失败等信息
                        _this.answers.push({
                            questionId: question.questionId,
                            option: answer.answerOption,
                            answerId: answer.answerId
                        })
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId == question.questionId) {
                                obj.isShow = false
                            }
                        })
                        _this.failedCourse()
                        return false
                    }

                } else {
                    _this.questions.forEach(function (obj) {
                        if (obj.questionId == question.questionId) {
                            obj.isShow = false
                        }
                    })
                    _this.video.addEventListener('timeupdate', function () {
                        if (_this.video.currentTime < answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                            // if (Math.floor(answer.frameNext) == Math.floor(_this.video.currentTime)) {
                            //     answer.frameNext += 1
                            // }
                            setTimeout(function () {
                                _this.video.currentTime = answer.frameNext
                            },(answer.frameEnd-_this.video.currentTime)*1000)
                        }
                    })
                    _this.video.currentTime = answer.frameStart
                    _this.video.play()
                }
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
                p.extend = JSON.stringify(_this.selectNum)
                p.result = 1
                _this.$httpWeb.fetch(url, p)
                    .then(res => {
                        console.log('ok', res)
                        _this.showfinishedMsg = true
                        _this.finishedMsg = res.data
                        _this.finishedMsg.success = true
                        _this.finishedMsg.nextCourseId = _this.nextCourseId
                    })
                    .catch(err => {
                        console.log('err', err)
                    })
            },
            selectAnswer(num, item) {
                this.selectNum[num]['q' + (num + 1)] = item.count
            },
            selectMulConfirm () {
                let an = JSON.stringify(this.selectNum)
                if (an.indexOf('E') > -1) {
                    Notification({
                        message: '你还没有选择完毕哦',
                        type: 'error'
                    });
                } else {
                    // todo 赋值答案
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
                _this.showQuestion(currentTime)
            }
            _this.video.onended = function () {
                _this.mulQuestionShow = true
            }
            _this.startCourse()
            bus.$emit('sendTitle', _this.title)
            bus.$on('hidden', function (action) {
                console.log(action)
                if (action == 'reload') {
                    _this.reload()
                }
                if (action == 'next') {
                    _this.$router.push({name: 'twentynine', query: {courseId: 29}})
                    _this.reload()
                }
            })
        },
        beforeCreate() {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        components: {
            vMsg, vSelectmsg, vFinished
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
        span:nth-child(1) {
            display: block;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.5rem;
        }
        span:not(:first-child) {
            display: inline-block;
            font-size: 1.2rem;
            height: 2rem;
            padding: 0 1rem;
            line-height: 2rem;
            width: 18%;
            text-align: center;
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
