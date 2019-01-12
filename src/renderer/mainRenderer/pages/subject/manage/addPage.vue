<template>
  <div class="addPage">
    <div class="addpage-head">
			<el-button size='small' plain icon="el-icon-back" @click='goback'>返回</el-button>
    </div>
    <div class="addpage-content" v-loading.lock="addloding">
      <el-row >
        <el-col :span="18" :offset='3'>
          <el-form ref="ruleForm" :inline="true" :model="subject" label-width="100px" :rules="rules">
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="课程名字" prop="name">
                  <el-input v-model="subject.name" ></el-input>
                </el-form-item>
                <el-form-item label="科目" prop="class_type">
                  <el-input  v-model="subject.class_type" 
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="授课方式" prop="type">
                  <el-input v-model="subject.type"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input   v-model="subject.price" 
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col  :span="18" :offset='3'>
                <el-form-item label="状态"  prop="status">
                  <el-select v-model="subject.status" placeholder="请选择"  class='select'>
                    <el-option
                      v-for="item in job_statusLists"
                      :key="item.uuid"
                      :label="item.name"
                      :value="item.uuid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="负责教师"  prop="teacherUuid">
                  <el-select  v-model="subject.teacherUuid" placeholder="请选择"  class='select'>
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
                <el-form-item label="时长" prop="class_time">
                  <el-input v-model.number="subject.class_time"></el-input>
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
      span: 20,
      offset: 2,
      rules: {
        name: [
          { required: true, message: '请输入课程名字', trigger: 'blur' }
        ],
        class_time: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择课程状态', trigger: 'change' }
        ],
        class_num: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      subject: {
        name: '',
        class_num: '',
        class_time: '',
        class_type: '',
        type: '',
        teachername: '',
        teacherUuid: '',
        status: '',
        price:0
      },
      job_statusLists: [{uuid: 0, name: '停课'}, {uuid: 20, name: '正在开课'}, {uuid: 30, name: '即将开课'}],
      addloding: true
    }
  },
  mounted () {
    var subject = this.$route.query.user_id
    if (subject) {
      this.subject = this.$_.cloneDeep(subject)
    }
    this.addloding = false
  },
  methods: {
    goback () {
      this.$router.push({path: '/subject/subjectManage'})
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addloding = true
          this.$store.dispatch('SUBJECT_SUBMIT_FORM', this.subject).then(data => {
            this.addloding = false
            if (data.success) {
              this.$message({
                message: '课程保存成功',
                type: 'success'
              })
              // this.loading = true;
              this.$store.dispatch('SUBJECT_GET_LIST').then(data => {
                if (data.success) {
                  this.$store.commit('SUBJECT_GET_LIST', data)
                }
                this.$router.push({path: '/subject/subjectManage'})
                this.loading = false
                this.$store.dispatch('GET_APP_CACHE')
              })
            } else {
              this.$message({
                message: '课程保存操作失败',
                type: 'warning'
              })
            }
          })
        } else {
          this.addloding = false
          this.$message({
            message: '填写完整课程信息',
            type: 'warning'
          })
          return false
        }
      })
    }
  },
  computed: {
    teachers () {
      return this.$store.state.app.teacherCache
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


