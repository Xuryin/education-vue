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
                studentName: '大宝',
                sourceSrc: '',
                questions: [],
                dialog: [
                    {
                        id: 1,
                        showTime: 95,
                        content: [
                            '（主角）着急地反驳：“小星，你你你狗咬吕洞宾，不识好人心，我好心提醒你，你反倒说我害你，你真是不可理喻。”',
                            '小星与（主角）在教室中推搡起来，“嘭”的一声，（主角）放在桌边的美国队长文具盒摔在地上，文具盒分成两半，里面的铅笔、橡皮擦、转笔刀都散了出来。',
                            '小星目瞪口呆，（主角）则十分愤怒。',
                            '（主角）气愤地指责小星说：“你这人怎么这样啊，我好心提醒你，你却把我的文具盒摔坏了，真是好心没好报，我再也不跟你玩了！”'
                        ],
                        showed: 0
                    },
                    {
                        id: 2,
                        showTime: 102.8,
                        content: [
                            '（主角）在教室门口遇到了广广。',
                            '（主角）：“广广，你帮我去跟小星说，汪老师找他去办公室。”'
                        ],
                        showed: 0
                    },
                    {
                        id: 3,
                        showTime: 109.48,
                        content: [
                            '（主角）：“还不是因为他上课吃面包的事情，我们俩吵了一架。”'
                        ],
                        showed: 0
                    },
                    {
                        id: 6,
                        showTime: 160,
                        content: [
                            '接下来几天你和小星都在冷战。'
                        ],
                        showed: 0
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
                showTitle: false,
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
                this.studentName = userData.name
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
                            obj.crux = 0
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
                    if (question.questionId == obj.questionId) {
                        obj.isShow = false
                    }
                })
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
                let _this = this
                switch (question.questionId){
                    case 67:
                        question.crux=0
                        break
                    case 68:
                        question.crux=0
                        break
                    case 70:
                        question.answers[0].feedback = _this.studentName+'：“小星，我也有要跟你道歉的地方，前天你心情不好，我不应该跟你争吵，我也应该更宽容一点，谢谢你买的新文具盒！”'
                        question.answers[0].type = 2
                        question.answers[1].feedback = _this.studentName+'：“小星，我也有要跟你道歉的地方，前天你心情不好，我不应该跟你争吵，我也应该更宽容一点，谢谢你买的新文具盒！”'
                        question.answers[1].type = 2
                        question.answers[2].feedback = _this.studentName+'：“小星，我也有要跟你道歉的地方，前天你心情不好，我不应该跟你争吵，我也应该更宽容一点，谢谢你买的新文具盒！”'
                        question.answers[2].type = 2
                        _this.video.addEventListener('timeupdate',function () {
                            _this.dialog[3].showed = 1
                            let current = this.currentTime
                            if (current>157&&current<158){
                                setTimeout(function () {
                                    _this.video.pause()
                                    _this.endCourse()
                                },(158-_this.video.currentTime)*1000)
                            }
                        })
                }
                switch (answer.answerId){
                    case 140:
                        this.questions.forEach(function (obj) {
                            if (obj.questionId==69) obj.isShow=false
                        })
                        _this.video.currentTime = 135.72
                        _this.video.play()
                        return
                    case 141:
                        _this.questions.forEach(function (obj) {
                            if (obj.questionId==69) obj.isShow=false
                        })
                        answer.type=1
                        break
                    case 142:
                        _this.video.currentTime = 123.92
                        _this.video.play()
                        return
                    case 143:
                        _this.video.currentTime = 135.72
                        _this.video.play()
                        return
                    case 145:
                        _this.video.currentTime = 158.04
                        _this.video.play()
                        return
                    case 144:
                        answer.feedback = _this.studentName+'：“广广还是你去帮我告诉小星吧，我就不去了。谢谢你！”'
                        answer.type=4
                        answer.frameStart=120.72
                        answer.frameEnd=124
                        answer.frameNext=135.72
                        break
                    case 146:
                        _this.video.play()
                        return
                    case 147:
                    case 148:
                        _this.video.currentTime = 158.04
                        _this.video.play()
                        return
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
                        //_this.video.currentTime+=1
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
                        _this.failedCourse()
                    }
                } else {
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
                        if (_this.video.currentTime <answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                            setTimeout(function () {
                                if (question.crux == 1 && answer.crux == 0) {
                                    _this.openDialog(question)
                                } else {
                                    _this.video.currentTime = answer.frameNext ? answer.frameNext : _this.video.currentTime
                                    _this.video.play()
                                }
                            },(answer.frameEnd-_this.video.currentTime)*1000)

                        }
                    })
                    _this.video.currentTime = answer.frameStart
                    _this.video.play()
                }, answer.feedbackDuration)
            },
            jump(answer, question) {
                let _this = this
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
                    if (_this.video.currentTime < answer.frameEnd && _this.video.currentTime > (answer.frameEnd - 1)) {
                        setTimeout(function () {
                            if (question.crux == 1 && answer.crux == 0) {
                                _this.openDialog(question)
                            } else {
                                _this.video.currentTime = answer.frameNext ? answer.frameNext : _this.video.currentTime
                                _this.video.play()
                            }
                        },(answer.frameEnd-_this.video.currentTime)*1000)
                    }
                })
                _this.video.currentTime = answer.frameStart
                _this.video.play()
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
                    if (obj.showTime > currentTime && (obj.showTime - 1) < currentTime && obj.showed == 0) {
                        obj.showed = 1
                        if (obj.id == 6) {
                            _this.video.addEventListener('timeupdate', function () {
                                let currentTime = this.currentTime
                                if (currentTime > 160.1 && currentTime < 161.1) {
                                    setTimeout(function () {
                                        _this.video.pause()
                                        _this.failedCourse()
                                    },(161.1-_this.video.currentTime)*1000)
                                }

                            })
                        }
                        setTimeout(function () {
                            _this.dialogMsg = obj.content
                            _this.showDialogMsg = true
                            _this.video.pause()
                            setTimeout(function () {
                                _this.showDialogMsg = false
                                _this.video.play()
                            }, 2000 * obj.content.length)
                        },(obj.showTime-_this.video.currentTime)*1000)

                    }
                })
            },
            formatDialogMsg() {
                let _this = this
                let str = JSON.stringify(_this.dialog)
                let dialog = str.replace(/（主角）/g, _this.studentName)
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
