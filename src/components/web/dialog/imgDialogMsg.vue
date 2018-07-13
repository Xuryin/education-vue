<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content" >
                <span class="content-title">如果你是小玉，你该怎么回答</span>
                <div class="content-radio">
                    <div class="shop" @click="hidden('A')"></div>
                    <div class="gameCenter" @click="hidden('C')"></div>
                    <div class="snacks"  @click="hidden('D')"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'
    export default {
        name: "imgDialogMsg",
        data() {
            return {}
        },
        methods:{
            hidden(option){
                bus.$emit('imgSelected',option);
            }
        },
        mounted(){
            console.log(3232)
        }
    }
</script>

<style scoped lang="less">
    @import "~static/less/reset.less";

    .thisPage {
        height: 100%;
    }

    .shadow {
        height: calc(98% - 10rem);
        margin-top: 10rem;
        margin-left: 18%;
        width: 64%;
        opacity: 0.2;
        background-color: #333333;
        position: absolute;
        top: 0;
        left: 0;
    }

    .content-title {
        font-size: 1.5rem;
        text-align: center;
        line-height: 2.5rem;
        padding: 1.2rem 2rem;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(to right, rgb(29, 113, 242) 0%, rgb(26, 199, 251) 100%);
        display: flex;
        flex-wrap: wrap;
        letter-spacing: 0.15rem;
        word-wrap: break-word;
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
        width: 460px;
        background-color: @fff;
    }

    .content-radio {
        width: 100%;
        height: 240px;
        background-image: url("../../../../static/imgs/video_scene.png");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        position: relative;
        div {
            position: absolute;
        }
        .shop {
            left: 20px;
            top: 90px;
            width: 80px;
            height: 80px;
        }

        .supermarket {
            left: 160px;
            top: 0;
            width: 130px;
            height: 100px;
        }

        .gameCenter {
            left: 300px;
            top: 20px;
            width: 90px;
            height: 150px;
        }

        .snacks {
            left: 145px;
            top: 139px;
            width: 90px;
            height: 90px;
        }
    }
</style>
