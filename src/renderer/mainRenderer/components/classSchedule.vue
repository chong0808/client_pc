<template>
  <div style="height:100%;">
    <div class="scheduleDate">
      <el-button-group>
        <el-button type="primary"  size="small" @click='preWeekly' plain icon="el-icon-d-arrow-left">上一周</el-button>
        <el-button type="primary"  size="small" @click='nextWeekly' plain >下一周<i class="el-icon-d-arrow-right  el-icon-right"></i></el-button>
      </el-button-group>
      <span>选择时间:</span>
      <el-date-picker
          v-model="date"
          type="week"
          format="yyyy 第 WW 周"
          size="small"
          @change='onClick'
          placeholder="选择周">
      </el-date-picker>
    </div>
    <div  style="height:calc(100% - 32px);position: relative;"  v-loading="loading" >
      <div class="schedule-col">
        <div class="header-title">
            <span class="title">教师</span>
            <span class="title timer">时间</span>
        </div>
        <div class='timer' v-for="(t,index) in day"  :key="index"
             v-bind:class="{ mouseOver: t.verticalIsMover }"
            @mouseover="horizontalOver($event,t,index)" 
            @mouseout="horizontalOut($event,t,index)" 
            @click="horizontaSelect($event,t,index)" 
            title="点击查看一天具体课程">
          <p>{{t.weekly}}</p>
          <p>{{timeFormat(t.time)}}</p>
        </div>
      </div>
      <div class="schedule-box">
        <div class="row">
          <div v-for="(t,index) in subjects"  :key="index"
              v-bind:class="{ mouseOver: t.verticalIsMover }"
              @mouseover="verticalOver($event,t)" 
              @mouseout="verticalOut($event,t)" 
              @click="verticalSelect($event,t)" 
              class="col-title"
              title="点击查看一周具体课程"
             >
            <p class="col-title-p">{{t.name}}</p>
          </div>
        </div>
        <div class="row" v-for="(item, index)  in day" :key="index">
          <div  v-for="(el,u) in subjects" class="t_sub" @click='popSubject(el,item)'  v-bind:class="{ mouseOver: el.verticalIsMover }" :key="u" >
            <div v-for='(subject,i) in el.subject' v-if='i==index'  v-bind:class="{ mouseOver: subject.isMover }" class="t_sub_t" :key="i" > 
              <p v-for='(_obj,o) in subject.text'  title="点击查看学生具体信息" @click='selectStudent($event,_obj)' :key="o" >{{_obj.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      dialogTableVisible: false,
      loading: false,
      date: "",
      startTime: "",
      timer: [],
      verticalIsMover: false,
      day: [
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" },
        { weekly: 1, verticalIsMover: false, time: "" }
      ],
      subjects: []
    };
  },
  methods: {
    onClick: function(date, ev) {
      this.timer = this.$moment(date).valueOf();
      this.getListForStartTs();
    },
    nextWeekly: function(ev) {
      this.timer = this.$moment(this.timer)
        .add(1, "w")
        .valueOf();
      this.getListForStartTs();
    },
    preWeekly: function() {
      this.timer = this.$moment(this.timer)
        .subtract(1, "w")
        .valueOf();
      this.getListForStartTs();
    },
    selectStudent(ev, data) {
      return false;
    },
    verticalOver(ev, t) {
      t.verticalIsMover = true;
    },
    verticalOut(ev, t) {
      t.verticalIsMover = false;
    },
    horizontalOver(ev, t, index) {
      t.verticalIsMover = true;
      this.subjects.forEach(item => {
        if (!this.$_.isEmpty(item.subject) && Array.isArray(item.subject)) {
          if (!this.$_.isEmpty(item.subject[index])) {
            item.subject[index].isMover = true;
          }
        }
      });
    },
    horizontalOut(ev, t, index) {
      t.verticalIsMover = false;
      this.subjects.forEach(item => {
        if (!this.$_.isEmpty(item.subject) && Array.isArray(item.subject)) {
          if (!this.$_.isEmpty(item.subject[index])) {
            item.subject[index].isMover = false;
          }
        }
      });
    },
    popSubject: function(data, time) {
      // 选择教师某一天课程]
      var params = {
        list: {
          name: data.name,
          teacherUuid: data.teacherUuid
        },
        type: 3,
        time: time.time
      }
      this.$router.push({name:'scheduleList',query:params})
    },
    horizontaSelect(ev, data) {
      // 选择某一天所有教师的课程
      var params = {
        time: data.time,
        type: 1,
      }
      this.$router.push({name:'scheduleList',query:params})
    },
    verticalSelect(ev, data) {
      // 选择教师某一周的课程
       var params = {
        time: this.day[0].time,
        type:2,
        list: {
          name: data.name,
          teacherUuid: data.teacherUuid
        },
      }
      this.$router.push({name:'scheduleList',query:params})
    },
    timeFormat(t) {
      return this.$moment(t * 1000).format("YYYY/MM/DD");
    },
    getListForStartTs() {
      var timer = {
        startTs: this.day[0].time,
        endTs:this.day[6].time+3600*24
      };
      this.loading = true;
      this.$store.dispatch("SCHEDULE_LISTS", timer).then(data => {
        this.subjects = [];
        if (data.success) {
          this.dowithData(data.data);
        }
        this.loading = false;
      });
    },
    dowithData(data) {
      if (data && Array.isArray(data)) {
        var obj = {};
        data.forEach(item => {
          if (!obj[item.teacherUuid]) {
            obj[item.teacherUuid] = {};
            obj[item.teacherUuid] = {
              name: item.teacher,
              teacherUuid: item.teacherUuid,
              verticalIsMover: false,
              vhorizontalIsMover: false,
              subject: []
            };
            for (var i = 0; i < 7; i++) {
              obj[item.teacherUuid].subject.push({
                isMover: false,
                text: []
              });
            }
          }
          let str = `${this.$moment(item.startTs).format("HH:mm")} | ${
            item.name
          }`;
          let _obj = {
            text: str,
            t_uuid: item.studentUuid
          };
          var _index =
            this.$moment(item.startTs).day() - 1 < 0
              ? 6
              : this.$moment(item.startTs).day() - 1;
          obj[item.teacherUuid].subject[_index].text.push(_obj);
        });
        for (let key in obj) {
          this.subjects.push(obj[key]);
        }
      }
    }
  },
  watch: {
    timer: function(newVal, oldVal) {
      this.date = new Date(newVal);
      var _d = this.$moment(newVal)
       _d = _d.startOf('week');
      let weekly = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];
      this.day = [];
      for (var i = 0; i < 7; i++) {
        _d.add(1, "d");
        this.day.push({
          weekly: weekly[i],
          time: _d.unix(),
          verticalIsMover: false
        });
      }
      this.getListForStartTs();
    },
    reload:function(){
      this.getListForStartTs();
    }
  },
  computed:{
    reload:function(){
      return this.$store.state.subject.isReload;
    }
  },
  mounted() {
    this.timer = this.$moment().startOf("day");
  }
};
</script>
<style>
.scheduleDate {
  margin-bottom: 10px;
}
.schedule-col {
  width: 90px;
  position: absolute;
  border-right: 0px;
  display: flex;
  flex-direction: column /* | row-reverse | column | column-reverse*/;
  justify-content: space-between;
  height: calc(100% - 32px);
}
.schedule-box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column /* | row-reverse | column | column-reverse*/;
  justify-content: space-between;
  height: calc(100% - 32px);
  padding-left: 90px;
  border-bottom: solid 1px #e6e6e6;
  border-right: solid 1px #e6e6e6;
}
.schedule-col > div,
.schedule-box > div {
  border-left: solid 1px #e6e6e6;
  border-top: solid 1px #e6e6e6;
  height: 12.5%;
}
.row {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row /* | row-reverse | column | column-reverse*/;
  justify-content: flex-start;
  cursor: pointer;
}
.row > div {
  width: 10%;
  border-right: solid 1px #e6e6e6;
  text-align: center;
}
div.header-title {
  position: relative;
  text-align: left;
  padding: 0px;
}

.schedule-col .title {
  display: inline-block;
  width: 25%;
  height: 25%;
  position: absolute;
  padding: 5px;
}
.schedule-col span.title:first-child {
  display: inline-block;
  height: 50%;
  right: 0;
}

.schedule-col span.title:last-child {
  display: inline-block;
  width: 50%;
  bottom: 0;
}
.timer {
  text-align: center;
  display: flex;
  flex-direction: column /* | row-reverse | column | column-reverse*/;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}
.timer p:last-child {
  /* font-size: 12px; */
}
.mouseOver {
  background: #b3d8ff;
}
.t_sub_t {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 14px;
  overflow: hidden;
}
.t_sub {
  position: relative;
}
.t_sub:hover {
  background: #9fd5f7;
  cursor: pointer;
}
.t_sub:hover .t_sub_tip {
  display: block;
}
.t_sub .tip {
  display: none;
  position: absolute;
  width: 150%;
  border: 1px solid #409eff;
  padding: 10px;
  border-radius: 5px;
  height: 150px;
  top: -25%;
  left: -25%;
  background: #b3d8ff;
  z-index: 2;
}
.col-title{
  position: relative;
}
.col-title-p{
  position: absolute;
  top: 50%;
  width: 100%;
}
</style>


