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
        <v-MulMsg @closeDialog="closeDialog"></v-MulMsg>

        <v-selectmsg :msg="msg" v-if="showMsg"></v-selectmsg>

        <v-finished :finishedMsg="finishedMsg" v-if="showfinishedMsg" @closeDialog="closeDialog"></v-finished>
    </div>
</template>

<script>
    import vMsg from '../dialog/msg'
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
                msg: {},
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
                showTitle: false
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
                            if (obj.questionId==87||obj.questionId==91){
                                obj.isShow=true
                            }
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
                    question.showTime < currentTime &&
                    (question.showTime + 1) > currentTime &&
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
                    _this.video.pause()
                    if (question.questionId!=92){
                        bus.$emit('openDialog', obj)
                    } else {
                        bus.$emit('specialDialog',obj)
                    }
                },(question.showTime-_this.video.currentTime)*1000)

            },
            closeDialog(answer, question,checkList=[]) {
                question.isShow = false
                if (question.questionId != 92) {
                    this.answers.push({
                        questionId: question.questionId,
                        option: answer.answerOption,
                        answerId: answer.answerId
                    })
                    this.natural(answer,question)
                }else {
                    let _this = this
                    checkList.forEach(function (obj) {
                        _this.answers.push({
                            questionId: question.questionId,
                            option: obj.split('-')[1],
                            answerId: obj.split('-')[0]
                        })
                    })
                    setTimeout(function () {
                        _this.video.play()
                    }, 3000)
                }
            },
            natural(answer,question){
                if (answer.feedbackDuration == null || answer.feedbackDuration == '' || answer.feedbackDuration == undefined) {
                    answer.feedbackDuration = 3000
                }
                let _this = this
                if (question.questionId === 87||question.questionId===91) {
                    _this.questions.forEach(function (obj) {
                        if (answer.answerId === 194&&obj.questionId==88) {
                            obj.isShow=true
                            console.log(88)
                            _this.openDialog(obj)
                        }else if (answer.answerId === 195&&obj.questionId==89){
                            obj.isShow=true
                            console.log(89)
                            _this.openDialog(obj)
                        }else if (answer.answerId === 196&&obj.questionId==90){
                            obj.isShow=true
                            console.log(90)
                            _this.openDialog(obj)
                        }else if (answer.answerId === 207&&obj.questionId==92){
                            obj.isShow=true
                            _this.openDialog(obj)
                        }
                    })
                }
                setTimeout(function () {
                    if (question.questionId !== 87&&question.questionId!==91){
                        _this.video.play()
                    }
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
        },
        beforeCreate () {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        components: {
            vMsg, vSelectmsg,vFinished,vMulMsg
        },
    }
</script>


<style lang="less" >
    @import "~static/less/reset.less";
    @import "~static/less/video.less";
</style>
