<template >
  <div class="listbox">
			<header>
				<el-row type="flex" class="row-bg" justify="space-between">
					<el-col :span="6">
						<div class="grid-content bg-purple">
							<!-- <el-button type="primary"  size="small" icon="el-icon-plus" @click='addStudent'>增加学生</el-button>
							<el-button type="primary"  size="small" icon="el-icon-printer">导出学生</el-button>
							<el-button type="primary"  size="small" icon="el-icon-printer">导入学生</el-button> -->
						</div>
					</el-col>
					<el-col :span="6">
						<el-input
							placeholder="请输入内容"
							v-model="inputSearch"
							size="small"
							clearable>
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
						</el-input>
					</el-col>
				</el-row>
			</header>
			<main class="main" v-loading="loading">
					<el-table
						stripe
						:data="lists.data"
						border
					>
						<el-table-column
							fixed
							prop="studentName"
							label="姓名"
						></el-table-column>
						<el-table-column
							fixed
							prop="subjectName"
							label="课程"
						></el-table-column>
						<el-table-column
							fixed
							prop="teacherName"
							label="老师"
						></el-table-column>
						<el-table-column
							fixed
							label="剩余 | 总课时"
						>
						<template slot-scope="scope">
								<span  v-bind:class="{ active: scope.row.count<5}">{{scope.row.count}}  </span>| <span>{{scope.row.total}}</span>
						</template>
						</el-table-column>
						<el-table-column
							fixed
							prop="createdAt"
							:formatter="momentTime"
							label="报名日期"
						></el-table-column>
						<el-table-column
							fixed
							prop="note"
							label="备注"
						></el-table-column>
						<el-table-column
								prop="class_status"
								label="标签"
								width="100"
								:filter-method="filterTag"
								:filters="[{ text: '未排课', value: 0 }, { text: '已排课', value: 1 }]"
								filter-placement="bottom-end">
								<template slot-scope="scope">
									<el-tag
										:type="scope.row.status == 1 ? 'primary' : 'success'"
										close-transition v-bind:tag="scope.row.status==0?'已排课':'	'">{{scope.row.status==1?'已排课':'未排课'}}
									</el-tag>
								</template>
						</el-table-column>
						<el-table-column
							fixed
							label="操作">
							<template slot-scope="scope">
								<el-button @click="detailSchedule($event,scope.row,scope.$index)" type="primary" size="small" :disabled="scope.row.status==1?true:false">排课</el-button>
							</template>
						</el-table-column>
					</el-table>
			</main>
			<footer>
				<div class="block">
					<el-pagination
					    @size-change="handleSizeChange"
     			        @current-change="handleCurrentChange"
						background
						:current-page="lists.paging.page"
						:page-sizes="[10, 20, 30, 40]"
						:page-size="lists.paging.limit"
						layout="total, sizes, prev, pager, next, jumper"
						:total="lists.paging.total">
					</el-pagination>
				</div>
			</footer>
      <transition  name="slide-fade">
				<router-view name='detailSchedule'></router-view>
			</transition>
	</div>
</template>
<script>
import moment from "moment";
export default {
  name: "awaitDo",
  data() {
    return {
      loading: false,
      inputSearch: ""
    };
  },
  methods: {
    getList(data = {}) {
		this.loading = true;
		this.$store.dispatch("GET_UNSEDULE_LIST", data).then(data=>{
			this.loading = false;
			if(!data.success){
				this.$message.error('获取数据失败');
		  	}
	  })
    },
    momentTime(data) {
      return moment(data.createdAt).format("YYYY-MM-DD");
    },
    filterTag(data, row) {
      return row.status == data;
    },
    // 改变每页数量
    handleSizeChange(index) {
      this.getList({ limit: index });
    },
    // 当前页码改变
    handleCurrentChange(index) {
      this.getList({ page: index });
    },
    detailSchedule(ev, data) {
      this.$router.push({ name: "detailSchedule", query: { data: data } });
    }
  },
  computed: {
    lists() {
      return this.$store.state.subject.unScheduleList;
    },
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.listbox {
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
}
header {
  padding-bottom: 10px;
}
main {
  height: -webkit-calc(100% - (84px));
  overflow-y: auto;
}
footer {
  height: 50px;
  padding-top: 10px;
}
.active {
  color: red;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter {
  transform: translateX(1000px);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateX(2000px);
}
</style>