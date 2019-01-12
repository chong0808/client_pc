<template>
  <el-dialog title="学生信息"
			width='1000px'  center
			:visible.sync="dialogFormVisible" 
			:show-close='showClose' 
			top='10vh'
			:close-on-click-modal='showClose' 
			:close-on-press-escape='showClose'
			class="studentDialog">
			<el-row v-loading="loading">
        <el-col :span="span" :offset='offset'>
          <el-form ref="ruleForm" :inline="true" :model="info" label-width="100px">
            <el-row>
              <el-col  :span="span" :offset='offset'>
                <el-form-item label="学生姓名" prop="name">
                  <el-input :value="info.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="学生电话">
                  <el-input :value="info.phone" disabled 
                 ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="span" :offset='offset'>
                <el-form-item label="家长姓名">
                  <el-input :value="info.parent_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="家长电话">
                  <el-input :value="info.parent_phone" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="span" :offset='offset'>
                <el-form-item label="家庭住址">
                  <el-input :value="info.address" class="address" disabled></el-input>
                </el-form-item>
                <!-- <el-form-item label="课程">
									<el-input :value="info.level" disabled></el-input>
                </el-form-item> -->
                <el-form-item label="现有水平">
                  <el-input :value="info.level" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="span" :offset='offset'>
                <el-form-item label="性别" class="form-item-sex">
                  <el-radio-group class="radio" v-model="info.sex" disabled>
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" >
                  <el-input :value="filterTime(info.birth)"  disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              
            </el-row>
             <el-row v-for="(subject, index) in info.subjects" :key="index">
              <el-col  :span="span" :offset='offset'>
                <el-form-item label="课程">
                  <el-select v-model="subject.subjectUuid" placeholder="请选择"  disabled  @change="updateFromSubjects(index,subject)" class='select'>
                    <el-option
                      v-for="item in subjectCache"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任课教师">
                  <el-select v-model="subject.teacherUuid"  disabled @input="updateFromSubjects(index,subject)" placeholder="请选择" class='select'>
                    <el-option
                      v-for="item in teachers"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>   
                <el-form-item label="总课时"  prop="total">
                  <el-input v-model.number="subject.total" disabled @input="updateFromSubjects(index,subject)"></el-input>
                </el-form-item>
                <el-form-item label="剩余课时" prop="count">
                  <el-input v-model.number="subject.count" disabled @input="updateFromSubjects(index,subject)"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button icon="el-icon-plus" circle @click="add(index)" v-if="! info.subjects.length>1 || index==( info.subjects.length-1)"></el-button>
                  <el-button icon="el-icon-minus" circle :disabled="index==0" @click="remove(index)" v-if="index==( info.subjects.length-1) || index!=0"></el-button>
                </el-form-item> -->
              </el-col>
            </el-row>
						<el-row>
              <el-col :span="span" :offset='offset'> 
                <el-form-item  label="备注">
									<p :v-bind="dialogForm.note" disabled></p>
                </el-form-item>
              </el-col>
            </el-row> 
            <el-row>
              <el-col :span="span" :offset='offset' class="stepsRow">
                <el-form-item>
                  <el-steps :active="active" class="steps" finish-status="success">
                    <el-step title="待沟通"></el-step>
                    <el-step title="跟进"></el-step>
                    <el-step title="试课"></el-step>
                    <el-step title="缴费"></el-step>
                    <el-step title="排课"></el-step>
                    <el-step title="结课"></el-step>
                  </el-steps>
                </el-form-item>
              </el-col>
            </el-row> 
         </el-form>
        </el-col>
      </el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="edite">编辑</el-button>
				<el-button type="primary" @click="display">取消</el-button>
			</div>
		</el-dialog>
</template>
<script>
import moment from 'moment'
export default {
  name: 'studentDialog',
  props: ['dialogForm', 'index'],
  data () {
    return {
      loading:false,
      dialogFormVisible: true,
      showClose: false,
      span: 20,
      offset: 2,
      info:{ 
        subjects:[]
       },
      
    }
  },
  methods: {
    edite () {
      this.$emit('display', this.info)
      this.$emit('edite', this.info)
    },
    display () {
      this.$emit('display', this.dialogForm)
    },
    filterTime (data) {
      return moment(data).format('YYYY-MM-DD')
    }
  },
  computed: {
    active () {
      return this.info.status / 10
    },
    subjectCache () {
      return this.$store.state.app.subjectCache
    },
    sales () {
      return this.$store.state.app.salesCache
    },
    teachers () {
      return this.$store.state.app.teacherCache
    }
  },
  async mounted(){
    this.loading = true;
    let uuid = this.dialogForm.uuid;
     var type = "error", message = "数据获取失败";
    try {
      let data = await this.$store.dispatch("GET_STUENT_ITEM", { uuid: uuid }); 
      if(data.success){
        this.info = data.data
      }else{
         this.$message({
              type: type,
              message: message
            });
         this.display()
      }
    } catch (error) {
      this.$message({
              type: type,
              message: message
            });
      this.display();
    }
     this.loading = false;
  }

}
</script>
<style>
	.dialog .step{
		margin-left: 98px;
	}
	.studentDialog .address{
		width:200px;
	}
	.studentDialog div.steps {
		width:600px;
	}
	.studentDialog .steps .el-step.is-horizontal .el-step__line{
  	top:18px;
	}
	.studentDialog .stepsRow{
		margin-left: 100px;
	}
  .form-item-sex{
    width: 302px;
  }
  .select{
    width: 202px;
  }
</style>

