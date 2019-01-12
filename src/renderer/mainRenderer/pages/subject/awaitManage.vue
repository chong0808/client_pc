<template>
    <div class="subject_m">
        <header class="s-m-header">
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="20">
                     <el-date-picker
                      v-model="filter.date"
                      type="daterange"
                      @change="change"
                      size="small"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
				    <el-select :value="filter.teacherUuid" multiple   @input="updateFrom($event)" size="small" placeholder="请选择" class='select'>
                        <el-option 
                        v-for="item in teachers"
                        :key="item.uuid"
                        :label="item.name"
                        :value="item.uuid">
                        </el-option>
                    </el-select>
                    <el-button type="primary"  size="small" icon="el-icon-printer">导出考勤</el-button>
				</el-col>
				<el-col :span="4">
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
			<el-table stripe :data="list" border >
				<el-table-column fixed prop="name" label="学生姓名" ></el-table-column>
				<el-table-column fixed prop="startTs" :formatter='momentTime("startTs")' label="计划时间"></el-table-column>
				<el-table-column fixed prop="subject" label="课程"></el-table-column>
				<el-table-column fixed prop="teacher" label="上课"></el-table-column>
                <el-table-column fixed	prop="price" label="价格"></el-table-column>
                <el-table-column fixed	prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == '10' ? 'primary' : 'success'"
                            close-transition v-bind:tag="scope.row.status==10?'正常上课':''">
                            {{scope.row.status==10?'正常上课':'请假'}}  
						</el-tag>
					</template>
                </el-table-column>
                <el-table-column fixed prop="attivetime" :formatter='momentTime("attivetime")' label="创建时间"></el-table-column>
			</el-table>
		</main>
        <footer class="s-m-footer">
			<div class="block">
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleSizeChange"
					background
					:current-page="paging.page"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="paging.limit"
					layout="total, sizes, prev, pager, next, jumper"
					:total="paging.total">
				</el-pagination>
			</div>
		</footer>
    </div>
</template>
<script>
    import moment from "moment";
    //默认查看本周的课程记录
    export default {
      name: 'awaitDeal',
      data(){
        return{
            loading:false,
            list:[],
            paging:{
                  limit:10,
                  page:1,
                  total:0
            },
            inputSearch:"",
              filter:{
                  teacherUuid:[],
                  date:[]
            }
        }
      },
      methods:{
        getData(){
            this.loading = true
            var params={
                limit:this.paging.limit,
                page:this.paging.page
            };
            this.$store.dispatch("ATENDANCELIST", params).then(data => {
                if(data.success){
                    this.loading = false
                    this.list = data.data.data;
                    this.paging.total = data.data.paging.total;
                }
            })    
        },
        handleSizeChange(index){
            this.paging.page = index
            this.getData()
        },
        handleCurrentChange(index) {
            this.paging.limit = index
            this.getData()
        },
        momentTime(type) {
            return (data)=>{
               return moment(data[type]).format("MM-DD HH:mm dddd");
            }
        },
        updateFrom(value){
            this.filter.teacherUuid = value;
        },
        change(val){
             this.filter.date = [this.$moment(val[0]),this.$moment(val[1])]
        }
      },
      mounted(){
            this.getData()
      },
      computed:{
        teachers () {
            return this.$store.state.app.teacherCache;
        }
      },
    }
</script>

<style scoped>
.subject_m{
    height: 100%;
	position: relative;
}
.subject_m .s-m-header{
    margin-bottom: 16px;
}
.subject_m .s-m-main{
    height: -webkit-calc(100% - (106px));
    overflow: auto;
}   
.s-m-footer{
    padding-top: 20px;
    line-height: 50px;
}
</style>