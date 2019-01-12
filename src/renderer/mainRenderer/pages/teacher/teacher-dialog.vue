<template>
  <el-dialog title="教师信息"
			width='1000px'  center
			:visible.sync="dialogFormVisible" 
			:show-close='showClose' 
			top='20vh'
			:close-on-click-modal='showClose' 
			:close-on-press-escape='showClose'
			class="studentDialog">
			<el-row >
        <el-col :span="span" :offset='offset'>
          <el-form ref="ruleForm" :inline="true" :model="dialogForm" label-width="100px">
           <el-row>
                <el-form-item label="姓名">
                  <el-input :value="dialogForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input  :value="dialogForm.phone" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="地址">
                  <el-input :value="dialogForm.address" class="address" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="身份证号">
                  <el-input :value="dialogForm.cardid"  disabled></el-input>
                </el-form-item>
                <el-form-item label="性别" >
                  <p>{{dialogForm.sex==1?'男':'女'}}</p>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="状态"  prop="job_status">
                  <el-select :value="dialogForm.job_status" placeholder="请选择"  class='select' disabled>
                    <el-option
                      v-for="item in job_statusLists"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                  <el-input  :value="filterTime(dialogForm.birth)" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="课程">
                  <el-select :value="dialogForm.subjectsUuid" placeholder="请选择"  class='select' disabled>
                    <el-option
                      v-for="item in subjects"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="现有水平">
                  <el-input :value="dialogForm.level" disabled></el-input>
                </el-form-item>
            </el-row>
            <el-row> 
              <el-form-item  label="备注">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    class="textarea"
                    :value="dialogForm.desc" disabled>
                  </el-input>
              </el-form-item>
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
      dialogFormVisible: true,
      showClose: false,
      span: 18,
      offset: 4,
      job_statusLists: [{uuid: 10, name: '全职'}, {uuid: 20, name: '兼职'}, {uuid: 30, name: '离职'}]
    }
  },
  computed: {
    subjects () {
      return this.$store.state.app.subjectCache
    }
  },
  methods: {
    edite () {
      this.$emit('teacherDisplay', this.dialogForm)
      this.$emit('teacherEdite', this.index)
    },
    display () {
      this.$emit('teacherDisplay', this.dialogForm)
    },
    filterTime (data) {
      return moment(data).format('YYYY-MM-DD')
    }
  }
}
</script>
<style>
	.dialog .step{
		margin-left: 98px;
	}
	.studentDialog .address{
		width:518px;
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
  .datePicker.el-input,
  .select,
.radio{
  width:202px;
}
.textarea,
.address{
  width:518px;
}
</style>

