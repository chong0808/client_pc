<template>
  <div class="listbox">
		<div class="list">
			<el-row class="el-memu-box">
				<el-col :span="24">
					<el-menu default-active="/subject/todayManage"  class="el-memu-list"  @select='select'> 
						<el-menu-item index="/subject/todayManage">
							<i class="el-icon-menu"></i>
							<span slot="title">今日收支</span>
						</el-menu-item>
						<el-menu-item index="/subject/teacherManage">
							<i class="el-icon-menu"></i>
							<span slot="title">老师课表</span>
						</el-menu-item>
						<el-menu-item index="/subject/subjectManage">
							<i class="el-icon-setting"></i>
							<span slot="title">课程管理</span>
						</el-menu-item>
						<el-menu-item index="/subject/schedule">
							<i class="el-icon-setting"></i>
							<span slot="title">待排课</span>
						</el-menu-item>
					</el-menu>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
    export default {
      data () {
        return {
          title: 'charge'
        }
      }
    }
</script>
<style scoped>

/*************************************
*  中间列表
*************************************/
.listbox{
    height: 100%;
    position: absolute;
    left: 50px;
    background: #FFF;
    padding-bottom: 95px;
    top: 0;
}
 .list{
	width: 192px;
  height: 100%;
  position: absolute;
  top: 0;
  padding-top: 45px;
  padding-bottom: 52px;
	background: url(./../../assets/img/icon/con-bg.png) top center ;
  background-size: cover;
}
</style>