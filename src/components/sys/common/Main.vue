<template>
    <div class="box">
        <el-container>
            <el-header style="background-color:	#6E6E6E" height="60px">
                 <my-header/>
            </el-header>
            <el-main>
                <el-container>
                     <el-aside style='background-color:#324157' :width="barWidth">
                        <my-side :isCollapse="isCollapse"/>
                     </el-aside>
                     <el-main>
                         <el-container>
                             <el-main>
                                <transition name="move" mode="out-in">
                                    <router-view></router-view>
			                    </transition>
                             </el-main>
                             <el-footer height="25px">{{copyright}}</el-footer>
                         </el-container>
                     </el-main>
                </el-container>
            </el-main>

        </el-container>
    </div>
</template>
<script>
import Header from '@/components/sys/common/Header'
import SideBar from '@/components/sys/common/SideBar'
export default {
    components: {
        'my-header': Header,
        'my-side': SideBar
    },
    computers:{
    },
    data(){
        return {
            widthClass: {
                width: this.mainWidth
            },
            isCollapse: false,
            barWidth: '200px',
            copyright: ''
        }
    },
    methods: {
        setSysInfo(){
            let sysInfo = JSON.parse(localStorage.getItem('sysInfo'));
            this.copyright = sysInfo.copyright;
        }
    },
    mounted(){
        this.setSysInfo();
    }
}
</script>

<style>

</style>

