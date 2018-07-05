<template>
    <div>
        <button @click="login">登录</button><br/>
        <button @click="getInfo">获取个人信息</button><br/>
        <button @click="courseList">获取课程列表</button><br/>
        <button @click="detail">获取课程详情</button><br/>
        <button @click="subtitle">字幕地址</button><br/>
        <button @click="start">开始课程</button><br/>
        <button @click="end">结束课程</button><br/>
    </div>
</template>
<script>
    export default {
        data(){
            return {}
        },
        methods: {
            login(){
                let url = '/student/login';
                let p = {};
                p.no = '001';           //学号,必填
                p.password = '123456';  //密码,必填
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        console.log('成功',res);
                        localStorage.studentToken = res.data.token;
                    })
                    .catch(err=>{
                        console.log('err',err)
                    });
            },
            getInfo(){
                let url = '/student/info';
                let p = {};
                p.studentId = 1;
                this.$httpWeb.fetch(url,p,true)
                    .then(res=>{
                        console.log('成功',res);
                    })
                    .catch(err=>{
                        console.log('报错',err)
                    });
            },
            courseList(){
                let url = '/course/listMyCourse';
                let p = {};
                p.studentId = 1;
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        console.log('ok',res)
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
            detail(){
                let url = '/course/detail';
                let p = {};
                p.courseId = 3;
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        console.log('ok',res)
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
            subtitle(){
                let url = this.$myUrl.webApiUrl()+"/course/subtitle?studentId=1&courseId=1";
                console.log(url);
            },
            start(){
                let url = '/course/start';
                let p = {};
                p.studentId = 1;
                p.courseId = 1;
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        console.log('ok',res)
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
            end(){
                let url = '/course/end';
                let p = {};
                let options = [{questionId:1,option:'A',answerId:1},{questionId:2,option:'B',answerId:4}];

                p.recordId = 3;
                p.options = JSON.stringify(options);
                this.$httpWeb.fetch(url,p)
                    .then(res=>{
                        console.log('ok',res)
                    })
                    .catch(err=>{
                        console.log('err',err)
                    })
            },
        },
        mounted(){}
    }
</script>
