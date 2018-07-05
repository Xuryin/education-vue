<template>
    <div class="details_page">
        <div class="details_title">
            <div>课程目录</div>
            <ul >
                <li v-for="(value, key) in listMyCourse.grades" :key="key" @click="checkGrade(value)"
                    v-bind:class="{greyBg:value.usable==0,blueBg:value.usable==1, yellowBg: gradeChecked == value.gradeNum}">{{value.gradeName}}</li>
            </ul>
            <div @click="$router.push({name: 'webHome'})">
                <span>返回首页</span>
            </div>
        </div>
        <ul class="details_content">
            <li v-for="(value, key) in listMyCourse.items" :key="key"
                @click="playVideo(value.courseId)">
                <div class="video_show">
                    <img :src="$myUrl.baseUrl() + value.imgUrl">
                    <span class="video_index">{{key + 1}}集</span>
                    <span class="video_time">{{value.duration}}</span>
                    <span class="video_button" v-if="value.usable == 1">
                        <img src="~static/imgs/play.png" alt="">
                    </span>
                    <span class="video_shadow" v-if="value.usable == 0"></span>
                </div>
                <span class="video_title">{{value.name}}</span>

            </li>
        </ul>
        <v-foot></v-foot>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../../tools/bus'
    import {getItem} from '../../../tools/common'
    import vFoot from '../common/Footer.vue'
    export default {
        inject: ['reload'],
        data() {
            return {
                playerOptions: {
                    height: '500px',
                    controls: false,
                    autoplay: true, //是否自动播放
                    muted: false, //是否静音
                    language: "zh-CN",
                    isFullscreen: true,
                    sources: [{
                        type: "video/mp4",
                        src: "http://localhost/video/course/1/1.mp4"
                    }],
                    tracks: [{
                        kind: 'subtitles',
                        src: 'http://localhost/video/course/1/101《我上小学了》.vtt',
                        // src: 'http://localhost:8000/demo1/test03?name=灰太狼',
                        srclang: "zh",
                        label: "中文",
                        default: true
                    }],
                    controlBar: {
                        fullscreenToggle: false
                    },
                    poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg"
                },
                userData: {},
                listMyCourse:{},
                videoList: [],
                gradeChecked: 0,
                title: '交互式课程'
            }
        },
        methods: {
            checkGrade (value) {
                if (value.usable == 0) {
                    return false
                } else {
                    this.gradeChecked = value.gradeNum
                    let p = {}
                    p.studentId = this.userData.studentId;
                    p.gradeNum = value.gradeNum
                    this.courseList(p)
                }
            },
            courseList(p){
                let url = '/course/listMyCourse';
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        this.listMyCourse = res.data
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
            getInfo(){
                this.userData = getItem('studentInfo')
                this.gradeChecked = this.userData.gradeNum
            },
            playVideo(courseId){
                let videoUrl = '/course/detail';
                let p = {};
                let _this = this
                let studentId = _this.userData.studentId
                p.courseId = courseId;
                if (courseId===25){
                    this.$router.push({name: 'twentyFif', query: {courseId:courseId}})
                } else if (courseId===27){
                    this.$router.push({name: 'twentyseven', query: {courseId:courseId}})
                }else if (courseId===28){
                    this.$router.push({name: 'twentyeight', query: {courseId:courseId}})
                }else if (courseId===29){
                    this.$router.push({name: 'twentynine', query: {courseId:courseId}})
                }else if (courseId===31){
                    this.$router.push({name: 'thirtyone', query: {courseId:courseId}})
                }else if (courseId===32){
                    this.$router.push({name: 'thirtytwo', query: {courseId:courseId}})
                }
                else {
                    this.$router.push({name: 'video', query: {courseId:courseId}})
                }
            }
        },
        mounted() {
            this.getInfo()
            let p = {}
            p.studentId = this.userData.studentId;
            this.courseList(p)
        },
        activated () {
            let _this = this
            bus.$on('getGrade', function () {
                _this.getInfo()
            })
            let p = {}
            p.studentId = this.userData.studentId;
            p.gradeNum = this.gradeChecked
            this.courseList(p)
            bus.$emit('sendTitle', this.title)
        },
        components: {
            vFoot
        }
    }
</script>

<style scoped lang="less">
    @import "~static/less/reset.less";
    .details_title {
        width: 75%;
        margin-left: 12.5%;
        margin-top: 1%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 10px;
        border-bottom: 1px solid #cccccc;
        div:nth-child(1) {
            width: 15%;
            font-size: 1.88rem;
            color: @333;
            padding-left: 18px;
        }
        ul {
            width: 75%;
            display: flex;
            justify-content: flex-start;
        }
        li {
            width: 5.625rem;
            height: 1.88rem;
            line-height: 1.88rem;
            text-align: center;
            border-radius: 5px;
            font-size: @20;
            color: @fff;
        }
        .blueBg {
            background-color: rgb(27, 183, 249);
        }

        .yellowBg {
            background-color: #fc9a00;
        }

        .greyBg {
            background-color: rgb(153, 153, 153);
        }

        li:not(:first-child) {
            margin-left: 10px;
        }
        div:nth-child(3) {
            width: 10%;
            span {
                display: block;
                width: 5rem;
                height: 5rem;
                line-height: 5rem;
                border-radius: 50%;
                text-align: center;
                background-color: rgb(27, 183, 249);
                color: @fff;
            }
        }
    }

    .details_content {
        width: 100%;
        display: flex;
        padding: 0 12%;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 20px;
        li {
            width: 25%;
            padding: 0 0.8%;
            .video_show {
                position: relative;
                img {
                    width: 100%;
                }
            }
            .video_title {
                height: 56px;
                display: block;
                line-height: 56px;
                text-align: center;
                color: @333;
                font-size: @22;
            }
        }
        .video_index {
            width: 4.25rem;
            height: 1.75rem;
            font-size: 1.16rem;
            line-height: 1.75rem;
            text-align: center;
            color: @fff;
            background-color: rgba(0, 0, 0, 0.6);
            position: absolute;
            left: 0;
            bottom: 3px;
            letter-spacing: 2px;
        }

        .video_time {
            display: block;
            padding: 2px;
            border-radius: 5px;
            color: @fff;
            font-size: 0.88rem;
            background-color: rgba(0, 0, 0, 0.4);
            position: absolute;
            right: 5px;
            bottom: 10px;
        }

        .video_button {
            width: 20%;
            position: absolute;
            top: 30%;
            left: 40%;
        }

        .video_shadow {
            height: 100%;
            width: 100%;
            background-color: @000;
            opacity: 0.5;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>
