<template>
  <div class="detailSchedule">
    <div class="detailSchedule-head">
			<el-button size='small' plain icon="el-icon-back" @click='goback'>返回</el-button>
    </div>
    <div v-loading="loading" class="detailScheduleContent">
        <P class="title">排课系统</P> 
        <div class="detailScheduleBox">
          <div class="block">
            <span class="demonstration">每周课次:</span>
            <el-select v-model="num" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button :disabled='selected' size='medium' @click="startSchedule">开始排课</el-button>
            <el-button :disabled='isSave' size='medium' @click="submitSchedule">保存</el-button>
          </div>
          <div class="block" v-for='(subject,index) in subjects' v-bind:key="index">
            <p>
              <span class="demonstration">开始日期</span>
              <el-date-picker
                v-model="subject.day"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <span  class="demonstration">
                上课时间
              </span>
              <el-time-select
                placeholder="起始时间"
                v-model="subject.startTime"
                @change='timerChange(subject)'
                :picker-options="{
                  start: '08:30',
                  step: '00:05',
                  end: '21:30'
                }">
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="subject.endTime"
                disabled
                :picker-options="{
                  start: '08:30',
                  step: step,
                  end: '21:30',
                  minTime: subject.startTime
                }">
              </el-time-select>
              {{timeFormat(subject.day)}}
              {{subject.timer}}
            </p>
          </div>  
          <div class="class-scheduleBox" v-loading="scheduleBox_loading" v-bind:style="styleObject">
            <el-table
              :data="scheduleLists"
              stripe
              border
              :row-class-name='rowClass'
              style="width: 100%">
              <el-table-column
                prop="startTs"
                label="上课时间"
                width="180"
                :formatter="timeFormat"
                >
              </el-table-column>
              <el-table-column
                prop="roomUuid"
                label="教室"
                width="180">
              </el-table-column>
              <el-table-column
                prop="teacherName"
                label="教师">
              </el-table-column>
              <el-table-column
                prop="subjectName"
                label="科目">
              </el-table-column>
              <el-table-column
                prop="time_length"
                label="课时"
                >
              </el-table-column>
              <el-table-column
                prop="time_length"
                label="课时"
                >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="warning"
                    :disabled='scope.row.isSchedule'
                    @click="handleEdit(scope.$index, scope.row)">调整</el-button>
                    <span style='color:red;' v-if='!scope.row.isSchedule'>课程有冲突！</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
    </div>
    <el-dialog
      title="调整冲突课程"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="false">
        <span class="demonstration">开始日期</span>
              <el-date-picker
                v-model="changeSubject.day"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <p style="margin-top: 20px;">
              <span  class="demonstration">
                上课时间
              </span>
              <el-time-select
                placeholder="起始时间"
                v-model="changeSubject.startTime"
                @blur='timerChangeConfict(changeSubject)'
                :picker-options="{
                  start: '08:30',
                  step: '00:05',
                  end: '21:30'
                }">
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="changeSubject.endTime"
                disabled
                :picker-options="{
                  start: '08:30',
                  step: step,
                  end: '21:30',
                  minTime: changeSubject.startTime
                }">
              </el-time-select>
              </p>
              <p style="margin-top: 20px; font-size:16px">
                <span  class="demonstration">
                调整为：
                </span>
                <span>{{changeSubject.timer}}</span>
                
              </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeSave()" :disabled="changeSubject.submit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data(){
      return {
        step:'00:45',
        selected:true,
        weekly:'',
        subjects:[{
            timer:'',
            day:'',
            startTime:'',
            endTime:'',
          }
        ],
        isSave:true,
        dialogVisible:false,
        num:1,
        options:[
          {
            value: 1,
            label: 1
          },{
            value: 2,
            label: 2
          },{
            value: 3,
            label: 3
          },{
            value: 4,
            label: 4
          }
        ],
        loading:false,
        scheduleBox_loading:false,
        timer:'',
        student:{},
        scheduleLists:[],
        styleObject: {
          height:''
        },
        changeSubject:{
          submit:true,
          select:true,
          timer:''
        }
      }
    },
    methods:{
      rowClass(row){
        if(row.isSchedule){
          return 'isSchedule'
        }else{
          return 'isUnSchedule'
        }
      },
      goback () {
        this.$router.push({path: '/subject/schedule'});
      },
      timeFormat(newVal){
        if(this.$moment.isDate(newVal)){
          let index = new Date(newVal).getDay();
          let weeklys = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
          let weekly ='上课时间：每周 '+ weeklys[index];
          return this.$moment(newVal).format('MM/DD')+' ' +weekly;
        }else if(typeof newVal== 'object'){
          let index = new Date(newVal.startTs*1000).getDay();
          let weeklys = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
          let weekly = weeklys[index];
          return this.$moment(newVal.startTs*1000).format('MM/DD HH:mm')+' ' +weekly;
        }else{
          return ''
        }
      },
      timerChange(subject){
        if(subject.startTime){
          subject.endTime = this.getEndTs(subject.startTime,this.student.class_time)
          subject.timer = subject.startTime +'--' + subject.endTime
          this.selected = false;
        }else{
          subject.timer='';
          this.selected = true;
        }
      },
      timerChangeConfict(changeSubject){
        if(changeSubject.startTime){
          var start_h = changeSubject.startTime.split(':');
          changeSubject.endTime =  this.getEndTs(this.changeSubject.startTime,this.changeSubject.row.time_length)
          changeSubject.timer = this.$moment(changeSubject.day).format('MM/DD')+'  '+changeSubject.startTime +'--' + changeSubject.endTime
          var end_h = changeSubject.endTime.split(':');
          this.changeSubject.row.startTs  = this.$moment(changeSubject.day).set('hour',Number(start_h[0])).set('minute',Number(start_h[1])).unix();
          this.changeSubject.row.endTs = this.$moment(changeSubject.day).set('hour',Number(end_h[0])).set('minute',Number(end_h[1])).unix();
          this.changeSubject.select = false 
          var obj = [];
          obj.push(this.changeSubject.row)
          this.$store.dispatch('QUERRY_SCHEDULE',obj).then(data =>{
            if(data.success){
              if(data.data && Array.isArray(data.data) && Object.keys(data.data[0]).length>0){
                if(data.data[0].isSchedule){
                  this.changeSubject.submit = false;
                 
                  this.changeSubject.row= data.data[0]
                }
              }
            }
            this.scheduleBox_loading= false;
          }).catch(e=>{
            console.error(e)
          })
        }else{
          changeSubject.timer='';
          changeSubject.select = true
          // changeSubject.submit = true
        }
      },
      startSchedule(){
        var len = this.student.total%this.subjects.length;
        var classNum = Math.floor(this.student.total/this.subjects.length);
        var sendObj = [];
        this.scheduleBox_loading= true;
        for(let i=0;i<this.subjects.length;i++){
            var start_h = this.subjects[i].startTime.split(':');
    
            var end_h = this.subjects[i].endTime.split(':');

            var startTs = this.$moment(this.subjects[i].day).set('hour',Number(start_h[0])).set('minute',Number(start_h[1])).subtract('w',1);
      
            var endTs = this.$moment(this.subjects[i].day).set('hour',Number(end_h[0])).set('minute',Number(end_h[1])).subtract('w',1);
           
            let _len = i == (this.subjects.length-1)?(classNum+len):classNum;
              for(var k=0;k<_len;k++){
                sendObj.push({
                  startTs:startTs.add('w',1).unix(),
                  endTs:endTs.add('w',1).unix(),
                  time_length:this.student.class_time,
                  status:0,
                  teacherUuid:this.student.teacherUuid,
                  teacherName:this.student.teacherName,
                  agenciesUuid:this.student.agenciesUuid,
                  studentUuid:this.student.uuid,
                  subjectName:this.student.subjectName,
                  subjectUuid:this.student.subjectUuid,
                  studentUuid:this.student.studentUuid,
                  classListId:this.student.classListId,
                  roomUuid:this.student.status
                })
              };
        }
        sendObj = this.$_.sortBy(sendObj,function(o) { return o.startTs; });

        this.$store.dispatch('QUERRY_SCHEDULE',sendObj).then(data=>{
          if(data.success){
            this.scheduleLists  = data.data
             this.isSave = false;
          }
          this.scheduleBox_loading= false;
        }).catch(e=>{
          console.error(e)
        })
      },
      submitSchedule(){
        if(this.scheduleLists.length>0){
          var isSchedule = true;
          this.scheduleLists.forEach(item=>{
            if(!item.isSchedule){
              isSchedule = false;
            }
          })
          if(isSchedule){
            this.scheduleBox_loading= true
            this.$store.dispatch('SUBMIT_SCHEDULE',this.scheduleLists).then(data=>{
              this.scheduleBox_loading= false;
              if(data.success){
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$store.dispatch("GET_UNSEDULE_LIST")
                this.$router.push({path: '/subject/schedule'});
              }else{
                this.$message.error('保存失败');
              }
            }).catch(e=>{
               this.$message.error('保存失败');
            })
          }else{
             this.$message({
                message: '请解决冲突课程',
                type: 'warning'
              });
          }
        }
      },
      changeSave(){
        this.$set(this.scheduleLists, this.changeSubject.index, this.changeSubject.row)
        this.dialogVisible = false;
      },
      handleEdit(index,row){
        this.dialogVisible = true;
        var obj = JSON.stringify(row)
        obj = JSON.parse(obj)
        this.changeSubject.row = obj
        this.changeSubject.index = index
        this.changeSubject.submit = true
        this.changeSubject.day = this.$moment(row.startTs*1000);
        this.changeSubject.startTime = this.$moment(row.startTs*1000).format('HH:mm')
        this.changeSubject.endTime = this.getEndTs(this.changeSubject.startTime,this.changeSubject.row.time_length)
      },
      getEndTs(startTs,len){
        var start_h =startTs.split(':');
        var end_h_S =  Number(start_h[1])+len;
        if(end_h_S>=60){
          return (Number(start_h[0])+1).toString()+':'+(end_h_S-60).toString()
        }else{
          return (Number(start_h[0])).toString()+':'+(end_h_S).toString()
        }
      }
    },
    watch:{
      num:function(newNum,oldNum){
        if(newNum>oldNum){
          let n = newNum-oldNum;
          for(let i=0;i<n;i++){
            this.subjects.push({
              day:'',
              startTime:'',
              endTime:''
            })
          }
        }else{
          let n = oldNum-newNum;
          for(let i=0;i<n;i++){
            this.subjects.pop();
          }
        }
        this.styleObject.height = `-webkit-calc(100% - (${newNum*40+50}px))`;
      }
    },
    mounted(){
      console.log(this.$route.query.data)
      this.student = this.$route.query.data;
    }
}
</script>
<style scoped>
.detailSchedule{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background: #fff;
    z-index: 23;
    padding: 20px 20px 20px 20px;
    left: 2px; 
}
.el-table tr.isUnSchedule{
  background: #f1b9b9;
}
.detailSchedule-head{
  height: 40px;
}
.detailScheduleContent{
  height: -webkit-calc(100% - (40px));
  width: 100%;
  background: #FFF;
  /* display: flex; */
}
.title{
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;

}
.block,
.block p{
  margin-bottom: 10px;
}
.demonstration{
  text-align: right;
  display: inline-block;
  width:100px;
}
.detailScheduleBox{
  height: -webkit-calc(100% - (90px));
  
}
.class-scheduleBox{
  height: -webkit-calc(100% - (90px));
  overflow-y: auto;
}


</style>


