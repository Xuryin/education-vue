<template>
    <div class="home_page">
        <div class="pic_content">
            <div @click="routerTo('courseDetails')">
                <span class="img_shadow"></span>
                <img :src="gradeSrc" alt="课程">
            </div>
            <div @click="routerTo()">
                <span class="img_shadow"></span>
                <img src="~static/imgs/index_rzxl.png" alt="认知训练">
            </div>
            <div>
                <ul>
                    <li>
                        <span class="img_shadow"></span>
                        <img src="~static/imgs/index_qwcs.png" alt="趣味测试" @click="routerTo()">
                    </li>
                    <li>
                        <span class="img_shadow"></span>
                        <img src="~static/imgs/index_qxfs.png" alt="情绪放松" @click="routerTo()">
                    </li>
                    <li>
                        <span class="img_shadow"></span>
                        <img src="~static/imgs/index_dzyl.png" alt="电子阅读" @click="routerTo()">
                    </li>
                    <li>
                        <span class="img_shadow"></span>
                        <img src="~static/imgs/index_czda.png" alt="成长档案" @click="routerTo()">
                    </li>
                </ul>
            </div>
        </div>
        <v-foot></v-foot>
    </div>
</template>
<script>
    import vFoot from './common/Footer.vue'
    import {getItem} from '../../tools/common'
    import {bus} from '../../tools/bus'

    export default {
        name: 'home',
        data() {
            return {
                userData: {},
                gradeSrc: '',
                title: '心理健康教育智能辅导系统'
            }
        },
        methods: {
            routerTo(dir) {
                this.$router.push({name: dir})
            }
        },
        created() {
            this.userData = getItem('studentInfo')
            this.userData.gradeNum > 6 ? this.gradeSrc = '../../static/imgs/index_kc_cz.png' :
                this.gradeSrc = '../../static/imgs/index_kc_xx.png'
            bus.$emit('sendTitle', this.title)
        },
        components: {
            vFoot
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/reset.less";

    .home_page {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        background: url(~static/imgs/index_bj.jpg) no-repeat 100% 120%;
    }

    .img_shadow {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        background-color: #333333;
        opacity: 0;
        z-index: 999;
    }

    .pic_content {
        width: 100%;
        padding: 0 12.5%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 5%;
        div:nth-child(1) {
            width: 22.8%;
            overflow: hidden;
            position: relative;
            img {
                width: 100%;
            }
        }

        div:nth-child(1):hover {
            .addHover;
        }
        div:nth-child(2) {
            width: 22.8%;
            overflow: hidden;
            position: relative;
            img {
                width: 100%;
            }
        }
        div:nth-child(2):hover {
            .addHover;
        }
        div:nth-child(3) {
            width: 52.4%;
            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
            li {
                width: 49%;
                text-align: left;
                overflow: hidden;
                position: relative;
            }
            li:nth-child(3), li:nth-child(4) {
                margin-top: 1.9%;
            }
            li:hover {
                .addHover;
            }
            img {
                width: 100%;
            }

        }
    }

    .addHover {
        img {
            transform: scale(1.2);
            animation: hoverPicture 0.5s ease-in;
        }
        .img_shadow {
            opacity: 0.4;
            z-index: 999;
        }
    }

</style>

