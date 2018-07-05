<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content">
                <ul>
                    <li @click="hidden('A')">
                        <img src="" alt="电玩城">
                    </li>
                    <li @click="hidden('B')">
                        <img src="" alt="小卖部">
                    </li>
                    <li @click="hidden('C')">
                        <img src="" alt="糖果屋">
                    </li>
                    <li @click="hidden('D')">
                        <img src="" alt="大型超市">
                    </li>
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
        ul {
            display: flex;
            justify-content: space-between;
            img {

            }
        }
    }
</style>
