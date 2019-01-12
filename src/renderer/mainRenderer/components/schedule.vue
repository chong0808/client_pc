<template>
  <div>
    <el-table
      :data="scheduleLists"
      stripe
      style="width: 100%">
      <el-table-column
        prop="startTs"
        label="上课时间"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="roomUuid"
        label="教室"
        width="180">
      </el-table-column>
      <el-table-column
        prop="teacherUuid"
        label="教师">
      </el-table-column>
      <el-table-column
        prop="subjectUuid"
        label="科目">
      </el-table-column>
      <el-table-column
        prop="time_length"
        label="课时"
        :formatter="test"
        >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name:'scheduleList',
  props:['scheduleLists'],
  data(){
    return {
      
    }
  },
  mounted(){
    console.log(this.scheduleLists)
  },
  methods:{
    timer(newVal){
        console.log(newVal)
        if(newVal){
          let index = new Date(newVal).getDay();
          let weeklys = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
          let weekly ='上课时间：每周 '+ weeklys[index];
          return this.$moment(newVal).format('YYYY/MM/DD')+' ' +weekly;
        }else{
          return '';
        }
      },
    test(ss){
      return '111'
    },
    startSchedule(){
      console.log(this.scheduleLists)
    }
  }
}
</script>
<style>

</style>


