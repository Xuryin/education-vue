import Vue from "vue";
import Router from "vue-router";
import sys from './sys'
import web from './web'

Vue.use(Router);

let routes = [...sys.router ,...web.router];
let router = {
    routes: routes
}

export default new Router(router);
