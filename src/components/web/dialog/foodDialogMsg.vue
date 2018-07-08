<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content">
                <ul>
                    <li @click="hidden()">商品1</li>
                    <li @click="hidden()">商品2</li>
                    <li @click="hidden()">商品3</li>
                    <li @click="hidden()">商品4</li>
                    <li @click="hidden()">商品5</li>
                    <li @click="hidden()">商品6</li>
                    <li @click="hidden()">商品7</li>
                    <li @click="hidden()">商品8</li>
                    <li @click="hidden()">商品9</li>
                </ul>
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
                bus.$emit('hidden',option);
            }
        },
        mounted(){

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
