<template>
    <div class="thisPage" v-if="dialogVisible">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content">
                <div class="content-title">你呢？你会选择几号岛呢？</div>
                <div class="content-radio">
                    <div @click="hidden(value, key)" v-for="(value, key) in pictureList" :key="key">
                        <img :src="value.url" alt="" class="main_pic">
                        <img src="~static/imgs/video_sock_choose.png" alt=""
                             v-show="checkPic == key"
                             class="check_img">
                        <span class="island_name">{{key}}号岛</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'

    export default {
        name: "islandDialogMsg",
        data() {
            return {
                pictureList: [
                    {
                        url: '../../../static/imgs/pic_video_01.jpg'
                    },
                    {
                        url: '../../../static/imgs/pic_video_02.png'
                    },
                    {
                        url: '../../../static/imgs/pic_video_03.jpg'
                    },
                    {
                        url: '../../../static/imgs/pic_video_04.jpg'
                    },
                    {
                        url: '../../../static/imgs/pic_video_05.jpg'
                    },
                    {
                        url: '../../../static/imgs/pic_video_06.jpg'
                    },
                ],
                dialogVisible: false,
                gradeNum: 0,
                isPinyin: true,
                checkPic: 6
            }
        },
        methods: {
            hidden(value, key) {
                this.checkPic = key
                this.dialogVisible = false
                bus.$emit('islandSelected', this.questionData.answers[key]);
            },
            commit() {
                //bus.$emit('foodSelected', this.checkList);
            }
        },
        mounted() {
            let _this = this
            bus.$on('openIslandDialog', function (obj) {
                _this.dialogVisible = true
                _this.gradeNum = obj.videoGrade
                _this.questionData = obj.question
                _this.gradeNum < 4 ? _this.isPinyin = true : _this.isPinyin = false
            })
        },
        beforeDestroy () {
            bus.$off('openIslandDialog')
        }
    }
</script>

<style scoped lang="less">
    @import "~static/less/reset.less";

    .thisPage {
        height: 100%;
    }

    .shadow {
        height: calc(100% - 6rem);
        width: 100%;
        min-width: 1280px;
        margin-top: 6rem;
        opacity: 0.2;
        background-color: #333333;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content-title {
        font-size: 1.5rem;
        text-align: center !important;
        line-height: 2.5rem;
        padding: 1rem 2rem;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        display: block;
        letter-spacing: 0.1rem;
        word-wrap: break-word;
    }

    .content_mention {
        font-size: 1.5rem;
        color: #333333;
        margin-left: 20px;
        line-height: 2.5rem;
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
        width: 540px;
        background-color: @fff;
    }

    .content-radio {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 20px 20px 20px;
        .b;
        div {
            position: relative;
            width: 33%;
            text-align: center;
            margin-top: 20px;
            .main_pic {
                width: 96%;
            }
            .check_img {
                position: absolute;
                z-index: 999;
                bottom: 1.5rem;
                right: 0;
            }
        }
    }

    .island_name {
        font-size: 1.5rem;
        line-height: 2.5rem;
    }
</style>
