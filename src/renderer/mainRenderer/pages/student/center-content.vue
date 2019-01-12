<template >
  <div class="listbox">
			<header>
				<el-row type="flex" class="row-bg" justify="space-between">
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-button type="primary"  size="small" icon="el-icon-plus" @click='addStudent'>增加学生</el-button>
							<el-button type="primary"  size="small" icon="el-icon-printer">导出学生</el-button>
							<el-button type="primary"  size="small" icon="el-icon-printer">导入学生</el-button>
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
							prop="name"
							label="姓名"
						></el-table-column>
						<el-table-column
							fixed
							prop="subjectCount"
							label="课程数目"
						></el-table-column>
						<el-table-column
							fixed
							prop="teacherName"
							label="老师"
						></el-table-column>
						<el-table-column
							fixed
							prop="parent_name"
							label="家长"
						></el-table-column>
						<el-table-column
							fixed
							prop="parent_phone"
							label="家长电话"
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
								:filters="[{ text: '未排课', value: 10 }, { text: '已排课', value: 20 }]"
								filter-placement="bottom-end">
								<template slot-scope="scope">
									<el-tag
										:type="scope.row.class_status == '10' ? 'primary' : 'success'"
										close-transition v-bind:tag="scope.row.class_status==20?'已排课':'	'">{{scope.row.class_status==20?'已排课':'未排课'}}
									</el-tag>
								</template>
						</el-table-column>
						<el-table-column
							fixed
							label="操作">
							<template slot-scope="scope">
								<el-button @click="edite(scope.row)" type="text" size="small">编辑</el-button>
								<el-button @click="detail(scope.row,scope.$index)" type="text" size="small">查看</el-button>
								<el-button @click="deleteUser(scope.$index)" type="text" size="small">删除</el-button>
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
				<!-- <keep-alive> -->
					<router-view name='addPage' ></router-view>
				<!-- </keep-alive> -->
			</transition>
			<transition  name="slide-fade">
				<student-dialog v-if='dialogFormVisible'   v-on:display="display"  v-on:edite="edite" :dialogForm = "dialogForm" :index = 'index' ></student-dialog>
			</transition>
	</div>
</template>
<script>
import moment from "moment";
import studentDialog from "./student-dialog";
export default {
  components: { studentDialog },
  data() {
    return {
      title: "student",
      inputSearch: "",
      dialogFormVisible: false,
      dialogForm: {},
      index: 0
    };
  },
  mounted() {
    this.$store.dispatch("GET_STUENT_LISTS")
  },
  methods: {
    // 改变每页数量
    handleSizeChange(index) {
      this.$store.dispatch("CHANGE_SIZE", { limit: index });
    },
    // 当前页码改变
    handleCurrentChange(index) {
      this.$store.dispatch("CHANGE_SIZE", { page: index });
    },
    addStudent() {
      this.$router.push({ path: "/addStudent/null" });
    },
    edite(val) {
			// console.log(val)
      this.$router.push({  path: `/addStudent/${val.uuid}` });
    },
    detail(val, index) {
      this.dialogForm = val;
      this.dialogFormVisible = true;
      this.index = index;
    },
    display(data) {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    momentTime(data) {
      return moment(data.createdAt).format("YYYY-MM-DD");
    },
    filterTag(data, row) {
      return row.class_status == data;
    },
    deleteUser(index) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("DELETE_USER", index).then(data => {
            var type = "info",
              message = "删除失败";
            if (data.success) {
              this.$store.dispatch("GET_STUENT_LISTS");
              type = "success";
              message = "删除成功";
            }
            this.$message({
              type: type,
              message: message
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  computed: {
    lists() {
      return this.$store.state.student.lists;
    },
    loading() {
      return this.$store.state.student.loding;
    }
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