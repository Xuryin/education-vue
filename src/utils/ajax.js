import axios from 'axios'
import qs from 'qs'
import { Notification } from "element-ui";

import router from '@/router'
import conf from '@/utils/conf.js'


let temp = true;
let url = conf.apiUrl();
const Axios = axios.create({
    baseURL: url,
    timeout: 5000,
    responseType: "json",
    withCredentials: false, // 是否允许带cookie这些
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});
Axios.interceptors.request.use(
    config => {
        if (
            config.method === 'post' ||
            config.method === 'put' ||
            config.method === 'delete'
        ) {
            config.data = qs.stringify(config.data);
        }
        if (localStorage.token) {
            config.headers.Authorization = localStorage.token;
        }else{
            console.log('发起请求-没有token')
        }
        return config;
    },
    error => {
        Notification({
            message: '请求错误',
            type: 'error'
        });
        return Promise.reject(error);
    }
)

Axios.interceptors.response.use(
    response => {
        let code = response.data.code;
        //请求正常
        if(code==0){
            return response.data;
        }
        let errMsg = '';
        //2:参数错误,3:逻辑错误,5:服务器错误,6:没有权限
        if(code==2||code==3||code==5||code==6){
            if(code==2){
                errMsg = '参数错误';
            }else if(code==3){
                errMsg = response.data.errMsg;
            }else if(code==5){
                errMsg = '服务器错误,请稍后再试';
            }else if(code==6){
                errMsg = '您没有权限进行该操作';
            }
            Notification({
                message: errMsg,
                type: 'error'
            })
            return Promise.reject(response.data);
        }
        //1:登录超时,7:其他地方登录,8:用户被禁用
        else{
            if(code==1){
                router.replace('/tlogin');
                errMsg = '登录超时';
            }else if(code==7){
                router.replace('/tlogin');
                errMsg = '您的账号在其他地方登录';
            }else if(code==8){
                errMsg = '用户被禁用';
            }
            //这里使用temp来做限制,避免一次谈出多个错误弹窗
            //code为1,7,8的错误. 1500ms内只会弹出一次
            if(temp){
                Notification({
                    message: errMsg,
                    type: 'error'
                });
                temp = false;
                window.setTimeout(()=>{
                    temp = true;
                },1500)
            }
        }
    },
    error => {
        Notification({
            message: '网络错误',
            type: 'error'
        })
        console.log("error",error)
        return Promise.reject(error);
    }
);

function fetch(url, params) {
    return new Promise((resolve, reject) => {
        Axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch(error => {
                reject(error)
            })
    });
}

export default {
    fetch
}
