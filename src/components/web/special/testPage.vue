<template>
    <div class="test_page">
        <div class="test_title">
            <h2>考试焦虑自评量表</h2>
            <h3>本测试共有33道题，每道题有四个备选答案，请根据自己最符合的情况，给每道题目一个评分，并将评分填入相应的括号里。</h3>
            <h3>0-很不符合 &nbsp; &nbsp;1-较不符合 &nbsp;&nbsp; 2-比较符合 &nbsp;&nbsp; 3-很符合</h3>
        </div>

        <div class="questions" v-for="(value, key) in questionData" :key="key">
            <span>(<input type="text" v-model="value.answer" @input="checkAnswer(key)">) &nbsp;</span>
            <span>{{value.content}}</span>
        </div>



        <div class="test_answer" v-if="finished">
            <h3>共计得分： {{grade}}</h3>
            <h3>计分与评价：</h3>
            <h4>
                总得分是33个项目得分之和，根据你的总得分，查下面的评价表，就可以知道你的考试焦虑水平。
            </h4>
            <p>
                0—24：镇定。你总是以较为轻松的方式对待考试，只有在特别重要的考试前你才会有些激动。但是如果得分少于10分，则说明你对考试不在乎，学习动机较低。

            </p>
            <p>
                25—49：适度焦虑。你面对考试时有些激动，有时会有点紧张和不安。这时你的脑细胞被充分调动起来了，这种程度的焦虑有助于考试的超常发挥。只是不要让焦虑持续太久。

            </p>
            <p>
                50—74：中度焦虑。你面对考试比较紧张，这种焦虑如不及时调整，会导致你无法静心复习，考试时还会影响你的发挥。

            </p>

        </div>

        <div class="submit_button">
            <button @click="confirmAnswer"  v-if="!finished">我答完了</button>
            <button @click="toVideo"  v-if="finished">返回</button>
        </div>
    </div>
</template>

<script>
    import {getItem} from "../../../tools/common";

    export default {
        name: "testPage",
        data() {
            return {
                femaleData: [
                    {
                        content: '1.在重要的考试前几天，我就坐立不安了。'
                    },
                    {
                        content: '2.临近考试时，我就泻肚子了。'
                    },
                    {
                        content: '3.一想到考试即将来临，身体就会发僵。'
                    },
                    {
                        content: '4.考试前，我总感到苦恼。'
                    },
                    {
                        content: '5.考试前，我感到烦躁，脾气变坏。'
                    },
                    {
                        content: '6.紧张的温课期间，常会想到：“这次考试要是得到个坏分数怎么办？”'
                    },
                    {
                        content: '7.临近考试，我的注意力越难集中。 '
                    },
                    {
                        content: '8.想到马上就要考试了，参加任何文娱活动都感到没劲。'
                    },
                    {
                        content: '9.在考试前，我总预感到这次考试将要考坏。'
                    },
                    {
                        content: '10.在考试前，我常做关于考试的梦。'
                    },
                    {
                        content: '11.到了考试那天，我就不安起来。'
                    },
                    {
                        content: '12.听到开始考试的铃声响了，我的心马上紧张地急跳起来。'
                    },
                    {
                        content: '13.一到重要的考试，我的脑子就变得比平时迟钝。 '
                    },
                    {
                        content: '14.考试题目越多、越难，我越感到不安。 '
                    },
                    {
                        content: '15.考试中，我的手会变得冰凉。'
                    },
                    {
                        content: '16.考试时，我感到十分紧张。'
                    },
                    {
                        content: '17.遇到很难的考试，我就担心自己会不及格。'
                    },
                    {
                        content: '18.紧张的考试中，我却会想些与考试无关的事情，注意力集中不起来。'
                    },
                    {
                        content: '19.考试时，我会紧张得连平时记得滚瓜烂熟的知识一点也回忆不起来。'
                    },
                    {
                        content: '20.在考试中，我会沉浸在空想之中，一时忘了自己是在考试。'
                    },
                    {
                        content: '21.考试中，我想上厕所的次数比平时多些。'
                    },
                    {
                        content: '22.考试时，即使不热，我也会浑身出汗。'
                    },
                    {
                        content: '23.在考试时，我紧张得手发僵，写字不流畅。'
                    },
                    {
                        content: '24.考试时，我经常会看错题目。'
                    },
                    {
                        content: '25.在进行重要的考试时，我的头就会痛起来。'
                    },
                    {
                        content: '26.发现剩下的时间来不及做完全部考题，我就急得手足无措、浑身大汗。'
                    },
                    {
                        content: '27.如果我考了个坏分数，家长或教师会严厉地指责我。'
                    },
                    {
                        content: '28.考试后，发现自己懂得的题没有答对时，就十分生自己的气。'
                    },
                    {
                        content: '29.有几次在重要的考试之后，我腹泻了。'
                    },
                    {
                        content: '30.我对考试十分厌烦。'
                    },
                    {
                        content: '31.只要考试不计成绩，我就会喜欢考试。'
                    },
                    {
                        content: '32.考试不应当像在这样的紧张状态下进行。'
                    },
                    {
                        content: '33.如不进行考试，我能学到更多的知识。'
                    }
                ],
                maleData: [
                    {
                        content: '1.在重要的考试前几天，我就坐立不安了。'
                    },
                    {
                        content: '2.临近考试时，我就泻肚子了。'
                    },
                    {
                        content: '3.一想到考试即将来临，身体就会发僵。'
                    },
                    {
                        content: '4.考试前，我总感到苦恼。'
                    },
                    {
                        content: '5.考试前，我感到烦躁，脾气变坏。'
                    },
                    {
                        content: '6.紧张的温课期间，常会想到：“这次考试要是得到个坏分数怎么办？”'
                    },
                    {
                        content: '7.临近考试，我的注意力越难集中。 '
                    },
                    {
                        content: '8.想到马上就要考试了，参加任何文娱活动都感到没劲。'
                    },
                    {
                        content: '9.在考试前，我总预感到这次考试将要考坏。'
                    },
                    {
                        content: '10.在考试前，我常做关于考试的梦。'
                    },
                    {
                        content: '11.到了考试那天，我就不安起来。'
                    },
                    {
                        content: '12.听到开始考试的铃声响了，我的心马上紧张地急跳起来。'
                    },
                    {
                        content: '13.一到重要的考试，我的脑子就变得比平时迟钝。 '
                    },
                    {
                        content: '14.考试题目越多、越难，我越感到不安。 '
                    },
                    {
                        content: '15.考试中，我的手会变得冰凉。'
                    },
                    {
                        content: '16.考试时，我感到十分紧张。'
                    },
                    {
                        content: '17.遇到很难的考试，我就担心自己会不及格。'
                    },
                    {
                        content: '18.紧张的考试中，我却会想些与考试无关的事情，注意力集中不起来。'
                    },
                    {
                        content: '19.考试时，我会紧张得连平时记得滚瓜烂熟的知识一点也回忆不起来。'
                    },
                    {
                        content: '20.在考试中，我会沉浸在空想之中，一时忘了自己是在考试。'
                    },
                    {
                        content: '21.考试中，我想上厕所的次数比平时多些。'
                    },
                    {
                        content: '22.考试时，即使不热，我也会浑身出汗。'
                    },
                    {
                        content: '23.在考试时，我紧张得手发僵，写字不流畅。'
                    },
                    {
                        content: '24.考试时，我经常会看错题目。'
                    },
                    {
                        content: '25.在进行重要的考试时，我的头就会痛起来。'
                    },
                    {
                        content: '26.发现剩下的时间来不及做完全部考题，我就急得手足无措、浑身大汗。'
                    },
                    {
                        content: '27.如果我考了个坏分数，家长或教师会严厉地指责我。'
                    },
                    {
                        content: '28.考试后，发现自己懂得的题没有答对时，就十分生自己的气。'
                    },
                    {
                        content: '29.有几次在重要的考试之后，我腹泻了。'
                    },
                    {
                        content: '30.我对考试十分厌烦。'
                    },
                    {
                        content: '31.只要考试不计成绩，我就会喜欢考试。'
                    },
                    {
                        content: '32.考试不应当像在这样的紧张状态下进行。'
                    },
                    {
                        content: '33.如不进行考试，我能学到更多的知识。'
                    }
                ],
                questionData: [],
                gender: '',
                finished: false,
                grade: 0,
                courseId:'',
                recordId:''
            }
        },
        methods: {
            getInfo() {
                let userInfo = getItem('studentInfo')
                this.gender = userInfo.gender
                this.gender == 0 ? this.questionData = this.maleData :
                    this.questionData = this.femaleData
            },
            checkAnswer(key){
                let pregx = /^(0|1|2|3)$/
                let e = window.event
                if (!pregx.test(e.target.value)) {
                    this.$alert('请填写0到3的整数', {
                        confirmButtonText: '确定',
                        center:true,
                        callback: action => {
                        }
                    })
                    this.questionData[key].answer=''
                }
            },
            confirmAnswer() {
                let _this = this
                let answerList = []
                for (let i = 0; i < 33; i++) {
                    let p={}
                    // todo 要验证是否都为0-3的数字
                    if (_this.questionData[i].answer=='') {
                        this.$alert('第'+(i+1)+'题没有填写答案，请仔细检查', {
                            confirmButtonText: '确定',
                            center:true,
                            callback: action => {
                                console.log(action)
                            }
                        })
                        return
                    }else {
                        let q = i+1
                        p[q] =  _this.questionData[i].answer
                        answerList.push(p)
                        _this.grade += parseInt(_this.questionData[i].answer)
                    }
                }
                // if (0<=_this.grade&&_this.grade<24){
                //     this.$alert('第'+(i+1)+'题没有填写答案，请仔细检查', {
                //         confirmButtonText: '返回视频',
                //         center:true,
                //         callback: action => {
                //             console.log(action)
                //         }
                //     })
                // } else if (25<=_this.grade&&_this.grade<49){
                //
                // }else if (50<=_this.grade&&_this.grade<74){
                //
                // }else if (75<=_this.grade&&_this.grade<100){
                //
                // }
                _this.finished = true
                //console.log(this.grade)
                localStorage.setItem('answerList',JSON.stringify(answerList))
                console.log(answerList)
                //todo 提交分数到后台
            },
            toVideo () {
                // 跳转
                let name='sixtynine'
                if (this.courseId==70){
                    name = 'seventy'
                }
                this.$router.push({name: name, query: {courseId: this.courseId,complete:1,recordId:this.recordId}})
            }
        },
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = true;  // B 跳转到 A 时，让 A 缓存，即不刷新
            next();
        },
        mounted() {
            this.getInfo()
            this.courseId = this.$route.query.courseId
            this.recordId = this.$route.query.recordId
        }
    }
</script>

<style scoped lang="less">
    @import "~static/less/reset.less";

    .test_page {
        padding: 6rem 12.5% 0 12.5%;
        height: 85%;
        overflow-y: auto !important;
    }

    .test_title {
        position: fixed;
        top: 6rem;
        background-color: white;
        h2, h3 {
            text-align: center;
        }

        h2 {
            margin-top: 20px;
        }

        h3 {
            text-align: center;
            margin-top: 10px;
        }
    }

    .questions {
        padding-left: 20px;
        text-align: left;
        margin-top: 20px;
        font-size: 1.2rem;
        line-height: 2.5rem;
        span:nth-child(1) {
            input {
                width: 40px;
                border: none;
                text-align: center;
            }
        }
    }

    .test_answer {
        h3 {
            margin-top: 20px;
        }
        h4 {
            margin: 10px 0;
        }
        p {
            font-size: 1rem;
            line-height: 2rem;
        }
    }

    .submit_button {
        text-align: center;
        margin-top: 20px;
        button {
            width: 220px;
            height: 50px;
            border-radius: 10px;
            background-color: #FF7E00;
            color: #fff;
            font-size: 1.5rem;
            line-height: 50px;
            border: none;
        }
    }
</style>
