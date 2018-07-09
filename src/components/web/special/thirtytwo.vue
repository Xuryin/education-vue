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


        <v-Msg @closeDialog="closeDialog"></v-Msg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>
        <v-imgDialogMsg v-if="showImgDialogMsg"></v-imgDialogMsg>
        <v-foodDialogMsg v-if="showFoodDialogMsg"></v-foodDialogMsg>
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
                showTitle: false
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
                if (question.questionId!=96){
                    answer.frameNext = 106.52
                    _this.feedBackAndJump(answer,question,videoGrade)
                }else {
                    if (answer.answerId==221) {
                        setTimeout(function () {
                            _this.video.currentTime=106.52
                            _this.video.play()
                        },1000)
                    }else {
                        setTimeout(function () {
                            _this.video.addEventListener(function () {
                                if (this.currentTime>132&&this.currentTime<133){
                                    _this.failedCourse()
                                }
                            })
                            _this.video.currentTime=121.6
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
                    _this.video.currentTime = answer.frameNext + 1
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
        },
        mounted() {
            let _this = this
            _this.video = document.getElementById('vid')
            _this.video.ontimeupdate = function () {
                let currentTime = this.currentTime
                if (currentTime>77.88&&currentTime<78.88) {
                    _this.showImgDialogMsg = true
                    _this.video.pause()
                }
                if (currentTime>107.52&&currentTime<108.52) {
                    _this.showFoodDialogMsg= true
                    _this.video.pause()
                }
                _this.showQuestion(currentTime)
            }
            _this.video.onended = function () {
                _this.endCourse()
            }
            _this.startCourse()
            bus.$emit('sendTitle', _this.title)
            bus.$on('hidden', function (option) {
                _this.showImgDialogMsg=false
                switch (option){
                    case 'A':
                        _this.video.currentTime = 78.88
                        break
                    case 'B':
                        _this.video.currentTime = 88.4
                        break
                    case 'C':
                        _this.video.currentTime = 97.4
                        break
                    case 'D':
                        _this.video.currentTime = 106.52
                        break
                }
                _this.video.play()
            })
            bus.$on('foodSelected', function (option) {
                _this.showFoodDialogMsg=false
                //todo 判断是否包含零食
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

</style>
