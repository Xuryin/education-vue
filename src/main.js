// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.css'
import Http from '@/utils/ajax'
import WebHttp from '@/utils/ajaxWeb'
import {bus} from './tools/bus'

import conf from '@/utils/conf.js'


Vue.prototype.$http = Http;
Vue.prototype.$httpWeb = WebHttp;
Vue.prototype.$myUrl = conf;
Vue.config.productionTip = false;


Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    if (to.name == 'courseDetails' && from.name == 'webHome') {
        bus.$emit('getGrade')
    }
    next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
