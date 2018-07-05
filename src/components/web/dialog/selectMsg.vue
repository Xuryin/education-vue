<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content-pinyin" v-if="msg.gradeNum < 4">
           <span v-for="(value, key) in msg.feedbackPinyin" :key="key">
                        <ruby><rb>{{value.w}}</rb><rt>{{value.p}}</rt> </ruby>
                    </span>
            </div>

            <div class="content" v-else>
                <span>{{msg.feedback}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'
    import {getItem} from '../../../tools/common'
    export default {
        name: "selectMsg",
        props: ['msg'],
        data() {
            return {
                gradeNum: 0
            }
        },
        methods: {
            getGrade() {
                let userData = getItem('studentInfo')
                this.gradeNum = userData.gradeNum
            }
        },
        mounted () {
            this.getGrade()
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
        opacity: 0.2;
        background-color: #333333;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content_border {
        min-width: 1280px;
        width: 100%;
        position: absolute;
        bottom: 40%;
        display: flex;
        justify-content: center;
    }

    .content {
        padding: 2rem 2rem;
        max-width: 40rem;
        min-width: 20rem;
        border-radius: 5px;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        color: @fff;
        font-size: 1.5rem;
        span {
            letter-spacing: 0.1rem;
        }
    }

    .content-pinyin {
        padding: 2.2rem 2rem 1.2rem 2rem;
        max-width: 40rem;
        min-width: 20rem;
        border-radius: 5px;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        color: @fff;
        font-size: 1.5rem;
        span {
            letter-spacing: 0.1rem;
        }
    }
</style>
