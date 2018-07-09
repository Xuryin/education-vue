<template>
    <div class="thisPage">
        <div class="shadow"></div>
        <div class="content_border">
            <div class="content">
                <span class="content-title">如果你是小玉，你该怎么回答</span>
                <span class="content_mention">最多可选择三样</span>
                <div class="content-radio">

                    <div :class="'snacks_' + item" @click="hidden(item)" v-for="item in 9">
                        <img src="~static/imgs/video_sock_choose.png" alt="" v-show="contain(checkList, item)">
                    </div>
                </div>

                <div>
                    <button @click="commit()">结账</button>
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
            return {
                checkList: []
            }
        },
        methods: {
            hidden(option) {

                if (this.checkList.length > 2) {
                    //this.$toast('只能选择三个哦')
                    alert('只能选择三个哦')
                }else{
                    if (this.contain(this.checkList,option)) {
                        this.checkList.remove(option)
                    }else {
                        this.checkList.push(option)
                    }

                }
                //bus.$emit('hidden', option);
            },
            commit(){
                bus.$emit('foodSelected', this.checkList);
            },
            contain (arr, item) {
                let temp=false
                arr.forEach(function (obj) {
                    if (obj == item) {
                        temp=true
                    }
                })
                return temp
            }
        },
        mounted() {
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            }
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
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

    .content_mention {
        font-size: 1.2rem;
        color: #333333;
        margin-left: 23px;
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
        width: 460px;
        background-color: @fff;
    }

    .content-radio {
        width: 100%;
        height: 240px;
        background-image: url("../../../../static/imgs/pic_sock.png");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100% 100%;
        position: relative;
        div {
            position: absolute;
        }
        .snacks_1 {
            left: 0;
            top: 0;
            width: 90px;
            height: 130px;
        }

        .snacks_2 {
            left: 110px;
            top: 0;
            width: 50px;
            height: 130px;
        }

        .snacks_3 {
            left: 170px;
            top: 0;
            width: 90px;
            height: 130px;
        }

        .snacks_4 {
            left: 270px;
            top: 0;
            width: 90px;
            height: 130px;
        }

        .snacks_5 {
            left: 370px;
            top: 0;
            width: 90px;
            height: 130px;
        }

        .snacks_6 {
            left: 0;
            top: 160px;
            width: 120px;
            height: 75px;
        }

        .snacks_7 {
            left: 120px;
            top: 160px;
            width: 125px;
            height: 75px;
        }

        .snacks_8 {
            left: 250px;
            top: 160px;
            width: 105px;
            height: 75px;
        }

        .snacks_9 {
            left: 355px;
            top: 160px;
            width: 105px;
            height: 75px;
        }

        img {
            width: 20px;
            position: absolute;
            bottom: 0;
            right: 0;
        }

        .checked {

        }
    }
</style>
