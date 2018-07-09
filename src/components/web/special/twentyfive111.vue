<template>
    <div class="videoPage">
        <div class="video_content_title">
            <img src="~static/imgs/btn_back.png" alt="返回" @click="$router.push({name: 'courseDetails'})">
            <span>{{orderNum}}：{{videoTitle}}</span>
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
    </div>
</template>

<script>
    import vMsg from '../dialog/msg'
    import vSelectmsg from '../dialog/selectMsg'
    import {bus} from '../../../tools/bus'
    import vFinished from '../dialog/finishedDialog'
    import {selectMsgDIalog, revertNumber, getItem} from '../../../tools/common'

    export default {
        inject: ['reload'],
        data() {
            return {
                sourceSrc: '',
                questions: [
                    {
                        questionId: 64,
                        showTime: 52.64,
                        content: '这个时候你应该怎么做呢',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 132,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '不停的用笔戳小星，知道他停止吃东西。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 133,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '给小星传小纸条说：“老师发现你吃东西了。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            }
                        ]
                    },
                    {
                        questionId: 65,
                        showTime: 86.6,
                        content: '这时候你会说什么？',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 134,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '小星，你这样会影响到其他同学，你要锤就去外面。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 135,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '小星，你上课吃东西本来就不对，老师批评你，你还锤桌子。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 136,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '小星，锤桌子的方法不是很好，我这里有漫画书，可以借给你看。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            }
                        ]
                    },
                    {
                        questionId: 66,
                        showTime: 96.64,
                        content: '你觉得小星听到你的话会怎么想？',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 137,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '哼，不玩就不玩，我还不想和你玩呢！',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 138,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '我是不是有点过份了，我应该道歉。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 139,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '火气真大，不就一个文具盒吗？',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            }
                        ]
                    },
                    {
                        questionId: 67,
                        showTime: 100.6,
                        content: '这时候你会怎么做呢？',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 140,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '主动告诉小星老师让他去一趟办公室',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 135.72,
                            },
                            {
                                answerId: 141,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '通过其他同学转告小星',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 142,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '犹豫不决，不知道怎么告诉小星',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 123.92,
                            }
                        ]
                    },
                    {
                        questionId: 70,
                        showTime: 152.2,
                        content: '这时你会怎么想？',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 149,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '小星平时大大咧咧的，想不到他还挺看重我这个朋友。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 150,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '小星居然能说出这番话，我应该见好就收。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 151,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '小星的道歉很真诚，这件事我也有做得不对的地方，我需要跟他道歉。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            }
                        ]
                    },
                    {
                        questionId: 68,
                        showTime: 120.72,
                        content: '你此时心里的感受是：',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 143,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '我可以像廉颇、蔺相如一样做一个心胸宽广的人。',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 135.72,
                            },
                            {
                                answerId: 144,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '哼！是小星不对在先，我要等着他来向我道歉。',
                                type: 1,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 0,
                            },
                            {
                                answerId: 145,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '明明是他不对，我才不要理解他，说了不跟他玩就不跟他玩。',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 158.04,
                            }
                        ]
                    },
                    {
                        questionId: 69,
                        showTime: 135.68,
                        content: '你此时心里的感受是：',
                        crux: 0,
                        selectType: 1,
                        selected: [],
                        answers: [
                            {
                                answerId: 146,
                                crux: 0,
                                answerOption: 'A',
                                answerContent: '我可以像廉颇、蔺相如一样做一个心胸宽广的人。',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 135.72,
                            },
                            {
                                answerId: 147,
                                crux: 0,
                                answerOption: 'B',
                                answerContent: '哼！是小星不对在先，我要等着他来向我道歉。',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 158.04,
                            },
                            {
                                answerId: 148,
                                crux: 0,
                                answerOption: 'C',
                                answerContent: '明明是他不对，我才不要理解他，说了不跟他玩就不跟他玩。',
                                type: 3,
                                feedback: '',
                                frameStart: 0,
                                frameEnd: 0,
                                frameNext: 158.04,
                            }
                        ]
                    },
                ],
                dialog: [
                    {
                        showTime: 96,
                        content: [
                            this.studentName + '着急地反驳：“小星，你你你狗咬吕洞宾，不识好人心，我好心提醒你，你反倒说我害你，你真是不可理喻。”',
                            '小星与' + this.studentName + '在教室中推搡起来，“嘭”的一声，' + this.studentName + '放在桌边的美国队长文具盒摔在地上，文具盒分成两半，里面的铅笔、橡皮擦、转笔刀都散了出来。',
                            '小星目瞪口呆，' + this.studentName + '则十分愤怒。',
                            this.studentName + '气愤地指责小星说：“你这人怎么这样啊，我好心提醒你，你却把我的文具盒摔坏了，真是好心没好报，我再也不跟你玩了！”'
                        ]
                    },
                    {
                        showTime: 102.8,
                        content: [
                            this.studentName + '在教室门口遇到了广广。',
                            this.studentName + '：“广广，你帮我去跟小星说，汪老师找他去办公室。”'
                        ]
                    },
                    {
                        showTime: 109.48,
                        content: [
                            this.studentName + '：“还不是因为他上课吃面包的事情，我们俩吵了一架。”'
                        ]
                    },
                    {
                        showTime: 121.72,
                        content: [
                            this.studentName + '：“广广还是你去帮我告诉小星吧，我就不去了。谢谢你！”'
                        ],
                        frameStart: 123.88,
                        frameNext: 135.72
                    },
                    {
                        showTime: 153.2,
                        content: [
                            this.studentName + '：“小星，我也有要跟你道歉的地方，前天你心情不好，我不应该跟你争吵，我也应该更宽容一点，谢谢你买的新文具盒！”'
                        ],
                        endTime: 158
                    },
                    {
                        showTime: 159,
                        content: [
                            '接下来几天你和小星都在冷战。'
                        ],
                        endTime: 0,
                    }
                ],
                showMsg: false,
                studentName: '',
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
                videoStatus: false
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
                    // this.questions.forEach(function (obj) {
                    //     if (question.questionId == obj.questionId) {
                    //         obj.isShow = false
                    //     }
                    // })
                    this.answers.push({
                        questionId: question.questionId,
                        option: answer.answerOption,
                        answerId: answer.answerId
                    })
                    this.errorCount = 0
                }
                if (question.crux == 0) {
                    // this.questions.forEach(function (obj) {
                    //     if (question.questionId == obj.questionId) {
                    //         obj.isShow = false
                    //     }
                    // })
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
                        _this.video.currentTime = _this.video.currentTime + 1
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
                            _this.failedCourse()
                        }
                    } else {
                        _this.video.currentTime = _this.video.currentTime + 1
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
                        //console.log('ok', res)
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
            //this.timeUpdate()
            _this.video.ontimeupdate = function () {
                //console.log(this.currentTime)
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
        components: {
            vMsg, vSelectmsg, vFinished
        },
    }
</script>


<style lang="less">
    @import "~static/less/reset.less";
    @import "~static/less/video.less";
</style>
