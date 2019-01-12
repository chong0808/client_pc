<template>
<div>
  <el-row :gutter="30">
    <el-col :span="18">
      <div class="grid-content dashboard-item-echart dashboard-item-echart-box">
        <h2>收入趋势图</h2>
        <div class="scheduleDate">
            <el-button-group>
              <el-button size="mini" @click='changeType("day")' :disabled="filter.isDay==true">Day</el-button>
              <el-button size="mini" @click='changeType("weekly")'  :disabled="filter.isWeekly==true">Weekly</el-button>
              <el-button  size="mini" @click='changeType("month")'  :disabled="filter.isMonth==true">Month</el-button>
              <el-popover
                placement="right"
                width="500"
                trigger="click">
                <el-row>
                  <el-col :span="4">
                    过滤时间:
                  </el-col>
                  <el-col :span="20">
                    <el-date-picker
                      v-model="filter.date"
                      type="daterange"
                      @change="change"
                      size="mini"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-col>
                </el-row>
                <el-row class="selectName">
                  <el-col :span="4">
                    过滤教师:
                  </el-col>
                  <el-select :value="filter.teacherUuid" multiple   @input="updateFrom($event)" size="mini" placeholder="请选择" class='select'>
                    <el-option 
                      v-for="item in teachers"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                  
                </el-row>
                  <el-button size="mini" slot="reference" class="dateIconBtn" style="height: 28px;border-radius: 0 4px 4px 0; "><i class="iconfont icon-chart dateIcon"></i></el-button>
              </el-popover>
            </el-button-group>
        </div>
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content dashboard-item-echart  dashboard-item-note-box">
        <h2>备忘录</h2>
        <!-- <full-calendar :events="fcEvents" locale="en"></full-calendar> -->
        <!-- <ds-calendar-app :calendar="calendar"></ds-calendar-app> -->
      </div>
      </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="18">
      <div class="grid-content dashboard-item-echart dashboard-item-echart-box">
        <h3>对应教师统计表</h3>
        <ve-histogram :data="teacherData" :extend="extend"></ve-histogram>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content dashboard-item-echart">
        
      </div>
      </el-col>
  </el-row>
</div>    
</template>
<script>

import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'

export default {
     components:{VeLine,VeHistogram},
    data(){
      this.chartSettings = {
        xAxisType: 'time',
        area: true
      }
      this.extend = {
        itemStyle:{
          color:"#E6A23C"
        },
        series: {
          label: { show: true, position: "top" }
        }
      }
      return {
        filter:{
            teacherUuid:[],
            date:[],
            type:"day",
            isDay:true,
            isWeekly:false,
            isMonth:false
        },
        chartData: {
          columns: ['日期', 'A', 'B', 'C',"D"],
          rows: [
            { '日期': '2018-01-01', 'A': 1393, 'B': 1093, 'C': 1234 ,'D': 1234 },
            { '日期': '2018-01-02', 'A': 3530, 'B': 3230, 'C': 4465 ,'D': 2324},
            { '日期': '2018-01-03', 'A': 2923, 'B': 2623, 'C': 6343 ,'D': 2344},
            { '日期': '2018-01-04', 'A': 2923, 'B': 2623, 'C': 2343 ,'D': 2344},
            { '日期': '2018-01-05', 'A': 1723, 'B': 1423, 'C': 5443 ,'D': 34543}
          ]
        },
        teacherData: {
          columns: ['日期', 'TOTAL', ],
          rows: [
            { '日期': 'A', 'TOTAL': 1393,  },
            { '日期': 'B', 'TOTAL': 3530,   },
            { '日期': 'C', 'TOTAL': 2923,   },
            { '日期': 'D', 'TOTAL': 2922,   }
          ]
        }
      }
    },
    mounted () {
      this.filter.date = [ this.$moment().startOf("week").add("day",1),this.$moment().endOf("week").add("day",1) ];
      var _q = this.filter.date[1].diff(this.filter.date[0], 'days')
      this.filter.isWeekly = _q>6?false:true
      this.filter.isMonth = _q>31?false:true
      this.filter.isDay = _q>60?true:false
    },
    methods:{
      updateFrom (value) {
        this.filter.teacherUuid = value;
      },
      change(val){
        this.filter.date = [this.$moment(val[0]),this.$moment(val[1])]
        var _q = this.filter.date[1].diff(this.filter.date[0], 'days')
        this.filter.isWeekly = _q>6?false:true
        this.filter.isMonth = _q>31?false:true
        this.filter.isDay = _q>60?true:false
        
      },
      changeType(type){
        this.filter.type = type;
        
      },
      getData(){
        console.log("getdata")
      }
    },
    computed:{
       teachers () {
          return this.$store.state.app.teacherCache;
        }
    },
    watch:{
      "filter.type":function(val,old){
          this.getData()
      }
    }
}
</script>
<style>
.dashboard-item-note-box,
.dashboard-item-echart-box{
  padding: 20px 5px;
}
.dashboard-item-note-box h2,
.dashboard-item-note-box h3,
.dashboard-item-echart-box h2,
.dashboard-item-echart-box h3{
  text-align: center;
  color: #404040;
}
.echart{
  width: 100%;
  height: 100%;
}
.icon{
  height:16px;
  width: 16px;
}
.dashboard-item-echart-box .scheduleDate{
  text-align: right;
}
.dateIcon{
  font-size: 14px;
}
.selectName{
  margin-top: 10px;
}
</style>


