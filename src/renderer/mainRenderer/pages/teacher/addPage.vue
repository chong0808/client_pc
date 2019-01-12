<template>
  <div class="addPage">
    <div class="addpage-head">
			<el-button size='small' plain icon="el-icon-back" @click='goback'>返回</el-button>
    </div>
    <div class="addpage-content" v-loading.lock="addloding">
      <el-row >
        <el-col :span="18" :offset='3'>
          <el-form ref="ruleForm" :inline="true" :model="teacherForm" label-width="100px" :rules="rules">
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="姓名" prop="name">
                  <el-input :value="teacherForm.name" @input="updateFrom($event,'name')"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input  :value="teacherForm.phone"  @input="updateFrom($event,'phone')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="地址" prop="address">
                  <el-input :value="teacherForm.address" class="address" @input="updateFrom($event,'address')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="身份证号" prop="cardid">
                  <el-input :value="teacherForm.cardid" class="address" @input="updateFrom($event,'cardid')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="状态"  prop="job_status">
                  <el-select :value="teacherForm.job_status" placeholder="请选择"  class='select' @change="updateFrom($event,'job_status')">
                    <el-option
                      v-for="item in job_statusLists"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别"  prop="sex">
                  <el-radio-group class="radio" v-model="sex" @change="updateFrom($event,'sex')">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="入职日期" prop="join_time">
                  <el-date-picker
                    v-model="join_time"
                    type="date"
                    placeholder="选择日期" class="datePicker"
                    @input="updateFrom($event,'join_time')">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                  <el-date-picker
                    v-model="birth"
                    type="date"
                    placeholder="选择日期" class="datePicker"
                    @input="updateFrom($event,'birth')">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="课程">
                  <el-select :value="teacherForm.subjectsUuid" placeholder="请选择" @change="updateFrom($event,'subjectsUuid')" class='select'>
                    <el-option
                      v-for="item in subjects"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="现有水平">
                  <el-input :value="teacherForm.level"   @input="updateFrom($event,'level')"></el-input>
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
                    :value="teacherForm.desc"  @input="updateFrom($event,'desc')">
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
      phone: '',
      span: 20,
      offset: 2,
      sex: 1,
      job_status: 10,
      join_time: new Date(),
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
          { required: true, message: '请选择性别', trigger: 'change'}
        ],
        class_number: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        l_class_number: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      user_id: '',
      job_statusLists: [{uuid: 10, name: '全职'}, {uuid: 20, name: '兼职'}, {uuid: 30, name: '离职'}],
      addloding: true
    }
  },
  watch: {
  },
  methods: {
    goback () {
      this.$router.push({path: '/teacher'})
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addloding = true
          this.$store.dispatch('TEACHER_SUBMIT_FORM').then(data => {
            this.addloding = false
            if (data.success) {
              this.$message({
                message: '保存教师成功',
                type: 'success'
              })
              this.$router.push({path: '/teacher'})
              this.loading = true
              this.$store.dispatch('TEACHER_GET_LIST').then(data => {
                if (data.success) {
                  this.$store.commit('TEACHER_GET_LIST', data.data)
                }
                this.loading = false
              })
              this.$store.dispatch('GET_APP_CACHE')
            }
          })
        } else {
          this.$message({
            message: '填写完整教师信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    updateFrom (value, type) {
      this.$store.commit('TEACHER_UPDATE_FORM', {type: type, value: value})
    }
  },
  computed: {
    teacherForm () {
      this.birth = this.$store.state.teacher.teacherForm.birth
      this.sex = Number(this.$store.state.teacher.teacherForm.sex)
      this.job_status = Number(this.$store.state.teacher.teacherForm.job_status)
      this.join_time = this.$store.state.teacher.teacherForm.join_time || new Date()
      return this.$store.state.teacher.teacherForm
    },
    subjects () {
      return this.$store.state.app.subjectCache
    },
    sales () {
      return this.$store.state.app.salesCache
    },
    teachers () {
      return this.$store.state.app.teacherCache
    }
  },
  activated () {
    var user_id = this.$route.query.user_id
    this.addloding = true
    if (user_id != null) {
      this.$store.commit('TEACHER_GET_STUDENT', {user_id: user_id})
    } else {
      if ((Date.now() - this.startTs) > 1000 * 5 * 1 || !this.user_id) {
        this.$store.commit('TEACHER_CLEAR_CACHE')
      }
    }
    this.addloding = false
  },
  deactivated () {
    this.startTs = Date.now()
    this.birth = ''
    if (this.teacherForm.user_id) {
      this.$store.dispatch('TEACHER_CLEAR_CACHE')
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
  .select,
.radio{
  width:202px;
}
.address{
  width:518px;
}
.textarea{
  width: 518px;
}
.addpage-content .el-loading-mask{
  background-color: #f7f7f7;
}
</style>


