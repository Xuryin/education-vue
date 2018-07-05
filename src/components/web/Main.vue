<template>
    <div class="thisPage">
        <v-header></v-header>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive&&isRouterAlive"></router-view>
    </div>
</template>
<script>
    import vHeader from './common/header.vue'
    export default {
        provide(){
            return {
                reload:this.reload
            }
        },
        data () {
            return {
                src: "http://localhost:8000/video/course/1/1.mp4",
                isDev: false,
                isRouterAlive:true
            }
        },
        methods: {
            reload(){
               this.isRouterAlive = false
               this.$nextTick(function () {
                   this.isRouterAlive = true
               })
            },
        toVideo  () {
                this.isDev ? this.src = "http://vjs.zencdn.net/v/oceans.mp4" : this.src = "http://localhost:8000/video/course/1/1.mp4"
                let playerOptions =  {
                    autoplay: true,
                    muted: true,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    isFullscreen: false,
                    sources: [{
                        type: "video/mp4",
                        src: "http://localhost/video/course/1/1.mp4"
                    }],
                    tracks: [{
                        kind: 'subtitles',
                        src: 'http://localhost/video/course/1/4-01.vtt',
                        // src: 'http://localhost:8000/demo1/test03?name=灰太狼',
                        srclang: "zh",
                        label: "中文",
                        default: true
                    }],
                    poster: "/static/images/author.jpg",
                    controls: false
                }
                this.$router.push({name: 'video', query: {options: playerOptions}})
            }
        },
        components: {
            vHeader
        }
    }
</script>

<style lang="less" scoped>
    .thisPage {
        height: 100%;
        overflow-y: hidden;
    }
</style>
