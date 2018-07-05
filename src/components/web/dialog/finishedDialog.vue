<template>
    <div class="dialog_page">
        <div class="content_border">
            <div class="finishedDialog" v-if="finishedMsg.complete==0">
                <div class="finishedDialog_title">
                    <img src="~static/imgs/pic_right.png" alt="" v-if="finishedMsg.success">
                    <img src="~static/imgs/pic_error.png" alt="" v-else>
                    <span v-if="finishedMsg.success">恭喜你完成了该主题的学习</span>
                    <span v-else>抱歉，你未完成该主题的学习</span>
                </div>

                <div class="finishedDialog_grade">
                    <img src="~static/imgs/pic_czb.png" alt="" v-if="finishedMsg.score!=0">
                    <span v-if="finishedMsg.score!=0">+{{finishedMsg.score}}</span>
                </div>

                <ul class="bottom_button">
                    <li >
                        <button @click="$router.push({name: 'courseDetails'})">返回</button>
                    </li>
                    <li>
                        <button v-if="finishedMsg.success" @click="hidden('next')">下一课</button>
                        <button v-else @click="hidden('reload')">重新学习</button>
                    </li>
                </ul>
            </div>

            <div class="finishedDialog_2" v-if="finishedMsg.complete==1">
                <img src="~static/imgs/pic_good.png" alt="">
                <p>恭喜你完成了本年级所有课程的学习！</p>
                <button @click="$router.push({name: 'courseDetails'})">返回</button>
            </div>
        </div>

    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'
    export default {
        name: "finishedDialog",
        data() {
            return {}
        },
        props: {
            finishedMsg: {
                type:Object,
                default: {
                    complete: 0,
                    success: false,
                    score: 0,
                    nextCourseId:0
                }
            }
        },
        methods:{
            hidden(action){
                bus.$emit('hidden',action);
            }
        }
    }
</script>

<style scoped>
    .content_border {
        min-width: 1280px;
        width: 100%;
        position: absolute;
        bottom: 20%;
        display: flex;
        justify-content: center;
    }

    .dialog_page {
        margin: 0 auto;
    }

    .finishedDialog {
        width: 39.875rem;
        margin: 0 auto;
        height: 21.25rem;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 3.45rem 4rem 0 4rem;
        box-sizing: border-box;
    }

    .finishedDialog_title {
    }

    .finishedDialog_title img {
        width: 4rem;
    }

    .finishedDialog_title span {
        font-size: 2rem;
        color: #363636;
        position: relative;
        top: -1rem;
    }

    .finishedDialog_grade {
        margin: 1.5rem auto;
        height: 3.5rem;
        display: flex;
        justify-content: center;
    }

    .finishedDialog_grade img {
        width: 2.5rem;
        height: 2.5rem;
        position: relative;
        left: -0.5rem;
        top: 0.3rem;
    }

    .finishedDialog_grade span {
        font-size: 2.5rem;
        color: #FF7E00;
    }

    .bottom_button {
        display: flex;
        justify-content: space-between;
        padding: 0;
    }

    .bottom_button li {
        text-align: center;
        width: 50%;
        height: 4rem;
    }

    .bottom_button li button {
        width: 80%;
        height: 4rem;
        border: none;
        border-radius: 5px;
    }

    .bottom_button li:nth-child(1) button{
        background-color: #eee;
        color: #333333;
        font-size: 2rem;
    }

    .bottom_button li:nth-child(2) button{
        background-color: #3B8F02;
        color: #fff;
        font-size: 2rem;
    }

    /*以下是第二个框*/

    .finishedDialog_2 {
        width: 39.875rem;
        margin: 0 auto;
        height: 21.25rem;
        position: absolute;
        bottom: 30%;
        left: 10%;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 3.45rem 5rem 0 5rem;
        box-sizing: border-box;
        text-align: center;
    }

    .finishedDialog_2 img {

    }

    .finishedDialog_2 p {
        font-size: 1.5rem;
    }

    .finishedDialog_2 button {
        width: 10rem;
        height: 3rem;
        border: none;
        background-color: #F3A818;
        border-radius: 10px;
        color: #ffffff;
        font-size: 2rem;
        margin-top: 2rem;
    }
</style>
