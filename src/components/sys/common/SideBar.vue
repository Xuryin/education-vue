<template>
    <div>
        <el-menu :default-active="onRoutes" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
            unique-opened router
            background-color="#324157" text-color="#fff"
            @select="handleSelect"
            class="el-menu-vertical-demo"
            active-text-color="#ffd04b">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key='item.index'>
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key='item.index'>
                        <i :class="item.icon"></i>
                        <span>{{item.title}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
import Http from '@/utils/ajax'
export default {
    
    data(){
        return {
            items: []
        }
    },
    computed:{
        onRoutes(){
            //return this.$route.path.replace('/','');
        }
    },
    props: {
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    methods:{
        handleOpen(){
            // console.log('open')
        },
        handleClose(){
            // console.log('close')
        },
        handleSelect(index){
            // console.log(index)
        },
        createSide(data,pid){
            pid = pid || 0;
            let list = [];
            data.map(item=>{
                if(item.pid == pid){
                    let c = {}
                    c.icon = item.icon
                    if(item.url){
                        c.index = item.url
                    }else{
                        c.index = item.tag
                    }
                    c.title = item.name
                    if(item.type!=1 || !item.url){
                        c.subs = this.createSide(data,item.menuId);
                    }
                    list.push(c)
                }
            })
            return list;
        },
        getSideData(){
            let url = '/menu/listByMemberId';
            let p = {};
            p.memberId = localStorage.getItem('memberId');
            Http.fetch(url,p)
            .then(res=>{
                this.items = this.createSide(res.data,0);
                //保存用户操作按钮的权限数据
                let userMenus = {};
                res.data.forEach(m=>{
                    if(m.type==3){
                        userMenus[m.tag] = 1
                    }
                })
                localStorage.setItem('userMenus',JSON.stringify(userMenus))
            })
        }
    },
    mounted(){
        this.getSideData();
    }
}
</script>
<style>

.el-menu{
        border-right: solid 0px #e6e6e6;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>


