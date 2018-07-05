//开发环境的值为false.
//打包部署到正式环境时为true
let prod = false;

//api调用的地址
function apiUrl(){
    if(prod){
        return '/sys';
    }else{
        return 'http://localhost:8000/sys';
    }
}

//文件上传的地址
function uploadUrl(){
    if(prod){
        return '/sys/upload';
    }else{
        return 'http://localhost:8000/sys/upload'
    }
}

//项目根地址
function baseUrl() {
    if(prod){
        return ''
    }else{
        return 'http://localhost:8000'
    }
}

//前端api的地址
function webApiUrl() {
    if(prod){
        return '/web';
    }else{
        return 'http://localhost:8000/web';
    }
}

export default{
    apiUrl,
    uploadUrl,
    baseUrl,
    webApiUrl
}
