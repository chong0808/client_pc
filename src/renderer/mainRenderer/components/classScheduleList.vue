<template>
  <div class="i-scheduleBox">
      <el-row class="timeRow" type="flex" ref="timeRow">
        <el-col v-for="(item,index) in lists.timer" :key ='index' class="timeCol">
          {{item}}
        </el-col>
      </el-row>
      <el-row class=" time-row-bg" type="flex" >
        <el-col v-for="(item,index) in lists.timer" :key ='index' class="timeCol time-col-bg">
          <!-- {{item}} -->
        </el-col>
      </el-row>
      <!-- 一天的课程 -->
      <el-row  v-if='lists.type!=2' class="timeRow class-container">
        <el-row class="class-row" v-for="(item,index) in lists.names" :key ='index'>
          <el-row type='flex' class="class-container-day-row" >
            <div  v-for='(a,i) in item.lists'  :key="i"
              :style="{width:a.time_length*scale+'px',left:a.left+'px'}" 
              class="class-container-day-col" 
              :class="{ 'class-container-day-col-r': a.status==1,
                      'class-container-week-col-r_2': a.status==2,
                      'class-container-week-col-r_3': a.status==3,
                      'class-container-week-col-r_4': a.status==4 }" 
              @click='adjustment($event,a)'
              >
                <el-popover
                  placement="top-start"
                  :title="a.time  "
                  width="200"
                  popper-class='popper'
                  trigger="hover"
                  >
                  <div>
                    <p>{{a.name}}</p>
                    <p>{{a.subject}}</p>
                    <p>{{a.teacher}}老师</p>
                    <p v-show="a.status==0">状态:未完成</p>
                    <p v-show="a.status==1">状态:已完成</p>
                    <p v-show="a.status==2">状态:请假(需补回)</p>
                    <p v-show="a.status==3">状态:请假(不补回)</p>
                    <p v-show="a.status==4">状态:缺课</p>
                  </div>
                  <el-button slot="reference" class="class-container-day-row">
                    <p>{{a.name}}</p>
                    <p>{{a.teacher}}老师</p>
                  </el-button>
                </el-popover>
            </div>
          </el-row>
        </el-row>
      </el-row>

      <!-- 一周的课程 -->
      <el-row  v-if='lists.type==2' class="timeRow class-container class-container-week" >
        <el-col v-for="(item,index) in lists.days" :key ='index' class="class-container-week-row">
          <div v-for='(a,i) in item.lists' class="class-container-week-col" :key="i"
            :class="{ 'class-container-week-col-r': a.status==1,
                      'class-container-week-col-r_2': a.status==2,
                      'class-container-week-col-r_3': a.status==3,
                      'class-container-week-col-r_4': a.status==4 }" 
            :style="{width:a.time_length*scale+'px',left:a.left+'px'}"
            @click='adjustment($event,a)'>
            
            <el-popover
                  placement="top-start"
                  :title="a.time  "
                  width="200"
                  popper-class='popper'
                  trigger="hover"
                  >
                  <div>
                    <p>{{a.name}}</p>
                    <p>{{a.subject}}</p>
                    <p>{{a.teacher}}老师</p>
                    <p v-show="a.status==0">状态:未完成</p>
                    <p v-show="a.status==1">状态:已完成</p>
                    <p v-show="a.status==2">状态:请假(需补回)</p>
                    <p v-show="a.status==3">状态:请假(不补回)</p>
                    <p v-show="a.status==4">状态:缺课</p>
                  </div>
                  <el-button slot="reference" class="class-container-day-row">
                    <p>{{a.name}}</p>
                    <p>{{a.teacher}}老师</p>
                  </el-button>
                </el-popover>
            <!-- <p>{{a.time}}</p>
            <p>{{a.name}}</p>
            <p>{{a.subject}}</p>
            <p>{{a.teacher}}老师</p> -->
          </div>
        </el-col>
      </el-row>
      <!-- 纵轴 -->
      <div class="t_Col" >
        <div v-if='lists.type!=2'>
          <div v-show='lists.type!=2' class='t_col_item' v-for="item in lists.names" :key ='item.studentUuid'>
            {{item.name}}
          </div>
        </div>
        <el-row v-if='lists.type==2' class="t_col_week">
          <el-col v-show='lists.type==2' class='t_col_item t_col_item_week' v-for="(item,index) in lists.days" :key ='index'>
            <div>
              <p>{{item.weekly}}</p>
              <p>{{item.time}}</p>
            </div>
          </el-col>
        </el-row>
      </div> 
      <el-dialog
        :title="title"
        :visible.sync="centerDialogVisible"
        width="30%"
        :close-on-click-modal='false'
        center>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="从">
            <el-input v-model="form.oldDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="到">
            <el-date-picker
              style="width:140px;"
              v-model="form.newDate"
              type="date"
              @change='valid'
              placeholder="选择日期">
            </el-date-picker>
            <el-time-select
              style="width:100px;"
              v-model="form.startTs"
              @change='valid'
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '22:00'
              }"
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
          <el-form-item
            label="选择教师"
          >
            <el-select v-model="form.teacherId" placeholder="请选择" @change="valid">
              <el-option
                v-for="item in form.options"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <p class="error" v-if='form._isValid'>*课程有冲突</p>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size='mini' @click="submitAdjustment" :disabled="form._isValid">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name:'classschedulelist',
  props:['lists'],
  data(){
    return {
      totolWidth:'',
      scale:1,
      startTs:'',
      centerDialogVisible:false,
      title:'',
      form:{
        oldDate:'',
        newDate:'',
        allTs:'',
        startTs:'',
        options:[],
        teacherId:'',
        obj:{},
        _isValid:false,
        isValid:true
      }
    }
  },
  methods:{
    weekly(){
      if(this.lists.days){
        this.lists.days.forEach(el => el.lists = [])         
        this.lists.lists.forEach(element=>{
            element = this.calculation(element)
            var _lists = this.lists.days[element.start];
            _lists.lists.push(this.calculation(element))
            this.$set(this.lists.days, element.start, _lists)
        })
      }
    },
    day(){
      this.lists.names = {}
      this.lists.lists.forEach(element=>{
        if(!this.lists.names[element.studentUuid]){
          this.lists.names[element.studentUuid] = {};
          this.lists.names[element.studentUuid]={
            name:element.name,
            lists:[]
          }
        }
      })
      this.lists.lists.forEach(element=>{
        this.lists.names[element.studentUuid].lists.push(this.calculation(element));
      })
    },
    calculation(element){
      var start = this.$moment(element.startTs).days()==0?6:this.$moment(element.startTs).days()-1;
      var startH = this.$moment(element.startTs).hours()*60+this.$moment(element.startTs).minutes();
      var left = (startH-this.startTs)*this.scale;
      element.left = left
      element.time = this.$moment(element.startTs).format('HH:mm')+'--'+this.$moment(element.endTs).format('HH:mm')
      element.start = start
      return element
    },
    adjustment(ev,el){
      if(el.status==0 ||el.status==2){
        this.form.obj = el
        this.centerDialogVisible = true;
        this.title = el.name +' 调课确认'
        this.form.oldDate = this.$moment(el.startTs).format('YYYY-MM-DD HH:mm')+' 老师:'+el.teacher;
        this.form.teacherId = el.teacherUuid;
      }
    },
    valid(){
      this.form._isValid = true;
      if(!!this.form.startTs &&!!this.form.newDate&& !!this.form.teacherId){
          var h = Number(this.form.startTs.split(':')[0])
          var m = Number(this.form.startTs.split(':')[1])
          this.form.sendObj =[
              {
                "startTs":this.$moment(this.form.newDate).set('hour',h).set('minute',m).unix(),
                "endTs":this.$moment(this.form.newDate).set('hour',h).set('minute',m).unix()+this.form.obj.time_length*60,
                "teacherUuid":this.form.teacherId
              }
          ];
          this.$store.dispatch('QUERRY_SCHEDULE',this.form.sendObj).then(data=>{
            if(data.success){
              this.form.isValid = data.data[0].isSchedule;
              if(this.form.isValid){
                this.form._isValid = false
              }else{
                this.form._isValid = true
              }
            }
          }).catch(e=>{
            console.error(e)
          })
      }
    },
    submitAdjustment(){
      if(this.form.isValid){
        this.form.sendObj[0].id = this.form.obj.id;
        this.$store.dispatch('UPDATE_SCHEDULE',this.form.sendObj[0]).then(data=>{
            if(data.success){
                this.$message({
                  message: '调课成功',
                  type: 'success'
                });
              this.$store.commit('RELOAD_DATA',!this.$store.state.subject.isReload)
            }else{
              this.$message.error('保存失败');
            }
        }).catch(e=>{
            this.$message.error('保存失败');
        })
      }
    }
  },
  watch:{
    totolWidth:function(val){
      this.totolWidth = this.$refs.timeRow.$el.offsetWidth-100
      this.scale = this.totolWidth/this.lists.timer.length/30;
      if(Number(this.lists.type)===2){
        this.weekly()
      }else{
        this.day()
      }
    }
  },
  mounted(){
    this.totolWidth = this.$refs.timeRow.$el.offsetWidth-100
    this.scale = this.totolWidth/this.lists.timer.length/30;
    this.startTs = Number(this.lists.timer[0].split(':')[0])*60;
    window.onresize= ()=>{
      this.totolWidth = this.$refs.timeRow.$el.offsetWidth-100
    }
    this.form.options = this.$store.state.app.teacherCache 
  }
} 
</script>
<style scoped>
.el-row {
  position:none;
}
.t_container_view{
    background: rgb(255, 255, 255);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.i-scheduleBox{
  height: calc(100% - 80px);;
  margin-top:20px; 
  width: 100%;
  border: 1px solid #e6e6e6;
  position: relative;
}
.timeRow{
  width: 100%;
  height: 20px;
  border-bottom: 1px solid #e6e6e6;
  padding-left:100px;
  text-align: left; 
}
.timeCol{
  text-align: left; 
  font-size: 12px;
  line-height: 20px;
  font-weight: 900;
}
.time-row-bg{
  position: absolute;
  width: 100%;
  padding-left:100px;
  height: calc(100% - 20px);
  border-bottom: 1px dashed #e6e6e6; 
}
.time-col-bg{
  border-right:1px dashed #e6e6e6; 
}
.class-container{
  border-bottom: 0px solid #e6e6e6;
  height:  calc(100% - 20px);
}
.class-row{
  height: 50px;
  border-bottom: 1px solid #e6e6e6;
}
.t_Col{
  height: 100%;
  width: 100px;
  padding-top: 20px;
  position: absolute;
  border-right:1px solid #e6e6e6; 
  top:0;
}
.t_col_week{
  display: flex;
  flex-direction: column /* | row-reverse | column | column-reverse*/;
  justify-content: space-between;
  height: 100%;
}
.class-container-week{
  display: flex;
  flex-direction: column /* | row-reverse | column | column-reverse*/;
  justify-content: space-between;
}
.class-container-week .class-container-week-row{
  border-bottom: 1px dashed #e6e6e6;
  flex-grow:1;
  display: flex;
  position: relative;
}
.class-container-day-col,
.class-container-week-col{
  position:absolute;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0px;
  font-size: 14px;
  background: #a56fef;
}
.class-container-day-col button,
.class-container-week-col button{
  color: #ffffff;
  border: 0;
  border-radius: 0;
  background: transparent;
  width:100%;
  text-align: left;
  padding: 10px;
  font-size: 12px;
}
/* //909399 */
.class-container-day-col-r,
.class-container-week-col-r{
  background: #e6a23c;
}
/*请假*/
.class-container-week-col-r_2{
   background: #409EFF;
}
/*请假*/
.class-container-week-col-r_3{
   background: #ccc;
}
/*缺课*/
.class-container-week-col-r_4{
   background: #f56c6c; 
}
.class-container-day-row{
  height: 100%;
  position: relative;
}
.t_col_item_week{
  position: relative;
  flex-grow:1;
}

.t_Col div.t_col_item{
  height: 50px;
  text-align: center;
  line-height: 50px;
  overflow: hidden;
  border-bottom:1px solid #e6e6e6; 
  font-size: 14px;
  cursor: pointer;
}
.t_Col div.t_col_item p{
  line-height: 20px;
  font-size: 14px;
}
.t_col_item_week>div{
    left: 0;
    right: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.timeSelect{
  width: 100px;
}
.error{
  color: #f56c6c;
  padding-left: 80px;
}
</style>


