<template>
  <div class="t_container_view" v-loading='loading'> 
    <div class="t_container_head">
			<el-button size='small' plain icon="el-icon-back" @click='goback'>返回</el-button>
      <span>{{title}}</span>
    </div>
    <classschedulelist :lists='lists' v-if='!loading'  v-loading='loading'></classschedulelist>
  </div>
</template>
<script>
import classschedulelist from './../../components/classScheduleList'
export default {
  name: "classScheduleDay",
  components:{classschedulelist},
  data(){
    return {
      loading:true,
      title:'',
      lists:{
        type:'',
        names:{},
        days:[],
        timer:[],
        lists:[]
      }
    }
  },
  methods: {
    goback() {
      this.$router.push({ path: "/subject/teacherManage" });
    },
    getDayAllTeachers(data){
      var params = {
        "startTs":data.time,
        "endTs": data.time+3600*24
      };
      this.getData(params)
    },
    getWeekOfTeacher(data){
      var params = {
        "startTs":data.time,
        "endTs": data.time+3600*24*7,
        filter:{
          teacherUuid:data.list.teacherUuid
        }
      };
      let weekly = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      var _d = this.$moment(data.time*1000).subtract(1, "d");
      for (var i = 0; i < 7; i++) {
        _d.add(1, "d");
        this.lists.days.push({
          weekly: weekly[i],
          time: _d.format("YYYY/MM/DD"),
          verticalIsMover: false
        });
      }
      this.getData(params)
    },
    getDayOfTeacher(data){
      var params = {
        "startTs":data.time,
        "endTs": data.time+3600*24,
        filter:{
          teacherUuid:data.list.teacherUuid
        }
      };
      this.getData(params)
    },
    getData(params){
      this.loading = true;
      this.$store.dispatch("SCHEDULE_LISTS", params).then(data => {
        if (data.success) {
          this.lists.lists = data.data;
          var timerList = [];
          // debugger
          this.lists.lists = this.$_.sortBy(this.lists.lists,(o)=>{
            timerList.push(this.$moment(o.startTs).hours())
            timerList.push(this.$moment(o.endTs).add('hour',1).hours());
            return o.startTs
          })
          if(timerList.length>0){
            let startTs = this.$_.min(timerList);
            let endTs = this.$_.max(timerList);
            let _timer = []
            for(;startTs<endTs;startTs++){
              _timer.push(
                startTs>9?`${startTs}:00`:`0${startTs}:00`
              )
              _timer.push(
                startTs>9?`${startTs}:30`:`0${startTs}:30`
              )
            }
            this.lists.timer = _timer
            this.loading = false;
          }
        }else{
          this.$message.error('数据加载失败');
          this.goback()
        }
      });
    },
    initGetData(){
      switch (this.lists.type) {
        case 1: // 请求某天所有老师的课程
          this.title= '请求某天所有老师的课程'
          this.getDayAllTeachers(this.$route.query);
          break;
        case 2: // 请求某个老师一周的课程
          this.title= '请求某个老师一周的课程'      
          this.getWeekOfTeacher(this.$route.query);
          break;
        case 3: // 请求某个老师某天的课程
          this.title= '请求某个老师某天的课程'   
          this.getDayOfTeacher(this.$route.query);
          break;
        default:
          break;
      }
    }
  },
  watch:{
    reload:function(){
      this.initGetData()
    }
  },
  computed:{
    reload:function(){
      return this.$store.state.subject.isReload;
    }
  },
  mounted() {
    this.lists.type = this.$route.query.type;
    this.initGetData()
  },
  beforeRouteLeave(to, from, next){
    window.onresize  = null
    next()
  }
};
</script>
<style scoped>
.t_container_view {
  background: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
}

</style>


