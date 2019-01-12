<template>
  <div class="t-right-container">
		<header class="s-m-header">
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-button type="primary"  size="small" icon="el-icon-plus" @click='addTeacher'>增加教师</el-button>
						<el-button type="primary"  size="small" icon="el-icon-printer">导出教师</el-button>
						<el-button type="primary"  size="small" icon="el-icon-printer">导入教师</el-button>
					</div>
				</el-col>
				<el-col :span="6">
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
        <main class="s-m-main" v-loading="loading">
			<el-table
				stripe
				:data="teacher.data"
				border
			>
			    <el-table-column
					fixed
					prop="name"
					label="姓名"
				></el-table-column>
				<el-table-column
					fixed
					prop="sex"
					label="性别"
					:formatter="filtersex"
				></el-table-column>
				<el-table-column
					fixed
					prop="phone"
					label="联系方式"
				></el-table-column>
				<el-table-column
					fixed
					prop="level"
					label="资历"
				></el-table-column>
				<el-table-column
					fixed
					prop="join_time"
					label="入职日期"
					:formatter="filterTime"
				>
				</el-table-column>
				<el-table-column
					fixed
					prop="job_status"
					:formatter="filterStatus"
					label="状态"
				></el-table-column>
				<el-table-column
					fixed
					prop="teacher.name"
					label="课程"
				></el-table-column>
				<el-table-column
					fixed
					label="操作"
				>
				  <template slot-scope="scope">
						<el-button @click="edite(scope.$index)" type="text" size="small">修改</el-button>
						<el-button @click="detail(scope.row,scope.$index)" type="text" size="small">查看</el-button>
						<el-button @click="deleteUser(scope.$index)" type="text" size="small">删除</el-button>
				  </template>
				</el-table-column>
			</el-table>
		</main>
		<footer class="s-m-footer">
			<div class="block">
				<el-pagination
				    @size-change="handleSizeChange"
     			    @current-change="handleCurrentChange"
					background
					:current-page="teacher.paging.page"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="teacher.paging.limit"
					layout="total, sizes, prev, pager, next, jumper"
					:total="teacher.paging.total">
				</el-pagination>
			</div>
		</footer>
		<transition  name="slide-fade">
			<keep-alive>
				<router-view name='addPage' ></router-view>
			</keep-alive>
		</transition>
		<transition  name="slide-fade">
			<teacher-dialog v-if='dialogFormVisible'   v-on:teacherDisplay="display"  v-on:teacherEdite="edite" :dialogForm = 'dialogForm' :index = 'index' ></teacher-dialog>
		</transition>
	</div>
</template>
<script>
	import moment from 'moment'
	import teacherDialog from './teacher-dialog'
export default {
	  components: {teacherDialog},
	  data () {
    return {
      inputSearch: '',
	      loading: false,
	      dialogFormVisible: false,
	      dialogForm: {},
	      index: 0
    }
  },
  methods: {
	    edite (index) {
	      this.$router.push({ name: 'addTeacher', query: {user_id: index}})
	    },
	    deleteUser (index) {
	      this.$confirm('此操作将永久删除该用户,不可恢复 是否继续?', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        this.$store.dispatch('TEACHER_DELETE_USER', index).then(data => {
	          var type = 'info', message = '删除失败'
	          if (data.success) {
	            this.loading = true
	            this.$store.dispatch('TEACHER_GET_LIST').then(data => {
	              if (data.success) {
	                this.$store.commit('TEACHER_GET_LIST', data.data)
	              }
	              this.loading = false
	            })
								 type = 'success'
									 message = '删除成功'
	          }
	          this.$message({
	            type: type,
	            message: message
	          })
	        })
      }).catch(() => {
	        this.$message({
	          type: 'info',
	          message: '已取消删除'
	        })
	      })
    },
	    detail (val, index) {
	      this.dialogForm = val
	      this.dialogFormVisible = true
	      this.index = index
	    },
	    display (data) {
	      this.dialogFormVisible = !this.dialogFormVisible
	    },
    addTeacher () {
	      this.$router.push({ name: 'addTeacher', query: {user_id: null}})
    },
    // 改变每页数量
	    handleSizeChange (index) {
	      this.loading = true
	      this.$store.dispatch('TEACHER_CHANGE_SIZE', {limit: index}).then(data => {
	        if (data.success) {
	          this.$store.commit('TEACHER_GET_LIST', data.data)
	        }
	        this.loading = false
	      })
	    },
	    // 当前页码改变
	    handleCurrentChange (index) {
	      this.loading = true
	      this.$store.dispatch('TEACHER_CHANGE_SIZE', {page: index}).then(data => {
	        if (data.success) {
	          this.$store.commit('TEACHER_GET_LIST', data.data)
	        }
	        this.loading = false
	      })
	    },
	    filtersex (data) {
	      return data.sex == 1 ? '男' : '女'
	    },
	    filterTime (data) {
	      return moment(data.join_time).format('YYYY-MM-DD')
	    },
	    filterStatus (data) {
	      if (data.job_status == 10) return '全职'
	      else if (data.job_status == 20) return '兼职'
	      else if (data.job_status == 30) return '离职'
	    }
	  },
	  computed: {
	    teacher () {
	      return this.$store.state.teacher.lists
	    }
	  },
	  mounted () {
	    this.loading = true
	    this.$store.dispatch('TEACHER_GET_LIST').then(data => {
	      if (data.success) {
	        this.$store.commit('TEACHER_GET_LIST', data.data)
	      }
	      this.loading = false
	    })
  }
}
</script>

<style scoped>
/*********************
* 内容区布局
*********************/

.content .t-right-container{
    width:100%;
	height:100%;
	padding:20px;
	position: relative;
}
.t-right-container  .s-m-header{
    margin-bottom: 20px;
}
.t-right-container  .s-m-main{
    height: -webkit-calc(100% - (106px));
}
.t-right-container  .s-m-footer{
    padding-top: 20px;
    line-height: 50px;
}
</style>