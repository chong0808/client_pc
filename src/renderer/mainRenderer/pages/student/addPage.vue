<template>
  <div class="addPage">
    <div class="addpage-head">
			<el-button size='small' plain icon="el-icon-back" @click='goback'>返回</el-button>
    </div>
    <div class="addpage-content" v-loading.lock="addloding">
      <el-row >
        <el-col :span="18" :offset='3'>
          <el-form ref="ruleForm" :inline="true" :model="studentForm" label-width="100px" :rules="rules">
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="学生姓名" prop="name">
                  <el-input :value="studentForm.name" @input="updateFrom($event,'name')"></el-input>
                </el-form-item>
                <el-form-item label="学生电话" prop="phone">
                  <el-input  :value="studentForm.phone"  @input="updateFrom($event,'phone')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="家长姓名" prop="parent_name">
                  <el-input :value="studentForm.parent_name" @input="updateFrom($event,'parent_name')"></el-input>
                </el-form-item>
                <el-form-item label="家长电话" prop="parent_phone">
                  <el-input :value="studentForm.parent_phone" @input="updateFrom($event,'parent_phone')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="家庭住址" >
                  <el-input :value="studentForm.address"  @input="updateFrom($event,'address')"></el-input>
                </el-form-item>
                <el-form-item label="主课教师">
                  <el-select v-model="studentForm.teacherUuid"  @input="updateFrom($event,'teacherUuid')" placeholder="请选择" class='select'>
                    <el-option
                      v-for="item in teachers"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item> 
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="性别"  prop="sex">
                  <el-radio-group class="radio"  v-model="sex" @change="updateFrom($event,'sex')">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                  <el-date-picker
                    v-model="birth"
                    type="date"
                    placeholder="选择日期" class="datePicker"
                    @input="updateFrom($event,'birth')">
                  </el-date-picker>
                  {{age}}岁
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-for="(subject, index) in subjects" :key="index">
              <el-col  :span="18" :offset='3'>
                <el-form-item label="课程">
                  <el-select v-model="subject.subjectUuid" placeholder="请选择" @change="updateFromSubjects(index,subject)" class='select'>
                    <el-option
                      v-for="item in subjectCache"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任课教师">
                  <el-select v-model="subject.teacherUuid"  @input="updateFromSubjects(index,subject)" placeholder="请选择" class='select'>
                    <el-option
                      v-for="item in teachers"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>   
                <el-form-item label="总课时"  prop="total">
                  <el-input v-model.number="subject.total"   @input="updateFromSubjects(index,subject)"></el-input>
                </el-form-item>
                <el-form-item label="剩余课时" prop="count">
                  <el-input v-model.number="subject.count"   @input="updateFromSubjects(index,subject)"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button icon="el-icon-plus" circle @click="add(index)" v-if="!subjects.length>1 || index==(subjects.length-1)"></el-button>
                  <el-button icon="el-icon-minus" circle :disabled="index==0" @click="remove(index)" v-if="index==(subjects.length-1) || index!=0"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                 <el-form-item label="现有水平">
                  <el-input :value="studentForm.level"   @input="updateFrom($event,'level')"></el-input>
                </el-form-item>
                <el-form-item label="课程顾问">
                  <el-select v-model="sale" placeholder="请选择" class='select'>
                    <el-option
                      v-for="item in sales"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="跟进状态">
                  <el-steps :active="active" class="steps" finish-status="success">
                    <el-step title="待沟通"></el-step>
                    <el-step title="跟进"></el-step>
                    <el-step title="试课"></el-step>
                    <el-step title="缴费"></el-step>
                    <el-step title="排课"></el-step>
                    <el-step title="结课"></el-step>
                  </el-steps>
                  <el-button style="margin-top: 12px;" size='small' plain @click="next">下一步</el-button>
                </el-form-item>
              </el-col>
            </el-row> 
            <el-row>
              <el-col  :span="18" :offset='3'> 
                <el-form-item  label="备注">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    class="textarea"
                    :value="studentForm.note"  @input="updateFrom($event,'note')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row> 
            <el-row>
              <el-col  :span="18" :offset='3'> 
                <el-form-item  label=" ">
                  <el-button  plain @click="onSubmit('ruleForm')">保存</el-button>
                  <el-button @click='goback'>取消</el-button>
                </el-form-item>
              </el-col>
            </el-row> 
         </el-form>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>
<script>
export default {
  name: 'addpage',
  data () {
    var checkNumber = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          return callback()
        }
        if (!Number.isInteger(Number(value))) {
          callback(new Error('请输入数字值'))
        } else {
          if (Number(value) > 0) {
            callback()
          } else {
            callback(new Error('请输入大于零数字值'))
          }
        }
      }, 1000)
    }
    return {
      week: '日',
      day: '上午',
      startTime: '',
      endTime: '',
      active: 2,
      phone: '',
      rules: {
        name: [
          { required: true, message: '请输入学生名字', trigger: 'blur' }
        ],
        phone: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        parent_name: [
          { required: true, message: '请输入家长名字', trigger: 'blur'}
        ],
        parent_phone: [
          { validator: checkNumber, trigger: 'blur' },
          { required: true, message: '请输入家长电话', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'chang'}
        ]
      },
      sex: 0,
      birth: '',
      sale: '',
      user_id: '',
      subjects:[
        {
            teacherUuid: '',
            subjectUuid: '',
            total: 0,
            count: 0
        }
      ]
    }
  },
  watch: {
    'birth': function (newVal, oldVal) {
      var age = new Date().getFullYear() - new Date(newVal).getFullYear()
      this.updateFrom(age, 'age')
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    'active': function (newVal, oldVal) {
      var val = newVal * 10
      this.updateFrom(val, 'status')
    }
  },
  methods: {
    add(){
      this.subjects.push({
        teacherUuid: '',
        subjectUuid: '',
        total: '',
        count: ''
      })
    },
    remove(index){
      this.subjects.splice(index, 1)
    },
    goback () {
      this.$router.push({path: '/student'})
    },
    next () {
      if (this.active++ > 5) this.active = 1
    },
    onSubmit (formName) {
      this.updateFrom(this.active, 'step')
      this.updateFrom(this.subjects, 'subjects')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('SUBMIT_FORM').then(data => {
            this.$store.commit('LODING')
            if (data.success) {
              this.$message({
                message: '添加学生成功',
                type: 'success'
              })
              this.$store.dispatch('GET_STUENT_LISTS')
              this.$router.push({path: '/student'})
              this.$store.dispatch('GET_APP_CACHE')
            }
          })
        } else {
          this.$message({
            message: '填写完整学生信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    updateFrom (value, type,subject) {
      if(subject){
        this.$store.commit('UPDATE_FORM', {type: type, value: value,subject:true})
      }else{        
        this.$store.commit('UPDATE_FORM', {type: type, value: value})
      }
    },
    updateFromSubjects(value,subject){
      console.log(value)
      console.log(subject)
      // this.subjects.splice(index,1,obj)
      // this.subjects[index][type] = value
    },
    getStudentItem(user_id){
      this.$store.commit('GET_STUENT_ITEM', user_id)
    }
  },
  computed: {
    studentForm () {
      console.log("ddd")
      var user_id = this.$route.params.user_id;
      this.sex = this.$store.state.student.studentForm.sex
      this.birth = this.$store.state.student.studentForm.birth
      var age = new Date().getFullYear() - new Date(this.birth).getFullYear()
      this.age = age || 0
      this.active = this.$store.state.student.studentForm.status / 10
      return this.$store.state.student.studentForm;
    },
    addloding () {
      return this.$store.state.student.loading
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
    console.log("mounted")
    console.log(this.$route.params)
    if(this.$route.params.user_id!="null"){
       try {
      let data = await this.$store.dispatch("GET_STUENT_ITEM", { uuid: this.$route.params.user_id }); 
      if(data.success){
          console.log(data)
          this.sex = data.data.sex
          this.birth = data.data.birth
          var age = new Date().getFullYear() - new Date(data.data.birth).getFullYear()
          this.age = age || 0
          this.active = data.data.status / 10;
          this.$store.commit('GET_STUENT_ITEM', data.data)
          this.subjects = data.data.subjects
      }else{
         this.$message({
              type: type,
              message: message
            });
         this.goback()
      }
    } catch (error) {
      this.$message({
              type: type,
              message: message
            });
      this.goback();
    }
    }else{
      return;
    }
  } 
}
</script>
<style>
.addPage{
  position: absolute;
  top: 0;
  width:100%;
  height:100%;
  background: #f7f7f7;
  z-index: 10;
  padding: 10px 20px;
  right: 0;
}
.addPage>div{
  width:100%;
}
.addpage-head{
  height: 40px;
}
.addpage-content{
  height: -webkit-calc(100% - (50px));
  overflow-y: auto;
}
.datePicker.el-input,
.radio{
  width:202px;
}
.address{
  width:518px;
}
.textarea{
  width: 518px;
}
.steps .el-step.is-horizontal .el-step__line{
  top:18px;
}
div.steps {
  width:600px;
}
.select{
  width:202px;
}
.addpage-content .el-loading-mask{
  background-color: #f7f7f7;
}
</style>


