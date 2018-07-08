<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content">
                <span>{{content}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import {bus} from '../../../tools/bus'
    export default {
        name: "dialogMsg",
        data() {
            return {
                content:''
            }
        },
        props: {
            dialogMsg: {
                type:Array,
                default: []
            }
        },
        methods:{
            hidden(action){
                bus.$emit('hidden',action);
            },
            showContent(){
                let _this = this
                let i = 1
                _this.content = _this.dialogMsg[0]
                let index = setInterval(function () {
                    _this.content = _this.dialogMsg[i]
                    i++
                },2000)
                if (i==_this.dialogMsg.length-1) {
                    clearInterval(index)
                }
            }
        },
        mounted(){
            this.showContent()
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
        line-height: 2rem;
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
