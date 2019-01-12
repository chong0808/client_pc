<template>
    <div class="subject_m">
        <header class="s-m-header">
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-button type="primary"  size="small" icon="el-icon-plus" @click='addsubject'>增加课程</el-button>
						<el-button type="primary"  size="small" icon="el-icon-printer">导出课程</el-button>
						<el-button type="primary"  size="small" icon="el-icon-printer">导入课程</el-button>
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
					:data="subjects.data"
					border
				>
						<el-table-column
						fixed
						prop="name"
						label="课程名称"
					></el-table-column>
					<el-table-column
						fixed
						prop="class_type"
						label="科目"
					></el-table-column>
					<el-table-column
						fixed
						prop="type"
						label="授课方式"
					></el-table-column>
					<el-table-column
						fixed
						prop="class_time"
						label="时长"
					></el-table-column>
					<el-table-column
						fixed
						prop="class_num"
						label="课次"
					>  
					</el-table-column>
					<el-table-column
						fixed
						prop="teachername"
						label="负责教师"
					>  
					</el-table-column>
					<el-table-column
						fixed
						prop="status"
						label="状态"
					><template slot-scope="scope">
											<span>{{scope.row.status==0?'停课':'正在开课'}}</span>
											</template>
					</el-table-column>
					<el-table-column
						fixed
						label="操作"
					>
							<template slot-scope="scope">
							<el-button @click="edite(scope.row)" type="text" size="small">修改</el-button>
							<el-button @click="deleteSubject(scope.$index)" type="text" size="small">删除</el-button>
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
						:current-page="subjects.paging.page"
						:page-sizes="[10, 20, 30, 40]"
						:page-size="subjects.paging.limit"
						layout="total, sizes, prev, pager, next, jumper"
						:total="subjects.paging.total">
					</el-pagination>
				</div>
			</footer>
			<transition  name="slide-fade">
				<router-view name='addPage'></router-view>
			</transition>
    </div>
</template>
<script>
    export default {
      name: 'class',
      data () {
        return {
          inputSearch: '',
          loading: false,
          dialogFormVisible: false
        }
      },
      methods: {
				edite (index) {
					this.$router.push({ name: 'addsubject', query: {user_id: index}})
				},
				addsubject () {
					this.$router.push({ name: 'addsubject', query: {user_id: null}})
				},
				handleSizeChange (index) {
					this.$store.commit('SUBJECT_CHANGE_SIZE', {limit: index})
					this.getList()
				},
				handleCurrentChange (index) {
					this.$store.commit('SUBJECT_CHANGE_SIZE', {page: index})
					this.getList()
				},
				getList () {
					this.loading = true
					this.$store.dispatch('SUBJECT_GET_LIST').then(data => {
						this.$store.commit('SUBJECT_GET_LIST', data)
						this.loading = false
					})
				},
				deleteSubject (index) {
					this.$store.dispatch('DELETE_SUBJECT', index).then(data => {
						if (data.success) {
							this.$message({
								message: '课程删除操作成功',
								type: 'success'
							})
							this.loading = true
							this.$store.dispatch('SUBJECT_GET_LIST').then(data => {
								this.$store.commit('SUBJECT_GET_LIST', data)
								this.loading = false
							})
						} else {
							this.$message({
								message: '课程删除操作失败',
								type: 'warning'
							})
						}
					})
				}
			},
			computed: {
				subjects () {
					return this.$store.state.subject.subjectList
				}
			},
			mounted () {
				this.getList()
			}
    }
</script>

<style scoped>
.subject_m{
    height: 100%;
	position: relative;
}
.subject_m .s-m-header{
    margin-bottom: 20px;
}
.subject_m .s-m-main{
    height: -webkit-calc(100% - (106px));
}
.subject_m .s-m-footer{
    padding-top: 20px;
    line-height: 50px;
}
</style>