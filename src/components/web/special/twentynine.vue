<template>
    <div class="videoPage">
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span>{{orderNum}}：{{videoTitle}}</span>
        </div>
        <div class="video_content">
            <video controls id="vid" crossorigin="*" :src="sourceSrc" autoplay
                   width="64%"
                   @click="togglePlay">
            </video>
            <img src="~static/imgs/play.png" alt="播放" v-if="videoStatus" class="video_status" @click="togglePlay">
        </div>
        <v-Msg @closeDialog="closeDialog"></v-Msg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>
        <v-dialogMsg :dialogMsg="dialogMsg" v-if="showDialogMsg"></v-dialogMsg>
    </div>
</template>

<script>
    import vMsg from '../dialog/msg'
    import vSelectmsg from '../dialog/selectMsg'
    import {bus} from '../../../tools/bus'
    import vFinished from '../dialog/finishedDialog'
    import vDialogMsg from '../dialog/dialogMsg'
    import {selectMsgDIalog, revertNumber, getItem} from '../../../tools/common'

    export default {
        inject: ['reload'],
        data() {
            return {
                studentName:'大宝',
                sourceSrc: '',
                questions: [],
                dialog: [
                    {
                        id: 1,
                        showTime: 15.28,
                        content: [
                            '（主角）：小星你也早啊！'
                        ],
                        showed:0
                    },
                    {
                        id: 2,
                        showTime: 19.12,
                        content: [
                            '（主角）：雅雅早上好！'
                        ],
                        showed:0
                    },
                    {
                        id: 3,
                        showTime: 186.64,
                        content: [
                            '（主角）：小玉，你的声音真好听，以后说话也像朗诵的时候大一点声音会很棒哦！'
                        ],
                        showed:0
                    }
                ],
                showMsg: false,
                msg: {},
                finishedMsg: {},
                dialogMsg: [],
                showDialogMsg: false,
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
                        this.questions = res.data.questions
                        this.videoTitle = res.data.title
                        this.videoGrade = res.data.gradeNum
                        this.orderNum = res.data.orderNum
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
                    //question.isShow==true&&   //todo
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
                if (question.crux == 1 && answer.crux == 1) {
                    this.answers.push({
                        questionId: question.questionId,
                        option: answer.answerOption,
                        answerId: answer.answerId
                    })
                    this.errorCount = 0
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
                            //视频播放结束，弹出游戏失败等信息
                            _this.failedCourse()
                        }
                    } else {
                        _this.video.currentTime = _this.video.currentTime+1
                        _this.video.play()
                    }
                }, answer.feedbackDuration)
            },
            natural(answer, question) {
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                if (question.questionId === 87) {
                    _this.questions.forEach(function (obj) {
                        if (answer.answerId === 194&&obj.questionId==88) {
                            _this.openDialog(obj)
                        }else if (answer.answerId === 195&&obj.questionId==89){
                            _this.openDialog(obj)
                        }else if (answer.answerId === 196&&obj.questionId==90){
                            _this.openDialog(obj)
                        }
                    })
                }
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
                            _this.failedCourse()
                        }
                    } else {
                        _this.video.currentTime = _this.video.currentTime+1
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
                        } else {
                            //视频播放结束，弹出游戏失败等信息
                            _this.answers.push({
                                questionId: question.questionId,
                                option: answer.answerOption,
                                answerId: answer.answerId
                            })
                            _this.failedCourse()
                            return false
                        }

                    }
                    _this.video.addEventListener('timeupdate', function () {
                        if (_this.video.currentTime > answer.frameEnd && (_this.video.currentTime < answer.frameEnd + 1)) {

                            if (question.crux == 1 && answer.crux == 0) {
                                _this.openDialog(question)
                            } else {
                                _this.video.currentTime = answer.frameNext + 1
                                _this.video.play()
                            }
                        }
                    })
                    _this.video.currentTime = answer.frameStart + 1
                    _this.video.play()
                }, answer.feedbackDuration)
            },
            jump(answer, question) {
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                setTimeout(function () {
                    if (answer.crux == 0 && question.crux == 1) {
                        if (_this.errorCount < 3) {
                            _this.errorCount++
                        } else {
                            //视频播放结束，弹出游戏失败等信息
                            _this.answers.push({
                                questionId: question.questionId,
                                option: answer.answerOption,
                                answerId: answer.answerId
                            })
                            _this.failedCourse()
                            return false
                        }
                    }
                    _this.video.addEventListener('timeupdate', function () {
                        if (_this.video.currentTime > answer.frameEnd && (_this.video.currentTime < answer.frameEnd + 1)) {

                            if (question.crux == 1 && answer.crux == 0) {
                                _this.openDialog(question)
                            } else {
                                _this.video.currentTime = answer.frameNext + 1
                                _this.video.play()
                            }
                        }
                    })
                    _this.video.currentTime = answer.frameStart + 1
                    _this.video.play()
                }, answer.feedbackDuration)
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
            showDialog(currentTime) {
                let _this = this
                _this.dialog.forEach(function (obj) {
                    if (obj.showTime < currentTime && (obj.showTime + 1) > currentTime){
                        obj.showed=1
                        _this.dialogMsg = obj.content
                        _this.showDialogMsg = true
                        _this.video.pause()
                        setTimeout(function () {
                            _this.showDialogMsg = false
                            _this.video.currentTime +=1
                            _this.video.play()
                        }, 2000 * obj.content.length)

                    }
                })
            },
            formatDialogMsg(){
                let _this = this
                let str = JSON.stringify(_this.dialog)
                let dialog = str.replace(/（主角）/g,_this.studentName)
                _this.dialog = JSON.parse(dialog)
            }
        },
        mounted() {
            let _this = this
            _this.video = document.getElementById('vid')
            _this.video.ontimeupdate = function () {
                let currentTime = this.currentTime
                _this.showQuestion(currentTime)
                _this.showDialog(currentTime)
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
            _this.formatDialogMsg()
        },
        beforeCreate() {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        components: {
            vMsg, vSelectmsg, vFinished, vDialogMsg
        },
    }
</script>


<style lang="less">
    @import "~static/less/reset.less";
    @import "~static/less/video.less";
</style>
