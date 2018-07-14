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
                        this.videoTitle = res.data.title
                        this.videoGrade = res.data.gradeNum
                        this.orderNum = res.data.orderNum
                        this.showTitle = true
                        this.sourceSrc = this.$myUrl.baseUrl() + res.data.video
                        this.nextCourseId = res.data.nextCourseId
                    })
                    .catch(err=>{
                        console.log('err',err)
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
                question.isShow = false
                this.natural(answer,question)
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
            _this.video.onended = function () {
                //todo 弹出调查问卷  弹出反馈  //根据性别不同显示不同问题 及反馈
                _this.$router.push({name: 'testPage',query: {courseId:  69}})
                //_this.endCourse()
            }
            bus.$on('hidden', function (action) {
                console.log(action)
                if (action == 'reload') {
                    _this.reload()
                }
                if (action == 'next') {
                    _this.$router.push({name: 'seventy', query: {courseId:  _this.nextCourseId}})
                    _this.reload()
                }
            })
            _this.startCourse()
            bus.$emit('sendTitle', _this.title)
        },
        beforeCreate () {
            let wid = document.body.clientWidth
            let hei = document.body.clientHeight
            this.videoWidth = wid * 0.75
            this.videoHeight = hei - 200

        },
        activated () {
            if (!this.$router.query.complete) {
                this.reload()
            }
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
