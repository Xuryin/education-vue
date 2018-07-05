let router = [
    {
        path: "/login",
        component: resolve =>
            require(["@/components/web/StudentLogin.vue"], resolve)
    },
    {
        path: "/web",
        component: resolve =>
            require(["@/components/web/Main.vue"], resolve),
        children: [
            {
                path: "/",
                name: 'webHome',
                component: resolve =>
                    require(["@/components/web/Home.vue"], resolve),
                meta: {
                    keepAlive: false
                }
            },
            {
                path: "courseDetails",
                name: 'courseDetails',
                component: resolve =>
                    require(["@/components/web/course/details.vue"], resolve),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: "/a",
                component: resolve =>
                    require(["@/components/web/A.vue"], resolve),
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/video',
                component: resolve =>
                    require(["@/components/web/video"], resolve),
                name: 'video',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/twentyFif',
                component: resolve =>
                    require(["@/components/web/special/twentyfive"], resolve),
                name: 'twentyFif',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/twentyseven',
                component: resolve =>
                    require(["@/components/web/special/twentyseven"], resolve),
                name: 'twentyseven',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/twentyeight',
                component: resolve =>
                    require(["@/components/web/special/twentyeight"], resolve),
                name: 'twentyeight',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/twentynine',
                component: resolve =>
                    require(["@/components/web/special/twentynine"], resolve),
                name: 'twentynine',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/thirtyone',
                component: resolve =>
                    require(["@/components/web/special/thirtyone"], resolve),
                name: 'thirtyone',
                meta: {
                    keepAlive: false
                }
            },
            {
                path: '/thirtytwo',
                component: resolve =>
                    require(["@/components/web/special/thirtytwo"], resolve),
                name: 'thirtytwo',
                meta: {
                    keepAlive: false
                }
            },
        ]
    }
]
export default {
    router
}
