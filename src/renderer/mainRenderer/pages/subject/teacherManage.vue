<template>
    <div class="t_container"> 
        <div class="t_container_section">
            <header class="t_container_header">
                <h1 class="teacher-header">课程表</h1>
            </header>
            <main class="t_container_main">
                <class-schedule></class-schedule> 
            </main>
        </div>
        <transition  name="slide-right">
             <router-view name='scheduleDetail'></router-view>
        </transition>
    </div>
</template>

<script>
    import classSchedule from './../../components/classSchedule'
    export default {
        components:{
            classSchedule
        },
        name: 'teacher',
        methods:{
        }
    }
</script>

<style scoped>
.t_container,
.t_container_section{
    height: 100%;
}
.t_container{
    position: relative;
}

.teacher-header{
    text-align: center;
}
.t_container_header{
    height: 60px;
}
.t_container_main{
     height:calc(100% - 60px);;
}
</style>