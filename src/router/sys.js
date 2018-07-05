let router = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/tlogin",
        component: resolve =>
            require(["@/components/sys/common/Login.vue"], resolve)
    },
    {
        path: "/system",
        component: resolve =>
            require(["@/components/sys/common/Main.vue"], resolve),
        children: [

            //系统管理
            {
                path: "/",
                component: resolve =>
                    require(["@/components/sys/common/Home.vue"], resolve)
            },
            {
                path: "home",
                component: resolve =>
                    require(["@/components/sys/common/Home.vue"], resolve)
            },
            {
                path: "menu",
                component: resolve =>
                    require(["@/components/sys/system/Menu.vue"], resolve)
            },
            {
                path: "role",
                component: resolve =>
                    require(["@/components/sys/system/Role.vue"], resolve)
            },
            {
                path: "member",
                component: resolve =>
                    require(["@/components/sys/system/Member.vue"], resolve)
            },
            {
                path: "mySet",
                component: resolve =>
                    require(["@/components/sys/system/MySet.vue"], resolve)
            },

            //学生管理
            {
                path: "student",
                component: resolve =>
                    require(["@/components/sys/student/Student.vue"], resolve)
            },


            //项目管理
            {
                path: 'electronicRead',
                component: resolve =>
                    require(['@/components/sys/electronicRead/ElectronicRead.vue'],resolve)
            },
            {
                path: 'courseInfo',
                component: resolve =>
                    require(['@/components/sys/project/CourseInfo.vue'],resolve)
            },
            {
                path: 'cognitionManage',
                component: resolve =>
                    require(['@/components/sys/cognition/CognitionManage.vue'],resolve)
            },
            {
                path: 'interestInfo',
                component: resolve =>
                    require(['@/components/sys/project/InterestInfo.vue'],resolve)
            },
            {
                path: 'emotionInfo',
                component: resolve =>
                    require(['@/components/sys/project/EmotionInfo.vue'],resolve)
            },
            //档案管理
            {
                path: "course",
                component: resolve =>
                    require(["@/components/sys/record/Course.vue"], resolve)
            },
            {
                path: "electronicAppraise",
                component: resolve =>
                    require(["@/components/sys/electronicRead/ElectronicAppraise.vue"], resolve)
            },
            {
                path: "cognition",
                component: resolve =>
                    require(["@/components/sys/record/Cognition.vue"], resolve)
            },
            {
                path: "interest",
                component: resolve =>
                    require(["@/components/sys/record/Interest.vue"], resolve)
            },
            {
                path: "emotion",
                component: resolve =>
                    require(["@/components/sys/record/Emotion.vue"], resolve)
            },
        ]
    },
    {
        path: "*",
        component: resolve =>
            require(["@/components/sys/common/NoFound.vue"], resolve)
    }
]


export default {
    router
}
