<template>
    <div class="videoPage" >
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span v-show="showTitle">{{orderNum}}：{{videoTitle}}</span>
        </div>
        <div class="video_content">
            <video id="vid" crossorigin="*" :src="sourceSrc" autoplay
                   width="64%"
                   @click="togglePlay" :poster="this.$myUrl.baseUrl() + poster ">
            </video>
            <img src="~static/imgs/play.png" alt="播放" v-show="videoStatus" class="video_status" @click="togglePlay">
        </div>
        <v-Msg @closeDialog="closeDialog"></v-Msg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>
    </div>
</template>

<script>
    import vMsg from './dialog/msg'
    import vSelectmsg from './dialog/selectMsg'
    import {bus} from '../../tools/bus'
    import vFinished from './dialog/finishedDialog'
    import {selectMsgDIalog, revertNumber, getItem} from '../../tools/common'

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
                errorCount: 1,
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
                orderNum: "",
                videoGrade: '',
                videoStatus: false,
                showTitle: false,
                poster: this.$myUrl.baseUrl() + '/video/course/1/2/2.jpg'
            }
        },
        computed: {},
        created: function () {
            this.getInfo()
            // this.poster = this.$route.query.poster
            this.poster = '/video/course/1/2/2.jpg'
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
                this.video.pause()
                let obj = {
                    question: question,
                    videoGrade: this.videoGrade
                }
                bus.$emit('openDialog', obj)
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
                setTimeout(function () {
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
                }, answer.feedbackDuration)
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
                                if (_this.video.currentTime > answer.frameEnd && _this.video.currentTime < (answer.frameEnd + 1)) {
                                    if (question.isShow === true) _this.openDialog(question)
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
                            if (_this.video.currentTime > answer.frameEnd && (_this.video.currentTime < answer.frameEnd + 1)) {
                                if (Math.floor(answer.frameNext) == Math.floor(_this.video.currentTime)) {
                                    answer.frameNext += 1
                                }
                                _this.video.currentTime = answer.frameNext
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
                            if (_this.video.currentTime > answer.frameEnd && (_this.video.currentTime < answer.frameEnd + 1)) {
                                if (question.isShow===true) _this.openDialog(question)
                            }
                        })
                        console.log(answer.frameStart)
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
                        if (_this.video.currentTime > answer.frameEnd && _this.video.currentTime < (answer.frameEnd + 1)) {
                            if (Math.floor(answer.frameNext) == Math.floor(_this.video.currentTime)) {
                                answer.frameNext += 1
                            }
                            _this.video.currentTime = answer.frameNext
                        }
                    })
                    _this.video.currentTime = answer.frameStart
                    _this.video.play()
                }
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
                        //console.log(_this.finishedMsg)
                    })
                    .catch(err => {
                        console.log('err', err)
                    })
            },
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
                    _this.$router.push({name: 'video', query: {courseId: _this.nextCourseId}})
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
        beforeDestroy () {
            this.video.src = null
        },
        components: {
            vMsg, vSelectmsg, vFinished
        },
    }
</script>


<style lang="less">
    @import "~static/less/reset.less";
    @import "~static/less/video.less";
</style>
