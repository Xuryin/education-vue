<template>
    <div class="thisPage" v-if="dialogVisible">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content" v-if="gradeNum > 3">
                <span class="content-title">问题：{{questionData.content}}</span>
                <div class="content-radio">
                    <ul class="select_text">
                        <el-checkbox-group v-model="checkList">
                        <li v-for="(value, key) in questionData.answers">
                            <!--<span>{{value.answerOption}}.{{value.answerContent}}</span>-->
                            <el-checkbox :label="value.answerId+'-'+value.answerOption">{{value.answerOption}}.{{value.answerContent}}</el-checkbox>
                        </li>
                        </el-checkbox-group>
                        <li> <button @click="changeAnswer()">提交</button></li>
                    </ul>
                </div>
            </div>
            <div v-else class="content">
            <span class="content-title-pinyin">
                    <span v-for="(value, key) in questionData.contentPinyin" :key="key">
                        <ruby>
                            <rb>{{value.w}}</rb>
                            <rt>{{value.p}}</rt>
                        </ruby>
                    </span>
               </span>
                <div class="content-radio-pinyin">
                    <ul class="select_text_pinyin">
                        <li v-for="(value, key) in questionData.answers">
                            <el-checkbox label="复选框 A"></el-checkbox>
                            <span>{{value.answerOption}}.</span>
                            <span v-for="(value, key) in value.answerContentPinyin" :key="key">
                            <ruby><rb>{{value.w}}</rb><rt>{{value.p}}</rt> </ruby>
                        </span>
                        </li>

                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'
    import {getItem} from '../../../tools/common'

    export default {
        name: "msgbox",
        data() {
            return {
                dialogVisible: false,
                questionData: {},
                gradeNum: 0,
                checkList:[]
            }
        },
        methods: {
            changeAnswer() {
                console.log(this.checkList)
                this.$emit('closeDialog', {}, this.questionData,this.checkList)
                this.dialogVisible = false
            }
        },
        mounted() {
            let _this = this
            bus.$on('specialDialog', function (obj) {
                _this.questionData = obj.question
                _this.gradeNum = obj.videoGrade
                _this.dialogVisible = true
                //console.log(obj)
            })
        },
        beforeDestroy() {
            bus.$off('specialDialog')
        }
    }
</script>

<style scoped lang="less">
    @import "~static/less/reset.less";

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
        bottom: 20%;
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

    .select_text {
        padding: 0;
    }

    .select_text li {
        color: #333333;
        padding: 1.5rem 2rem;
        font-size: 1.2rem;
        text-align: left;
        span {
            padding: 0 0.2rem;
            letter-spacing: 0.1rem;
        }
    }

    .select_text li:not(:last-child) {
        border-bottom: 1px solid #cccccc;
    }

    .content-title-pinyin {
        font-size: 1.5rem;
        padding: 1.4rem 2rem 0.8rem 2rem;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        display: flex;
        flex-wrap: wrap;
        letter-spacing: 0.15rem;
        span {
            padding: 0 0.2rem;
        }
        rt {
            min-height: 1.2rem;
        }
    }

    .select_text_pinyin {
        padding: 0;
    }

    .select_text_pinyin li {
        color: #333333;
        padding: 1.8rem 2rem 0.8rem 2rem;
        line-height: 2.5rem;
        font-size: 1.2rem;
        text-align: left;
        span {
            padding: 0 0.2rem;
            letter-spacing: 0.1rem;
        }
    }

    .select_text_pinyin li:not(:last-child) {
        border-bottom: 1px solid #cccccc;
    }
</style>
