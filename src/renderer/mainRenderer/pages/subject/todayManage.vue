<template>
    <div class="t_container">
        <header class="s-m-header">
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="20">
                     <el-date-picker
                      v-model="filter.date"
                      type="daterange"
                      @change="change"
                      size="small"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
				    <el-select :value="filter.teacherUuid" multiple   @input="updateFrom($event)" size="small" placeholder="请选择" class='select'>
                        <el-option 
                        v-for="item in teachers"
                        :key="item.uuid"
                        :label="item.name"
                        :value="item.uuid">
                        </el-option>
                    </el-select>
                    <el-button type="primary"  size="small" icon="el-icon-printer" @click="search">搜索</el-button>
				</el-col>
				<el-col :span="4">
					<el-input
						placeholder="请输入内容"
						v-model="inputSearch"
						size='small'
						clearable>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</el-col>
			</el-row>
		</header>
        <div v-loading="loading" class="t_container_table">
            <el-table 
                ref="multipleTable"
                :data="subjects"
                border
                stripe
                tooltip-effect="dark"
                @selection-change='handleSelectionChange'
                :row-class-name="tableRowClassName"
            >   
                <el-table-column
                    type="selection"
                    :selectable='isSelect'
                    width="55">
                </el-table-column>
                <el-table-column
                    label="时间(开始-结束)"
                    >
                    <template slot-scope="scope">
                        {{$moment(scope.row.startTs).format('YYYY/MM/DD')}}
                        <el-tag type="info" >{{$moment(scope.row.startTs).format('HH:mm')}}</el-tag>
                        --
                        <el-tag type="info" >{{$moment(scope.row.endTs).format('HH:mm')}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="subject"
                    label="姓名"
                    >
                </el-table-column>
                <el-table-column
                    prop="teacher"
                    label="教师"
                    >
                </el-table-column>
                <el-table-column
                    prop="room"
                    label="教室"
                    >
                </el-table-column>
                <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-check" :disabled="scope.row.status!=0" @click='checkAttendance($event,scope.row)' size="mini" round>考勤</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 20px">
            <el-button  type="primary" icon="el-icon-check" size="mini" :disabled="selected"  @click="checkAttendance($event,multipleSelection)">考勤</el-button>
            <el-button  size="mini"  @click="toggleSelection()">取消选择</el-button>
        </div>
        <el-dialog
            title="添加考勤"
            :visible.sync="centerDialogVisible"
            width="30%"
            @close='close'
            center>
            <div>
                <el-form ref="form" :model="form" label-width="40px">
                    <el-form-item label="状态">
                        <el-radio-group v-model="form.radio">
                            <el-radio :label="10">正常</el-radio>
                            <el-radio :label="20">请假待补</el-radio>
                            <el-radio :label="30">请假(不回补)</el-radio>
                            <el-radio :label="40">缺课</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.textarea">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="centerDialogVisible = false"  size="mini" >取 消</el-button>
                        <el-button type="primary" @click="submit"  size="mini" >确 定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
      name: 'today',
      data(){
          return {
              timer:'',
              loading:false,
              selected:true,
              subjects:[],
              multipleSelection: [],
              selection: [],
              form:{
                radio:10,
                textarea:''
              },
              centerDialogVisible:false,
              inputSearch:"",
              filter:{
                  teacherUuid:[],
                  date:[]
              }
          }
      },
      methods:{
        checkAttendance(ev,data){
            if(!Array.isArray(data)){
                this.selection.push(data)
            }else{
                this.selection.push(...data)
            }
            if(this.selection.length>0){
                this.centerDialogVisible = true
            }
        },
        submit(){
            if(this.selection.length>0){
                var arr = [];
                this.selection.forEach(item=>{
                    arr.push({
                        attivetime:this.$moment().format('YYYY/MM/DD HH:mm:ss'),
                        note:this.form.textarea,
                        status:this.form.radio,
                        scheduleid:item.id,
                        classListId:item.classListId,
                        studentUuid:item.studentUuid
                    })
                })
                this.$store.dispatch("ADDATENDANCE", arr).then(data => {
                    if (data.success) {
                        this.centerDialogVisible = false
                        this.getData()
                    }else{
                        this.$message.error('添加考勤失败');
                    }
                });
            }
        },
        close(){
            this.selection=[]
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if(this.multipleSelection.length>0){
                this.selected = false
            }else{
                this.selected = true;
            }
        },
        isSelect(row, index){
            return row.status==0;
        },
        tableRowClassName({row,index}){
            if(row.status==1){
                return 'warning-row';
            }else{
                return ''
            }
        },
        getData(){
            this.timer = this.$moment().startOf("day");
            var timer = {
                startTs:this.filter.date[0].unix(),
                endTs:this.filter.date[1].unix(),
                filter:{
                    
                }
            };
            if(this.filter.teacherUuid.length>0){
                timer.filter.teacherUuid=this.filter.teacherUuid.join(",")
            }
            this.loading = true;
            this.$store.dispatch("SCHEDULE_LISTS", timer).then(data => {
                this.subjects = [];
                if (data.success) {
                    this.subjects = data.data
                }
                this.loading = false;
            });
        },
        updateFrom(value){
            this.filter.teacherUuid = value;
        },
        change(val){
             this.filter.date = [this.$moment(val[0]),this.$moment(val[1])]
        },
        search(){
            this.getData()
        }
      },
      mounted(){
          this.filter.date = [ this.$moment().startOf("day"),this.$moment().endOf("day") ];
          this.getData()
      },
      computed:{
        teachers () {
            return this.$store.state.app.teacherCache;
        }
    },
    }
</script>

<style scoped>
.t_container{
    height: 100%;
    overflow: auto;
}
.t_container_table{
    height:calc(100% - 90px);;
    overflow: auto;
}
.s-m-header{
    margin-bottom: 10px;
}
</style>